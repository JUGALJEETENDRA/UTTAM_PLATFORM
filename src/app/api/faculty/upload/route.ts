import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { google } from "googleapis";

async function getOrCreateFolder(drive: any, folderName: string, parentId?: string) {
  // Escape single quotes in folder names to prevent query errors
  const safeName = folderName.replace(/'/g, "\\'");
  
  let query = `mimeType='application/vnd.google-apps.folder' and name='${safeName}' and trashed=false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const res = await drive.files.list({
    q: query,
    spaces: 'drive',
    fields: 'files(id, name)',
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id;
  } else {
    const fileMetadata: any = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };
    if (parentId) {
      fileMetadata.parents = [parentId];
    }
    const createRes = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });
    return createRes.data.id;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const topicId = formData.get("topicId") as string;
    
    if (!file || !topicId) {
      return NextResponse.json({ error: "Missing file or topicId" }, { status: 400 });
    }

    // Fetch the hierarchy: Topic -> Module -> Subject
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        module: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!topic || !topic.module || !topic.module.subject) {
      return NextResponse.json({ error: "Invalid topic hierarchy" }, { status: 400 });
    }

    // Get user's Google tokens from Account
    const account = await prisma.account.findFirst({
      where: { userId: (session.user as any).id, provider: "google" }
    });

    if (!account || !account.access_token) {
      return NextResponse.json({ error: "Google Drive not connected. Please log out and sign in as Faculty to grant Drive permissions." }, { status: 403 });
    }

    // Set up Google Drive API
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token
    });

    const drive = google.drive({ version: 'v3', auth });

    // Build Folder Structure: "Notes Folder" -> Subject Title -> Module Title -> Topic Title
    const rootFolderId = await getOrCreateFolder(drive, "Notes Folder");
    const currentYear = new Date().getFullYear();
    const subjectFolderId = await getOrCreateFolder(drive, `${topic.module.subject.title} - ${currentYear}`, rootFolderId);
    const moduleFolderId = await getOrCreateFolder(drive, topic.module.title, subjectFolderId);
    const topicFolderId = await getOrCreateFolder(drive, topic.title, moduleFolderId);

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to the specific Topic Folder in Google Drive
    const driveRes = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [topicFolderId]
      },
      media: {
        mimeType: file.type,
        body: require('stream').Readable.from(buffer),
      },
      fields: 'id, webContentLink, webViewLink'
    });

    // Make the file publicly accessible so students can view/download it
    await drive.permissions.create({
      fileId: driveRes.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      }
    });

    // Save to our database
    const material = await prisma.fileMaterial.create({
      data: {
        topicId,
        googleDriveFileId: driveRes.data.id!,
        webContentLink: driveRes.data.webContentLink || driveRes.data.webViewLink,
        mimeType: file.type,
        fileName: file.name
      }
    });

    return NextResponse.json(material);

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
