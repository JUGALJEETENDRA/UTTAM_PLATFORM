"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectResourceCard } from "@/components/cards/SubjectResourceCard";
import { 
  TrendingUp, TrendingDown, Layers, Target, Zap, Brain, FileText, 
  ArrowRight, Clock, Book, ExternalLink, Globe, Activity, ShieldAlert, Send, BookOpen
} from "lucide-react";

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

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState<number | null>(0);
  const [tickerX, setTickerX] = useState(0);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: "Executive Strategy Portal active. Quarterly targets prioritize Module 1 operational scalability. Proceed?" }
  ]);

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

  // Live horizontal trading ticker animation loop for Digital Business
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerX((prev) => (prev <= -1000 ? 0 : prev - 0.75));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E2E8F0] flex flex-col justify-center items-center font-mono text-zinc-800 space-y-4">
        <div className="w-12 h-12 border-4 border-t-[#6366F1] border-zinc-300 rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase font-bold animate-pulse">Establishing Terminal Baseline...</p>
      </div>
    );
  }

  if (!data || !data.subject) {
    return (
      <div className="p-8 text-center text-[#F43F5E] font-bold border-4 border-[#F43F5E] bg-white max-w-xl mx-auto mt-20">
        CRITICAL FAILURE: INSTANCE CONNECT PATHWAY TERMINATED.
      </div>
    );
  }

  const { subject, modules, quizzesWithAttempts, flashcardDecks, mindmaps = [], subjectResources } = data;
  const activeModule = modules[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setAiInput("");

    setTimeout(() => {
      setAiMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Analyzing parameters for "${userMsg}". Recommended strategic vector: Maximize output structures across target key result zones.` 
      }]);
    }, 800);
  };

  // Identify theme variants safely using lowercase checks
  const subjectNameLower = subject?.name?.toLowerCase() || "";
  const isDigitalBusiness = subjectNameLower.includes("digital business");
  const isUiProgramming = subjectNameLower.includes("ui programming");

  // ==========================================
  // RENDER VARIANT A: DIGITAL BUSINESS & TRANSFORMATION
  // ==========================================
  if (isDigitalBusiness) {
    return (
      <div className="min-h-screen bg-[#E2E8F0] text-zinc-900 pb-20 relative overflow-hidden font-sans antialiased selection:bg-[#6366F1]/30 selection:text-black">
        {/* Background Micro-Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25]" style={{
          backgroundImage: `linear-gradient(to right, #94A3B8 1px, transparent 1px), linear-gradient(to bottom, #94A3B8 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }} />
        
        {/* LIVE MARKET TICKER */}
        <div className="w-full bg-[#1E293B] text-[#FAFAFA] text-xs font-mono py-2.5 border-b border-black/40 overflow-hidden relative z-50 flex shadow-inner">
          <div className="bg-[#6366F1] px-3 font-bold uppercase tracking-wider absolute left-0 top-0 bottom-0 flex items-center z-50 shadow-md">
            LIVE INDEX
          </div>
          <div className="flex whitespace-nowrap space-x-12 pl-36 shadow-inner" style={{ transform: `translateX(${tickerX}px)` }}>
            <span className="flex items-center gap-1.5">XP_EARNED: <span className="text-[#10B981] font-bold">+{(modules.length * 1250).toLocaleString()}</span> <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" /></span>
            <span className="flex items-center gap-1.5">CORP_STREAK: <span className="text-[#10B981] font-bold">14 DAYS</span></span>
            <span className="flex items-center gap-1.5">COMP_INDEX: <span className="text-[#6366F1] font-bold">88.4%</span></span>
            <span className="flex items-center gap-1.5">MKT_SHARE: <span className="text-[#10B981] font-bold">▲ 24.2%</span></span>
            <span className="flex items-center gap-1.5">RISK_RATIO: <span className="text-[#F43F5E] font-bold">▼ 0.04%</span> <TrendingDown className="w-3.5 h-3.5 text-[#F43F5E]" /></span>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-6 relative z-10">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-[#FAFAFA]/90 backdrop-blur-md p-6 border-2 border-slate-300 shadow-sm rounded-none">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-xs uppercase font-mono tracking-widest text-slate-500 font-bold">Enterprise Operation Portal</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mt-1">
                {subject.name} <span className="text-[#6366F1] font-light">| Command Center</span>
              </h1>
            </div>
            <div className="bg-slate-200/80 p-1 rounded-none border border-slate-300 flex items-center font-mono text-xs font-bold text-slate-700">
              <span className="px-3 py-1 bg-white shadow-sm border border-slate-300/60">SYSTEM: OPERATIONAL</span>
            </div>
          </div>

          {/* KPI METRIC BAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#FAFAFA] border-2 border-slate-300 p-5 relative shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-slate-500">Business Growth Index</span>
                <span className="text-xs font-mono font-black text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 flex items-center gap-0.5">+12.4% <TrendingUp className="w-3 h-3" /></span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">94.82 <span className="text-sm font-normal text-slate-400 font-mono">PTS</span></div>
              <div className="h-8 mt-4 w-full opacity-80">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,15 L15,13 L30,17 L45,8 L60,11 L75,3 L90,6 L100,2" fill="none" stroke="#10B981" strokeWidth="2.5" /></svg>
              </div>
            </div>

            <div className="bg-[#FAFAFA] border-2 border-slate-300 p-5 relative shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-slate-500">Learning Velocity</span>
                <span className="text-xs font-mono font-black text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 flex items-center gap-0.5">OPTIMAL <Activity className="w-3 h-3" /></span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">4.8 <span className="text-sm font-normal text-slate-400 font-mono">HRS / WK</span></div>
              <div className="h-8 mt-4 w-full opacity-80">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 L20,12 L40,8 L60,14 L80,5 L100,2" fill="none" stroke="#6366F1" strokeWidth="2.5" /></svg>
              </div>
            </div>

            <div className="bg-[#FAFAFA] border-2 border-slate-300 p-5 relative shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-slate-500">Knowledge Capital</span>
                <span className="text-xs font-mono font-black text-[#10B981] bg-[#10B981]/10 px-2 py-0.5">LIQUID</span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">{(modules.length * 400).toLocaleString()} <span className="text-sm font-normal text-slate-400 font-mono">XP</span></div>
              <div className="h-1.5 bg-slate-200 mt-6 w-full rounded-none overflow-hidden">
                <div className="h-full bg-[#10B981]" style={{ width: "74%" }} />
              </div>
            </div>

            <div className="bg-[#FAFAFA] border-2 border-slate-300 p-5 relative shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-slate-500">Risk Assessment</span>
                <span className="text-xs font-mono font-black text-[#F43F5E] bg-[#F43F5E]/10 px-2 py-0.5 flex items-center gap-0.5">MINIMAL <ShieldAlert className="w-3 h-3" /></span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">0.02% <span className="text-sm font-normal text-slate-400 font-mono">DEG</span></div>
              <div className="h-1.5 bg-slate-200 mt-6 w-full rounded-none overflow-hidden">
                <div className="h-full bg-[#F43F5E]" style={{ width: "2%" }} />
              </div>
            </div>
          </div>

          {/* TWO COLUMN MATRIX CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT & CENTER COLUMN ACTIONS */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* WORKFLOW ROADMAP PATH */}
              <div className="bg-[#FAFAFA] border-2 border-slate-300 p-6 shadow-sm">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-[#6366F1]" /> Startup Growth Journey & Corporate Architecture Map
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  {modules.slice(0, 4).map((mod: any, index: number) => {
                    const isActive = activeNode === index;
                    return (
                      <div key={mod.id} className="relative">
                        <button onClick={() => setActiveNode(index)} className={`w-full p-4 text-left border-2 transition-all rounded-none ${isActive ? "bg-[#1E293B] border-black text-white shadow-[4px_4px_0px_0px_#6366F1]" : "bg-white border-slate-300 text-slate-800"}`}>
                          <div className="font-mono text-xs font-bold opacity-60 mb-1">STAGE 0{index + 1}</div>
                          <div className="font-black text-sm uppercase tracking-tight line-clamp-1">{mod.title}</div>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <AnimatePresence mode="wait">
                  {activeNode !== null && modules[activeNode] && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 p-4 bg-slate-100/80 border border-slate-300 font-mono text-xs flex justify-between items-center">
                      <div>
                        <span className="text-[#6366F1] font-black uppercase tracking-wider block">🏢 Framework Objective:</span>
                        <p className="text-slate-800 font-bold font-sans text-sm">{modules[activeNode].title}</p>
                      </div>
                      <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${modules[activeNode].id}`}>
                        <Button className="bg-[#1E293B] text-white text-xs font-mono rounded-none">Access Nodes →</Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MODULES AS ANALYTICS WIDGETS */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">🏢 Enterprise Operational Modules</h2>
                  <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
                    <Button variant="ghost" className="text-xs font-mono font-black uppercase tracking-wider text-[#6366F1]">View Ledger →</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.slice(0, 4).map((mod: any) => (
                    <Link key={mod.id} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                      <div className="bg-[#FAFAFA] border-2 border-slate-300 p-5 shadow-sm hover:border-slate-900 transition-all flex flex-col justify-between h-full">
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight line-clamp-2">{mod.title}</h3>
                        <div className="mt-6 pt-3 border-t border-slate-200 flex justify-between font-mono text-xs text-slate-500">
                          <span>{mod.hours || "3h"} ALLOC</span>
                          <span className="bg-slate-200 text-slate-700 px-2">{mod.subtopics?.length || 0} UNITS</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ASSESSMENT TESTING STRATEGY (QUIZZES) */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#F43F5E]" /> Risk Testing Quadrants
                  </h2>
                  <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                    <Button variant="ghost" className="text-xs font-mono font-black uppercase text-[#6366F1]">Full Audit →</Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {quizzesWithAttempts.map((quiz: any) => (
                    <div key={quiz.id} className="bg-[#FAFAFA] border-2 border-slate-300 p-4 flex justify-between items-center font-mono text-xs">
                      <div>
                        <div className="font-sans font-black text-sm text-slate-900">{quiz.title}</div>
                        <div className="text-slate-500 mt-1">{quiz.timeLimit || 30} MIN LIMIT | {quiz.totalMarks || 100} MARKS EXPECTED</div>
                      </div>
                      <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`}>
                        <Button className="bg-[#F43F5E] hover:bg-[#F43F5E]/90 text-white font-mono rounded-none tracking-wider uppercase px-4 text-xs">
                          Launch Test
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {quizzesWithAttempts.length === 0 && (
                    <div className="p-4 border border-dashed border-slate-300 text-center text-slate-400 font-mono text-xs">No metrics endpoints active.</div>
                  )}
                </div>
              </div>

              {/* FLASHCARDS SECTION */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> Retention Flashcard Decks
                  </h2>
                  <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                    <Button variant="ghost" className="text-xs font-mono font-black uppercase text-[#6366F1]">All Decks →</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flashcardDecks.map((deck: any) => (
                    <Link key={deck.id} href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`}>
                      <div className="bg-[#FAFAFA] border-2 border-slate-300 p-4 shadow-sm hover:border-slate-900 transition-all flex justify-between items-center">
                        <span className="font-black text-slate-900 uppercase tracking-tight line-clamp-1">{deck.title}</span>
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-mono px-2 font-bold whitespace-nowrap">{deck.cards?.length || 0} CARDS</span>
                      </div>
                    </Link>
                  ))}
                  {flashcardDecks.length === 0 && (
                    <div className="col-span-2 p-4 border border-dashed border-slate-300 text-center text-slate-400 font-mono text-xs">No active decks registered.</div>
                  )}
                </div>
              </div>

              {/* MIND MAPS ARCHITECTURE SECTION */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#6366F1]" /> Interactive Visual Mind Maps
                  </h2>
                  <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                    <Button variant="ghost" className="text-xs font-mono font-black uppercase text-[#6366F1]">All Diagrams →</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mindmaps.map((map: any) => (
                    <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`}>
                      <div className="bg-[#FAFAFA] border-2 border-slate-300 p-4 shadow-sm hover:border-slate-900 transition-all flex justify-between items-center font-mono text-xs">
                        <span className="font-sans font-black text-slate-900 uppercase line-clamp-1">{map.title}</span>
                        <span className="text-[#6366F1] font-bold flex items-center gap-1">GRAPH <ExternalLink className="w-3 h-3" /></span>
                      </div>
                    </Link>
                  ))}
                  {mindmaps.length === 0 && (
                    <div className="col-span-2 p-4 border border-dashed border-slate-300 text-center text-slate-400 font-mono text-xs">No map schemas projected.</div>
                  )}
                </div>
              </div>

            </div>

            {/* SIDEBAR DASHBOARD SYSTEM ASSETS */}
            <div className="space-y-6">
              
              {/* AI STRATEGY PILOT */}
              <div className="bg-[#1E293B] text-slate-100 p-5 border-2 border-black flex flex-col justify-between h-[340px] relative shadow-md">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
                    <span className="text-xs font-mono font-black text-[#10B981]">Executive AI Copilot</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">V2.4</span>
                  </div>
                  <div className="h-[180px] overflow-y-auto space-y-3 text-xs font-mono pr-1">
                    {aiMessages.map((msg, idx) => (
                      <div key={idx} className={`p-2 ${msg.role === 'assistant' ? 'bg-slate-800 text-slate-200 border-l-2 border-[#10B981]' : 'bg-slate-700 text-white text-right'}`}>
                        <p className="font-sans text-[11px] font-medium leading-normal">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                  <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Query strategic metrics..." className="bg-slate-900 text-xs px-3 py-2 flex-1 text-white border border-slate-700 outline-none" />
                  <button type="submit" className="bg-[#10B981] text-black px-3 py-2"><Send className="w-3.5 h-3.5" /></button>
                </form>
              </div>

              {/* TARGET RADIAL DIAGRAMS */}
              <div className="bg-[#FAFAFA] border-2 border-slate-300 p-5 shadow-sm font-mono text-xs">
                <h4 className="font-black uppercase tracking-tight text-slate-900 text-sm mb-4">📊 Operational Vectors</h4>
                <div className="flex justify-around items-center py-2">
                  <div className="relative w-16 h-16 flex items-center justify-center border-4 border-[#6366F1] rounded-full font-sans font-black text-sm">85%</div>
                  <div className="relative w-16 h-16 flex items-center justify-center border-4 border-[#10B981] rounded-full font-sans font-black text-sm">62%</div>
                </div>
              </div>

              {/* DOSSIERS & MATERIALS REFERENCE */}
              <Card className="border-2 border-slate-300 bg-[#FAFAFA] rounded-none shadow-sm">
                <CardHeader className="pb-4 border-b-2 border-slate-200">
                  <CardTitle className="text-sm font-black uppercase flex items-center text-slate-900">
                    <FileText className="w-4 h-4 mr-2 text-[#6366F1]" /> Reference Material Dossiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {subjectResources.map((resource: any, idx: number) => (
                    <div key={idx} className="bg-white border p-1"><SubjectResourceCard title={resource.title} type={resource.type} link={resource.link} /></div>
                  ))}
                  {subjectResources.length === 0 && (
                    <p className="text-xs font-mono text-slate-400 text-center py-2">No files currently logged.</p>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VARIANT B: UI PROGRAMMING & DEFAULT FALLBACK LOOK (NEUBRUTALISM STYLE)
  // ==========================================
  const themeKey = isUiProgramming ? "ui programming" : (subjectNameLower.includes("python") ? "python programming" : "");
  const t = THEME_MAP[themeKey] || DEFAULT_THEME;

  return (
    <div className={`min-h-screen ${t.bg} ${t.pattern} pb-16 pt-8 brutalist-transition transition-colors duration-300`}>
      
      {/* Structural Embedded CSS Overrides */}
      <style jsx global>{`
        .brutalist-transition {
          transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ui-blueprint-grid {
          background-size: 30px 30px;
          background-image: linear-gradient(to right, rgba(168, 85, 247, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(168, 85, 247, 0.05) 1px, transparent 1px);
        }
        .python-matrix-terminal {
          background-size: 40px 40px;
          background-image: linear-gradient(to bottom, rgba(55, 118, 171, 0.03) 50%, rgba(0, 0, 0, 0) 50%), 
                            linear-gradient(to right, rgba(255, 212, 59, 0.02) 1px, transparent 1px);
        }
        /* Style fixes for the Python Dark Mode Variant */
        .python-matrix-terminal .text-zinc-900,
        .python-matrix-terminal .text-zinc-800,
        .python-matrix-terminal h2,
        .python-matrix-terminal h3 { color: #ffffff !important; }
        .python-matrix-terminal .text-zinc-500,
        .python-matrix-terminal p { color: #a1a1aa !important; }
        .python-matrix-terminal span { color: #e4e4e7 !important; }
      `}</style>

      <div className="container mx-auto px-4">
        {/* Welcome & Top Stats Banner Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className={`${t.borderClass} ${t.cardBg} ${t.shadowClass} brutalist-transition lg:col-span-2 overflow-hidden relative`}>
            {/* Visual dynamic structural colored bar decoration */}
            <div className={`absolute top-0 left-0 right-0 h-4 ${t.btnPrimary.split(" ")[0] || "bg-black"} border-b-4 border-black`} />
            <CardHeader className="pt-8 pb-6 relative z-10">
              <div>
                <CardTitle className={`text-3xl md:text-4xl ${t.textHeading}`}>
                  Welcome to {subject.name}
                </CardTitle>
                <CardDescription className={`${t.textMuted} mt-2 text-base`}>
                  {subject.description || "Explore modules, quizzes, and resources."}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          {/* Quick Resume Card */}
          <Card className={`${t.borderClass} ${t.cardBg} ${t.shadowClass} brutalist-transition`}>
            <CardHeader>
              <CardTitle className={`text-lg flex items-center font-black uppercase ${t.textHeading.split(" ")[0]}`}>
                <BookOpen className="w-5 h-5 mr-2" /> Active Module
              </CardTitle>
              <CardDescription className={t.textMuted}>Start learning now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeModule ? (
                <>
                  <div>
                    <div className={`flex justify-between text-sm mb-1.5 font-bold ${t.textHeading.split(" ")[0]}`}>
                      <span>{activeModule.title}</span>
                    </div>
                  </div>
                  <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${activeModule.id}`}>
                    <Button className={`w-full mt-2 font-black uppercase tracking-wider ${t.btnPrimary}`}>
                      Start Module <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="py-6 text-center text-zinc-400 font-bold text-sm">
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
                  <h2 className={`text-2xl ${t.textHeading} flex items-center`}>
                    <Layers className="w-6 h-6 mr-2" /> Learning Modules
                  </h2>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Explore all the topics for this subject</p>
                </div>
                <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
                  <Button variant="ghost" className={`${t.btnGhost}`}>
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.slice(0, 4).map((mod: any) => (
                  <Link key={mod.id} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                    <Card className={`${t.borderClass} ${t.cardBg} ${t.shadowClass} brutalist-transition h-full group`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs px-2.5 py-1 ${t.badge}`}>
                            Module {mod.moduleNo}
                          </span>
                        </div>
                        <CardTitle className={`text-lg font-black leading-tight transition-colors line-clamp-2 ${t.titleHover}`}>
                          {mod.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-zinc-500">
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {mod.hours || "2h"}</span>
                          <span className="flex items-center"><Book className="w-3.5 h-3.5 mr-1" /> {mod.subtopics?.length || 0} Subtopics</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {modules.length === 0 && (
                  <div className={`col-span-full py-8 text-center font-bold ${t.borderClass} ${t.cardBg} border-dashed`}>
                    No modules available yet.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Available Quizzes */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className={`text-2xl ${t.textHeading} flex items-center`}>
                    <Target className="w-6 h-6 mr-2" /> Quizzes & Assessments
                  </h2>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Test your knowledge</p>
                </div>
                <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                  <Button variant="ghost" className={`${t.btnGhost}`}>
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {quizzesWithAttempts.slice(0, 3).map((quiz: any) => (
                  <Card key={quiz.id} className={`${t.borderClass} ${t.cardBg} ${t.shadowClass} brutalist-transition overflow-hidden group`}>
                    <div className="flex flex-col sm:flex-row">
                      <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs px-2 py-0.5 ${t.badge}`}>
                            Module {quiz.module?.moduleNo || "?"}
                          </span>
                        </div>
                        <h3 className={`text-lg font-black mb-2 transition-colors ${t.titleHover}`}>{quiz.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-zinc-500 font-bold">
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {quiz.timeLimit || 30} mins</span>
                          <span className="flex items-center"><Target className="w-4 h-4 mr-1" /> {quiz.totalMarks || 100} Marks</span>
                        </div>
                      </div>
                      <div className={`p-5 flex flex-col justify-center items-center border-t sm:border-t-0 sm:border-l-4 border-black ${themeKey === 'python programming' ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                        <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="w-full">
                          <Button className={`w-full font-black uppercase tracking-wider ${t.btnPrimary}`}>Start Quiz</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
                {quizzesWithAttempts.length === 0 && (
                  <div className={`py-8 text-center font-bold ${t.borderClass} ${t.cardBg} border-dashed`}>
                    No quizzes assigned yet.
                  </div>
                )}
              </div>
            </div>
            
            {/* 3. Flashcard Decks */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className={`text-2xl ${t.textHeading} flex items-center`}>
                    <Zap className="w-6 h-6 mr-2" /> Flashcard Decks
                  </h2>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Quick revision decks</p>
                </div>
                <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                  <Button variant="ghost" className={`${t.btnGhost}`}>
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashcardDecks.slice(0, 4).map((deck: any) => (
                  <Link key={deck.id} href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`}>
                    <Card className={`${t.borderClass} ${t.cardBg} ${t.shadowClass} brutalist-transition h-full group`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs px-2 py-0.5 ${t.badge}`}>
                            Module {deck.module?.moduleNo || "?"}
                          </span>
                        </div>
                        <CardTitle className={`text-lg font-black leading-tight transition-colors ${t.titleHover}`}>
                          {deck.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-zinc-500 font-bold">
                          <Layers className="w-4 h-4 mr-1.5" /> {deck.cards?.length || 0} Cards
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {flashcardDecks.length === 0 && (
                  <div className={`col-span-full py-8 text-center font-bold ${t.borderClass} ${t.cardBg} border-dashed`}>
                    No flashcard decks available yet.
                  </div>
                )}
              </div>
            </div>

            {/* 4. Mind Maps */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className={`text-2xl ${t.textHeading} flex items-center`}>
                    <Brain className="w-6 h-6 mr-2" /> Interactive Mind Maps
                  </h2>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Explore visual topic structures</p>
                </div>
                <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                  <Button variant="ghost" className={`${t.btnGhost}`}>
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mindmaps.slice(0, 4).map((map: any) => (
                  <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`}>
                    <Card className={`${t.borderClass} ${t.cardBg} ${t.shadowClass} brutalist-transition h-full group`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs px-2 py-0.5 ${t.badge}`}>
                            Mind Map
                          </span>
                        </div>
                        <CardTitle className={`text-lg font-black leading-tight transition-colors ${t.titleHover}`}>
                          {map.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-zinc-500 font-bold">
                          <ExternalLink className="w-4 h-4 mr-1.5" /> Interactive View
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {mindmaps.length === 0 && (
                  <div className={`col-span-full py-8 text-center font-bold ${t.borderClass} ${t.cardBg} border-dashed`}>
                    No mind maps available yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Resources */}
            <Card className={`${t.borderClass} ${t.cardBg} ${t.shadowClass} brutalist-transition`}>
              <CardHeader className="pb-4 border-b-4 border-black">
                <CardTitle className={`text-lg flex items-center ${t.textHeading}`}>
                  <FileText className="w-5 h-5 mr-2" /> Reference Materials
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {subjectResources.map((resource: any, index: number) => (
                   <div key={index} className="brutalist-resource-item">
                     <SubjectResourceCard 
                       title={resource.title}
                       type={resource.type}
                       link={resource.link}
                     />
                   </div>
                ))}
                {subjectResources.length === 0 && (
                  <p className="text-sm font-bold text-zinc-500 text-center py-2">No resources provided yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}