import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import mammoth from "mammoth";
import { google } from "googleapis";

async function getOrCreateFolder(drive: any, folderName: string, parentId?: string) {
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

function parseDocxText(text: string) {
  const questions: any[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let currentBlock: string[] = [];
  const blocks: string[][] = [];
  
  for (const line of lines) {
    if (/^\d+\.\s/.test(line) || /^Question:\s*/i.test(line) || /\?$/.test(line)) {
      if (currentBlock.length > 0) blocks.push(currentBlock);
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) blocks.push(currentBlock);

  for (const block of blocks) {
    let question = "";
    let options: string[] = [];
    let correctIndex = 0;
    let explanation = "";

    let i = 0;
    while (i < block.length && !/^[A-D][\.\):]\s*/i.test(block[i]) && !/^Answer:/i.test(block[i])) {
      let text = block[i];
      if (i === 0) {
        text = text.replace(/^\d+\.\s*/, '').replace(/^Question:\s*/i, '');
      }
      question += (question ? " " : "") + text;
      i++;
    }

    while (i < block.length && /^[A-D][\.\):]\s*/i.test(block[i])) {
      const optText = block[i].replace(/^[A-D][\.\):]\s*/i, '').trim();
      options.push(optText);
      i++;
    }

    while (i < block.length) {
      if (/^Answer:/i.test(block[i])) {
        const match = block[i].match(/^Answer:\s*([A-D])/i);
        if (match) {
          correctIndex = match[1].toUpperCase().charCodeAt(0) - 65;
        }
        
        const afterAns = block[i].replace(/^Answer:\s*([A-D][\.\):]?)?\s*/i, '').trim();
        if (afterAns) {
          explanation += (explanation ? " " : "") + afterAns;
        }
      } else if (/^Explanation:/i.test(block[i])) {
        explanation += (explanation ? " " : "") + block[i].replace(/^Explanation:\s*/i, '').trim();
      } else {
        // If we haven't found options but we are reading extra lines, just append to explanation or question
        if (options.length > 0 && correctIndex !== undefined) {
           explanation += (explanation ? " " : "") + block[i];
        } else if (/^Answer:/i.test(block[i-1])) {
           explanation += (explanation ? " " : "") + block[i];
        }
      }
      i++;
    }

    if (options.length === 0 && explanation) {
      // It's a flashcard format without multiple choice options.
      // We store the answer in options[0] so it fits the schema perfectly.
      options.push(explanation);
      correctIndex = 0;
      explanation = ""; 
    }

    if (question && options.length > 0) {
      questions.push({
        question,
        options,
        correctIndex: Math.max(0, Math.min(correctIndex || 0, options.length - 1)),
        explanation
      });
    }
  }
  return questions;
}

function parseFlashcardsText(text: string) {
  const questions: any[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  for (let i = 0; i < lines.length; i++) {
    if (/^Answer:/i.test(lines[i])) {
      let questionText = "";
      if (i > 0) {
        // The line before is the question
        questionText = lines[i-1].replace(/^\d+\.\s*/, '').replace(/^Question:\s*/i, '');
      }
      
      let answerText = lines[i].replace(/^Answer:\s*/i, '');
      
      // Look ahead for multi-line answers
      let j = i + 1;
      while (j < lines.length && !/^Answer:/i.test(lines[j]) && !/\?$/.test(lines[j]) && !/^\d+\.\s/.test(lines[j])) {
        // If the next line doesn't look like a question or an answer, it's probably part of the answer.
        answerText += "\n" + lines[j];
        j++;
      }
      
      if (questionText) {
        questions.push({
          question: questionText,
          options: [answerText],
          correctIndex: 0,
          explanation: ""
        });
      }
    }
  }
  return questions;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const moduleId = formData.get("moduleId") as string;
    const title = formData.get("title") as string || "Quiz";
    const topicType = formData.get("topicType") as string || "quiz";

    if (!file || !moduleId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    
    let questions: any[] = [];

    if (fileName.endsWith(".json")) {
      try {
        questions = JSON.parse(fileBuffer.toString());
      } catch (e) {
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
      }
    } else if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      if (topicType === "flashcard") {
        questions = parseFlashcardsText(result.value);
      } else {
        questions = parseDocxText(result.value);
      }
    } else {
      return NextResponse.json({ error: "Unsupported file type. Please upload .json or .docx" }, { status: 400 });
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: "JSON/DOCX must result in an array of questions" }, { status: 400 });
    }

    const totalQuestions = parseInt(formData.get("totalQuestions") as string || "5", 10);

    // We will save all questions to the database up to the totalQuestions limit.
    // The frontend QuizPlayer will handle picking random questions.
    const allQuestions = questions.slice(0, totalQuestions);

    // Create Topic first
    const topic = await prisma.topic.create({
      data: {
        moduleId,
        title,
        type: topicType,
        order: 99, // Append to end
        durationMinutes: questions.length * 2, // Estimate 2 mins per question
      }
    });

    const module = await prisma.module.findUnique({ where: { id: moduleId } });
    if (module) {
      await prisma.subject.update({
        where: { id: module.subjectId },
        data: { totalTopics: { increment: 1 } }
      });
    }

    // Insert Questions
    for (const q of allQuestions) {
      await prisma.quizQuestion.create({
        data: {
          topicId: topic.id,
          question: q.question,
          options: q.options || [],
          correctIndex: q.correctIndex || 0,
          explanation: q.explanation || "",
        }
      });
    }

    // Google Drive Upload
    const account = await prisma.account.findFirst({
      where: { userId: (session.user as any).id, provider: "google" }
    });

    if (account && account.access_token) {
      try {
        const auth = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        auth.setCredentials({
          access_token: account.access_token,
          refresh_token: account.refresh_token
        });

        const drive = google.drive({ version: 'v3', auth });

        // Ensure subject context is fully loaded for folder names
        const moduleData = await prisma.module.findUnique({
          where: { id: moduleId },
          include: { subject: true }
        });

        if (moduleData && moduleData.subject) {
          const rootFolderId = await getOrCreateFolder(drive, "Notes Folder");
          const currentYear = new Date().getFullYear();
          const subjectFolderId = await getOrCreateFolder(drive, `${moduleData.subject.title} - ${currentYear}`, rootFolderId);
          const moduleFolderId = await getOrCreateFolder(drive, moduleData.title, subjectFolderId);
          const topicFolderId = await getOrCreateFolder(drive, topic.title, moduleFolderId);

          const driveRes = await drive.files.create({
            requestBody: {
              name: fileName,
              mimeType: file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              parents: [topicFolderId]
            },
            media: {
              mimeType: file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              body: require('stream').Readable.from(fileBuffer),
            },
            fields: 'id, webContentLink, webViewLink'
          });

          await drive.permissions.create({
            fileId: driveRes.data.id!,
            requestBody: {
              role: 'reader',
              type: 'anyone',
            }
          });

          await prisma.fileMaterial.create({
            data: {
              topicId: topic.id,
              googleDriveFileId: driveRes.data.id!,
              webContentLink: driveRes.data.webContentLink || driveRes.data.webViewLink,
              mimeType: file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              fileName: fileName
            }
          });
        }
      } catch (driveErr) {
        console.error("Drive upload failed during quiz upload:", driveErr);
        // We still return success for the quiz parsing even if drive upload fails
      }
    }

    return NextResponse.json({ success: true, topic });
  } catch (error: any) {
    console.error("Error uploading quiz:", error);
    return NextResponse.json({ error: "Failed to upload quiz" }, { status: 500 });
  }
}
