import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getModulesWithCustomTopics } from "@/lib/course";
import ProgressBar from "@/components/ui/ProgressBar";
import { prisma } from "@/lib/prisma";

interface SubjectPageProps {
  params: Promise<{ subjectId: string }>;
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subjectId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) notFound();

  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email || "" },
      include: { topicProgress: true, moduleProgress: true },
    });
  }

  const completedTopicIds = dbUser?.topicProgress?.filter((t) => t.isCompleted).map((t) => t.topicId) || [];
  const completedModuleIds = dbUser?.moduleProgress?.filter((m) => m.isCompleted).map((m) => m.moduleId) || [];

  const modules = await getModulesWithCustomTopics();
  const totalTopicsCount = modules.reduce((acc, m) => acc + m.topics.length, 0);
  const completedInCourse = completedTopicIds.length;
  const subjectProgress = totalTopicsCount > 0 ? Math.round((completedInCourse / totalTopicsCount) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900 transition" id="breadcrumb-dashboard">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{subject.title}</span>
      </nav>

      {/* Hero Header */}
      <header
        className={`relative rounded-3xl p-8 bg-gradient-to-br ${subject.coverColor} overflow-hidden shadow-lg`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-black/5 rounded-full translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              {subject.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              Semester {subject.semester}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              {subject.credits} Credits
            </span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
            {subject.title}
          </h1>
          <p className="text-white/90 max-w-2xl text-sm lg:text-base font-medium">
            {subject.description}
          </p>
          <p className="text-white/80 text-sm mt-3 font-medium">👨‍🏫 {subject.instructor}</p>
        </div>
      </header>

      {/* Progress Overview */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { id: "ov-topics", label: "Topics Done", value: `${completedInCourse}`, total: `/${totalTopicsCount}` },
          { id: "ov-modules", label: "Modules Done", value: `${completedModuleIds.length}`, total: `/${modules.length}` },
          { id: "ov-completion", label: "Completion", value: `${subjectProgress}`, total: "%" },
        ].map((item) => (
          <div key={item.id} id={item.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-red-600">
              {item.value}
              <span className="text-lg text-gray-400 font-normal">{item.total}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1 font-medium">{item.label}</p>
          </div>
        ))}
      </section>

      {/* Overall progress bar */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
        <ProgressBar value={subjectProgress} showLabel height="h-3" id="subject-overview-progress" colorClass="bg-red-500" />
      </div>

      {/* Modules List */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Course Modules</h2>
        <div className="space-y-4">
          {modules.map((mod) => {
            const modTopicsCount = mod.topics.length;
            const completedModTopics = mod.topics.filter(t => completedTopicIds.includes(t.id)).length;
            const prog = modTopicsCount > 0 ? Math.round((completedModTopics / modTopicsCount) * 100) : 0;
            const completed = completedModuleIds.includes(mod.id) || (prog === 100 && modTopicsCount > 0);

            const videoCount = mod.topics.filter((t) => t.type === "video").length;
            const quizCount = mod.topics.filter((t) => t.type === "quiz").length;
            const assignCount = mod.topics.filter((t) => t.type === "assignment").length;

            return (
              <div
                key={mod.id}
                id={`module-card-${mod.id}`}
                className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 transition-all duration-200 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Order badge */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        completed
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {completed ? "✓" : mod.order}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {mod.title}
                        </h3>
                        {completed && (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{mod.description}</p>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        <span>{mod.topics.length} topics</span>
                        {videoCount > 0 && <span>🎬 {videoCount} videos</span>}
                        {quizCount > 0 && <span>📝 {quizCount} quizzes</span>}
                        {assignCount > 0 && <span>📋 {assignCount} assignments</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-red-600">{prog}%</p>
                      <p className="text-xs text-gray-400 font-medium">complete</p>
                    </div>
                      <Link
                        href={`/subject/${subject.id}/module/${mod.id}`}
                        id={`module-link-${mod.id}`}
                        className="flex-shrink-0 px-5 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-200 hover:bg-red-100 transition"
                      >
                        {completed ? "Review" : prog > 0 ? "Continue" : "Start"}
                      </Link>
                  </div>
                </div>

                <div className="mt-5">
                  <ProgressBar
                    value={prog}
                    colorClass={
                      completed
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                    id={`mod-prog-bar-${mod.id}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
