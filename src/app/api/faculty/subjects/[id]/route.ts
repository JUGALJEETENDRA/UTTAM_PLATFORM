import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, title, description, instructor, credits, semester, coverColor } = body;

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        code,
        title,
        description,
        instructor,
        credits: credits !== undefined ? parseInt(credits) : undefined,
        semester: semester !== undefined ? parseInt(semester) : undefined,
        coverColor,
      }
    });

    return NextResponse.json(subject);
  } catch (error: any) {
    console.error("Error updating subject:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Subject code must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.subject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete subject" }, { status: 500 });
  }
}
