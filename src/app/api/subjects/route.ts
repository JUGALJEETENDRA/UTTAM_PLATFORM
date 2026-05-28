import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { modules: true }
        }
      }
    });
    
    // Format for frontend which expects subject.modules.length
    const optimizedSubjects = subjects.map(s => ({
      ...s,
      modules: { length: s._count.modules }
    }));

    return NextResponse.json(optimizedSubjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}
