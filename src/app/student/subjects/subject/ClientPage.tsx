"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchGAS } from "@/lib/apiClient";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Target, Zap, Clock, Star, Gamepad2, FileText, ExternalLink, ArrowRight, Book, Layers, Brain } from "lucide-react";
import { SubjectResourceCard } from "@/components/cards/SubjectResourceCard";

export default function StudentDashboard({ params }: { params: Promise<{ subjectId: string }> }) {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) {
      const loadDashboardData = async () => {
        try {
          const result = await fetchGAS("getStudentDashboard", {
            userId: "anonymous",
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
  }, [subjectId]);

  if (loading) {
    return <div className="p-8 text-center">Loading your learning dashboard...</div>;
  }

  if (!data || !data.subject) {
    return <div className="p-8 text-center text-red-500">Failed to load subject data.</div>;
  }

  const { subject, modules, quizzesWithAttempts, flashcardDecks, mindmaps = [], subjectResources } = data;
  const activeModule = modules[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome & Top Stats Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary to-[#700000] text-white border-primary shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-white/10 blur-3xl transform translate-x-1/2 rounded-full"></div>
          <CardHeader className="relative z-10 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">Welcome to {subject.name}</CardTitle>
                <CardDescription className="text-white/80 mt-2 text-base">
                  {subject.description || "Explore modules, quizzes, and resources."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Resume Card */}
        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center font-bold text-zinc-800">
              <BookOpen className="w-5 h-5 mr-2 text-primary" /> Active Module
            </CardTitle>
            <CardDescription>Start learning now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeModule ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-semibold text-zinc-700">
                    <span>{activeModule.title}</span>
                  </div>
                </div>
                <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${activeModule.id}`}>
                  <Button className="w-full mt-2 bg-primary hover:bg-primary/95 text-white">
                    Start Module <ArrowRight className="w-4 h-4 ml-1.5" />
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
                <h2 className="text-2xl font-bold text-zinc-900 flex items-center">
                  <Layers className="w-6 h-6 mr-2 text-primary" /> Learning Modules
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Explore all the topics for this subject</p>
              </div>
              <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
                <Button variant="ghost" className="text-primary font-medium hover:bg-primary/5">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.slice(0, 4).map((mod: any, index: number) => (
                <Link key={mod.id} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                  <Card className="hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full group bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                          Module {mod.moduleNo}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-zinc-800 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {mod.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-medium">
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {mod.hours || "2h"}</span>
                        <span className="flex items-center"><Book className="w-3.5 h-3.5 mr-1" /> {mod.subtopics?.length || 0} Subtopics</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {modules.length === 0 && (
                <div className="col-span-full py-8 text-center text-zinc-500 border border-dashed rounded-lg">
                  No modules available yet.
                </div>
              )}
            </div>
          </div>

          {/* 2. Available Quizzes */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-blue-600" /> Quizzes & Assessments
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Test your knowledge</p>
              </div>
              <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {quizzesWithAttempts.slice(0, 3).map((quiz: any) => (
                <Card key={quiz.id} className="border border-zinc-200 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden group">
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          Module {quiz.module?.moduleNo || "?"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-800 mb-2 group-hover:text-blue-600 transition-colors">{quiz.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-zinc-400" /> {quiz.timeLimit || 30} mins</span>
                        <span className="flex items-center"><Target className="w-4 h-4 mr-1 text-zinc-400" /> {quiz.totalMarks || 100} Marks</span>
                      </div>
                    </div>
                    <div className="bg-zinc-50 sm:w-48 p-5 flex flex-col justify-center items-center border-t sm:border-t-0 sm:border-l border-zinc-100">
                      <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Quiz</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
              {quizzesWithAttempts.length === 0 && (
                <div className="py-8 text-center text-zinc-500 border border-dashed rounded-lg bg-zinc-50">
                  No quizzes assigned yet.
                </div>
              )}
            </div>
          </div>
          
          {/* 3. Flashcard Decks */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-amber-500" /> Flashcard Decks
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Quick revision decks</p>
              </div>
              <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcardDecks.slice(0, 4).map((deck: any) => (
                <Link key={deck.id} href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`}>
                  <Card className="hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer h-full group bg-white border-zinc-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Module {deck.module?.moduleNo || "?"}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-zinc-800 leading-tight group-hover:text-amber-600 transition-colors">
                        {deck.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-zinc-500 font-medium">
                        <Layers className="w-4 h-4 mr-1.5" /> {deck.cards?.length || 0} Cards
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {flashcardDecks.length === 0 && (
                <div className="col-span-full py-8 text-center text-zinc-500 border border-dashed rounded-lg bg-zinc-50">
                  No flashcard decks available yet.
                </div>
              )}
            </div>
          </div>

          {/* 4. Mind Maps */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-purple-500" /> Interactive Mind Maps
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Explore visual topic structures</p>
              </div>
              <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mindmaps.slice(0, 4).map((map: any) => (
                <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`}>
                  <Card className="hover:border-purple-400/50 hover:shadow-md transition-all cursor-pointer h-full group bg-white border-zinc-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          Mind Map
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-zinc-800 leading-tight group-hover:text-purple-600 transition-colors">
                        {map.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-zinc-500 font-medium">
                        <ExternalLink className="w-4 h-4 mr-1.5" /> Interactive View
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {mindmaps.length === 0 && (
                <div className="col-span-full py-8 text-center text-zinc-500 border border-dashed rounded-lg bg-zinc-50">
                  No mind maps available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Resources */}
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-zinc-100">
              <CardTitle className="text-lg font-bold flex items-center text-zinc-800">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Reference Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {subjectResources.map((resource: any, index: number) => (
                 <SubjectResourceCard 
                   key={index} 
                   title={resource.title}
                   type={resource.type}
                   link={resource.link}
                 />
              ))}
              {subjectResources.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-2">No resources provided yet.</p>
              )}
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
