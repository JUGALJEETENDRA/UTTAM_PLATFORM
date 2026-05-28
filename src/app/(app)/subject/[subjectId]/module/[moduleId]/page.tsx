import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getModulesWithCustomTopics } from "@/lib/course";
import TopicTypeBadge from "@/components/ui/TopicTypeBadge";
import { prisma } from "@/lib/prisma";

interface ModulePageProps {
  params: Promise<{ subjectId: string; moduleId: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { subjectId, moduleId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) notFound();

  const modules = await getModulesWithCustomTopics();
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) notFound();

  const moduleIndex = modules.findIndex((m) => m.id === moduleId);
  const prevModule = modules[moduleIndex - 1] ?? null;
  const nextModule = modules[moduleIndex + 1] ?? null;

  const totalMinutes = mod.topics.reduce((a, t) => a + t.durationMinutes, 0);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-gray-900 transition" id="bc-dashboard">
          Dashboard
        </Link>
        <span>/</span>
        <Link href={`/subject/${subjectId}`} className="hover:text-gray-900 transition" id="bc-subject">
          {subject.code}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{mod.title}</span>
      </nav>

      {/* Module Header */}
      <header className="bg-white border border-gray-100 shadow-sm rounded-3xl p-7">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">
                Module {mod.order}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{mod.title}</h1>
            <p className="text-gray-500 max-w-xl">{mod.description}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mt-5 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-red-500">📋</span>
            <span>{mod.topics.length} topics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-red-500">⏱</span>
            <span>~{totalMinutes} min total</span>
          </div>
        </div>
      </header>

      {/* Topics List */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Topics in this Module</h2>
        <div className="space-y-3">
          {mod.topics.map((topic, idx) => {
            const href = `/subject/${subjectId}/module/${moduleId}/topic/${topic.id}`;

            return (
              <Link
                key={topic.id}
                href={href}
                id={`topic-${topic.id}`}
                className="bg-white border border-gray-100 hover:shadow-md shadow-sm rounded-2xl p-5 flex items-center gap-4 transition-all duration-150 cursor-pointer"
              >
                {/* Number indicator */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all bg-gray-50 text-gray-500 border border-gray-200"
                >
                  <span>{idx + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-bold text-gray-900">
                        {topic.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <TopicTypeBadge type={topic.type as any} />
                        <span className="text-xs text-gray-500">⏱ {topic.durationMinutes} min</span>
                      </div>
                    </div>
                    <span
                      className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border bg-red-50 text-red-600 border-red-200"
                    >
                      Start →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Module Navigation */}
      <nav className="flex items-center justify-between gap-4">
        {prevModule ? (
          <Link
            href={`/subject/${subject.id}/module/${prevModule.id}`}
            id="prev-module-link"
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prevModule.title}
          </Link>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Link
            href={`/subject/${subject.id}/module/${nextModule.id}`}
            id="next-module-link"
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 border border-red-700 shadow-sm rounded-xl text-sm font-semibold text-white hover:bg-red-700 transition-all"
          >
            {nextModule.title}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
