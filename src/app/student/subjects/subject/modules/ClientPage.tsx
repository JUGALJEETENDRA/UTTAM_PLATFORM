"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGAS } from "@/lib/apiClient";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Clock, Book, ArrowRight, ChevronRight, Layers,
  TrendingUp, Activity, Terminal, ShieldAlert, Sparkles, Code, MousePointer
} from "lucide-react";
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
    btnGhost: "text-slate-500 hover:text-indigo-655 font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-indigo-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg",
    pattern: ""
  },

  "python programming": {
    bg: "bg-[#0C0A09]",
    cardBg: "bg-[#1C1917]",
    borderClass: "border-4 border-[#3776AB] rounded-none",
    shadowClass: "shadow-[8px_8px_0px_0px_#FFD43B] hover:shadow-[0px_0px_0px_0px_#FFD43B] hover:translate-x-2 hover:translate-y-2",
    btnPrimary: "bg-[#FFD43B] text-black hover:bg-[#FFD43B]/90 border-2 border-white rounded-none shadow-[4px_4px_0px_0px_#3776AB] active:shadow-none active:translate-x-1 active:translate-y-1",
    btnGhost: "text-[#FFD43B] font-black hover:bg-[#FFD43B]/10 rounded-none",
    titleHover: "group-hover:text-[#FFD43B]",
    textHeading: "text-[#FFD43B] font-mono uppercase tracking-widest",
    textMuted: "text-zinc-400 font-mono",
    badge: "bg-[#3776AB] text-white border-2 border-[#FFD43B] rounded-none font-mono",
    pattern: "python-matrix-terminal"
  }
};

const DEFAULT_THEME = {
  bg: "bg-[#f4f4f0]",
  cardBg: "bg-white",
  borderClass: "border-4 border-black rounded-none",
  shadowClass: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2",
  btnPrimary: "bg-[#2dd4bf] text-black hover:bg-[#2dd4bf]/90 border-2 border-black rounded-none",
  btnGhost: "text-black font-black hover:bg-zinc-200 rounded-none",
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

export default function ModulesPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [data, setData] = useState<any>(null);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const [result, subjects] = await Promise.all([
          fetchGAS("getModules", { subjectId, userId: "anonymous" }),
          fetchGAS("getSubjects")
        ]);
        
        setData(result);
        if (Array.isArray(subjects)) {
          const currentSub = subjects.find((s: any) => s.id === subjectId);
          if (currentSub) setSubjectName(currentSub.name || "");
        }
      } catch (err) {
        console.error("Failed to load modules", err);
      } finally {
        setLoading(false);
      }
    };
    if (subjectId) {
      loadModules();
    } else {
      setLoading(false);
    }
  }, [subjectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-center items-center font-mono text-zinc-800 space-y-4">
        <div className="w-12 h-12 border-4 border-t-[#3b82f6] border-zinc-200 rounded-full animate-spin" />
        <p className="text-xs uppercase font-bold tracking-wider animate-pulse text-zinc-500">Retrieving modules pipeline...</p>
      </div>
    );
  }

  const modules = data || [];

  // Theme Identification based on dynamic name matching and subjectId checks
  const isUiProgramming = subjectId === 'id_mn573l5e5' || subjectName.toLowerCase().includes("ui programming");
  const isDigitalBusiness = subjectId === 'id_pryay1ykw' || subjectName.toLowerCase().includes("digital business");
  const isPythonProgramming = subjectId === 'id_hdzqxse2n' || subjectName.toLowerCase().includes("python");

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
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 relative overflow-hidden antialiased selection:bg-[#1E3A8A]/10 selection:text-[#1E3A8A] font-sans">
        {/* Strategy-board dot pattern grid overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(#e2e8f0 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px"
        }} />

        <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl space-y-6">

          {/* Subtle Breadcrumb Navigation - Removed */}

          {/* Dashboard Back Nav Bar */}
          <div className="flex justify-between items-center bg-white p-3 border border-slate-200 shadow-sm rounded-lg">
            <Link href={`/student/subjects/subject?subjectId=${subjectId}`}>
              <Button className="bg-gradient-to-r from-blue-700 to-indigo-750 hover:from-blue-800 hover:to-indigo-900 border-none text-white text-[10px] font-mono tracking-widest px-4 py-1.5 h-8 uppercase rounded-md shadow-md transition-all flex items-center gap-1.5">
                ← Return to Workspace
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">WORKSPACE</span>
            </div>
          </div>

          {/* Section Header */}
          <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-lg">
            <div className="flex items-center gap-3.5 mb-2.5">
              <Badge className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                Course Outline
              </Badge>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">DBT_MODULES</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 font-sans">
              <Layers className="w-7 h-7 text-[#1E3A8A]" />
              Modules
            </h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl font-sans font-medium">
              Explore the core learning modules of the Digital Business & Transformation course. Select a module below to view detailed subtopics and content.
            </p>
          </div>

          {/* Modules Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {modules.map((mod: any, index: number) => {
              const hourLabel = mod.hours ? `${mod.hours} Hours` : "3 Hours";
              const subtopicsCount = mod.subtopics?.length || 0;

              return (
                <motion.div key={mod.id} variants={itemVariants}>
                  <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`} className="block h-full font-sans">
                    <div className="bg-white border border-slate-200 p-5 rounded-lg transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer shadow-sm hover:shadow-[0_8px_30px_rgba(30,58,138,0.06)] hover:border-[#1E3A8A] hover:bg-slate-50/30 hover:-translate-y-1 hover:scale-[1.01]">
                      <div>
                        {/* Top Indicator Line */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">Module 0{mod.moduleNo || (index + 1)}</span>
                          <span className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${(mod.moduleNo || (index + 1)) <= 2
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : (mod.moduleNo || (index + 1)) <= 4
                                  ? "bg-amber-50 text-amber-700 border border-amber-250"
                                  : "bg-rose-50 text-rose-700 border border-rose-250"
                              }`}>
                              {(mod.moduleNo || (index + 1)) <= 2 ? "Beginner" : (mod.moduleNo || (index + 1)) <= 4 ? "Intermediate" : "Advanced"}
                            </span>
                            <span className="text-[9px] font-mono text-teal-700 border border-teal-200/60 px-1.5 py-0.5 rounded bg-teal-500/10 font-semibold uppercase group-hover:bg-teal-650 group-hover:text-white group-hover:border-teal-650 transition-colors duration-300">
                              Active
                            </span>
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-[13.5px] font-bold font-sans text-slate-800 tracking-tight leading-snug group-hover:text-[#1E3A8A] transition-colors pr-2 mb-2">
                          {mod.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-sans leading-relaxed line-clamp-3 mb-4">
                          {mod.co || "Analyze foundational strategies, operational metrics, and structural transformation objectives."}
                        </p>
                      </div>

                      {/* Details & Standard Action footer */}
                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[9.5px] font-mono text-slate-500">
                        <span className="flex items-center gap-1 font-semibold uppercase">
                          {subtopicsCount} Units
                        </span>
                        <span className="text-[#1E3A8A] font-semibold flex items-center gap-1 group-hover:text-indigo-750 transition-colors duration-300">
                          Start Learning <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {modules.length === 0 && (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-400 font-mono text-xs">
              NO ACTIVE MODULES FOUND.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VARIANT C: PYTHON PROGRAMMING (IDE DEVELOPER SHELL WORKSPACE)
  // ==========================================
  if (isPythonProgramming) {
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
              <span className="text-slate-600 font-bold uppercase tracking-wider">Modules Config</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-500">
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
              path: <span className="text-[#3776AB]">~/workspace/modules_config.json</span>
            </div>
          </div>

          {/* IDE Section Header Panel */}
          <div className="bg-white border border-slate-200 p-6 rounded relative overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#3776AB]" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold text-[#3776AB] bg-[#3776AB]/10 px-2 py-0.5 border border-[#3776AB]/30 rounded">INDEX</span>
              <span className="text-[10px] text-slate-400 font-mono">READ-ONLY STREAM</span>
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-[#3776AB] flex items-center gap-3">
              <Terminal className="w-6 h-6 text-[#3776AB]" />
              Module Loader.py
            </h1>
            <p className="text-slate-500 mt-2 text-xs leading-relaxed max-w-2xl font-medium">
              Load learning sectors and script structures. Engage compiler checks inside each unit segment node to unlock source files.
            </p>
          </div>

          {/* Modules Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {modules.map((mod: any, idx: number) => {
              // Custom helper to resolve clean short titles and func names without underscores
              const getCleanPythonDetails = (title: string) => {
                const lower = title.toLowerCase();
                let shortTitle = "";
                let funcName = "";

                if (lower.includes("data types") || lower.includes("structures")) {
                  shortTitle = "Data Structures.py";
                  funcName = "studyDataStructures";
                } else if (lower.includes("decision") || lower.includes("functions") || lower.includes("making")) {
                  shortTitle = "Decision Making.py";
                  funcName = "studyDecisionMaking";
                } else if (lower.includes("exception") || lower.includes("file")) {
                  shortTitle = "Exception Handling.py";
                  funcName = "studyExceptionHandling";
                } else if (lower.includes("pandas") || lower.includes("seaborn") || lower.includes("visualize")) {
                  shortTitle = "Data Visualization.py";
                  funcName = "studyDataVisualization";
                } else if (lower.includes("gui") || lower.includes("connectivity") || lower.includes("database")) {
                  shortTitle = "GUI Databases.py";
                  funcName = "studyGUIDatabases";
                } else {
                  const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ");
                  const words = cleanTitle.split(" ");
                  const shortWords = words.slice(0, 2);
                  shortTitle = shortWords.join(" ") + ".py";
                  funcName = "study" + shortWords.map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
                }

                return { shortTitle, funcName };
              };

              const { shortTitle, funcName } = getCleanPythonDetails(mod.title);

              return (
                <motion.div key={mod.id} variants={itemVariants}>
                  <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`} className="block h-full">
                    <div className="bg-white border border-slate-200 p-4 rounded hover:border-[#3776AB] transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(55,118,171,0.06)] hover:-translate-y-1">

                      <div>
                        {/* IDE Tab indicators */}
                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2 text-[10px] text-slate-400">
                          <span className="font-bold">M0{mod.moduleNo}</span>
                          <span className="text-[#3776AB] font-bold group-hover:text-[#005B99] transition-colors">{shortTitle}</span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-bold text-xs text-slate-800 mb-2 leading-relaxed font-jetbrains group-hover:text-[#3776AB] transition-colors">
                          def {funcName}():
                        </h4>
                        <p className="text-[10px] text-slate-500 font-sans leading-relaxed line-clamp-3 mb-4 pl-4 border-l border-slate-200 font-medium">
                          &quot;&quot;&quot;<br />
                          {mod.co || "Review syntax configurations, structure types, exception scripts, and execution workflows."}<br />
                          &quot;&quot;&quot;
                        </p>
                      </div>

                      {/* Detail nodes */}
                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 font-bold"><Code className="w-3.5 h-3.5 text-[#3776AB]" /> {mod.subtopics?.length || 0} sub_nodes</span>
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

          {modules.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-200 bg-white text-slate-400 rounded">
              EMPTY INTERPRETER WORKSPACE.
            </div>
          )}

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VARIANT B: UI PROGRAMMING (NEUBRUTALISM /FIGMA CANVAS WORKBENCH)
  // ==========================================
  const renderModulePreview = (moduleNo: number, title?: string) => {
    const normalizedTitle = String(title || "").toLowerCase();

    // Module 1: User Persona Card, User Journey, Profile Layout
    if (normalizedTitle.includes("intro") || normalizedTitle.includes("thinking") || moduleNo === 1) {
      return (
        <svg className="w-full h-full text-[#7C3AED]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Wireframe box layout */}
          <rect x="15" y="10" width="80" height="60" rx="6" fill="currentColor" fillOpacity="0.03" stroke="#7C3AED" />
          {/* User Persona Avatar */}
          <motion.g
            variants={{
              rest: { y: 0 },
              hover: { y: -2, transition: { type: "spring", stiffness: 300, damping: 15 } }
            }}
          >
            <circle cx="35" cy="30" r="12" stroke="#7C3AED" strokeWidth="1.5" />
            <path d="M23,50 C23,43 28,42 35,42 C42,42 47,43 47,50" stroke="#7C3AED" strokeWidth="1.5" />
          </motion.g>

          {/* Info lines */}
          <line x1="55" y1="24" x2="85" y2="24" stroke="#7C3AED" strokeWidth="2" />
          <line x1="55" y1="32" x2="75" y2="32" stroke="#7C3AED" strokeWidth="1" />
          <line x1="55" y1="40" x2="80" y2="40" stroke="#7C3AED" strokeWidth="1" />

          {/* User Journey Graph line */}
          <motion.path
            d="M110,55 L125,35 L145,45 L165,15 L185,25"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              rest: { pathLength: 1 },
              hover: { pathLength: [0, 1], transition: { duration: 0.8, ease: "easeOut" } }
            }}
          />
          {/* Graph Nodes */}
          <circle cx="110" cy="55" r="3" fill="#10B981" />
          <circle cx="125" cy="35" r="3" fill="#10B981" />
          <circle cx="145" cy="45" r="3" fill="#10B981" />
          <circle cx="165" cy="15" r="3" fill="#10B981" />
          <circle cx="185" cy="25" r="3" fill="#10B981" />

          {/* Guidelines */}
          <line x1="105" y1="60" x2="190" y2="60" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="105" y1="10" x2="105" y2="60" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    }

    // Module 2: Layout Grids, Wireframes, Spacing Systems
    if (normalizedTitle.includes("flex") || normalizedTitle.includes("layout") || moduleNo === 2) {
      return (
        <svg className="w-full h-full text-[#3B82F6]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="15" y="10" width="170" height="60" rx="6" stroke="#E2E8F0" />
          {/* Flex column grid layout */}
          <rect x="25" y="18" width="40" height="44" rx="3" fill="currentColor" fillOpacity="0.04" stroke="#3B82F6" strokeWidth="1.2" />
          <motion.rect
            x="73" y="18" width="54" height="44" rx="3" fill="currentColor" fillOpacity="0.04" stroke="#3B82F6" strokeWidth="1.2"
            variants={{
              rest: { scale: 1, originX: "73px", originY: "18px" },
              hover: { scale: 1.015, originX: "73px", originY: "18px", transition: { type: "spring", stiffness: 300, damping: 15 } }
            }}
          />
          <rect x="135" y="18" width="40" height="44" rx="3" fill="currentColor" fillOpacity="0.04" stroke="#3B82F6" strokeWidth="1.2" />

          {/* Spacing lines / dimension guides */}
          <line x1="65" y1="18" x2="65" y2="62" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 1" />
          <line x1="127" y1="18" x2="127" y2="62" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 1" />
          <motion.line
            x1="65" y1="40" x2="73" y2="40" stroke="#EF4444" strokeWidth="1"
            variants={{
              rest: { opacity: 0.8 },
              hover: { opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }
            }}
          />
          <motion.line
            x1="127" y1="40" x2="135" y2="40" stroke="#EF4444" strokeWidth="1"
            variants={{
              rest: { opacity: 0.8 },
              hover: { opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }
            }}
          />

          {/* Dimension Text mockup */}
          <text x="66" y="34" fill="#EF4444" fontSize="6" fontFamily="monospace" stroke="none" fontWeight="bold">8</text>

          {/* Wireframe lines */}
          <line x1="30" y1="28" x2="60" y2="28" stroke="#3B82F6" strokeWidth="1.5" />
          <line x1="30" y1="36" x2="50" y2="36" stroke="#3B82F6" strokeWidth="1" />
          <line x1="79" y1="28" x2="121" y2="28" stroke="#3B82F6" strokeWidth="1.5" />
          <line x1="79" y1="36" x2="110" y2="36" stroke="#3B82F6" strokeWidth="1" />
          <line x1="79" y1="44" x2="100" y2="44" stroke="#3B82F6" strokeWidth="1" />
        </svg>
      );
    }

    // Module 3: Browser Mockup, Navigation Systems, Responsive Layouts
    if (normalizedTitle.includes("styling") || normalizedTitle.includes("tailwind") || normalizedTitle.includes("design system") || moduleNo === 3) {
      return (
        <svg className="w-full h-full text-[#10B981]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Responsive Browser Mockups */}
          {/* Desktop Browser */}
          <rect x="15" y="10" width="110" height="60" rx="6" fill="white" stroke="#E2E8F0" />
          <motion.g
            variants={{
              rest: { x: 0 },
              hover: { x: -3, transition: { type: "spring", stiffness: 200, damping: 15 } }
            }}
          >
            <rect x="157" y="20" width="30" height="50" rx="4" fill="white" stroke="#E2E8F0" />
            <rect x="162" y="28" width="20" height="4" rx="2" fill="#10B981" stroke="none" />
            <circle cx="172" cy="42" r="6" fill="currentColor" fillOpacity="0.08" stroke="#10B981" strokeWidth="1" />
            <rect x="162" y="54" width="20" height="2" rx="1" fill="#E2E8F0" stroke="none" />
            <rect x="162" y="60" width="14" height="2" rx="1" fill="#E2E8F0" stroke="none" />
          </motion.g>

          {/* Desktop headers */}
          <rect x="15.5" y="10.5" width="109" height="12" rx="5.5" fill="#F8FAFC" stroke="none" />
          <circle cx="21" cy="16.5" r="2" fill="#EF4444" stroke="none" />
          <circle cx="27" cy="16.5" r="2" fill="#F59E0B" stroke="none" />
          <circle cx="33" cy="16.5" r="2" fill="#10B981" stroke="none" />

          {/* Navigation link markers */}
          <rect x="55" y="15" width="15" height="3" rx="1.5" fill="#10B981" stroke="none" />
          <rect x="75" y="15" width="15" height="3" rx="1.5" fill="#E2E8F0" stroke="none" />
          <rect x="95" y="15" width="15" height="3" rx="1.5" fill="#E2E8F0" stroke="none" />

          {/* Desktop Body content */}
          <circle cx="35" cy="40" r="10" fill="currentColor" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.2" />
          <rect x="52" y="34" width="45" height="5" rx="2.5" fill="#10B981" stroke="none" />
          <rect x="52" y="44" width="30" height="3.5" rx="1.7" fill="#E2E8F0" stroke="none" />

          {/* Responsive connector vector line */}
          <motion.path
            d="M130,40 L150,40"
            stroke="#10B981"
            strokeDasharray="3 3"
            strokeWidth="1.5"
            initial={{ strokeDashoffset: 0 }}
            variants={{
              rest: { strokeDashoffset: 0 },
              hover: { strokeDashoffset: [0, -6], transition: { repeat: Infinity, ease: "linear", duration: 0.8 } }
            }}
          />
          <polygon points="146,37 151,40 146,43" fill="#10B981" stroke="none" />
        </svg>
      );
    }

    // Module 4: Tables, Dashboards, Cards, Data Widgets
    if (normalizedTitle.includes("data") || normalizedTitle.includes("handling") || moduleNo === 4) {
      return (
        <svg className="w-full h-full text-[#F59E0B]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="15" y="10" width="170" height="60" rx="6" stroke="#E2E8F0" />

          {/* Widget 1: Circular Chart */}
          <rect x="25" y="18" width="40" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="45" cy="35" r="10" stroke="#E2E8F0" strokeWidth="2.5" />
          <circle cx="45" cy="35" r="10" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="40 60" />
          <text x="38" y="38" fill="#F59E0B" fontSize="7" fontWeight="bold" fontFamily="sans-serif" stroke="none">65%</text>

          {/* Widget 2: Data Bars */}
          <rect x="73" y="18" width="54" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
          <motion.rect
            x="81" y="42" width="6" height="12" rx="1" fill="#F59E0B" stroke="none"
            variants={{
              rest: { scaleY: 1, originY: "54px" },
              hover: { scaleY: [1, 1.1, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.1 } }
            }}
          />
          <motion.rect
            x="91" y="32" width="6" height="22" rx="1" fill="#F59E0B" stroke="none"
            variants={{
              rest: { scaleY: 1, originY: "54px" },
              hover: { scaleY: [1, 1.15, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }
            }}
          />
          <motion.rect
            x="101" y="26" width="6" height="28" rx="1" fill="#F59E0B" stroke="none"
            variants={{
              rest: { scaleY: 1, originY: "54px" },
              hover: { scaleY: [1, 1.08, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 } }
            }}
          />
          <rect x="111" y="36" width="6" height="18" rx="1" fill="#E2E8F0" stroke="none" />

          {/* Widget 3: Card list grid */}
          <rect x="135" y="18" width="40" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
          <rect x="141" y="24" width="28" height="6" rx="3" fill="#F59E0B" stroke="none" />
          <rect x="141" y="34" width="28" height="6" rx="3" fill="#E2E8F0" stroke="none" />
          <rect x="141" y="44" width="28" height="6" rx="3" fill="#E2E8F0" stroke="none" />
        </svg>
      );
    }

    // Module 5: Mobile Interface Design (Phone shell & Lateral slide-out navigation)
    if (normalizedTitle.includes("mobile") || normalizedTitle.includes("phone") || moduleNo === 5) {
      return (
        <svg className="w-full h-full text-[#EC4899]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Mobile phone chassis */}
          <rect x="80" y="8" width="40" height="64" rx="6" stroke="#EC4899" strokeWidth="1.5" fill="white" />
          {/* Notch / Speaker */}
          <rect x="95" y="11" width="10" height="2" rx="1" fill="#EC4899" stroke="none" />
          {/* Bottom Nav Bar */}
          <rect x="80.75" y="60" width="38.5" height="11.25" fill="#FFF1F2" stroke="none" />
          <line x1="80" y1="60" x2="120" y2="60" stroke="#EC4899" strokeWidth="0.8" />
          <circle cx="89" cy="65" r="1.5" fill="#EC4899" />
          <circle cx="100" cy="65" r="1.5" fill="#EC4899" />
          <circle cx="111" cy="65" r="1.5" fill="#EC4899" />

          {/* Main Content Area: Info Card */}
          <rect x="85" y="18" width="30" height="16" rx="3" fill="#EC4899" fillOpacity="0.04" stroke="#EC4899" strokeWidth="0.8" />
          <circle cx="92" cy="26" r="3.5" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="0.6" />
          <line x1="100" y1="23" x2="111" y2="23" stroke="#EC4899" strokeWidth="1.2" />
          <line x1="100" y1="28" x2="108" y2="28" stroke="#EC4899" strokeWidth="0.8" strokeOpacity="0.6" />

          {/* List Items */}
          <rect x="85" y="38" width="30" height="6" rx="1.5" fill="#EC4899" fillOpacity="0.02" stroke="#EC4899" strokeWidth="0.6" />
          <rect x="85" y="47" width="30" height="6" rx="1.5" fill="#EC4899" fillOpacity="0.02" stroke="#EC4899" strokeWidth="0.6" />
          <line x1="89" y1="41" x2="111" y2="41" stroke="#EC4899" strokeWidth="0.6" strokeOpacity="0.8" />
          <line x1="89" y1="50" x2="105" y2="50" stroke="#EC4899" strokeWidth="0.6" strokeOpacity="0.8" />

          {/* Lateral overlay menu sliding in */}
          <motion.g
            variants={{
              rest: { x: 0 },
              hover: { x: -3, transition: { type: "spring", stiffness: 200, damping: 15 } }
            }}
          >
            <path d="M128,12 L146,12 L146,58 L128,58 Z" stroke="#EC4899" strokeWidth="0.8" strokeDasharray="3 2" fill="white" />
            <line x1="132" y1="18" x2="142" y2="18" stroke="#EC4899" strokeWidth="0.8" />
            <line x1="132" y1="24" x2="139" y2="24" stroke="#EC4899" strokeWidth="0.8" />
            <line x1="132" y1="30" x2="141" y2="30" stroke="#EC4899" strokeWidth="0.8" />
          </motion.g>

          {/* Connection Arrows */}
          <path d="M122,35 L126,35" stroke="#EC4899" strokeWidth="1" strokeLinecap="round" />
          <polygon points="125,33 128,35 125,37" fill="#EC4899" stroke="none" />
        </svg>
      );
    }

    // Default Fallback: Tables, Dashboards, Cards, Data Widgets
    return (
      <svg className="w-full h-full text-[#F59E0B]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="15" y="10" width="170" height="60" rx="6" stroke="#E2E8F0" />

        {/* Widget 1: Circular Chart */}
        <rect x="25" y="18" width="40" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="45" cy="35" r="10" stroke="#E2E8F0" strokeWidth="2.5" />
        <circle cx="45" cy="35" r="10" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="40 60" />
        <text x="38" y="38" fill="#F59E0B" fontSize="7" fontWeight="bold" fontFamily="sans-serif" stroke="none">65%</text>

        {/* Widget 2: Data Bars */}
        <rect x="73" y="18" width="54" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
        <motion.rect
          x="81" y="42" width="6" height="12" rx="1" fill="#F59E0B" stroke="none"
          variants={{
            rest: { scaleY: 1, originY: "54px" },
            hover: { scaleY: [1, 1.1, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.1 } }
          }}
        />
        <motion.rect
          x="91" y="32" width="6" height="22" rx="1" fill="#F59E0B" stroke="none"
          variants={{
            rest: { scaleY: 1, originY: "54px" },
            hover: { scaleY: [1, 1.15, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }
          }}
        />
        <motion.rect
          x="101" y="26" width="6" height="28" rx="1" fill="#F59E0B" stroke="none"
          variants={{
            rest: { scaleY: 1, originY: "54px" },
            hover: { scaleY: [1, 1.08, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 } }
          }}
        />
        <rect x="111" y="36" width="6" height="18" rx="1" fill="#E2E8F0" stroke="none" />

        {/* Widget 3: Card list grid */}
        <rect x="135" y="18" width="40" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
        <rect x="141" y="24" width="28" height="6" rx="3" fill="#F59E0B" stroke="none" />
        <rect x="141" y="34" width="28" height="6" rx="3" fill="#E2E8F0" stroke="none" />
        <rect x="141" y="44" width="28" height="6" rx="3" fill="#E2E8F0" stroke="none" />
      </svg>
    );
  };

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

        /* Microinteractions: grows underline from left */
        .design-studio-link {
          position: relative;
          color: #7C3AED;
          font-weight: 600;
        }
        .design-studio-link::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: #7C3AED;
          transform-origin: bottom left;
          transition: transform 0.25s ease-out;
        }
        .design-studio-link:hover::after {
          transform: scaleX(1);
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
                : t.btnPrimary
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
                  <span className="text-[10px] font-mono text-slate-400">modules.console</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-[10px] font-mono px-2.5 py-1 ${t.badge}`}>
                    Workspace
                  </Badge>
                </div>
              )}
              <CardTitle className={`text-2xl md:text-3xl ${isPremiumTheme ? 'text-slate-900 font-semibold tracking-tight' : t.textHeading} flex items-center gap-3`}>
                {isPremiumTheme ? <Layers className="w-6 h-6 text-slate-500" /> : <BookOpen className="w-8 h-8" />} Component Inspector
              </CardTitle>
              <CardDescription className={`${isPremiumTheme ? 'text-slate-550 font-medium font-sans' : t.textMuted} mt-2 text-sm leading-relaxed`}>
                Master UI layout constraints across {modules.length} design canvas frames.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Modules Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((mod: any) => (
            <motion.div key={mod.id} variants={itemVariants}>
              <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`} className="block h-full">
                <motion.div
                  whileHover={isPremiumTheme ? "hover" : ""}
                  animate="rest"
                  className="h-full"
                >
                  <motion.div
                    variants={{
                      rest: { y: 0, scale: 1 },
                      hover: { y: -8, scale: 1.03 }
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="h-full"
                  >
                    <DesignStudioCard isPremium={isPremiumTheme} className={`h-full ${t.cardBg} ${t.borderClass} ${t.shadowClass} flex flex-col justify-between brutalist-transition overflow-hidden group relative`}>

                      <CardHeader className={isPremiumTheme ? "p-5 md:p-6 pb-2 relative z-10" : "pt-5 px-5 pb-2.5 relative z-10"}>
                        <div className="flex justify-between items-center mb-3">
                          <motion.span
                            variants={{
                              rest: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
                              hover: { y: -1, boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)" }
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className={`inline-block text-[10px] px-2.5 py-1 transition-all duration-150 font-sans ${isPremiumTheme
                              ? "bg-indigo-50 text-indigo-850 border border-indigo-200/50 rounded-lg font-semibold group-hover:bg-indigo-100 group-hover:text-indigo-950"
                              : t.badge
                              }`}
                          >
                            Module 0{mod.moduleNo}
                          </motion.span>
                          {isPremiumTheme && (
                            <span className={`text-[9px] font-sans font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${mod.moduleNo <= 2
                                ? "bg-green-100 text-green-800"
                                : mod.moduleNo <= 4
                                  ? "bg-amber-100 text-amber-850"
                                  : "bg-red-100 text-red-800"
                              }`}>
                              {mod.moduleNo <= 2 ? "Beginner" : mod.moduleNo <= 4 ? "Intermediate" : "Advanced"}
                            </span>
                          )}
                        </div>
                        {isPremiumTheme && (
                          <motion.div
                            variants={{
                              rest: { opacity: 1, scale: 1 },
                              hover: { opacity: 1, scale: 1.02 }
                            }}
                            className="w-full h-24 bg-slate-50/50 border border-slate-200/60 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden pointer-events-none"
                          >
                            <div className="w-full h-full">
                              {renderModulePreview(mod.moduleNo, mod.title)}
                            </div>
                            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                              backgroundImage: `linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)`,
                              backgroundSize: '8px 8px'
                            }} />
                          </motion.div>
                        )}
                        <CardTitle className={`text-base transition-colors duration-150 line-clamp-2 ${isPremiumTheme
                          ? 'font-bold font-sans tracking-tight text-slate-800'
                          : t.titleHover + ' font-black leading-tight'
                          }`}>
                          {mod.title ? mod.title.replace(/^[●•]\s*/, "") : ""}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={isPremiumTheme ? "p-5 md:p-6 pt-0 relative z-10 flex-1 flex flex-col justify-end" : "px-5 pb-5 pt-0 flex-1 flex flex-col justify-between"}>
                        {!isPremiumTheme && (
                          <p className={`text-xs leading-relaxed line-clamp-3 mb-4 text-zinc-700 font-bold`}>
                            {mod.co || "Inspect component spacing, flex grids, nested outline boxes, and micro-interactions guidelines."}
                          </p>
                        )}

                        <div className={`pt-3 flex justify-between items-center text-xs font-semibold transition-all duration-150 ${isPremiumTheme ? 'border-t border-slate-100 text-slate-500 font-sans' : 'border-t-2 border-black text-zinc-500'
                          }`}>
                          <div className="flex gap-3">
                            <span className="flex items-center"><Book className="w-3.5 h-3.5 mr-1" /> {mod.subtopics?.length || 0} Units</span>
                          </div>
                          {isPremiumTheme && (
                            <motion.span
                              variants={{ hover: { x: 4 } }}
                              className="text-slate-655 flex items-center transition-colors"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </motion.span>
                          )}
                        </div>
                      </CardContent>
                    </DesignStudioCard>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {modules.length === 0 && (
          <div className={`py-12 text-center font-bold ${isPremiumTheme
            ? 'bg-white/50 border border-slate-200 border-dashed text-slate-400 rounded-xl shadow-none'
            : t.borderClass + ' ' + t.cardBg + ' border-dashed text-zinc-500 shadow-sm'
            }`}>
            NO ACTIVE LAYOUT NODES GENERATED.
          </div>
        )}
      </div>
    </div>
  );
}
