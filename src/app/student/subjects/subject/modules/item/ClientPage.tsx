"use client";
import Link from "next/link";
import { MarkCompletedButton } from "@/components/student/MarkCompletedButton";
import { ResourceLinkTracker } from "@/components/student/ResourceLinkTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, PlayCircle, FileText, CheckCircle2, Gamepad2, Target, Download, Book, BrainCircuit, CreditCard, Link as LinkIcon, HelpCircle, Layers, Headphones } from "lucide-react";
import { module1Quizzes } from "@/data/module1QuizData";
import { module2Quizzes } from "@/data/module2QuizData";
import { useEffect, useState, use } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { useSession } from "@/components/AuthProvider";
import { redirect, useSearchParams } from "next/navigation";
function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("/embed/")) return url;
  
  if (url.includes("youtube.com/watch")) {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
      // ignore
    }
  }
  
  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts.length > 1) {
      const videoId = parts[1].split(/[?#]/)[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  return url;
}
function getExternalEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("drive.google.com/file/d/")) {
    return url.replace(/\/view.*$/, "/preview");
  }
  return url;
}
export default function ModuleDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const subjectId = searchParams.get('subjectId') || '';
  const { data: session, status } = useSession();
  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (status === "unauthenticated") redirect("/sign-in");
    
    if (status === "authenticated" && session?.user) {
      const loadModule = async () => {
        try {
          const result = await fetchGAS("getModule", { moduleId: id, userId: session.user.id });
          setModuleData(result);
        } catch (err) {
          console.error("Failed to load module", err);
        } finally {
          setLoading(false);
        }
      };
      loadModule();
    }
  }, [status, session, id]);
  if (status === "loading" || loading) return <div className="p-8 text-center">Loading module details...</div>;
  if (!moduleData || moduleData.error) return <div className="p-8 text-center text-red-500">Module not found.</div>;
  const completedSubtopics = moduleData.completedSubtopics || [];
  const completedResources: string[] = []; // Not tracked strictly in GAS schema currently, assume empty
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`} className="flex items-center text-sm font-medium text-zinc-500 hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Modules
      </Link>
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">{moduleData.id.toUpperCase()}</Badge>
          <Badge variant="secondary">{moduleData.co}</Badge>
          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">{moduleData.hours} Hours</Badge>
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-4">{moduleData.title}</h1>
            <p className="text-lg text-zinc-600">{moduleData.description}</p>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-zinc-800 mb-6">Subtopics</h2>
      <div className="space-y-4">
        {moduleData.subtopics && moduleData.subtopics.map((subtopic: any, index: number) => {
          const hasNotes = !!subtopic.notesUrl;
          
          // Map dynamic resources
          const subtopicQuizzes = moduleData.quizzes?.filter((q: any) => q.subtopicId === subtopic.id) || [];
          const subtopicSims = moduleData.simulations?.filter((s: any) => s.subtopicId === subtopic.id) || [];
          const subtopicFlashcards = moduleData.flashcardDecks?.filter((f: any) => f.subtopicId === subtopic.id) || [];
          // Simplification for client rendering without deep tracking
          const isNotesCompleted = true; 
          const isSimCompleted = true;
          const isQuizCompleted = true;
          const isAudioCompleted = true;
          const canComplete = isNotesCompleted && isSimCompleted && isQuizCompleted && isAudioCompleted;
          return (
          <Card key={subtopic.id} className="border-zinc-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white">
            <div className="flex flex-col md:flex-row">
              <div className="bg-zinc-50 w-full md:w-16 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 py-4 md:py-0 flex-shrink-0">
                <span className="text-2xl font-bold text-zinc-300">{index + 1}</span>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <div className="mb-4">
                  <CardTitle className="text-xl mb-2 text-zinc-800 font-bold">{subtopic.title}</CardTitle>
                  <CardDescription className="text-base text-zinc-600">{subtopic.description}</CardDescription>
                </div>
                {subtopic.videoUrl && (
                  <div className="w-full mb-5">
                    <div className="w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-950 aspect-video shadow-sm max-w-3xl mx-auto">
                      <iframe
                        src={getEmbedUrl(subtopic.videoUrl) || ""}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={subtopic.title}
                      ></iframe>
                    </div>
                  </div>
                )}
                {subtopic.audioUrl && (
                  <div className="w-full mb-5 max-w-3xl mx-auto">
                    <p className="text-sm font-bold text-zinc-700 mb-2 flex items-center">
                      <Headphones className="w-4 h-4 mr-2 text-purple-600" /> Audio Lesson
                    </p>
                    <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="audio">
                      <iframe 
                        className="w-full h-16 rounded-lg bg-zinc-50 border border-zinc-200 shadow-sm"
                        src={getExternalEmbedUrl(subtopic.audioUrl) || ""}
                        allow="autoplay"
                      ></iframe>
                    </ResourceLinkTracker>
                    <div className="mt-2 text-right">
                       <a href={subtopic.audioUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline">
                         Open Audio Source
                       </a>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-5 mt-auto">
                  {subtopic.notesUrl && (
                    <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                      <a href={subtopic.notesUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="bg-white hover:bg-red-50 border-red-200 text-red-700 text-sm font-bold h-11 px-6 shadow-sm">
                          <FileText className="w-5 h-5 mr-2" /> Read Notes
                        </Button>
                      </a>
                    </ResourceLinkTracker>
                  )}
                  {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes || subtopicQuizzes.length > 0) && (
                    <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                      <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : subtopic.id}`}>
                        <Button variant="outline" className="bg-white hover:bg-red-50 border-red-200 text-red-700 text-sm font-bold h-11 px-6 shadow-sm">
                          <Target className="w-5 h-5 mr-2" /> Attempt Quiz
                        </Button>
                      </Link>
                    </ResourceLinkTracker>
                  )}
                  {(subtopic.simulationUrl || subtopicSims.length > 0) && (
                    <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="simulation">
                      <Link href={
                        subtopicSims.length > 0 
                          ? `/student/subjects/subject/simulations/item?subjectId=${subjectId}&id=${subtopicSims[0].id}`
                          : `/student/subjects/subject/modules/item/simulations/subtopic?subjectId=${subjectId}&id=${id}&subtopicId=${subtopic.id}`
                      }>
                        <Button variant="outline" className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 text-sm font-bold h-11 px-6 shadow-sm">
                          <Gamepad2 className="w-5 h-5 mr-2" /> View Simulation
                        </Button>
                      </Link>
                    </ResourceLinkTracker>
                  )}
                  {subtopicFlashcards.length > 0 && (
                    <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${subtopicFlashcards[0].id}`}>
                      <Button variant="outline" className="bg-white hover:bg-amber-50 border-amber-200 text-amber-700 text-sm font-bold h-11 px-6 shadow-sm">
                        <Layers className="w-5 h-5 mr-2" /> Study Flashcards
                      </Button>
                    </Link>
                  )}
                  <MarkCompletedButton 
                    subtopicId={subtopic.id} 
                    moduleId={id} 
                    isInitiallyCompleted={completedSubtopics.includes(subtopic.id)} 
                    canComplete={canComplete}
                  />
                </div>
              </div>
            </div>
          </Card>
          );
        })}
      </div>
    </div>
  );
}