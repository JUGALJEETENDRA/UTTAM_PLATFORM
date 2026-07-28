"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Play, Headphones, BookOpen, Layers, Target, Brain, Image as ImageIcon, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";


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
    btnGhost: "text-slate-555 hover:text-blue-650 font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
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

function getThemeHelper(subjectId: string | null) {
  if (!subjectId) return DEFAULT_THEME;
  if (subjectId === 'id_mn573l5e5') return THEME_MAP["ui programming"];
  if (subjectId === 'id_hdzqxse2n') return THEME_MAP["python programming"];
  if (subjectId === 'id_pryay1ykw') return THEME_MAP["digital business"];
  // Fallback / Startup engineering check
  return THEME_MAP["startup engineering"] || DEFAULT_THEME;
}

export const ICONS: Record<string, React.ComponentType<any>> = {
  videos: Play,
  audio: Headphones,
  notes: BookOpen,
  pdfs: FileText,
  flashcards: Layers,
  quizzes: Target,
  mindmaps: Brain,
  infographics: ImageIcon,
  simulations: Gamepad2,
};

export const RESOURCE_LABELS: Record<string, string> = {
  videos: "Video Library",
  audio: "Audio Library",
  notes: "Notes Library",
  pdfs: "PDF Library",
  flashcards: "Flashcard Library",
  quizzes: "Quiz Library",
  mindmaps: "Mind Map Library",
  infographics: "Infographic Library",
  simulations: "Simulation Library",
};

interface BreadcrumbProps {
  subjectId: string;
  subjectName?: string;
  resourceType: string;
}

export function ViewerBreadcrumbs({ subjectId, subjectName = "Subject", resourceType }: BreadcrumbProps) {
  const searchParams = useSearchParams();
  const urlSubjectId = subjectId || searchParams.get("subjectId") || "";
  const t = getThemeHelper(urlSubjectId);
  const isPythonProgramming = urlSubjectId === 'id_hdzqxse2n';
  const Icon = ICONS[resourceType] || FileText;
  const libraryLabel = RESOURCE_LABELS[resourceType] || "Resource Library";

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm font-medium text-stone-500 mb-6 ${isPythonProgramming ? 'font-mono' : 'font-sans'}`}>
      <Link href={`/student/subjects/subject?subjectId=${urlSubjectId}`} className={`hover:underline flex items-center gap-1 ${t.titleHover}`}>
        <ArrowLeft className="w-4 h-4" />
        <span>{subjectName}</span>
      </Link>
      <span className="text-stone-300">/</span>
      <Link href={`/student/subjects/subject/${resourceType === 'videos' ? 'videos' : resourceType === 'audio' ? 'audio' : resourceType === 'notes' ? 'notes' : resourceType === 'pdfs' ? 'pdfs' : resourceType}?subjectId=${urlSubjectId}`} className={`hover:underline flex items-center gap-1.5 ${t.titleHover}`}>
        <Icon className="w-4 h-4" />
        <span>{libraryLabel}</span>
      </Link>
      <span className="text-stone-300">/</span>
      <span className={`font-semibold ${isPythonProgramming ? 'text-[#3776AB]' : 'text-stone-900'}`}>Viewer</span>
    </div>
  );
}

interface ViewerHeaderProps {
  title: string;
  moduleName?: string;
  topicName?: string;
  duration?: string;
}

export function ViewerHeader({ title, moduleName, topicName, duration }: ViewerHeaderProps) {
  const searchParams = useSearchParams();
  const urlSubjectId = searchParams.get("subjectId") || "";
  const t = getThemeHelper(urlSubjectId);
  const isUiProgramming = urlSubjectId === 'id_mn573l5e5';
  const isPythonProgramming = urlSubjectId === 'id_hdzqxse2n';

  return (
    <div className="mb-8">
      <h1 className={`text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-tight mb-4 ${isPythonProgramming ? 'font-mono text-[#3776AB]' : 'font-sans'}`}>
        {title}
      </h1>
      <div className={`flex flex-wrap items-center gap-4 text-sm font-medium text-stone-600 ${isPythonProgramming ? 'font-mono' : 'font-sans'}`}>
        {moduleName && (
          <span className={isUiProgramming ? "bg-slate-100 px-3 py-1 text-zinc-900 border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] font-bold text-xs" : isPythonProgramming ? "bg-slate-100 border border-slate-200 text-[#3776AB] px-3 py-1 font-mono rounded text-xs" : "bg-stone-200/50 px-3 py-1 rounded-full text-stone-850 border border-stone-200 text-xs"}>
            {moduleName}
          </span>
        )}
        {topicName && (
          <span className="flex items-center gap-1.5 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${isUiProgramming ? 'bg-black' : isPythonProgramming ? 'bg-[#3776AB]' : 'bg-stone-400'}`} />
            {topicName}
          </span>
        )}
        {duration && (
          <span className="flex items-center gap-1.5 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${isUiProgramming ? 'bg-black' : isPythonProgramming ? 'bg-[#3776AB]' : 'bg-stone-400'}`} />
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}

interface PrevNextProps {
  prev?: { url: string; title: string } | null;
  next?: { url: string; title: string } | null;
}

export function ViewerPreviousNext({ prev, next }: PrevNextProps) {
  if (!prev && !next) return null;
  const searchParams = useSearchParams();
  const urlSubjectId = searchParams.get("subjectId") || "";
  const t = getThemeHelper(urlSubjectId);
  const isUiProgramming = urlSubjectId === 'id_mn573l5e5';
  const isPythonProgramming = urlSubjectId === 'id_hdzqxse2n';

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t ${isUiProgramming ? 'border-black' : 'border-stone-200'}`}>
      {prev ? (
        <Link href={prev.url} className="w-full sm:w-auto group">
          <button className={`w-full sm:w-auto justify-start h-auto py-3 px-4 flex flex-col items-start gap-1 text-left transition-all cursor-pointer ${
            isUiProgramming
              ? 'bg-white hover:bg-slate-50 border-2 border-black text-black font-extrabold uppercase shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] rounded-none'
              : isPythonProgramming
                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-[#3776AB] rounded font-mono shadow-xs'
                : 'bg-stone-55 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-xl shadow-xs'
          }`}>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </span>
            <span className={`text-sm font-bold truncate max-w-[200px] ${isPythonProgramming ? 'font-mono' : ''}`}>
              {prev.title}
            </span>
          </button>
        </Link>
      ) : <div className="hidden sm:block flex-1" />}
      
      {next ? (
        <Link href={next.url} className="w-full sm:w-auto group sm:text-right">
          <button className={`w-full sm:w-auto justify-end sm:items-end h-auto py-3 px-4 flex flex-col items-start gap-1 text-left sm:text-right transition-all cursor-pointer ${
            isUiProgramming
              ? 'bg-black hover:bg-zinc-900 border-2 border-black text-white font-extrabold uppercase shadow-[2.5px_2.5px_0px_rgba(239,68,68,1)] rounded-none'
              : isPythonProgramming
                ? 'bg-[#3776AB] hover:bg-[#2b5b84] border border-[#3776AB] text-white rounded font-mono shadow-xs'
                : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 rounded-xl shadow-xs'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-full justify-start sm:justify-end ${isUiProgramming ? 'text-[#fbbf24]' : 'text-slate-200'}`}>
              Next <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <span className={`text-sm font-bold truncate max-w-[200px] ${isPythonProgramming ? 'font-mono' : ''}`}>
              {next.title}
            </span>
          </button>
        </Link>
      ) : <div className="hidden sm:block flex-1" />}
    </div>
  );
}

export function ViewerLayout({ children, maxWidth = "max-w-4xl" }: { children: React.ReactNode, maxWidth?: string }) {
  const searchParams = useSearchParams();
  const urlSubjectId = searchParams.get("subjectId") || "";
  const t = getThemeHelper(urlSubjectId);
  const isPythonProgramming = urlSubjectId === 'id_hdzqxse2n';
  
  const viewerThemeClass = urlSubjectId === 'id_mn573l5e5'
    ? 'ui-programming-viewer'
    : urlSubjectId === 'id_hdzqxse2n'
      ? 'python-programming-viewer'
      : urlSubjectId === 'id_pryay1ykw'
        ? 'digital-business-viewer'
        : 'startup-engineering-viewer';

  return (
    <div className={`min-h-screen ${t.bg} ${t.pattern} pb-24 ${viewerThemeClass} ${isPythonProgramming ? 'font-mono' : 'font-sans'}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
        
        .font-jetbrains {
          font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
        }
        .strategy-board-dot {
          background-image: radial-gradient(#e2e8f0 1.2px, transparent 1.2px);
          background-size: 24px 24px;
        }
        
        /* Theme Overrides for Viewer Content Card Elements */
        .ui-programming-viewer div.rounded-2xl,
        .ui-programming-viewer div.rounded-xl,
        .ui-programming-viewer div.border-stone-200 {
          border-width: 2px !important;
          border-color: #000000 !important;
          border-radius: 0px !important;
          box-shadow: 2.5px 2.5px 0px rgba(0,0,0,1) !important;
        }
        .python-programming-viewer div.rounded-2xl,
        .python-programming-viewer div.rounded-xl,
        .python-programming-viewer div.border-stone-200 {
          border-color: #e2e8f0 !important;
          border-radius: 4px !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .digital-business-viewer div.rounded-2xl,
        .digital-business-viewer div.rounded-xl,
        .digital-business-viewer div.border-stone-200 {
          border-color: #e2e8f0 !important;
          border-radius: 12px !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
      `}</style>
      <div className={`container mx-auto px-4 pt-8 md:pt-12 ${maxWidth}`}>
        {children}
      </div>
    </div>
  );
}

interface RelatedResourcesProps {
  resources: { id: string; title: string; type: string; url: string }[];
}

export function ViewerRelatedResources({ resources }: RelatedResourcesProps) {
  if (!resources || resources.length === 0) return null;
  const searchParams = useSearchParams();
  const urlSubjectId = searchParams.get("subjectId") || "";
  const t = getThemeHelper(urlSubjectId);
  const isUiProgramming = urlSubjectId === 'id_mn573l5e5';
  const isPythonProgramming = urlSubjectId === 'id_hdzqxse2n';

  return (
    <div className={`mt-12 pt-8 border-t ${isUiProgramming ? 'border-black border-t-2' : 'border-stone-200'}`}>
      <h3 className={`text-lg font-black uppercase text-black tracking-tight mb-6 ${isPythonProgramming ? 'font-mono text-[#3776AB]' : ''}`}>
        Related Resources
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {resources.map(res => {
          const Icon = ICONS[res.type] || FileText;
          const cardClass = isUiProgramming
            ? "bg-white border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(239,68,68,1)] hover:-translate-y-0.5"
            : isPythonProgramming
              ? "bg-white border border-slate-200 rounded font-mono shadow-xs hover:border-[#3776AB]"
              : "bg-white border border-stone-200 hover:border-stone-300 rounded-xl hover:shadow-xs transition-all";

          return (
            <Link key={res.id} href={res.url} className="group flex items-start gap-3 p-4 transition-all duration-200 cursor-pointer bg-white border border-stone-250 rounded-xl hover:border-stone-400 hover:shadow-sm">
              <div className={`w-8 h-8 flex items-center justify-center shrink-0 transition-colors bg-white ${
                isUiProgramming
                  ? 'border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] rounded-none group-hover:bg-[#EF4444] group-hover:text-white text-[#EF4444]'
                  : isPythonProgramming
                    ? 'border border-slate-200 rounded group-hover:bg-[#3776AB] group-hover:text-white text-[#3776AB]'
                    : 'border border-slate-200 rounded-lg group-hover:bg-blue-600 group-hover:text-white text-blue-600'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-sm font-bold text-stone-850 group-hover:text-blue-600 truncate ${isPythonProgramming ? 'font-mono group-hover:text-[#3776AB]' : ''}`}>
                  {res.title}
                </h4>
                <p className={`text-[10px] font-bold text-stone-500 uppercase tracking-wider mt-1.5 ${isPythonProgramming ? 'font-mono' : ''}`}>
                  {RESOURCE_LABELS[res.type]?.replace(" Library", "") || "Resource"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
