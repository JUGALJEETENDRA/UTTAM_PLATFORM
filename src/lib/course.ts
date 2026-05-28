import { prisma } from "@/lib/prisma";

export async function getModulesWithCustomTopics() {
  try {
    return await prisma.module.findMany({
      orderBy: { order: "asc" },
      include: {
        topics: {
          orderBy: { order: "asc" },
          include: { quizQuestions: true, fileMaterials: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch modules:", error);
    return [];
  }
}

export async function getTopic(moduleId: string, topicId: string) {
  try {
    return await prisma.topic.findUnique({
      where: { id: topicId },
      include: { quizQuestions: true, fileMaterials: true },
    });
  } catch (error) {
    console.error("Failed to fetch topic:", error);
    return null;
  }
}
