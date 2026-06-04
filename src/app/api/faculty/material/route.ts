import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { google } from "googleapis";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing material id" }, { status: 400 });

    const material = await prisma.fileMaterial.findUnique({ where: { id } });
    if (!material) return NextResponse.json({ error: "Material not found" }, { status: 404 });

    // Optional: Delete from Google Drive if we want
    try {
      const account = await prisma.account.findFirst({
        where: { userId: (session.user as any).id, provider: "google" }
      });
      if (account && account.access_token) {
        const auth = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        auth.setCredentials({
          access_token: account.access_token,
          refresh_token: account.refresh_token
        });
        const drive = google.drive({ version: 'v3', auth });
        await drive.files.delete({ fileId: material.googleDriveFileId });
      }
    } catch (e) {
      console.warn("Failed to delete from Google Drive, proceeding to delete from DB.", e);
    }

    await prisma.fileMaterial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
