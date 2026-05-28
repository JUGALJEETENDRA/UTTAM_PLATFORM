import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      moduleId, 
      title, 
      type, 
      order, 
      durationMinutes,
      videoId,
      ebookContent,
      simulationUrl,
      assignmentDescription
    } = body;

    if (!moduleId || !title || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const topic = await prisma.topic.create({
      data: {
        moduleId,
        title,
        type,
        order: order || 1,
        durationMinutes: durationMinutes || 10,
        videoId,
        ebookContent,
        simulationUrl,
        assignmentDescription
      }
    });

    const module = await prisma.module.findUnique({ where: { id: moduleId } });
    if (module) {
      await prisma.subject.update({
        where: { id: module.subjectId },
        data: { totalTopics: { increment: 1 } }
      });
    }

    return NextResponse.json(topic);
  } catch (error: any) {
    console.error("Error creating topic:", error);
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing topic id" }, { status: 400 });

    const topic = await prisma.topic.delete({
      where: { id },
    });

    const module = await prisma.module.findUnique({ where: { id: topic.moduleId } });
    if (module) {
      await prisma.subject.update({
        where: { id: module.subjectId },
        data: { totalTopics: { decrement: 1 } }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json({ error: "Failed to delete topic" }, { status: 500 });
  }
}
