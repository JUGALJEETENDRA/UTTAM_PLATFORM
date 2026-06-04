"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/components/AuthProvider";
import { fetchGAS } from "@/lib/apiClient";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import {
  Flame, Trophy, Play, BookOpen, Target, Zap, Clock, Star,
  Gamepad2, Users, FileText, ExternalLink, Award, CheckCircle,
  ArrowRight, Book, Layers
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubjectResourceCard } from "@/components/cards/SubjectResourceCard";

export default function StudentDashboard({ params }: { params: Promise<{ subjectId: string }> }) {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }

    if (status === "authenticated" && session?.user) {
      // Fetch all required data from GAS
      const loadDashboardData = async () => {
        try {
          const result = await fetchGAS("getStudentDashboard", {
            userId: session.user.id,
            subjectId: subjectId
          });
          setData(result);
        } catch (err) {
          console.error("Failed to load dashboard data", err);
        } finally {
          setLoading(false);
        }
      };
      
      loadDashboardData();
    }
  }, [status, session, subjectId]);

  if (status === "loading" || loading) {
    return <div className="p-8 text-center">Loading your learning dashboard...</div>;
  }

  if (!data || !data.subject) {
    return <div className="p-8 text-center text-red-500">Failed to load subject data.</div>;
  }

  const user = session!.user;
  const { subject, enrollment, modules, quizzesWithAttempts, topStudents, classRank, userBadges, userProgress, recommendedSimulations, flashcardDecks, subjectResources } = data;

  // 9. Calculate Overall Progress & Active Module
  const totalSubjectSubtopics = modules.reduce((sum: any, mod: any) => sum + (mod.subtopics?.length || 0), 0);
  const completedSubjectSubtopics = userProgress.reduce((sum: any, prog: any) => sum + (prog.completedSubtopics?.length || 0), 0);
  const overallProgressPercent = totalSubjectSubtopics > 0 ? Math.round((completedSubjectSubtopics / totalSubjectSubtopics) * 100) : 0;
  
  const activeModule = modules.find((m: any) => {
    const p = userProgress.find((up: any) => up.moduleId === m.id);
    return !p || !p.completed || p.completedSubtopics.length < m.subtopics.length;
  }) || modules[modules.length - 1] || modules[0];

  const activeModuleProgress = activeModule ? userProgress.find((p: any) => p.moduleId === activeModule.id) : null;
  const activeModuleCompletedSubtopics = activeModuleProgress?.completedSubtopics.length || 0;
  const activeModuleTotalSubtopics = activeModule?.subtopics?.length || 1;
  const activeModuleProgressPercent = Math.round((activeModuleCompletedSubtopics / activeModuleTotalSubtopics) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome & Top Stats Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary to-[#700000] text-white border-primary shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-white/10 blur-3xl transform translate-x-1/2 rounded-full"></div>
          <CardHeader className="relative z-10 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">Welcome back, {user.name || "Student"}!</CardTitle>
                <CardDescription className="text-white/80 mt-2 text-base">
                  You are making great progress in {subject.name}. Let's keep the momentum going!
                </CardDescription>
              </div>
              <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-primary-foreground text-primary font-bold text-lg">
                  {(user.name || "Student").charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Resume Card */}
        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center font-bold text-zinc-800">
              <BookOpen className="w-5 h-5 mr-2 text-primary" /> Active Module
            </CardTitle>
            <CardDescription>Continue where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeModule ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-semibold text-zinc-700">
                    <span>{activeModule.title}</span>
                    <span className="text-primary">
                      {activeModuleProgressPercent}%
                    </span>
                  </div>
                  <Progress
                    value={activeModuleProgressPercent}
                    className="h-2 bg-zinc-100"
                  />
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  Next Subtopic: <span className="font-semibold text-zinc-700">
                    {activeModule.subtopics?.[activeModuleCompletedSubtopics]?.title || "N/A"}
                  </span>
                </div>
                <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${activeModule.id}`}>
                  <Button className="w-full mt-2 bg-primary hover:bg-primary/95 text-white">
                    Resume Module <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="py-6 text-center text-zinc-400 text-sm">
                No active modules available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-10">

          {/* 1. Learning Modules */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2.5 text-primary" /> Learning Modules
                </h3>
                <p className="text-zinc-500 text-sm mt-0.5">Explore syllabus concepts with videos & reference notes.</p>
              </div>
              <Link href={`/student/subjects/subject?subjectId=${subjectId}/modules`} className="text-sm font-semibold text-primary hover:underline flex items-center">
                All Modules <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {modules.map((mod: any) => {
                const prog = userProgress.find((p: any) => p.moduleId === mod.id);
                const completedCount = prog?.completedSubtopics?.length || 0;
                const totalCount = mod.subtopics?.length || 0;
                const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <Card key={mod.id} className="hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden bg-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-bold text-lg border border-primary/10">
                          {mod.moduleNo}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-800 text-base leading-snug">{mod.title}</h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-zinc-500 font-medium">{mod.hours} Hours</span>
                            <span className="text-xs text-zinc-300">•</span>
                            <span className="text-xs text-zinc-500 font-medium">CO: {mod.co}</span>
                            <span className="text-xs text-zinc-300">•</span>
                            <span className="text-xs text-zinc-500 font-medium">{mod.subtopics?.length || 0} Subtopics</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 md:w-1/3 w-full md:justify-end">
                        <div className="flex-1 max-w-[150px]">
                          <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
                            <span>Progress</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-1.5 bg-zinc-100" />
                        </div>
                        <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5 text-xs font-semibold px-4 h-9">
                            Study
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>


          {/* 2.5 Subject Resources */}
          {subjectResources?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-zinc-900 flex items-center mb-5">
                <Book className="w-6 h-6 mr-2.5 text-primary" /> Subject Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjectResources.map((resource: any) => (
                  <div key={resource.id}>
                    <SubjectResourceCard
                      title={resource.title}
                      type={resource.type}
                      link={resource.link}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Quizzes & Assessments */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 flex items-center">
                  <Target className="w-6 h-6 mr-2.5 text-primary" /> Quizzes & Assessments
                </h3>
                <p className="text-zinc-500 text-sm mt-0.5">Test your concept understanding with quizzes.</p>
              </div>
              <Link href={`/student/subjects/subject?subjectId=${subjectId}/quizzes`} className="text-sm font-semibold text-primary hover:underline flex items-center">
                All Quizzes <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizzesWithAttempts?.map((quiz: any) => {
                const attempt = quiz.attempts?.[0];
                const isCompleted = attempt?.completed;

                return (
                  <Card key={quiz.id} className={`hover:border-primary/30 transition-all duration-200 ${isCompleted ? 'bg-zinc-50/50' : 'bg-white'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline" className="text-[10px] px-2 border-zinc-200">
                          Module {quiz.module?.moduleNo}
                        </Badge>
                        {isCompleted ? (
                          <Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0 border-none font-semibold flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Score: {attempt.score}/{attempt.totalMarks}
                          </Badge>
                        ) : (
                          <Badge className="bg-red-50 hover:bg-red-50 text-red-700 text-[10px] px-2 py-0 border border-red-200 font-semibold">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base font-bold text-zinc-800 line-clamp-1">{quiz.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" /> <span>{quiz.timeLimit}m limit</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3.5 h-3.5" /> <span>{quiz.totalQuestionsToAsk || quiz.questions?.length} Questions</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-4">
                      {isCompleted ? (
                        <div className="w-full flex flex-col space-y-2">
                          <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="w-full block">
                            <Button variant="outline" className="w-full border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-semibold text-xs h-9 shadow-sm">
                              Retake Quiz
                            </Button>
                          </Link>
                          <Link href={`/student/subjects/subject/quizzes/item/attempts/attempt?subjectId=${subjectId}&id=${quiz.id}&attemptId=${attempt.id}`} className="w-full block">
                            <Button variant="ghost" className="w-full text-zinc-500 hover:text-primary text-xs h-8">
                              Review Last Attempt
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="w-full block">
                          <Button className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-semibold h-9 shadow-sm">
                            Start Quiz
                          </Button>
                        </Link>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 4. Flashcards & Study Decks */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 flex items-center">
                  <Layers className="w-6 h-6 mr-2.5 text-primary" /> Flashcards & Study Decks
                </h3>
                <p className="text-zinc-500 text-sm mt-0.5">Review key terms and concepts interactively.</p>
              </div>
              <Link href={`/student/subjects/subject?subjectId=${subjectId}/flashcards`} className="text-sm font-semibold text-primary hover:underline flex items-center">
                All Decks <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {flashcardDecks?.map((deck: any) => (
                <Card key={deck.id} className="hover:border-primary/30 transition-all duration-200 bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline" className="text-[10px] px-2 border-zinc-200">
                        Module {deck.module?.moduleNo}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-zinc-800 line-clamp-1">{deck.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                      <div className="flex items-center space-x-1">
                        <Layers className="w-3.5 h-3.5" /> <span>{deck.cards?.length || 0} Cards</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`} className="w-full block">
                      <Button variant="outline" className="w-full border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-semibold text-xs h-9 shadow-sm">
                        Study Flashcards
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
              {flashcardDecks?.length === 0 && (
                <p className="text-sm text-zinc-500 italic py-4">No flashcard decks available yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">

          {/* 1. Recommended Simulations */}
          <Card className="bg-white shadow-sm border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-zinc-800 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2 text-primary" /> Interactive Labs
              </CardTitle>
              <CardDescription className="text-xs">Gain visual UI practice on interactive simulators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedSimulations?.map((sim: any) => (
                <div key={sim.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg hover:border-primary/20 transition-all duration-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <Badge variant="outline" className="text-[9px] text-zinc-500">
                      {sim.difficulty}
                    </Badge>
                  </div>
                  <h5 className="font-semibold text-zinc-800 text-sm leading-snug line-clamp-1">{sim.title}</h5>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{sim.description}</p>
                  <Link href={`/student/subjects/subject/simulations/item?subjectId=${subjectId}&id=${sim.id}`} className="mt-3 block">
                    <Button variant="secondary" size="sm" className="w-full text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 h-8">
                      <Play className="w-3 h-3 mr-1.5 fill-current" /> Start Lab
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
