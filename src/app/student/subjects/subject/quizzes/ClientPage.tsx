"use client";
import Link from "next/link";
import { Target, Clock, Trophy, ArrowLeft, Layers, Book, ChevronRight, Terminal, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ResourceHeader from "@/components/ui/ResourceHeader";
import { useEffect, useState } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { UttamLoader } from "@/components/ui/UttamLoader";

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
  iconColor: string;
}> = {
  "ui programming": {
    bg: "bg-[#FAF9F5] text-black font-sans",
    cardBg: "bg-white",
    borderClass: "border-2 border-black rounded-none",
    shadowClass: "shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(239,68,68,1)] hover:-translate-y-0.5",
    btnPrimary: "bg-[#EF4444] hover:bg-[#dc2626] text-white font-black uppercase text-[11px] tracking-wider px-3.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer rounded-none",
    btnGhost: "text-black hover:text-[#EF4444] font-bold text-xs bg-white hover:bg-slate-50 border-2 border-black rounded-none px-3 py-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] transition-all inline-flex items-center",
    titleHover: "group-hover:text-[#EF4444]",
    textHeading: "text-slate-900 font-black uppercase tracking-tight font-sans",
    textMuted: "text-zinc-655 font-bold",
    badge: "font-mono text-[9px] font-black uppercase tracking-wider text-white bg-zinc-900 px-2 py-0.5 border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]",
    pattern: "",
    iconColor: "text-[#EF4444]"
  },

  "startup engineering": {
    bg: "bg-[#F8FAFC] text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-xs hover:shadow-md hover:-translate-y-0.5",
    btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-555 hover:text-blue-650 font-sans text-xs hover:bg-slate-50 border border-slate-202 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-blue-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg",
    pattern: "",
    iconColor: "text-blue-600"
  },

  "python programming": {
    bg: "bg-[#F8FAFC] text-slate-755 font-mono font-jetbrains",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded",
    shadowClass: "shadow-xs hover:shadow-sm hover:-translate-y-0.5",
    btnPrimary: "bg-[#3776AB] hover:bg-[#2b5b84] text-white font-bold text-xs rounded shadow-xs py-2 px-4 transition-all font-mono",
    btnGhost: "text-slate-655 hover:text-[#3776AB] font-mono text-xs hover:bg-slate-50 border border-slate-200 rounded px-3 py-1.5 transition-all bg-white shadow-sm inline-flex items-center",
    titleHover: "group-hover:text-[#3776AB]",
    textHeading: "text-slate-900 font-bold tracking-tight font-mono",
    textMuted: "text-slate-500 font-mono",
    badge: "bg-blue-50 text-[#3776AB] border border-blue-200 rounded font-mono",
    pattern: "",
    iconColor: "text-[#3776AB]"
  },

  "digital business": {
    bg: "bg-[#F8FAFC] text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-xs hover:shadow-md hover:-translate-y-0.5",
    btnPrimary: "bg-[#0F766E] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-555 hover:text-[#0F766E] font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-[#0F766E]",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-[#0F766E]/5 text-[#0F766E] border border-[#0F766E]/10 px-2.5 py-1 rounded-lg",
    pattern: "strategy-board-dot",
    iconColor: "text-[#0F766E]"
  }
};

const DEFAULT_THEME = {
  bg: "bg-[#F8FAFC] text-slate-800 font-sans",
  cardBg: "bg-white",
  borderClass: "border border-slate-200 rounded-xl",
  shadowClass: "shadow-xs transition-all duration-200",
  btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
  btnGhost: "text-slate-555 hover:text-blue-650 font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
  titleHover: "group-hover:text-blue-600",
  textHeading: "text-slate-900 font-bold tracking-tight font-sans",
  textMuted: "text-slate-500 font-medium font-sans",
  badge: "font-sans text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg",
  pattern: "",
  iconColor: "text-blue-600"
};

// Premium Figma-style component bounding box selection frame (Overlays removed per request)
const DesignStudioCard = ({ children, className = "", style = {}, isPremium, label, ...props }: any) => {
  return (
    <div
      className={`relative transition-all duration-300 ease-out rounded-lg ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

const getQuizDisplayTitle = (quiz: any) => {
  const titleStr = String(quiz.title || "").trim();
  const isNumeric = /^\d+(\.\d+)?$/.test(titleStr);
  
  if (isNumeric) {
    const module = quiz.module;
    if (module) {
      const parts = titleStr.split(".");
      const subNo = parts.length === 2 ? parseInt(parts[1], 10) : (quiz.subtopicId || 1);
      const subtopic = (module.subtopics || []).find((st: any) => st.subtopicNo === subNo || st.order === subNo);
      if (subtopic && subtopic.title) {
        let cleanSubTitle = subtopic.title.trim();
        const prefixRegex = new RegExp(`^(Quiz\\s+)?${titleStr.replace(".", "\\.")}[:\\s-]*|^(Quiz\\s+)?\\d+\\.\\d+[:\\s-]*`, 'i');
        cleanSubTitle = cleanSubTitle.replace(prefixRegex, "").trim();
        return `Quiz ${titleStr}: ${cleanSubTitle}`;
      }
    }
  }
  return quiz.title;
};

export default function QuizzesPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const [result, subjects] = await Promise.all([
          fetchGAS("getQuizzes", { subjectId, userId: "anonymous" }),
          fetchGAS("getSubjects")
        ]);
        if (Array.isArray(result)) {
          setQuizzes(result);
        }
        if (Array.isArray(subjects)) {
          const currentSub = subjects.find((s: any) => s.id === subjectId);
          if (currentSub) setSubjectName(currentSub.name || "");
        }
      } catch (err) {
        console.error("Failed to load quizzes", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, [subjectId]);
  const isDigitalBusiness = subjectId === 'id_pryay1ykw' || String(subjectName || "").toLowerCase().includes("digital business");
  const isUiProgramming = subjectId === 'id_mn573l5e5' || String(subjectName || "").toLowerCase().includes("ui programming");
  const isPythonProgramming = subjectId === 'id_hdzqxse2n' || String(subjectName || "").toLowerCase().includes("python");
  const isStartupEngineering = subjectId === 'id_1i2u3y4t5' || String(subjectName || "").toLowerCase().includes("startup");
  const themeKey = isUiProgramming ? "ui programming" : isPythonProgramming ? "python programming" : isDigitalBusiness ? "digital business" : (isStartupEngineering ? "startup engineering" : "");
  const t = THEME_MAP[themeKey] || DEFAULT_THEME;
  const isPremiumTheme = !isPythonProgramming;

  const renderQuizPreview = (quizIndex: number, title?: string) => {
    const normalizedTitle = String(title || "").toLowerCase();

    if (normalizedTitle.includes("layout") || normalizedTitle.includes("concept") || quizIndex === 0) {
      return (
        <svg className="w-full h-full text-[#7C3AED]" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="50" cy="40" r="28" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="50" cy="40" r="18" stroke="#7C3AED" strokeWidth="1.2" strokeOpacity="0.5" />
          <circle cx="50" cy="40" r="8" stroke="#7C3AED" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          <circle cx="50" cy="40" r="3" fill="#7C3AED" />
          <line x1="50" y1="6" x2="50" y2="74" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="16" y1="40" x2="84" y2="40" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.4" />
        </svg>
      );
    }

    if (normalizedTitle.includes("component") || normalizedTitle.includes("design") || quizIndex === 1) {
      return (
        <svg className="w-full h-full text-[#3B82F6]" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="15" y="15" width="70" height="50" rx="4" stroke="#E2E8F0" fill="currentColor" fillOpacity="0.02" />
          <rect x="25" y="24" width="22" height="10" rx="5" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="1" />
          <circle cx="40" cy="29" r="3" fill="#3B82F6" />
          <rect x="25" y="42" width="22" height="10" rx="5" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="30" cy="47" r="3" fill="#94A3B8" />
          <path d="M53,29 L68,29 M53,47 L68,47" stroke="#3B82F6" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
          <circle cx="70" cy="29" r="2" fill="#3B82F6" />
          <circle cx="70" cy="47" r="2" fill="#CBD5E1" />
        </svg>
      );
    }

    return (
      <svg className="w-full h-full text-[#10B981]" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="50" cy="44" r="22" stroke="#E2E8F0" strokeWidth="2.5" />
        <circle cx="50" cy="44" r="22" stroke="#10B981" strokeWidth="2.5" strokeDasharray="30 110" />
        <rect x="47" y="16" width="6" height="6" rx="1" fill="#10B981" />
        <line x1="50" y1="44" x2="50" y2="30" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="50" cy="44" r="2" fill="#10B981" />
      </svg>
    );
  };

  if (loading) {
    return <UttamLoader isLoading={true} />;
  }

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

  if (isPythonProgramming) {
    const getCleanPythonDetails = (title: string) => {
      const cleanTitle = String(title || "").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ");
      const words = cleanTitle.split(" ");
      const shortWords = words.slice(0, 2);
      const shortTitle = shortWords.join(" ") + ".py";
      const funcName = "study" + shortWords.map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
      return { shortTitle, funcName };
    };

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 relative overflow-hidden font-mono antialiased selection:bg-[#3776AB]/10 selection:text-[#3776AB] font-jetbrains">
        {/* Dynamic code syntax fragments in background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-[0.05] text-[9px] font-mono leading-relaxed space-y-4 p-8 text-slate-400">
          <div>import os, sys, json<br />from typing import List, Dict, Optional</div>
          <div className="pl-6">class PyDevStudyWorkspace(object):<br />&nbsp;&nbsp;&nbsp;&nbsp;def __init__(self, node: str) -&gt; None:<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.active_node = node</div>
          <div>def resolve_xp_stream(stream: Dict[str, float]) -&gt; float:<br />&nbsp;&nbsp;&nbsp;&nbsp;return sum(stream.values()) * 0.98</div>
        </div>

        {/* Global style imports */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
          .font-jetbrains {
            font-family: 'JetBrains Mono', monospace;
          }
        `}</style>

        <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl space-y-6">
          {/* Header IDE Info bar */}
          <div className="bg-white border border-slate-200 rounded px-4 py-2.5 flex flex-col md:flex-row justify-between items-center text-xs gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              </div>
              <span className="text-slate-200">|</span>
              <span className="font-bold text-[#3776AB]">PYTHON STUDIO</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-650 font-bold uppercase tracking-wider text-xs">Quizzes Config</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
              <span>Environment: <span className="text-[#3776AB] font-bold">py3.9-study</span></span>
              <span>Status: <span className="text-emerald-600 font-bold">ONLINE</span></span>
            </div>
          </div>

          {/* Dashboard Back Nav Bar */}
          <div className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <Link href={`/student/subjects/subject?subjectId=${subjectId}`}>
              <Button className="bg-[#3776AB] hover:bg-[#3776AB]/90 text-white border border-[#3776AB] font-bold text-[10px] py-1.5 px-4 h-8 uppercase tracking-widest transition-all rounded shadow-md">
                ← IDE Dashboard
              </Button>
            </Link>
            <div className="text-[10px] text-slate-400 font-mono">
              path: <span className="text-[#3776AB]">~/workspace/quizzes.json</span>
            </div>
          </div>

          {/* IDE Section Header Panel */}
          <div className="bg-white border border-slate-200 p-6 rounded relative overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#3776AB]" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold text-[#3776AB] bg-[#3776AB]/10 px-2 py-0.5 border border-[#3776AB]/30 rounded">INDEX</span>
              <span className="text-[10px] text-slate-400 font-mono">READ-ONLY STREAM</span>
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-[#3776AB] flex items-center gap-3 font-jetbrains animate-pulse">
              <Terminal className="w-6 h-6 text-[#3776AB]" />
              Quiz Loader.py
            </h1>
            <p className="text-slate-550 mt-2 text-xs leading-relaxed max-w-2xl font-medium font-sans">
              Load assessment pipelines and unit tests. Run the compiled check modules below to validate your code blocks.
            </p>
          </div>

          {/* Quizzes Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {quizzes.map((quiz: any) => {
              const { shortTitle, funcName } = getCleanPythonDetails(quiz.title);

              return (
                <motion.div key={quiz.id} variants={itemVariants} className="h-fit">
                  <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="block h-full">
                    <div className="bg-white border border-slate-200 p-4 rounded hover:border-[#3776AB] transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(55,118,171,0.06)] hover:-translate-y-1">
                      <div>
                        {/* IDE Tab indicators */}
                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2 text-[10px] text-slate-400 font-mono">
                          <span className="font-bold">M0{quiz.module?.moduleNo || "?"}</span>
                          <span className="text-[#3776AB] font-bold group-hover:text-[#005B99] transition-colors">{shortTitle}</span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-bold text-xs text-slate-800 mb-2 leading-relaxed font-jetbrains group-hover:text-[#3776AB] transition-colors">
                          def {funcName}():
                        </h4>
                        <p className="text-[10px] text-slate-555 font-sans leading-relaxed line-clamp-3 mb-4 pl-4 border-l border-slate-200 font-medium">
                          &quot;&quot;&quot;<br />
                          Topic: {getQuizDisplayTitle(quiz)}<br />
                          Execute a check with {quiz.questions?.length || 0} unit questions.<br />
                          &quot;&quot;&quot;
                        </p>
                      </div>

                      {/* Detail nodes */}
                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 font-bold"><Code className="w-3.5 h-3.5 text-[#3776AB]" /> {quiz.questions?.length || 0} checks</span>
                        <span className="text-[#3776AB] group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold">
                          RUN_TESTS() &gt;
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {quizzes.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-200 bg-white text-slate-400 rounded">
              EMPTY INTERPRETER WORKSPACE.
            </div>
          )}
        </div>
      </div>
    );
  }


  return (
    <div className={`min-h-screen relative ${t.bg} ${t.pattern} pb-16 pt-8 brutalist-transition transition-colors duration-300 overflow-hidden`}>
      {isDigitalBusiness && (
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(#e2e8f0 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px"
        }} />
      )}
      {/* Structural Embedded CSS Overrides */}
      <style jsx global>{`
        .brutalist-transition {
          transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ui-blueprint-grid {
          background-color: #F8F9FC;
          position: relative;
        }
      `}</style>

      {/* Layered Design-System inspired Background - Disabled for Clean EdTech Minimal */}

      <div className="container mx-auto px-4 max-w-5xl space-y-6 relative z-10">
        {/* Subtle Breadcrumb Navigation - Removed */}

        {/* Back button */}
        <div className="mb-4 flex justify-between items-center">
          <Link href={`/student/subjects/subject?subjectId=${subjectId}`}>
            <motion.div
              whileHover={isPremiumTheme ? { x: -3 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button className={`${t.btnGhost} uppercase`}>
                ← Back to Dashboard
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Section Header Card */}
        <div className={`bg-white ${t.borderClass} p-6 md:p-8 ${t.shadowClass} mb-8`}>
          <ResourceHeader 
            type="quizzes" 
            title="Interactive Quizzes" 
            subtitle="Test your understanding with adaptive quizzes." 
          />
        </div>

        {/* Quizzes Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {quizzes.map((quiz, quizIdx) => {
            const attempt = quiz.attempts ? quiz.attempts[0] : null;
            const isCompleted = attempt?.completed;
            const percentage = attempt ? (attempt.score / attempt.totalMarks) * 100 : 0;
            const hasPassed = percentage >= 70;
            const quizStatus = isCompleted ? (hasPassed ? "passed" : "failed") : "pending";

            const quizCard = (
              <Card className={`flex flex-col h-auto transition-all duration-300 overflow-hidden ${isPremiumTheme
                  ? `${t.cardBg} ${t.borderClass} ${t.shadowClass} ${quizStatus === 'passed' ? 'opacity-85' : ''}`
                  : `flex flex-col h-auto hover:shadow-lg transition-shadow border-zinc-200 ${quizStatus === 'passed' ? 'bg-zinc-50 opacity-80' : ''}`
                }`}>
                <CardHeader className={isPremiumTheme ? (isUiProgramming ? "p-4 pb-1 md:p-4 md:pb-1" : "p-4 md:p-5 pb-1.5") : ""}>
                  <div className="flex justify-between items-start mb-1.5">
                    <Badge variant="outline" className={isPremiumTheme ? "bg-slate-100 text-slate-700 border-slate-200 rounded font-mono text-[9px]" : "text-zinc-600 bg-white"}>
                      Module {quiz.module?.moduleNo || "?"}
                    </Badge>
                    {quizStatus === 'failed' && <Badge className="bg-amber-100 text-amber-750 hover:bg-amber-100 text-[9px] py-0.5 px-2">Failed</Badge>}
                    {quizStatus === 'passed' && <Badge className="bg-green-100 text-green-755 hover:bg-green-100 text-[9px] py-0.5 px-2">Completed</Badge>}
                  </div>

                  <CardTitle className={isPremiumTheme ? (isUiProgramming ? "text-sm font-bold font-sans tracking-tight text-slate-800 line-clamp-1" : "text-base font-bold font-sans tracking-tight text-slate-800 line-clamp-1") : "text-xl"}>
                    {getQuizDisplayTitle(quiz)}
                  </CardTitle>
                </CardHeader>

                <CardContent className={`${isPremiumTheme ? (isUiProgramming ? "p-4 pt-1 pb-1 md:p-4 md:pt-1 md:pb-1" : "p-4 md:p-5 pt-0 pb-3") : ""}`}>
                  <div className={`space-y-1.5 ${isPremiumTheme ? "text-xs font-mono text-slate-500" : "text-sm text-zinc-650"}`}>
                    {quizStatus === 'pending' ? (
                      <>
                        <div className="flex items-center">
                          <span>{quiz.totalQuestionsToAsk || (quiz.questions && quiz.questions.length) || 0} Questions</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`flex items-center space-x-2 font-bold ${isPremiumTheme ? "text-xs text-slate-800" : "text-lg text-zinc-800"}`}>
                          <span>Score: {attempt.score}/{attempt.totalMarks} ({Math.round(percentage)}%)</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>

                <CardFooter className={`pt-2 mt-auto ${isPremiumTheme ? (isUiProgramming ? "p-4 pt-2 md:p-4 md:pt-2 border-t border-black" : "p-4 md:p-5 border-t border-slate-100") : "border-t border-zinc-100"}`}>
                  {quizStatus === 'pending' && (
                    <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="w-full">
                      <Button className={`w-full ${isPremiumTheme ? t.btnPrimary : "bg-primary hover:bg-primary/90 text-white"}`}>Start Quiz</Button>
                    </Link>
                  )}
                  {quizStatus === 'failed' && (
                    <div className="w-full flex flex-col space-y-2">
                      <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="w-full">
                        <Button variant="outline" className={`w-full font-semibold ${isPremiumTheme ? t.btnGhost : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-lg"}`}>Retry Quiz</Button>
                      </Link>
                    </div>
                  )}
                  {quizStatus === 'passed' && (
                    <div className="w-full flex flex-col space-y-2">
                      <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="w-full">
                        <Button variant="outline" className={`w-full font-semibold ${isPremiumTheme
                            ? (isUiProgramming ? "h-8 py-1 text-xs rounded-lg border-emerald-250 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/50 shadow-xs font-sans" : "border-emerald-250 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/50 rounded-lg shadow-xs font-mono text-xs uppercase")
                            : "text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
                          }`}>Retake Quiz</Button>
                      </Link>
                    </div>
                  )}
                </CardFooter>
              </Card>
            );

            return (
              <motion.div key={quiz.id} variants={itemVariants}>
                {isPremiumTheme ? (
                  <motion.div
                    whileHover="hover"
                    animate="rest"
                    className="h-full"
                  >
                    <motion.div
                      variants={{
                        rest: { y: 0, scale: 1 },
                        hover: { y: -3, scale: 1.015 }
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="h-full"
                    >
                      <DesignStudioCard isPremium={true} label={`Quiz.Component M0${quiz.module?.moduleNo || 1}`} className="h-full relative group">
                        {/* Clean layout */}
                        {quizCard}
                      </DesignStudioCard>
                    </motion.div>
                  </motion.div>
                ) : (
                  quizCard
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {quizzes.length === 0 && (
          <div className={`py-12 text-center font-bold ${isPremiumTheme
            ? 'bg-white/50 border border-slate-200 border-dashed text-slate-400 rounded-lg shadow-none'
            : 'bg-zinc-50 border border-dashed border-zinc-300 text-zinc-500 rounded-lg'
            }`}>
            NO ASSESSMENTS IN CONTEXT.
          </div>
        )}
      </div>
    </div>
  );
}