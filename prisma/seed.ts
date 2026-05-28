import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { MOCK_SUBJECT, MOCK_MODULES } from '../src/lib/mockData';

async function main() {
  console.log('Seeding database...');

  // Create Subject
  const subject = await prisma.subject.upsert({
    where: { code: MOCK_SUBJECT.code },
    update: {},
    create: {
      id: MOCK_SUBJECT.id,
      code: MOCK_SUBJECT.code,
      title: MOCK_SUBJECT.title,
      description: MOCK_SUBJECT.description,
      instructor: MOCK_SUBJECT.instructor,
      credits: MOCK_SUBJECT.credits,
      semester: MOCK_SUBJECT.semester,
      coverColor: MOCK_SUBJECT.coverColor,
      totalModules: MOCK_SUBJECT.totalModules,
      totalTopics: MOCK_SUBJECT.totalTopics || 0,
    },
  });

  console.log(`Created subject: ${subject.title}`);

  // Create Modules and Topics
  for (const mod of MOCK_MODULES) {
    const createdModule = await prisma.module.upsert({
      where: { id: mod.id },
      update: {},
      create: {
        id: mod.id,
        subjectId: subject.id,
        order: mod.order,
        title: mod.title,
        description: mod.description,
        isLocked: mod.isLocked,
      },
    });
    console.log(`Created module: ${createdModule.title}`);

    for (const topic of mod.topics) {
      const createdTopic = await prisma.topic.upsert({
        where: { id: topic.id },
        update: {},
        create: {
          id: topic.id,
          moduleId: createdModule.id,
          order: topic.order,
          title: topic.title,
          type: topic.type,
          durationMinutes: topic.durationMinutes,
          videoId: topic.videoId,
          ebookContent: topic.ebookContent,
          simulationUrl: topic.simulationUrl,
          assignmentDescription: topic.assignmentDescription,
        },
      });
      console.log(`Created topic: ${createdTopic.title}`);

      // If topic has quiz questions, insert them
      if (topic.quizQuestions && topic.quizQuestions.length > 0) {
        for (const q of topic.quizQuestions) {
          await prisma.quizQuestion.upsert({
            where: { id: q.id },
            update: {},
            create: {
              id: q.id,
              topicId: createdTopic.id,
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation,
            },
          });
        }
      }
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
