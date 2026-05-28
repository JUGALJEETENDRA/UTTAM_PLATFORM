import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getModulesWithCustomTopics } from "@/lib/course";
import TopicTypeBadge from "@/components/ui/TopicTypeBadge";
import TopicFooterNav from "@/components/ui/TopicFooterNav";
import SimulationPlayer from "@/components/ui/SimulationPlayer";
import QuizPlayer from "@/components/ui/QuizPlayer";
import FlashcardPlayer from "@/components/ui/FlashcardPlayer";
import { prisma } from "@/lib/prisma";

interface TopicPageProps {
  params: Promise<{ subjectId: string; moduleId: string; topicId: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { subjectId, moduleId, topicId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) notFound();

  const modules = await getModulesWithCustomTopics();
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) notFound();

  const topic = mod.topics.find((t) => t.id === topicId);
  if (!topic) notFound();

  const topicIndex = mod.topics.findIndex((t) => t.id === topicId);
  const nextTopic = mod.topics[topicIndex + 1] ?? null;
  const prevTopic = mod.topics[topicIndex - 1] ?? null;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-gray-900 transition">
          Dashboard
        </Link>
        <span>/</span>
        <Link href={`/subject/${subject.id}`} className="hover:text-gray-900 transition">
          {subject.code}
        </Link>
        <span>/</span>
        <Link href={`/subject/${subject.id}/module/${mod.id}`} className="hover:text-gray-900 transition">
          {mod.title}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{topic.title}</span>
      </nav>

      {/* Header */}
      <header className="bg-white border border-gray-100 shadow-sm rounded-3xl p-7 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <TopicTypeBadge type={topic.type as any} />
            <span className="text-xs text-gray-500">⏱ {topic.durationMinutes} min</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{topic.title}</h1>
        </div>
      </header>

      {/* Content Area */}
      <main className="bg-white border border-gray-100 shadow-sm rounded-3xl p-7 min-h-[500px]">
        {topic.type === "video" && topic.videoId && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${topic.videoId}`}
              title={topic.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {["reading", "notes", "mindmap", "flashcard", "extra"].includes(topic.type) && topic.ebookContent && (
          <div className="prose prose-gray max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: topic.ebookContent }} />
          </div>
        )}

        {["reading", "notes", "mindmap", "extra"].includes(topic.type) && topic.fileMaterials && topic.fileMaterials.length > 0 && (
          <div className="space-y-8">
            {topic.fileMaterials.map((file: any) => (
              <div key={file.id} className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">{file.fileName || "Document"}</h3>
                  </div>
                  <a
                    href={file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.googleDriveFileId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium text-sm transition border border-red-200"
                    download
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
                {/* PDF Viewer */}
                <div className="w-full h-[600px] bg-gray-100">
                  <iframe src={`https://drive.google.com/file/d/${file.googleDriveFileId}/preview`} className="w-full h-full border-0" title={file.title} />
                </div>
              </div>
            ))}
          </div>
        )}

        {topic.type === "quiz" && topic.quizQuestions && (
          <QuizPlayer 
            questions={topic.quizQuestions} 
            originalFileUrl={topic.fileMaterials?.[0]?.webContentLink || (topic.fileMaterials?.[0]?.googleDriveFileId ? `https://drive.google.com/uc?export=download&id=${topic.fileMaterials[0].googleDriveFileId}` : undefined)}
          />
        )}

        {topic.type === "flashcard" && topic.quizQuestions && (
          <FlashcardPlayer 
            questions={topic.quizQuestions} 
            originalFileUrl={topic.fileMaterials?.[0]?.webContentLink || (topic.fileMaterials?.[0]?.googleDriveFileId ? `https://drive.google.com/uc?export=download&id=${topic.fileMaterials[0].googleDriveFileId}` : undefined)}
          />
        )}

        {topic.type === "assignment" && topic.assignmentDescription && (
          <div className="prose prose-gray max-w-none">
             <div className="whitespace-pre-wrap text-gray-700 font-mono text-sm bg-gray-50 p-6 rounded-2xl border border-gray-200">
               {topic.assignmentDescription}
             </div>
             <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Assignment</h3>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-red-400 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-600"><span className="font-semibold text-red-600">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, ZIP, or Jupyter Notebook</p>
                        </div>
                        <input type="file" className="hidden" />
                    </label>
                </div>
             </div>
          </div>
        )}

        {topic.type === "simulation" && topic.simulationUrl && (
          <div className="space-y-6">
             {/* Detailed explanation above the simulation */}
             {topic.ebookContent && (
               <div className="prose prose-gray max-w-none">
                 <div dangerouslySetInnerHTML={{ __html: topic.ebookContent }} />
               </div>
             )}

             {/* Simulation banner + iframe */}
             <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-purple-900">
               <h3 className="font-semibold mb-1">🧪 Interactive Simulation</h3>
               <p className="text-sm text-purple-800">Now that you understand the theory, experiment with the visualizer below to see the algorithm execute step-by-step on real data.</p>
             </div>
             <SimulationPlayer url={topic.simulationUrl} title={topic.title} />
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <TopicFooterNav
        subjectId={subject.id}
        moduleId={mod.id}
        topicId={topic.id}
        prevTopicId={prevTopic?.id || null}
        nextTopicId={nextTopic?.id || null}
      />
    </div>
  );
}
