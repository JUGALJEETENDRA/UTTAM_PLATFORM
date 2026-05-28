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
    const { subjectId, title, description, order } = body;

    if (!subjectId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const module = await prisma.module.create({
      data: {
        subjectId,
        title,
        description: description || "",
        order: order || 1,
      }
    });

    // Update subject totalModules count
    await prisma.subject.update({
      where: { id: subjectId },
      data: { totalModules: { increment: 1 } }
    });

    return NextResponse.json(module);
  } catch (error: any) {
    console.error("Error creating module:", error);
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 });
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

    if (!id) return NextResponse.json({ error: "Missing module id" }, { status: 400 });

    const module = await prisma.module.delete({
      where: { id },
    });

    await prisma.subject.update({
      where: { id: module.subjectId },
      data: { totalModules: { decrement: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json({ error: "Failed to delete module" }, { status: 500 });
  }
}
