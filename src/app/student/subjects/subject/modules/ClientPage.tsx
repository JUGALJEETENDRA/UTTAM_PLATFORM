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
    bg: "bg-[#F9F6F0]",
    cardBg: "bg-white",
    borderClass: "border-4 border-black rounded-none",
    shadowClass: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2",
    btnPrimary: "bg-[#A855F7] text-white hover:bg-[#A855F7]/90 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1",
    btnGhost: "text-[#A855F7] font-black hover:bg-[#A855F7]/10 rounded-none",
    titleHover: "group-hover:text-[#A855F7]",
    textHeading: "text-black font-black uppercase tracking-tight",
    textMuted: "text-zinc-800 font-bold",
    badge: "bg-[#A855F7] text-white border-2 border-black rounded-none font-bold",
    pattern: "ui-blueprint-grid"
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
    setGlare({ x: glareX, y: glareY, opacity: 1 });
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
            background: `radial-gradient(circle 160px at ${glare.x}% ${glare.y}%, rgba(124, 58, 237, 0.06), transparent 80%)`,
            opacity: glare.opacity
          }}
        />
      )}
    </div>
  );
};

export default function ModulesPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const result = await fetchGAS("getModules", { subjectId, userId: "anonymous" });
        setData(result);
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
  // RENDER VARIANT A: DIGITAL BUSINESS & TRANSFORMATION (STRIPE/BLOOMBERG SAAS LOOK)
  // ==========================================
  if (isDigitalBusiness) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 relative overflow-hidden antialiased selection:bg-[#2563eb]/10 selection:text-[#2563eb] font-sans">

        {/* Ambient Grid Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(circle, #2563eb 1.2px, transparent 1.2px)`,
          backgroundSize: "28px 28px"
        }} />

        {/* Dynamic Financial Flow Vector Backings */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-20">
          <div className="absolute top-[15%] left-[5%] w-96 h-96 bg-[#2563eb]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-[#16a34a]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl space-y-8">

          {/* Dashboard Back Nav Bar */}
          <div className="flex justify-between items-center bg-white p-3 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] rounded-lg">
            <Link href={`/student/subjects/subject?subjectId=${subjectId}`}>
              <Button className="bg-slate-900 hover:bg-[#2563eb] text-white text-[10px] font-mono tracking-widest px-4 py-1.5 h-8 uppercase rounded-md shadow-sm transition-all flex items-center gap-1.5">
                ← Return to Terminal
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
                Core Assets
              </Badge>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">// DBT_LEDGER</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Layers className="w-7 h-7 text-[#2563eb]" />
              Learning Sectors
            </h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl font-medium">
              Explore strategic topics across {modules.length} operational study sectors. Expand segments below to engage prototype components.
            </p>
          </div>

          {/* Modules Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {modules.map((mod: any) => {
              const moduleWithProps = { ...mod, totalXpAvailable: 0, xpEarned: 0 };

              // Generate custom mock metrics based on module index for data richness
              const coverageVal = (mod.subtopics?.length || 0) * 12.5 + 25;

              return (
                <motion.div key={mod.id} variants={itemVariants}>
                  <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`} className="block h-full">
                    <div className="bg-white border border-slate-200/80 p-5 rounded-xl transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.06)] hover:border-[#2563eb]/60 hover:-translate-y-1">

                      <div>
                        {/* Top Indicator Line */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-mono text-slate-400 font-bold">SECTOR 0{mod.moduleNo}</span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-ping" />
                            <span className="text-[9px] font-mono text-[#16a34a] font-black uppercase tracking-wider">Active</span>
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest line-clamp-2 pr-4 mb-2 group-hover:text-[#2563eb] transition-colors">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-450 line-clamp-2 leading-relaxed font-medium mb-4">
                          {mod.co || "Analyze foundational strategies, operational metrics, and structural transformation objectives."}
                        </p>
                      </div>

                      {/* Details & Custom Visualizations */}
                      <div className="space-y-4">
                        {/* Mock Sparkline graph */}
                        <div className="h-6 w-full flex items-end gap-1 select-none opacity-40 group-hover:opacity-90 transition-opacity">
                          {[...Array(15)].map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-slate-200 group-hover:bg-[#2563eb]/20 rounded-xs"
                              style={{
                                height: `${Math.max(15, (Math.sin(i * 0.4 + mod.moduleNo) + 1.1) * 45)}%`,
                                transition: 'height 0.3s ease, background-color 0.2s ease'
                              }}
                            />
                          ))}
                        </div>

                        {/* Custom Coverage Progress bar */}
                        <div>
                          <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-mono">
                            <span>Sector coverage</span>
                            <span className="text-slate-700">{coverageVal}%</span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#2563eb] to-[#16a34a] rounded-full transition-all duration-500"
                              style={{ width: `${coverageVal}%` }}
                            />
                          </div>
                        </div>

                        {/* Core details footer */}
                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {mod.hours || 3}h VOL</span>
                          <span className="text-[#2563eb] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                            Engage <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {modules.length === 0 && (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-400 font-mono text-xs">
              NO OPERATIONS SECTORS INSTANTIATED.
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
              <span className="text-[10px] text-slate-400 font-mono">// READ-ONLY STREAM</span>
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
                  funcName = "study" + shortWords.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
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
  const renderModulePreview = (moduleNo: number, title: string) => {
    const normalizedTitle = title.toLowerCase();

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
          <circle cx="165" cy="15" r="3" fill="#10B981" className="animate-ping" />
          <motion.circle
            cx="165" cy="15" r="3" fill="#10B981"
            variants={{
              rest: { scale: 1 },
              hover: { scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 1.2 } }
            }}
          />
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

            {/* Abstract node networks */}
            <g opacity="0.04">
              <circle cx="78%" cy="260" r="4.5" fill="currentColor" />
              <circle cx="84%" cy="320" r="4.5" fill="currentColor" />
              <circle cx="75%" cy="360" r="4.5" fill="currentColor" />
              <line x1="78%" y1="260" x2="84%" y2="320" stroke="currentColor" strokeWidth="1" />
              <line x1="84%" y1="320" x2="75%" y2="360" stroke="currentColor" strokeWidth="1" />
            </g>

            {/* Technical text canvas indicators */}
            <text x="35" y="45" fill="currentColor" opacity="0.04" fontSize="9" fontFamily="monospace">GRID_SCALE: 24PX</text>
            <text x="83%" y="90" fill="currentColor" opacity="0.04" fontSize="9" fontFamily="monospace">CANVAS // 1024X768</text>
          </svg>

          {/* Glowing colorful auras for design depth */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#7C3AED]/5 to-[#3B82F6]/5 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#10B981]/5 to-[#F59E0B]/5 rounded-full blur-3xl opacity-40 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-5xl space-y-6 relative z-10">

        {/* Back button */}
        <div className="mb-4 flex justify-between items-center">
          <Link href={`/student/subjects/subject?subjectId=${subjectId}`}>
            <motion.div
              whileHover={isPremiumTheme ? { x: -3 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button className={`font-black uppercase tracking-wider ${isPremiumTheme
                ? "bg-white hover:bg-slate-50 border border-slate-200/80 text-[#7C3AED] shadow-sm rounded-xl px-5 py-4 font-bold"
                : t.btnPrimary
                }`}>
                ← Figma Dashboard
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Section Header Card */}
        <Card className={`${isPremiumTheme
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
                <Badge className={`text-xs px-2.5 py-1 ${isPremiumTheme
                  ? "bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 border-none font-bold rounded-lg"
                  : t.badge
                  }`}>
                  CANVAS: LAYOUT
                </Badge>
                <span className="font-mono text-xs font-bold text-zinc-400">// COMPONENT_SYSTEM</span>
              </div>
              <CardTitle className={`text-3xl md:text-4xl ${isPremiumTheme ? 'text-slate-800 font-semibold tracking-tight' : t.textHeading} flex items-center gap-3`}>
                {isPremiumTheme ? <Layers className="w-8 h-8 text-[#7C3AED]" /> : <BookOpen className="w-8 h-8" />} Component Inspector
              </CardTitle>
              <CardDescription className={`${isPremiumTheme ? 'text-slate-500 font-medium' : t.textMuted} mt-2 text-base`}>
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
                      hover: { y: -8, scale: 1.012 }
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="h-full"
                  >
                    <DesignStudioCard isPremium={isPremiumTheme} className={`h-full ${isPremiumTheme
                      ? 'bg-gradient-to-br from-white/98 via-white/95 to-[#7C3AED]/10 hover:from-[#8B5CF6] hover:via-[#8B5CF6] hover:to-[#8B5CF6] backdrop-blur-md border border-slate-200/80 group-hover:border-[#7C3AED] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] rounded-[22px]'
                      : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass + ' flex flex-col justify-between'
                      } brutalist-transition overflow-hidden group`}>
                      <CardHeader className={isPremiumTheme ? "p-3 md:p-4 pb-1.5 md:pb-2 relative z-10" : "pb-3 relative z-10"}>
                        <div className="flex justify-between items-start mb-2">
                          <motion.span
                            variants={{
                              rest: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
                              hover: { y: -2, boxShadow: "0 4px 12px rgba(124, 58, 237, 0.08)" }
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className={`text-xs px-2.5 py-1 transition-all duration-300 ${isPremiumTheme
                              ? "bg-slate-100 text-slate-600 border-none font-bold rounded-md group-hover:bg-white group-hover:text-[#8B5CF6]"
                              : t.badge
                              }`}
                          >
                            Frame 0{mod.moduleNo}
                          </motion.span>
                        </div>
                        {isPremiumTheme && (
                          <div className="w-full h-24 bg-white border border-slate-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden pointer-events-none">
                            <motion.div
                              variants={{ hover: { x: 6, y: -4 } }}
                              className="w-full h-full"
                            >
                              {renderModulePreview(mod.moduleNo, mod.title)}
                            </motion.div>
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                              backgroundImage: `linear-gradient(to right, #7C3AED 1px, transparent 1px), linear-gradient(to bottom, #7C3AED 1px, transparent 1px)`,
                              backgroundSize: '8px 8px'
                            }} />
                          </div>
                        )}
                        <CardTitle className={`text-lg transition-colors duration-300 line-clamp-2 ${isPremiumTheme
                          ? 'font-semibold font-sans tracking-tight text-slate-800 group-hover:text-white'
                          : t.titleHover + ' font-black leading-tight'
                          }`}>
                          {mod.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={isPremiumTheme ? "p-3 md:p-4 pt-0 relative z-10" : "flex-1 flex flex-col justify-between"}>
                        <p className={`text-xs leading-relaxed line-clamp-3 mb-4 transition-colors duration-300 ${isPremiumTheme ? 'text-slate-500 font-medium font-sans group-hover:text-white/85' : 'text-zinc-700 font-bold'
                          }`}>
                          {mod.co || "Inspect component spacing, flex grids, nested outline boxes, and micro-interactions guidelines."}
                        </p>

                        <div className={`pt-3 flex justify-between items-center text-xs font-bold transition-all duration-300 ${isPremiumTheme ? 'border-t border-slate-100 text-slate-400 font-sans group-hover:text-white/85 group-hover:border-white/20' : 'border-t-2 border-black text-zinc-500'
                          }`}>
                          <div className="flex gap-3">
                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {mod.hours || 3} Hours</span>
                            <span className="flex items-center"><Book className="w-3.5 h-3.5 mr-1" /> {mod.subtopics?.length || 0} Units</span>
                          </div>
                          {isPremiumTheme && (
                            <motion.span
                              variants={{ hover: { x: 8 } }}
                              className="text-[#7C3AED] group-hover:text-white flex items-center transition-colors duration-300"
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
