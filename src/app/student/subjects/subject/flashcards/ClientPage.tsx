"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, ArrowLeft, Clock, Book, ChevronRight, Terminal, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { useSearchParams } from "next/navigation";
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
    bg: "bg-slate-50 text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-sm transition-all duration-200",
    btnPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-500 hover:text-indigo-655 font-sans text-xs hover:bg-slate-55 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-indigo-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg",
    pattern: ""
  },
  "digital business": {
    bg: "bg-slate-50 text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-sm transition-all duration-200",
    btnPrimary: "bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-600 hover:text-slate-900 font-sans text-xs hover:bg-slate-100 border border-slate-200/85 rounded-xl px-4 py-2 transition-all inline-flex items-center bg-white shadow-xs",
    titleHover: "group-hover:text-blue-700",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg",
    pattern: ""
  }
};

const DEFAULT_THEME = {
  bg: "bg-[#f4f4f0]",
  cardBg: "bg-white",
  borderClass: "border-4 border-black rounded-none",
  shadowClass: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2",
  btnPrimary: "bg-[#2dd4bf] text-black hover:bg-[#2dd4bf]/90 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  btnGhost: "text-black font-black hover:bg-zinc-200 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs h-9 px-3 flex items-center bg-white",
  titleHover: "group-hover:text-primary",
  textHeading: "text-black font-black uppercase",
  textMuted: "text-zinc-700 font-medium",
  badge: "bg-zinc-200 text-black border-2 border-black rounded-none",
  pattern: ""
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

const getFlashcardDisplayTitle = (deck: any, modules: any[] = []) => {
  const titleStr = String(deck.title || "").trim();
  const isNumeric = /^\d+(\.\d+)?$/.test(titleStr);
  
  if (isNumeric) {
    const module = deck.module || (Array.isArray(modules) && modules.find((m: any) => m.id === deck.moduleId || m.moduleNo === parseInt(titleStr.split(".")[0], 10)));
    if (module) {
      const parts = titleStr.split(".");
      const subNo = parts.length === 2 ? parseInt(parts[1], 10) : (deck.subtopicId || 1);
      const subtopic = (module.subtopics || []).find((st: any) => st.subtopicNo === subNo || st.order === subNo);
      if (subtopic && subtopic.title) {
        return subtopic.title;
      }
    }
  }
  return deck.title;
};

export default function FlashcardsListPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
  const [flashcardDecks, setFlashcardDecks] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const [result, subjects, mods] = await Promise.all([
          fetchGAS("getFlashcardDecks", { subjectId }),
          fetchGAS("getSubjects"),
          fetchGAS("getModules", { subjectId })
        ]);
        if (Array.isArray(result)) {
          setFlashcardDecks(result);
        }
        if (Array.isArray(subjects)) {
          const currentSub = subjects.find((s: any) => s.id === subjectId);
          if (currentSub) setSubjectName(currentSub.name || "");
        }
        if (Array.isArray(mods)) {
          setModules(mods);
        }
      } catch (err) {
        console.error("Failed to load flashcard decks", err);
      } finally {
        setLoading(false);
      }
    };
    loadDecks();
  }, [subjectId]);

  const isDigitalBusiness = subjectId === 'id_pryay1ykw' || String(subjectName || "").toLowerCase().includes("digital business");
  const isUiProgramming = subjectId === 'id_mn573l5e5' || String(subjectName || "").toLowerCase().includes("ui programming");
  const isPythonProgramming = subjectId === 'id_hdzqxse2n' || String(subjectName || "").toLowerCase().includes("python");
  const themeKey = isUiProgramming ? "ui programming" : isPythonProgramming ? "python programming" : isDigitalBusiness ? "digital business" : "";
  const t = THEME_MAP[themeKey] || DEFAULT_THEME;
  const isPremiumTheme = isUiProgramming || isPythonProgramming || isDigitalBusiness;

  const renderFlashcardPreview = (moduleNo: number, title: string) => {
    return (
      <svg className="w-full h-full text-[#7C3AED]" viewBox="0 0 150 80" fill="none" stroke="currentColor" strokeWidth="1.2">
        <motion.rect
          x="35" y="25" width="80" height="42" rx="4"
          fill="currentColor" fillOpacity="0.02"
          stroke="#7C3AED" strokeOpacity="0.3"
          variants={{
            rest: { x: 0, y: 0, rotate: 0 },
            hover: { x: 12, y: -8, rotate: 4 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <motion.rect
          x="35" y="22" width="80" height="42" rx="4"
          fill="currentColor" fillOpacity="0.04"
          stroke="#7C3AED" strokeOpacity="0.6"
          variants={{
            rest: { x: 0, y: 0, rotate: 0 },
            hover: { x: 6, y: -4, rotate: -2 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <rect x="35" y="18" width="80" height="42" rx="4" fill="white" stroke="#7C3AED" strokeWidth="1.5" />
        <line x1="45" y1="28" x2="75" y2="28" stroke="#7C3AED" strokeWidth="2.5" />
        <line x1="45" y1="36" x2="105" y2="36" stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="45" y1="44" x2="95" y2="44" stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.5" />
        <circle cx="103" cy="28" r="4" fill="#7C3AED" fillOpacity="0.1" stroke="#7C3AED" strokeWidth="0.8" />
        <path d="M101.5,28 L102.5,29 L104.5,27" stroke="#7C3AED" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-center items-center font-mono text-zinc-800 space-y-4">
        <div className="w-12 h-12 border-4 border-t-[#3b82f6] border-zinc-200 rounded-full animate-spin" />
        <p className="text-xs uppercase font-bold tracking-wider animate-pulse text-zinc-500">Retrieving flashcards index...</p>
      </div>
    );
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
              <span className="text-slate-650 font-bold uppercase tracking-wider text-xs">Flashcards Config</span>
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
              path: <span className="text-[#3776AB]">~/workspace/flashcards.json</span>
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
              Flashcard Loader.py
            </h1>
            <p className="text-slate-550 mt-2 text-xs leading-relaxed max-w-2xl font-medium font-sans">
              Review key syntax components, data types, and core coding conventions. Select a deck below to begin parsing active terms.
            </p>
          </div>

          {/* Decks Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {flashcardDecks.map((deck: any) => {
              const { shortTitle, funcName } = getCleanPythonDetails(getFlashcardDisplayTitle(deck, modules));

              return (
                <motion.div key={deck.id} variants={itemVariants}>
                  <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`} className="block h-full">
                    <div className="bg-white border border-slate-200 p-4 rounded hover:border-[#3776AB] transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(55,118,171,0.06)] hover:-translate-y-1">
                      <div>
                        {/* IDE Tab indicators */}
                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2 text-[10px] text-slate-400 font-mono">
                          <span className="font-bold">M0{deck.module?.moduleNo || "?"}</span>
                          <span className="text-[#3776AB] font-bold group-hover:text-[#005B99] transition-colors">{shortTitle}</span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-bold text-xs text-slate-800 mb-2 leading-relaxed font-jetbrains group-hover:text-[#3776AB] transition-colors">
                          def {funcName}():
                        </h4>
                        <p className="text-[10px] text-slate-550 font-sans leading-relaxed line-clamp-3 mb-4 pl-4 border-l border-slate-200 font-medium">
                          &quot;&quot;&quot;<br />
                          Parse and review {deck.cards?.length || 0} vocabulary definitions, methods, and statements.<br />
                          &quot;&quot;&quot;
                        </p>
                      </div>

                      {/* Detail nodes */}
                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 font-bold"><Code className="w-3.5 h-3.5 text-[#3776AB]" /> {deck.cards?.length || 0} terms</span>
                        <span className="text-[#3776AB] group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold">
                          PARSE_DECK() &gt;
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {flashcardDecks.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-200 bg-white text-slate-400 rounded">
              EMPTY FLASHCARDS DIRECTORY.
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
              <Button className={`font-black uppercase tracking-wider ${isPremiumTheme
                ? "bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-slate-900 shadow-xs rounded-lg px-4 py-2 text-xs font-mono font-bold uppercase transition-all duration-150"
                : t.btnGhost
                }`}>
                ← Back to Dashboard
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Section Header Card */}
        <Card className={`${isPremiumTheme
          ? 'bg-white border border-slate-200 shadow-xs'
          : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass
          } brutalist-transition mb-8 relative overflow-hidden rounded-lg`}>
          <CardHeader className="pt-8 pb-6 relative z-10">
            <div>
              {isPremiumTheme ? (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/50">
                    Workspace
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">flashcards.console</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-[10px] font-mono px-2.5 py-1 ${t.badge}`}>
                    Workspace
                  </Badge>
                </div>
              )}
              <CardTitle className={`text-2xl md:text-3xl ${isPremiumTheme ? 'text-slate-900 font-semibold tracking-tight' : t.textHeading} flex items-center gap-3`}>
                <Layers className={`w-7 h-7 ${isPremiumTheme ? "text-slate-500" : "text-primary"}`} /> Interactive Flashcards
              </CardTitle>
              <CardDescription className={`${isPremiumTheme ? 'text-slate-550 font-medium font-sans' : t.textMuted} mt-2 text-sm leading-relaxed`}>
                Review key design principles, usability metrics, and typography terms interactively.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Flashcard Decks Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {flashcardDecks.map((deck) => {
            const cardContent = (
              <Card className={`flex flex-col h-full transition-all duration-300 overflow-hidden ${isPremiumTheme
                  ? "bg-white border border-slate-200 rounded-xl shadow-sm"
                  : "hover:border-primary/40 hover:shadow-lg bg-white"
                }`}>
                <CardHeader className={`${isPremiumTheme ? "p-5 md:p-6 pb-2 border-b border-slate-100" : "pb-3 border-b border-zinc-50"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={isPremiumTheme ? "bg-slate-100 text-slate-750 border-slate-200 rounded font-mono text-[9px]" : "text-[10px] px-2 py-0.5 border-zinc-200 bg-zinc-50 text-zinc-650 font-bold"}>
                      Module {deck.module?.moduleNo || "?"}
                    </Badge>
                  </div>

                  {/* Micro-interactive SVG Illustration preview */}
                  {isPremiumTheme && (
                    <div className="w-full h-24 bg-slate-50/50 border border-slate-200/60 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden pointer-events-none">
                      <div className="w-full h-full">
                        {renderFlashcardPreview(deck.module?.moduleNo || 1, getFlashcardDisplayTitle(deck, modules))}
                      </div>
                      <div className="absolute inset-0 opacity-[0.015]" style={{
                        backgroundImage: `linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)`,
                        backgroundSize: '8px 8px'
                      }} />
                    </div>
                  )}

                  <CardTitle className={isPremiumTheme ? "text-base font-bold font-sans tracking-tight text-slate-800 line-clamp-1 leading-snug" : "text-lg font-bold text-zinc-800 leading-snug group-hover:text-primary transition-colors"}>
                    {getFlashcardDisplayTitle(deck, modules)}
                  </CardTitle>
                </CardHeader>
                <CardContent className={`flex-grow flex flex-col justify-between ${isPremiumTheme ? "p-5 md:p-6" : "pt-4"}`}>
                  <div className={`flex items-center space-x-2 font-medium mb-6 ${isPremiumTheme ? "text-xs font-mono text-slate-500" : "text-sm text-zinc-555"}`}>
                    <Layers className={`w-4 h-4 ${isPremiumTheme ? "text-slate-400" : "text-primary/70"}`} />
                    <span>{deck.cards?.length || 0} Terms & Concepts</span>
                  </div>

                  <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`} className="w-full mt-auto">
                    <Button className={`w-full ${isPremiumTheme
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm font-sans text-xs font-semibold transition-all duration-150"
                        : "bg-primary hover:bg-primary/95 text-white shadow-sm font-bold h-10 transition-transform active:scale-[0.98]"
                      }`}>
                      Study Deck
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );

            return (
              <motion.div key={deck.id} variants={itemVariants}>
                {isPremiumTheme ? (
                  <motion.div
                    whileHover="hover"
                    animate="rest"
                    className="h-full"
                  >
                    <motion.div
                      variants={{
                        rest: { y: 0, scale: 1 },
                        hover: { y: -8, scale: 1.012 }
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="h-full relative group"
                    >
                      {/* Stack offset backgrounds — frozen, no hover changes */}
                      <div
                        className="absolute inset-0 bg-slate-100 rounded-xl border border-slate-200 translate-y-1 translate-x-1 pointer-events-none transition-opacity duration-200 group-hover:opacity-0"
                      />
                      <div
                        className="absolute inset-0 bg-slate-50 rounded-xl border border-slate-200/60 translate-y-2 translate-x-2 pointer-events-none transition-opacity duration-200 opacity-60 group-hover:opacity-0"
                      />
                      <DesignStudioCard isPremium={true} label={`Deck.Topology M0${deck.module?.moduleNo || 1}`} className="h-full relative z-10">
                        {cardContent}
                      </DesignStudioCard>
                    </motion.div>
                  </motion.div>
                ) : (
                  cardContent
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {flashcardDecks.length === 0 && (
          <div className={`py-12 text-center font-bold border border-dashed rounded-xl ${isPremiumTheme
            ? 'bg-white/50 border-slate-200 text-slate-400 shadow-none'
            : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}>
            <Layers className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-lg">No Flashcards Available</h3>
            <p className="text-sm text-zinc-500 font-normal mt-1">Check back later when your instructors upload study materials.</p>
          </div>
        )}
      </div>
    </div>
  );
}