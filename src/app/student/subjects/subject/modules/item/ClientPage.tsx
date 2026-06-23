"use client";

import Link from "next/link";
import { ResourceLinkTracker } from "@/components/student/ResourceLinkTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, PlayCircle, FileText, CheckCircle2, Gamepad2, Target, 
  Download, Book, BookOpen, BrainCircuit, CreditCard, Link as LinkIcon, 
  HelpCircle, Layers, Headphones, Lightbulb, Clock, Terminal, Activity, Code, Settings, ChevronRight, MousePointer
} from "lucide-react";
import { module1Quizzes } from "@/data/module1QuizData";
import { module2Quizzes } from "@/data/module2QuizData";
import { useEffect, useState } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { redirect, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

// Theme Configuration lookup table used by fallback default and custom layouts
const THEME_MAP: Record<string, {
  bg: string;
  cardBg: string;
  borderClass: string;
  shadowClass: string;
  btnPrimary: string;
  btnGhost: string;
  titleHover: string;
  textHeading: string;
  textMuted: string;
  badge: string;
  pattern: string;
}> = {
  "ui programming": {
    bg: "bg-[#F9F6F0]",
    cardBg: "bg-white",
    borderClass: "border-4 border-black rounded-none",
    shadowClass: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1.5 hover:translate-y-1.5",
    btnPrimary: "bg-[#A855F7] text-white hover:bg-[#A855F7]/90 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1",
    btnGhost: "text-[#A855F7] font-black hover:bg-[#A855F7]/10 rounded-none",
    titleHover: "group-hover:text-[#A855F7]",
    textHeading: "text-black font-black uppercase tracking-tight",
    textMuted: "text-zinc-800 font-bold",
    badge: "bg-[#A855F7] text-white border-2 border-black rounded-none font-bold",
    pattern: "ui-blueprint-grid"
  }
};

const DEFAULT_THEME = {
  bg: "bg-[#f4f4f0]",
  cardBg: "bg-white",
  borderClass: "border-4 border-black rounded-none",
  shadowClass: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1.5 hover:translate-y-1.5",
  btnPrimary: "bg-[#2dd4bf] text-black hover:bg-[#2dd4bf]/90 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  btnGhost: "text-black font-black hover:bg-zinc-200 rounded-none",
  titleHover: "group-hover:text-primary",
  textHeading: "text-black font-black uppercase",
  textMuted: "text-zinc-700 font-medium",
  badge: "bg-zinc-200 text-black border-2 border-black rounded-none",
  pattern: ""
};

function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("/embed/")) return url;
  
  if (url.includes("drive.google.com/file/d/")) {
    return url.replace(/\/view.*$/, "/preview");
  }
  
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

// Premium 3D Tilt Card with moving light glare reflection effect
const DesignStudioCard = ({ children, className = "", style = {}, isPremium = true, ...props }: any) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPremium) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Rotate maximum 4deg in X and Y directions
    const rotateX = -((y / rect.height) - 0.5) * 8;
    const rotateY = ((x / rect.width) - 0.5) * 8;

    // Glare position percentage tracking cursor
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isPremium ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
        position: 'relative',
        ...style
      }}
      className={className}
      {...props}
    >
      {children}
      {isPremium && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30"
          style={{
            background: `radial-gradient(circle 120px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.12), transparent)`,
            opacity: glare.opacity
          }}
        />
      )}
    </div>
  );
};

export default function ModuleDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const subjectId = searchParams.get('subjectId') || '';
  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<{[id: string]: {video: string, audio: string}}>({});

  const handleLanguageChange = (subtopicId: string, type: 'video' | 'audio', url: string) => {
    setSelectedLanguages(prev => ({
      ...prev,
      [subtopicId]: {
        ...(prev[subtopicId] || {}),
        [type]: url
      }
    }));
  };

  useEffect(() => {
    if (id) {
      const loadModule = async () => {
        try {
          const result = await fetchGAS("getModule", { moduleId: id, userId: "anonymous" });
          setModuleData(result);
        } catch (err) {
          console.error("Failed to load module", err);
        } finally {
          setLoading(false);
        }
      };
      loadModule();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-center items-center font-mono text-zinc-800 space-y-4">
        <div className="w-12 h-12 border-4 border-t-[#3b82f6] border-zinc-200 rounded-full animate-spin" />
        <p className="text-xs uppercase font-bold tracking-wider animate-pulse text-zinc-500">Retrieving module pipeline...</p>
      </div>
    );
  }

  if (!moduleData || moduleData.error) {
    return <div className="p-8 text-center text-red-500 font-mono">Module not found.</div>;
  }

  // Theme Identification based strictly on query params to keep data fetching unchanged
  const isUiProgramming = subjectId === 'id_mn573l5e5';
  const isDigitalBusiness = subjectId === 'id_pryay1ykw';
  const isPythonProgramming = subjectId === 'id_hdzqxse2n';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 14 } }
  };

  // ==========================================
  // RENDER VARIANT A: DIGITAL BUSINESS & TRANSFORMATION (PREMIUM LIGHT THEME)
  // ==========================================
  if (isDigitalBusiness) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 relative overflow-hidden antialiased selection:bg-[#2563eb]/10 selection:text-[#2563eb] font-sans">
        
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(circle, #2563eb 1.2px, transparent 1.2px)`,
          backgroundSize: "28px 28px"
        }} />

        {/* Dynamic Vector Backings */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-20">
          <div className="absolute top-[15%] left-[5%] w-96 h-96 bg-[#2563eb]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-[#16a34a]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl space-y-8">
          
          {/* Dashboard Back Nav Bar */}
          <div className="flex justify-between items-center bg-white p-3 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] rounded-lg">
            <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
              <Button className="bg-slate-900 hover:bg-[#2563eb] text-white text-[10px] font-mono tracking-widest px-4 py-1.5 h-8 uppercase rounded-md shadow-sm transition-all flex items-center gap-1.5">
                ← Back to Modules
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">LIVE NODE DESK</span>
            </div>
          </div>

          {/* Section Header */}
          <div className="bg-white p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563eb] to-[#16a34a]" />
            <div className="flex items-center gap-3.5 mb-2.5">
              <Badge className="bg-[#2563eb]/10 text-[#2563eb] hover:bg-[#2563eb]/20 border-none px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                {moduleData.id.toUpperCase()}
              </Badge>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">// DBT_MODULE_INSPECT</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Layers className="w-7 h-7 text-[#2563eb]" />
              {moduleData.title}
            </h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl font-medium">
              {moduleData.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono font-bold text-slate-450">
              <span className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-md text-[#2563eb]">CO: {moduleData.co}</span>
              <span className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-md text-[#16a34a] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {moduleData.hours} Hours
              </span>
            </div>
          </div>

          {/* Subtopics stack */}
          <h2 className="text-sm font-black uppercase tracking-widest text-[#2563eb]">Subtopic Nodes</h2>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {moduleData.subtopics && moduleData.subtopics.map((rawSubtopic: any, index: number) => {
              let subtopic = { ...rawSubtopic };
              if (typeof subtopic.simulationData === 'string') {
                try {
                  const parsed = JSON.parse(subtopic.simulationData);
                  subtopic = { ...subtopic, ...parsed };
                } catch(e) {}
              } else if (typeof subtopic.simulationData === 'object' && subtopic.simulationData !== null) {
                subtopic = { ...subtopic, ...subtopic.simulationData };
              }
              
              if (typeof subtopic.otherUrl === 'string' && subtopic.otherUrl.trim().startsWith("{")) {
                try {
                  const sanitizedStr = subtopic.otherUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
                  let parsedOther = JSON.parse(sanitizedStr);
                  while (typeof parsedOther === 'string') {
                    parsedOther = JSON.parse(parsedOther);
                  }
                  if (typeof parsedOther === 'object' && parsedOther !== null) {
                    subtopic = { ...subtopic, ...parsedOther };
                  }
                  if (!subtopic.otherUrl || subtopic.otherUrl.trim() === "" || subtopic.otherUrl.trim().startsWith("{")) subtopic.otherUrl = "";
                  if (!subtopic.didYouKnowUrl || subtopic.didYouKnowUrl.trim() === "" || subtopic.didYouKnowUrl.trim().startsWith("{")) subtopic.didYouKnowUrl = "";
                  if (!subtopic.referenceUrl || subtopic.referenceUrl.trim() === "" || subtopic.referenceUrl.trim().startsWith("{")) subtopic.referenceUrl = "";
                } catch(e) {
                  subtopic.otherUrl = "";
                  subtopic.didYouKnowUrl = "";
                  subtopic.referenceUrl = "";
                }
              }

              const subtopicQuizzes = moduleData.quizzes?.filter((q: any) => q.subtopicId === subtopic.subtopicNo || q.subtopicId === subtopic.id) || [];
              const subtopicSims = moduleData.simulations?.filter((s: any) => s.subtopicId === subtopic.subtopicNo || s.subtopicId === subtopic.id) || [];
              const subtopicFlashcards = moduleData.flashcardDecks?.filter((f: any) => f.subtopicId === subtopic.subtopicNo || f.subtopicId === subtopic.id) || [];
              const subtopicMindMaps = moduleData.mindmaps?.filter((m: any) => m.title === subtopic.title) || [];

              const defaultVideoUrl = subtopic.videoUrl || (subtopic.videoLanguages?.[0]?.url || "");
              const defaultAudioUrl = subtopic.audioUrl || (subtopic.audioLanguages?.[0]?.url || "");

              return (
                <motion.div key={subtopic.id} variants={itemVariants}>
                  <Card className="border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.06)] hover:border-[#2563eb]/45 transition-all overflow-hidden bg-white rounded-xl">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-slate-50/50 w-full md:w-16 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 py-4 md:py-0 flex-shrink-0 select-none">
                        <span className="text-2xl font-black text-slate-300">0{index + 1}</span>
                      </div>
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="mb-4">
                          <CardTitle className="text-lg font-bold text-slate-800 mb-1.5">{subtopic.title}</CardTitle>
                          <CardDescription className="text-sm text-slate-500 font-medium leading-relaxed">{subtopic.description}</CardDescription>
                        </div>

                        {/* Video Content */}
                        {(subtopic.videoUrl || (subtopic.videoLanguages && subtopic.videoLanguages.length > 0)) && (
                          <div className="w-full mb-5">
                            {subtopic.videoLanguages && subtopic.videoLanguages.length > 0 && (
                              <div className="flex justify-end mb-2 max-w-3xl mx-auto">
                                <select 
                                  className="bg-white border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 text-slate-750 font-medium focus:outline-none focus:border-[#2563eb] shadow-sm"
                                  value={selectedLanguages[subtopic.id]?.video || defaultVideoUrl}
                                  onChange={(e) => handleLanguageChange(subtopic.id, 'video', e.target.value)}
                                >
                                  {subtopic.videoUrl && <option value={subtopic.videoUrl}>English (Default)</option>}
                                  {subtopic.videoLanguages.map((lang: any, i: number) => (
                                    <option key={i} value={lang.url}>{lang.language}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <div className="w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-950 aspect-video shadow-sm max-w-3xl mx-auto">
                              <iframe
                                src={getEmbedUrl(selectedLanguages[subtopic.id]?.video || defaultVideoUrl) || ""}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={subtopic.title}
                              ></iframe>
                            </div>
                          </div>
                        )}

                        {/* Audio Content */}
                        {(subtopic.audioUrl || (subtopic.audioLanguages && subtopic.audioLanguages.length > 0)) && (
                          <div className="w-full mb-5 max-w-3xl mx-auto bg-slate-50 p-4 border border-slate-200/80 rounded-lg shadow-inner">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-xs font-bold text-slate-750 flex items-center">
                                <Headphones className="w-4 h-4 mr-2 text-[#2563eb]" /> Audio Lesson
                              </p>
                              {subtopic.audioLanguages && subtopic.audioLanguages.length > 0 && (
                                <select 
                                  className="bg-white border border-slate-200 rounded-lg text-[10px] px-2 py-1 text-slate-750 font-medium focus:outline-none focus:border-[#2563eb] shadow-sm"
                                  value={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl}
                                  onChange={(e) => handleLanguageChange(subtopic.id, 'audio', e.target.value)}
                                >
                                  {subtopic.audioUrl && <option value={subtopic.audioUrl}>English (Default)</option>}
                                  {subtopic.audioLanguages.map((lang: any, i: number) => (
                                    <option key={i} value={lang.url}>{lang.language}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="audio">
                              <iframe 
                                className="w-full h-14 rounded bg-transparent border-0"
                                src={getExternalEmbedUrl(selectedLanguages[subtopic.id]?.audio || defaultAudioUrl) || ""}
                                allow="autoplay"
                              ></iframe>
                            </ResourceLinkTracker>
                            <div className="mt-2 text-right">
                               <a href={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#2563eb] font-mono hover:underline">
                                 Open Audio Source
                               </a>
                            </div>
                          </div>
                        )}

                        {/* Buttons grid */}
                        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 mt-auto">
                          {subtopic.notesUrl && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                              <a href={subtopic.notesUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold h-10 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                  <FileText className="w-4 h-4 text-red-500" /> Read Notes
                                </Button>
                              </a>
                            </ResourceLinkTracker>
                          )}
                          {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes || subtopicQuizzes.length > 0) && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                              <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : subtopic.id}`}>
                                <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold h-10 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                  <Target className="w-4 h-4 text-emerald-500" /> Attempt Quiz
                                </Button>
                              </Link>
                            </ResourceLinkTracker>
                          )}
                          {subtopicMindMaps.length > 0 && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="mindmap">
                              <Link href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${subtopicMindMaps[0].id}`}>
                                <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold h-10 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                  <BrainCircuit className="w-4 h-4 text-purple-500" /> View Mind Map
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
                                <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold h-10 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                  <Gamepad2 className="w-4 h-4 text-blue-500" /> View Simulation
                                </Button>
                              </Link>
                            </ResourceLinkTracker>
                          )}
                          {subtopic.didYouKnowUrl && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="didYouKnow">
                              <a href={subtopic.didYouKnowUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold h-10 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                  <Lightbulb className="w-4 h-4 text-amber-500" /> Did You Know
                                </Button>
                              </a>
                            </ResourceLinkTracker>
                          )}
                          {subtopic.referenceUrl && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="reference">
                              <a href={subtopic.referenceUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold h-10 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                  <Book className="w-4 h-4 text-zinc-550" /> Reference Material
                                </Button>
                              </a>
                            </ResourceLinkTracker>
                          )}
                          {subtopic.otherUrl && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="other">
                              <a href={subtopic.otherUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold h-10 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                  <LinkIcon className="w-4 h-4 text-slate-500" /> External Link
                                </Button>
                              </a>
                            </ResourceLinkTracker>
                          )}
                          {subtopicFlashcards.length > 0 && (
                            <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${subtopicFlashcards[0].id}`}>
                              <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs font-bold h-10 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                <Layers className="w-4 h-4 text-amber-500" /> Study Flashcards
                              </Button>
                            </Link>
                          )}
                        </div>

                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VARIANT C: PYTHON DEVELOPMENT STUDIO (PREMIUM PROFESSIONAL IDE THEME)
  // ==========================================
  if (isPythonProgramming) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 relative overflow-hidden font-mono antialiased selection:bg-[#3776AB]/10 selection:text-[#3776AB] font-jetbrains">
        
        {/* Code fragments in background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-[0.04] text-[9px] font-mono leading-relaxed space-y-4 p-8 text-slate-400">
          <div>import os, sys, json<br />from typing import List, Dict, Optional</div>
          <div className="pl-6">class PyDevStudyWorkspace(object):<br />&nbsp;&nbsp;&nbsp;&nbsp;def __init__(self, node: str) -&gt; None:<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.active_node = node</div>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;750&display=swap');
          .font-jetbrains {
            font-family: 'JetBrains Mono', monospace;
          }
        `}</style>

        <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl space-y-6">
          
          {/* Header IDE Info bar */}
          <div className="bg-white border border-slate-200 rounded px-4 py-2.5 flex flex-col md:flex-row justify-between items-center text-xs gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              </div>
              <span className="text-slate-200">|</span>
              <span className="font-bold text-[#2b5b84]">PYTHON DEVELOPMENT STUDIO</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-655 font-bold uppercase tracking-wider">Module Inspector</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-500">
              <span>Environment: <span className="text-[#3776AB] font-bold">py3.9-study</span></span>
              <span>Status: <span className="text-emerald-600 font-bold">ONLINE</span></span>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
              <Button className="bg-[#3776AB] hover:bg-[#3776AB]/90 text-white border border-[#3776AB] font-bold text-[10px] py-1.5 px-4 h-8 uppercase tracking-widest transition-all rounded shadow-md font-mono">
                ← IDE Modules
              </Button>
            </Link>
            <div className="text-[10px] text-slate-400 font-mono">
              path: <span className="text-[#3776AB]">~/workspace/modules/{moduleData.id}.py</span>
            </div>
          </div>

          {/* IDE Section Header Panel */}
          <div className="bg-white border border-slate-200 p-6 rounded relative overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#3776AB]" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold text-[#3776AB] bg-[#3776AB]/10 px-2 py-0.5 border border-[#3776AB]/30 rounded">DOCSTRING</span>
              <span className="text-[10px] text-slate-400 font-mono">// READ-ONLY SCHEMA</span>
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-[#3776AB] flex items-center gap-3 font-jetbrains">
              <Terminal className="w-6 h-6 text-[#3776AB]" />
              {moduleData.title}
            </h1>
            <p className="text-slate-500 mt-2 text-xs leading-relaxed max-w-2xl font-medium font-jetbrains">
              {moduleData.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="text-slate-500">co = &quot;{moduleData.co}&quot;</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#3776AB]">hours = {moduleData.hours}</span>
            </div>
          </div>

          {/* Subtopics stack */}
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-2">class SubtopicLoader(object):</h2>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {moduleData.subtopics && moduleData.subtopics.map((rawSubtopic: any, index: number) => {
              let subtopic = { ...rawSubtopic };
              if (typeof subtopic.simulationData === 'string') {
                try {
                  const parsed = JSON.parse(subtopic.simulationData);
                  subtopic = { ...subtopic, ...parsed };
                } catch(e) {}
              } else if (typeof subtopic.simulationData === 'object' && subtopic.simulationData !== null) {
                subtopic = { ...subtopic, ...subtopic.simulationData };
              }
              
              if (typeof subtopic.otherUrl === 'string' && subtopic.otherUrl.trim().startsWith("{")) {
                try {
                  const sanitizedStr = subtopic.otherUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
                  let parsedOther = JSON.parse(sanitizedStr);
                  while (typeof parsedOther === 'string') {
                    parsedOther = JSON.parse(parsedOther);
                  }
                  if (typeof parsedOther === 'object' && parsedOther !== null) {
                    subtopic = { ...subtopic, ...parsedOther };
                  }
                  if (!subtopic.otherUrl || subtopic.otherUrl.trim() === "" || subtopic.otherUrl.trim().startsWith("{")) subtopic.otherUrl = "";
                  if (!subtopic.didYouKnowUrl || subtopic.didYouKnowUrl.trim() === "" || subtopic.didYouKnowUrl.trim().startsWith("{")) subtopic.didYouKnowUrl = "";
                  if (!subtopic.referenceUrl || subtopic.referenceUrl.trim() === "" || subtopic.referenceUrl.trim().startsWith("{")) subtopic.referenceUrl = "";
                } catch(e) {
                  subtopic.otherUrl = "";
                  subtopic.didYouKnowUrl = "";
                  subtopic.referenceUrl = "";
                }
              }

              const subtopicQuizzes = moduleData.quizzes?.filter((q: any) => q.subtopicId === subtopic.subtopicNo || q.subtopicId === subtopic.id) || [];
              const subtopicSims = moduleData.simulations?.filter((s: any) => s.subtopicId === subtopic.subtopicNo || s.subtopicId === subtopic.id) || [];
              const subtopicFlashcards = moduleData.flashcardDecks?.filter((f: any) => f.subtopicId === subtopic.subtopicNo || f.subtopicId === subtopic.id) || [];
              const subtopicMindMaps = moduleData.mindmaps?.filter((m: any) => m.title === subtopic.title) || [];

              const defaultVideoUrl = subtopic.videoUrl || (subtopic.videoLanguages?.[0]?.url || "");
              const defaultAudioUrl = subtopic.audioUrl || (subtopic.audioLanguages?.[0]?.url || "");

              return (
                <motion.div key={subtopic.id} variants={itemVariants}>
                  <div className="bg-white border border-slate-200 p-6 rounded hover:border-[#3776AB] transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(55,118,171,0.06)] font-mono text-xs">
                    
                    <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2 text-[10px] text-slate-400">
                      <span className="font-bold">SUB_NODE 0{index + 1}</span>
                      <span className="text-[#3776AB] font-bold">class Subtopic{index + 1}(ModuleStudy):</span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-xs text-slate-800 mb-2 leading-relaxed">
                        def execute_{subtopic.id.substring(0, 8)}():
                      </h4>
                      <p className="text-[11px] text-slate-550 pl-4 border-l border-slate-200 leading-relaxed font-mono font-medium">
                        &quot;&quot;&quot;<br />
                        <strong className="text-slate-705 block mb-1">{subtopic.title}</strong>
                        {subtopic.description}<br />
                        &quot;&quot;&quot;
                      </p>
                    </div>

                    {/* Video Box */}
                    {(subtopic.videoUrl || (subtopic.videoLanguages && subtopic.videoLanguages.length > 0)) && (
                      <div className="w-full mb-5 pl-4 border-l border-slate-200">
                        {subtopic.videoLanguages && subtopic.videoLanguages.length > 0 && (
                          <div className="flex justify-end mb-2 max-w-3xl mx-auto">
                            <select 
                              className="bg-white border border-slate-200 rounded font-mono text-[10px] px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-[#3776AB] shadow-xs"
                              value={selectedLanguages[subtopic.id]?.video || defaultVideoUrl}
                              onChange={(e) => handleLanguageChange(subtopic.id, 'video', e.target.value)}
                            >
                              {subtopic.videoUrl && <option value={subtopic.videoUrl}>English (Default)</option>}
                              {subtopic.videoLanguages.map((lang: any, i: number) => (
                                <option key={i} value={lang.url}>{lang.language}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="w-full rounded overflow-hidden border border-slate-200 bg-slate-950 aspect-video shadow-xs max-w-2xl">
                          <iframe
                            src={getEmbedUrl(selectedLanguages[subtopic.id]?.video || defaultVideoUrl) || ""}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={subtopic.title}
                          ></iframe>
                        </div>
                      </div>
                    )}

                    {/* Audio Box */}
                    {(subtopic.audioUrl || (subtopic.audioLanguages && subtopic.audioLanguages.length > 0)) && (
                      <div className="w-full mb-5 pl-4 border-l border-slate-200 max-w-2xl bg-slate-50/50 p-3.5 border border-slate-200 rounded font-mono">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] font-bold text-slate-750 flex items-center">
                            <Headphones className="w-3.5 h-3.5 mr-1.5 text-[#3776AB]" /> audio_lesson.mp3
                          </p>
                          {subtopic.audioLanguages && subtopic.audioLanguages.length > 0 && (
                            <select 
                              className="bg-white border border-slate-200 rounded font-mono text-[9px] px-2 py-0.5 text-slate-700 focus:outline-none focus:border-[#3776AB]"
                              value={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl}
                              onChange={(e) => handleLanguageChange(subtopic.id, 'audio', e.target.value)}
                            >
                              {subtopic.audioUrl && <option value={subtopic.audioUrl}>English (Default)</option>}
                              {subtopic.audioLanguages.map((lang: any, i: number) => (
                                <option key={i} value={lang.url}>{lang.language}</option>
                              ))}
                            </select>
                          )}
                        </div>
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="audio">
                          <iframe 
                            className="w-full h-12 rounded bg-transparent border-0"
                            src={getExternalEmbedUrl(selectedLanguages[subtopic.id]?.audio || defaultAudioUrl) || ""}
                            allow="autoplay"
                          ></iframe>
                        </ResourceLinkTracker>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 mt-auto">
                      {subtopic.notesUrl && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                          <a href={subtopic.notesUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-red-500" /> read_notes()
                            </Button>
                          </a>
                        </ResourceLinkTracker>
                      )}
                      {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes || subtopicQuizzes.length > 0) && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                          <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : subtopic.id}`}>
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                              <Target className="w-3.5 h-3.5 text-emerald-500" /> attempt_quiz()
                            </Button>
                          </Link>
                        </ResourceLinkTracker>
                      )}
                      {subtopicMindMaps.length > 0 && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="mindmap">
                          <Link href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${subtopicMindMaps[0].id}`}>
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                              <BrainCircuit className="w-3.5 h-3.5 text-purple-500" /> view_mind_map()
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
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                              <Gamepad2 className="w-3.5 h-3.5 text-blue-500" /> view_simulation()
                            </Button>
                          </Link>
                        </ResourceLinkTracker>
                      )}
                      {subtopic.didYouKnowUrl && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="didYouKnow">
                          <a href={subtopic.didYouKnowUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> did_you_know()
                            </Button>
                          </a>
                        </ResourceLinkTracker>
                      )}
                      {subtopic.referenceUrl && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="reference">
                          <a href={subtopic.referenceUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                              <Book className="w-3.5 h-3.5 text-zinc-550" /> ref_material()
                            </Button>
                          </a>
                        </ResourceLinkTracker>
                      )}
                      {subtopic.otherUrl && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="other">
                          <a href={subtopic.otherUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                              <LinkIcon className="w-3.5 h-3.5 text-slate-500" /> external_link()
                            </Button>
                          </a>
                        </ResourceLinkTracker>
                      )}
                      {subtopicFlashcards.length > 0 && (
                        <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${subtopicFlashcards[0].id}`}>
                          <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-amber-500" /> study_flashcards()
                          </Button>
                        </Link>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VARIANT B: UI PROGRAMMING & DEFAULT FALLBACK LOOK (NEUBRUTALISM STYLE)
  // ==========================================
  const themeKey = isUiProgramming ? "ui programming" : "";
  const t = THEME_MAP[themeKey] || DEFAULT_THEME;
  const isPremiumTheme = isUiProgramming;

  return (
    <div className={`min-h-screen relative ${t.bg} ${t.pattern} pb-16 pt-8 brutalist-transition transition-colors duration-300 overflow-hidden`}>
      
      {/* Structural Embedded CSS Overrides */}
      <style jsx global>{`
        .brutalist-transition {
          transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ui-blueprint-grid {
          background-color: #F8F9FC;
          position: relative;
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.08; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Layered Design-System inspired Background */}
      {isPremiumTheme && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Subtle Grid Pattern (2%-6% opacity overall) */}
          <div className="absolute inset-0 bg-[#F8F9FC]" style={{
            backgroundImage: "radial-gradient(circle, rgba(148, 163, 184, 0.12) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
          }} />

          {/* Blueprint-style guides, nodes, outlines and connections */}
          <svg className="absolute inset-0 w-full h-full text-slate-400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ruler-x" width="100" height="20" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.04" />
                <line x1="10" y1="0" x2="10" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="20" y1="0" x2="20" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="30" y1="0" x2="30" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="40" y1="0" x2="40" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="50" y1="0" x2="50" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.04" />
                <line x1="60" y1="0" x2="60" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="70" y1="0" x2="70" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="80" y1="0" x2="80" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="90" y1="0" x2="90" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
              </pattern>
              <pattern id="ruler-y" width="20" height="100" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="10" y2="0" stroke="currentColor" strokeWidth="1" opacity="0.04" />
                <line x1="0" y1="10" x2="5" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="30" x2="5" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="40" x2="5" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="50" x2="8" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.04" />
                <line x1="0" y1="60" x2="5" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="70" x2="5" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="80" x2="5" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="90" x2="5" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.03" />
              </pattern>
            </defs>

            {/* Ruler guides */}
            <rect x="0" y="0" width="100%" height="20" fill="url(#ruler-x)" />
            <rect x="0" y="0" width="20" height="100%" fill="url(#ruler-y)" />

            {/* Connection lines and node circles (opacity 2% - 6%) */}
            <line x1="15%" y1="0" x2="15%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.03" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.02" />
            <line x1="82%" y1="0" x2="82%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.03" />
            <line x1="0" y1="220" x2="100%" y2="220" stroke="currentColor" strokeWidth="1" opacity="0.03" />
            <line x1="0" y1="720" x2="100%" y2="720" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.03" />

            {/* Large Design Circles */}
            <circle cx="20%" cy="35%" r="300" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.03" />
            <circle cx="85%" cy="60%" r="400" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="8 8" opacity="0.02" />

            {/* Outlines of UI Components */}
            <rect x="8%" y="150" width="160" height="120" rx="8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.03" />
            <circle cx="8%" cy="150" r="3" fill="currentColor" opacity="0.04" />
            <circle cx="168" cy="270" r="3" fill="currentColor" opacity="0.04" />

            {/* Technical text canvas indicators */}
            <text x="35" y="45" fill="currentColor" opacity="0.04" fontSize="9" fontFamily="monospace">GRID_SCALE: 24PX</text>
            <text x="83%" y="90" fill="currentColor" opacity="0.04" fontSize="9" fontFamily="monospace">CANVAS // 1024X768</text>
          </svg>

          {/* Glowing colorful auras for design depth */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#7C3AED]/5 to-[#3B82F6]/5 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#10B981]/5 to-[#F59E0B]/5 rounded-full blur-3xl opacity-40 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-4xl space-y-6 relative z-10">
        
        {/* Back button */}
        <div className="mb-4 flex justify-between items-center">
          <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
            <motion.div
              whileHover={isPremiumTheme ? { x: -3 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button className={`font-black uppercase tracking-wider ${
                isPremiumTheme 
                  ? "bg-white hover:bg-slate-50 border border-slate-200/80 text-[#7C3AED] shadow-sm rounded-xl px-5 py-4 font-bold" 
                  : t.btnPrimary
              }`}>
                ← Modules Canvas
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Section Header Card */}
        <Card className={`${
          isPremiumTheme 
            ? 'bg-white/92 backdrop-blur-md border-none shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[22px]' 
            : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass
        } brutalist-transition mb-8 relative overflow-hidden`}>
          {isPremiumTheme && (
            <div className="absolute inset-0 rounded-[22px] pointer-events-none p-[1.2px] bg-gradient-to-br from-white/80 via-[#7C3AED]/20 to-slate-200/50 -z-10" />
          )}
          {isPremiumTheme && (
            <motion.div
              className="absolute right-8 top-8 text-[#7C3AED] pointer-events-none select-none z-10"
              animate={{
                x: [0, -15, -5, 0],
                y: [0, -10, -20, 0]
              }}
              transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
            >
              <MousePointer className="w-8 h-8 fill-current stroke-white stroke-[1.5]" />
              <span className="absolute left-6 top-6 bg-[#7C3AED] text-[8px] text-white px-1.5 py-0.5 rounded font-sans font-bold shadow-sm whitespace-nowrap">Inspector</span>
            </motion.div>
          )}
          <CardHeader className="pt-10 pb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs px-2.5 py-1 ${
                  isPremiumTheme 
                    ? "bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 border-none font-bold rounded-lg" 
                    : t.badge
                }`}>
                  CANVAS: {moduleData.id.toUpperCase()}
                </Badge>
                <span className="font-mono text-xs font-bold text-zinc-400">// COMPONENT_METRICS</span>
              </div>
              <CardTitle className={`text-3xl md:text-4xl ${isPremiumTheme ? 'text-slate-800 font-semibold tracking-tight' : t.textHeading} flex items-center gap-3`}>
                {isPremiumTheme ? <Layers className="w-8 h-8 text-[#7C3AED]" /> : <BookOpen className="w-8 h-8" />} {moduleData.title}
              </CardTitle>
              <CardDescription className={`${isPremiumTheme ? 'text-slate-500 font-medium' : t.textMuted} mt-2 text-base`}>
                {moduleData.description}
              </CardDescription>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold font-sans">
                <span className={`px-2.5 py-1 border ${
                  isPremiumTheme 
                    ? 'bg-slate-100/80 text-slate-700 border-slate-200/60 rounded-lg font-bold' 
                    : 'bg-zinc-100 border-2 border-black'
                }`}>{moduleData.co}</span>
                <span className={`px-2.5 py-1 border flex items-center gap-1 ${
                  isPremiumTheme 
                    ? 'bg-slate-100/80 text-slate-700 border-slate-200/60 rounded-lg font-bold' 
                    : 'bg-zinc-100 border-2 border-black'
                }`}>
                  <Clock className="w-3.5 h-3.5" /> {moduleData.hours} Hours
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Subtopics stack */}
        <h2 className={`text-xl font-bold uppercase tracking-tight ${isPremiumTheme ? 'text-slate-800' : 'text-black'}`}>Subtopics List</h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {moduleData.subtopics && moduleData.subtopics.map((rawSubtopic: any, index: number) => {
            let subtopic = { ...rawSubtopic };
            if (typeof subtopic.simulationData === 'string') {
              try {
                const parsed = JSON.parse(subtopic.simulationData);
                subtopic = { ...subtopic, ...parsed };
              } catch(e) {}
            } else if (typeof subtopic.simulationData === 'object' && subtopic.simulationData !== null) {
              subtopic = { ...subtopic, ...subtopic.simulationData };
            }
            
            if (typeof subtopic.otherUrl === 'string' && subtopic.otherUrl.trim().startsWith("{")) {
              try {
                const sanitizedStr = subtopic.otherUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
                let parsedOther = JSON.parse(sanitizedStr);
                while (typeof parsedOther === 'string') {
                  parsedOther = JSON.parse(parsedOther);
                }
                if (typeof parsedOther === 'object' && parsedOther !== null) {
                  subtopic = { ...subtopic, ...parsedOther };
                }
                if (!subtopic.otherUrl || subtopic.otherUrl.trim() === "" || subtopic.otherUrl.trim().startsWith("{")) subtopic.otherUrl = "";
                if (!subtopic.didYouKnowUrl || subtopic.didYouKnowUrl.trim() === "" || subtopic.didYouKnowUrl.trim().startsWith("{")) subtopic.didYouKnowUrl = "";
                if (!subtopic.referenceUrl || subtopic.referenceUrl.trim() === "" || subtopic.referenceUrl.trim().startsWith("{")) subtopic.referenceUrl = "";
              } catch(e) {
                subtopic.otherUrl = "";
                subtopic.didYouKnowUrl = "";
                subtopic.referenceUrl = "";
              }
            }

            const subtopicQuizzes = moduleData.quizzes?.filter((q: any) => q.subtopicId === subtopic.subtopicNo || q.subtopicId === subtopic.id) || [];
            const subtopicSims = moduleData.simulations?.filter((s: any) => s.subtopicId === subtopic.subtopicNo || s.subtopicId === subtopic.id) || [];
            const subtopicFlashcards = moduleData.flashcardDecks?.filter((f: any) => f.subtopicId === subtopic.subtopicNo || f.subtopicId === subtopic.id) || [];
            const subtopicMindMaps = moduleData.mindmaps?.filter((m: any) => m.title === subtopic.title) || [];

            const defaultVideoUrl = subtopic.videoUrl || (subtopic.videoLanguages?.[0]?.url || "");
            const defaultAudioUrl = subtopic.audioUrl || (subtopic.audioLanguages?.[0]?.url || "");

            const cardContentNode = (
              <div className="flex flex-col md:flex-row w-full">
                <div className={`w-full md:w-16 flex items-center justify-center py-4 md:py-0 flex-shrink-0 select-none ${
                  isPremiumTheme 
                    ? 'bg-[#7C3AED]/5 text-[#7C3AED] border-b md:border-b-0 md:border-r border-slate-100' 
                    : 'bg-zinc-100 border-b-4 md:border-b-0 md:border-r-4 border-black text-black'
                }`}>
                  <span className="text-2xl font-black">{index + 1}</span>
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="mb-4">
                    <CardTitle className={`text-xl mb-2 ${
                      isPremiumTheme ? 'text-slate-800 font-semibold font-sans tracking-tight' : 'text-black font-black uppercase tracking-tight'
                    }`}>{subtopic.title}</CardTitle>
                    <CardDescription className={`text-sm ${
                      isPremiumTheme ? 'text-slate-500 font-medium font-sans' : 'text-zinc-800 font-bold leading-relaxed'
                    }`}>{subtopic.description}</CardDescription>
                  </div>

                  {/* Video Content */}
                  {(subtopic.videoUrl || (subtopic.videoLanguages && subtopic.videoLanguages.length > 0)) && (
                    <div className="w-full mb-5">
                      {subtopic.videoLanguages && subtopic.videoLanguages.length > 0 && (
                        <div className="flex justify-end mb-2 max-w-3xl mx-auto">
                          <select 
                            className={`focus:outline-none text-xs font-bold px-3 py-1.5 ${
                              isPremiumTheme 
                                ? 'bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm font-sans' 
                                : 'bg-white border-2 border-black text-black'
                            }`}
                            value={selectedLanguages[subtopic.id]?.video || defaultVideoUrl}
                            onChange={(e) => handleLanguageChange(subtopic.id, 'video', e.target.value)}
                          >
                            {subtopic.videoUrl && <option value={subtopic.videoUrl}>English (Default)</option>}
                            {subtopic.videoLanguages.map((lang: any, i: number) => (
                              <option key={i} value={lang.url}>{lang.language}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className={`w-full aspect-video max-w-3xl mx-auto overflow-hidden ${
                        isPremiumTheme 
                          ? 'border border-slate-200/80 bg-zinc-950 shadow-md rounded-[16px]' 
                          : 'border-4 border-black bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      }`}>
                        <iframe
                          src={getEmbedUrl(selectedLanguages[subtopic.id]?.video || defaultVideoUrl) || ""}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={subtopic.title}
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Audio Content */}
                  {(subtopic.audioUrl || (subtopic.audioLanguages && subtopic.audioLanguages.length > 0)) && (
                    <div className={`w-full mb-5 max-w-3xl mx-auto ${
                      isPremiumTheme 
                        ? 'border border-slate-200/60 bg-white/92 backdrop-blur-md p-4 rounded-xl shadow-sm' 
                        : 'border-2 border-black bg-zinc-50 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <p className={`text-sm font-bold flex items-center ${isPremiumTheme ? 'text-slate-800' : 'text-black font-black'}`}>
                          <Headphones className="w-4 h-4 mr-2 text-[#7C3AED]" /> Audio Lesson
                        </p>
                        {subtopic.audioLanguages && subtopic.audioLanguages.length > 0 && (
                          <select 
                            className={`focus:outline-none text-xs font-bold px-2 py-1 ${
                              isPremiumTheme 
                                ? 'bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm font-sans' 
                                : 'bg-white border-2 border-black text-black'
                            }`}
                            value={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl}
                            onChange={(e) => handleLanguageChange(subtopic.id, 'audio', e.target.value)}
                          >
                            {subtopic.audioUrl && <option value={subtopic.audioUrl}>English (Default)</option>}
                            {subtopic.audioLanguages.map((lang: any, i: number) => (
                              <option key={i} value={lang.url}>{lang.language}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="audio">
                        <iframe 
                          className={`w-full h-16 bg-white ${
                            isPremiumTheme 
                              ? 'border border-slate-100 rounded-lg shadow-sm' 
                              : 'border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          }`}
                          src={getExternalEmbedUrl(selectedLanguages[subtopic.id]?.audio || defaultAudioUrl) || ""}
                          allow="autoplay"
                        ></iframe>
                      </ResourceLinkTracker>
                      <div className="mt-2 text-right">
                         <a href={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl} target="_blank" rel="noopener noreferrer" className={`text-xs font-bold ${isPremiumTheme ? 'text-[#7C3AED] hover:underline' : 'text-black hover:underline'}`}>
                           Open Audio Source
                         </a>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className={`flex flex-wrap items-center gap-3 mt-auto pt-5 ${
                    isPremiumTheme ? 'border-t border-slate-100' : 'border-t-2 border-black'
                  }`}>
                    {subtopic.notesUrl && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                        <a href={subtopic.notesUrl} target="_blank" rel="noopener noreferrer">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                            <Button variant="outline" className={
                              isPremiumTheme 
                                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 font-sans' 
                                : t.btnPrimary + ' flex items-center gap-1.5'
                            }>
                              <FileText className="w-4 h-4 text-red-500" /> Read Notes
                            </Button>
                          </motion.div>
                        </a>
                      </ResourceLinkTracker>
                    )}
                    {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes || subtopicQuizzes.length > 0) && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                        <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : subtopic.id}`}>
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                            <Button variant="outline" className={
                              isPremiumTheme 
                                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 font-sans' 
                                : t.btnPrimary + ' flex items-center gap-1.5'
                            }>
                              <Target className="w-4 h-4 text-emerald-500" /> Attempt Quiz
                            </Button>
                          </motion.div>
                        </Link>
                      </ResourceLinkTracker>
                    )}
                    {subtopicMindMaps.length > 0 && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="mindmap">
                        <Link href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${subtopicMindMaps[0].id}`}>
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                            <Button variant="outline" className={
                              isPremiumTheme 
                                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 font-sans' 
                                : t.btnPrimary + ' flex items-center gap-1.5'
                            }>
                              <BrainCircuit className="w-4 h-4 text-purple-500" /> View Mind Map
                            </Button>
                          </motion.div>
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
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                            <Button variant="outline" className={
                              isPremiumTheme 
                                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 font-sans' 
                                : t.btnPrimary + ' flex items-center gap-1.5'
                            }>
                              <Gamepad2 className="w-4 h-4 text-blue-500" /> View Simulation
                            </Button>
                          </motion.div>
                        </Link>
                      </ResourceLinkTracker>
                    )}
                    {subtopic.didYouKnowUrl && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="didYouKnow">
                        <a href={subtopic.didYouKnowUrl} target="_blank" rel="noopener noreferrer">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                            <Button variant="outline" className={
                              isPremiumTheme 
                                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 font-sans' 
                                : t.btnPrimary + ' flex items-center gap-1.5'
                            }>
                              <Lightbulb className="w-4 h-4 text-amber-500" /> Did You Know
                            </Button>
                          </motion.div>
                        </a>
                      </ResourceLinkTracker>
                    )}
                    {subtopic.referenceUrl && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="reference">
                        <a href={subtopic.referenceUrl} target="_blank" rel="noopener noreferrer">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                            <Button variant="outline" className={
                              isPremiumTheme 
                                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 font-sans' 
                                : t.btnPrimary + ' flex items-center gap-1.5'
                            }>
                              <Book className="w-4 h-4 text-zinc-550" /> Reference Material
                            </Button>
                          </motion.div>
                        </a>
                      </ResourceLinkTracker>
                    )}
                    {subtopic.otherUrl && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="other">
                        <a href={subtopic.otherUrl} target="_blank" rel="noopener noreferrer">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                            <Button variant="outline" className={
                              isPremiumTheme 
                                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 font-sans' 
                                : t.btnPrimary + ' flex items-center gap-1.5'
                            }>
                              <LinkIcon className="w-4 h-4 text-slate-550" /> External Link
                            </Button>
                          </motion.div>
                        </a>
                      </ResourceLinkTracker>
                    )}
                    {subtopicFlashcards.length > 0 && (
                      <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${subtopicFlashcards[0].id}`}>
                        <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                          <Button variant="outline" className={
                            isPremiumTheme 
                              ? 'bg-white hover:bg-slate-50 border border-slate-200 text-[#7C3AED] text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 font-sans' 
                              : t.btnPrimary + ' flex items-center gap-1.5'
                          }>
                            <Layers className="w-4 h-4 text-amber-500" /> Study Flashcards
                          </Button>
                        </motion.div>
                      </Link>
                    )}
                  </div>

                </div>
              </div>
            );

            return (
              <motion.div key={subtopic.id} variants={itemVariants}>
                {isPremiumTheme ? (
                  <DesignStudioCard isPremium={isPremiumTheme} className="bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] rounded-[22px] overflow-hidden">
                    {cardContentNode}
                  </DesignStudioCard>
                ) : (
                  <Card className={`${t.borderClass} ${t.cardBg} ${t.shadowClass} brutalist-transition overflow-hidden`}>
                    {cardContentNode}
                  </Card>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}