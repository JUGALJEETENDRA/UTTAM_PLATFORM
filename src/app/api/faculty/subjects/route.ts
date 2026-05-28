import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        modules: {
          include: {
            _count: {
              select: { topics: true }
            }
          }
        },
      }
    });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, title, description, instructor, credits, semester, coverColor } = body;

    if (!code || !title || !description || !instructor || credits === undefined || semester === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        code,
        title,
        description,
        instructor,
        credits: parseInt(credits),
        semester: parseInt(semester),
        coverColor: coverColor || "from-red-500 to-red-700",
      }
    });

    return NextResponse.json(subject);
  } catch (error: any) {
    console.error("Error creating subject:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Subject code must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}
