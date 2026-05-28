import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email || "" }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { topicId, moduleId } = await req.json();
    if (!topicId) {
      return NextResponse.json({ error: "Missing topicId" }, { status: 400 });
    }

    // Mark topic as completed
    await prisma.topicProgress.upsert({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId: topicId
        }
      },
      update: {
        isCompleted: true
      },
      create: {
        userId: user.id,
        topicId: topicId,
        isCompleted: true
      }
    });

    if (moduleId) {
      // Check if all topics in module are complete
      const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
        include: { topics: true }
      });

      if (moduleData) {
        const allTopicIds = moduleData.topics.map((t) => t.id);
        const completedTopics = await prisma.topicProgress.findMany({
          where: {
            userId: user.id,
            topicId: { in: allTopicIds },
            isCompleted: true
          }
        });

        if (completedTopics.length === allTopicIds.length) {
          await prisma.moduleProgress.upsert({
            where: {
              userId_moduleId: {
                userId: user.id,
                moduleId: moduleId
              }
            },
            update: {
              isCompleted: true
            },
            create: {
              userId: user.id,
              moduleId: moduleId,
              isCompleted: true
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Progress save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
