"use client";

import Link from "next/link";
import { ResourceLinkTracker } from "@/components/student/ResourceLinkTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, PlayCircle, FileText, CheckCircle2, Gamepad2, Target, 
  Download, Book, BookOpen, BrainCircuit, CreditCard, Link as LinkIcon, 
  HelpCircle, Layers, Headphones, Lightbulb, Clock, Terminal, Activity, Code, Settings, ChevronRight, MousePointer, ExternalLink, X, Maximize2, Volume2, Play, Pause, Image as ImageIcon
} from "lucide-react";
import { module1Quizzes } from "@/data/module1QuizData";
import { module2Quizzes } from "@/data/module2QuizData";
import { useEffect, useState, useRef } from "react";
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
    bg: "bg-slate-50 text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-sm transition-all duration-200",
    btnPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-550 hover:text-indigo-650 font-sans text-xs hover:bg-slate-55 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-indigo-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg",
    pattern: ""
  },
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
  
  if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
    const match = url.match(/(file|document|presentation|spreadsheets).*?\/d\/([^\/\?]+)/);
    if (match && match[1] && match[2]) {
      const type = match[1];
      const id = match[2];
      const domain = type === 'file' ? 'drive.google.com' : 'docs.google.com';
      return `https://${domain}/${type}/d/${id}/preview`;
    }
    const folderMatch = url.match(/\/folders\/([^\/\?]+)/);
    if (folderMatch && folderMatch[1]) {
      return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`;
    }
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
  }
  
  let embedUrl = url;
  
  if (url.includes("youtube.com/watch")) {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      // ignore
    }
  } else if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts.length > 1) {
      const videoId = parts[1].split(/[?#]/)[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } else if (url.includes("youtube.com/shorts/")) {
    const parts = url.split("youtube.com/shorts/");
    if (parts.length > 1) {
      const videoId = parts[1].split(/[?#]/)[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
  }
  
  // Force playsinline and rel parameters for YouTube embeds to fix mobile browser playback
  if (embedUrl.includes("youtube.com/embed/")) {
    try {
      const urlObj = new URL(embedUrl);
      urlObj.searchParams.set("playsinline", "1");
      urlObj.searchParams.set("rel", "0");
      return urlObj.toString();
    } catch (e) {
      const separator = embedUrl.includes("?") ? "&" : "?";
      return `${embedUrl}${separator}playsinline=1&rel=0`;
    }
  }
  
  return embedUrl;
}

function getParsedNotes(notesUrl: string | null | undefined) {
  if (!notesUrl) return [];
  // Auto-correct common typos
  let cleanUrl = notesUrl.replace(/drive\.https:\/\//g, "https://");
  if (cleanUrl.startsWith("drive.google.com")) cleanUrl = "https://" + cleanUrl;
  
  try {
    const parsed = JSON.parse(cleanUrl);
    if (Array.isArray(parsed)) return parsed.map(p => ({ ...p, url: p.url.replace(/drive\.https:\/\//g, "https://") }));
    return [{ title: "Notes", url: cleanUrl }];
  } catch(e) {
    return [{ title: "Notes", url: cleanUrl }];
  }
}

function getExternalEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  let cleanUrl = url.replace(/drive\.https:\/\//g, "https://");
  if (cleanUrl.startsWith("drive.google.com") || cleanUrl.startsWith("docs.google.com")) {
    cleanUrl = "https://" + cleanUrl;
  }
  
  if (cleanUrl.includes("drive.google.com") || cleanUrl.includes("docs.google.com")) {
    const match = cleanUrl.match(/(file|document|presentation|spreadsheets).*?\/d\/([^\/\?]+)/);
    if (match && match[1] && match[2]) {
      const type = match[1];
      const id = match[2];
      const domain = type === 'file' ? 'drive.google.com' : 'docs.google.com';
      return `https://${domain}/${type}/d/${id}/preview`;
    }
    const folderMatch = cleanUrl.match(/\/folders\/([^\/\?]+)/);
    if (folderMatch && folderMatch[1]) {
      return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`;
    }
    const idMatch = cleanUrl.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
  }
  return cleanUrl;
}

function getGoogleDriveFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("/file/d/")) {
    const match = url.match(/\/file\/d\/([^\/\?]+)/);
    if (match && match[1]) return match[1];
  }
  if (url.includes("id=")) {
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) return match[1];
  }
  return null;
}

const InlineVideoPlayer = ({ url, title, downloadUrl }: { url: string; title: string; downloadUrl?: string }) => {
  if (!url || typeof url !== 'string') return null;

  const lowerUrl = url.toLowerCase();
  const isYouTube = lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be");
  const isDirectVideo = lowerUrl.endsWith(".mp4") || lowerUrl.endsWith(".webm") || lowerUrl.endsWith(".ogg") || lowerUrl.includes(".mp4?") || lowerUrl.includes(".webm?");
  const driveFileId = getGoogleDriveFileId(url);
  const embedUrl = getEmbedUrl(url);

  const driveAppUrl = driveFileId 
    ? `https://drive.google.com/file/d/${driveFileId}/view` 
    : url;

  return (
    <div className="w-full flex flex-col select-none">
      {/* Video Viewport Container - Responsive Aspect Ratio */}
      <div className="w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
        {isYouTube || (!isDirectVideo && embedUrl) ? (
          <iframe
            src={embedUrl || url}
            className="w-full h-full border-0 bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            title={title}
          />
        ) : isDirectVideo ? (
          <video
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-black"
          >
            <source src={url} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={embedUrl || url}
            className="w-full h-full border-0 bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            title={title}
          />
        )}
      </div>


    </div>
  );
};

const InlineAudioPlayer = ({ url, title }: { url: string; title: string }) => {
  if (!url || typeof url !== 'string') return null;
  const isCloudinary = url.includes("cloudinary.com");
  const driveFileId = getGoogleDriveFileId(url);
  const embedUrl = getExternalEmbedUrl(url);
  const viewUrl = driveFileId 
    ? `https://drive.google.com/file/d/${driveFileId}/view` 
    : url;
  
  // Use the standard Google Docs direct download endpoint
  const googleDriveDirectUrl = driveFileId 
    ? `https://docs.google.com/uc?export=download&id=${driveFileId}` 
    : url;

  // Default to native player
  const [useDriveFallback, setUseDriveFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!url) return null;

  // Use the exact url for Cloudinary, or direct for drive files
  const activeAudioSrc = isCloudinary ? url : googleDriveDirectUrl;

  return (
    <div className="w-full bg-white text-slate-800 p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 shrink-0">
          <Headphones className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
            {title || "Audio Lesson"}
          </span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
            isCloudinary ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}>
            {isCloudinary ? "Cloudinary CDN" : "Drive Audio"}
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {driveFileId && (
            <button
              type="button"
              onClick={() => setUseDriveFallback(!useDriveFallback)}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded border border-slate-200 transition-colors"
            >
              {useDriveFallback ? "Use Direct Stream" : "Switch Player Mode"}
            </button>
          )}
          <a
            href={isCloudinary ? url : viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-800 p-1 rounded bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 text-[10px] font-medium"
            title="Open direct media link"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Direct Link
          </a>
        </div>
      </div>

      {/* Audio Player Container */}
      {!useDriveFallback && activeAudioSrc ? (
        <div className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col gap-1.5">
          <audio 
            key={activeAudioSrc}
            ref={audioRef}
            src={activeAudioSrc}
            controls 
            playsInline
            preload="auto"
            className="w-full h-10 accent-blue-600 rounded-md"
            onError={() => {
              if (driveFileId) setUseDriveFallback(true);
            }}
          >
            Your browser does not support the audio element.
          </audio>
          {driveFileId && (
            <div className="flex justify-end px-1">
              <button
                type="button"
                onClick={() => setUseDriveFallback(true)}
                className="text-[10px] text-blue-600 hover:underline font-semibold"
              >
                No sound output? Switch to Drive Embed Player
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-16 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
          <iframe
            src={embedUrl || url}
            className="w-full h-full border-0"
            allow="autoplay"
            title={title || "Drive Audio Player"}
          />
        </div>
      )}
    </div>
  );
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

export default function ModuleDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const subjectId = searchParams.get('subjectId') || '';
  const [moduleData, setModuleData] = useState<any>(null);
  const [allModules, setAllModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<{[id: string]: {video: string, audio: string}}>({});
  const [activeNote, setActiveNote] = useState<{url: string, title: string, id: string, content?: string} | null>(null);

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
          const [result, modulesResult] = await Promise.all([
            fetchGAS("getModule", { moduleId: id, userId: "anonymous" }),
            fetchGAS("getModules", { subjectId, userId: "anonymous" })
          ]);
          if (Array.isArray(modulesResult)) {
            setAllModules(modulesResult);
          }
          if (result && result.subtopics) {
            result.subtopics = result.subtopics.filter((st: any) => {
              let isVisible = true;
              if (st.isVisible === false) isVisible = false;
              if (typeof st.simulationData === 'string') {
                try {
                  const simData = JSON.parse(st.simulationData);
                  if (simData.isVisible === false) isVisible = false;
                } catch(e) {}
              } else if (typeof st.simulationData === 'object' && st.simulationData !== null) {
                if (st.simulationData.isVisible === false) isVisible = false;
              }

              if (typeof st.videoLanguages === 'string') {
                try { st.videoLanguages = JSON.parse(st.videoLanguages); } catch(e) { st.videoLanguages = []; }
              } else if (!Array.isArray(st.videoLanguages)) {
                st.videoLanguages = [];
              }
              
              if (typeof st.audioLanguages === 'string') {
                try { st.audioLanguages = JSON.parse(st.audioLanguages); } catch(e) { st.audioLanguages = []; }
              } else if (!Array.isArray(st.audioLanguages)) {
                st.audioLanguages = [];
              }

              return isVisible;
            });
          }
          setModuleData(result);
        } catch (err: any) {
          console.warn("Module could not be loaded:", err.message);
          setModuleData({ error: err.message || "Module not found" });
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

  const currentIndex = allModules.findIndex(m => m.id === id);
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 && currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

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

  const sideNavIcons = (
    <>
      {prevModule && (
        <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${prevModule.id}`}>
          <Button className="fixed left-2 sm:left-6 xl:left-12 top-1/2 -translate-y-1/2 z-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-110 group" title="Previous Module">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
          </Button>
        </Link>
      )}
      {nextModule && (
        <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${nextModule.id}`}>
          <Button className="fixed right-2 sm:right-6 xl:right-12 top-1/2 -translate-y-1/2 z-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-110 group" title="Next Module">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      )}
    </>
  );

  // ==========================================
  // RENDER VARIANT A: DIGITAL BUSINESS & TRANSFORMATION (PREMIUM LIGHT THEME)
  // ==========================================
  if (isDigitalBusiness) {
    if (activeNote) {
      return (
        <div className="fixed inset-0 z-[100] bg-[#F8FAFC] text-slate-800 flex flex-col antialiased font-sans">
          <div className="bg-white px-4 md:px-6 h-14 border-b border-slate-200 shadow-sm flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setActiveNote(null)} className="h-8 shadow-sm text-xs font-bold text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50 flex items-center gap-1.5">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Subtopics
              </Button>
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
                <Layers className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span className="truncate max-w-[200px]">{moduleData.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="truncate max-w-[250px] text-slate-800 font-bold">{activeNote.title}</span>
              </div>
            </div>
            <a href={activeNote.url} target="_blank" rel="noopener noreferrer" className={activeNote.url ? "" : "hidden"}>
              <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-[#1E3A8A] hover:bg-slate-50 border border-slate-200">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open in Drive
              </Button>
            </a>
          </div>
          <div className="flex-1 w-full bg-slate-50 relative overflow-hidden">
            {activeNote.content ? (
              <div className="w-full h-full overflow-auto p-4 sm:p-8 relative pt-6 bg-white prose max-w-none" dangerouslySetInnerHTML={{ __html: activeNote.content }} />
            ) : (
              <iframe src={getExternalEmbedUrl(activeNote.url) || activeNote.url} className="w-full h-full border-0 absolute inset-0 pt-6" allow="autoplay; fullscreen" />
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 relative overflow-hidden antialiased selection:bg-[#1E3A8A]/10 selection:text-[#1E3A8A] font-sans">
        {/* Strategy-board dot pattern grid overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(#e2e8f0 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px"
        }} />

        {sideNavIcons}

        <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl space-y-6">
          
          {/* Subtle Breadcrumb Navigation - Removed */}

          {/* Return Button */}
          <div className="mb-4">
            <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
              <Button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-slate-900 shadow-sm rounded-lg px-4 py-2 text-xs font-mono font-bold uppercase transition-all duration-150">
                ← Return to Modules
              </Button>
            </Link>
          </div>

          {/* Section Header */}
          <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-lg">
            <div className="flex items-center gap-3.5 mb-2.5">
              <Badge className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                {moduleData.id.toUpperCase()}
              </Badge>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">DBT_MODULE_DETAIL</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 font-sans">
              <Layers className="w-7 h-7 text-[#1E3A8A]" />
              {moduleData.title ? moduleData.title.replace(/^[●•]\s*/, "") : ""}
            </h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl font-sans font-medium">
              {moduleData.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono font-bold">
              <span className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-md text-[#1E3A8A]">CO: {moduleData.co}</span>
              <span className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-md text-[#0F766E] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {moduleData.hours} Hours
              </span>
            </div>
          </div>

          {/* Subtopics stack */}
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#1E3A8A]">Subtopics</h2>

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

              if (typeof subtopic.videoLanguages === 'string') {
                try { subtopic.videoLanguages = JSON.parse(subtopic.videoLanguages); } catch(e) { subtopic.videoLanguages = []; }
              } else if (!Array.isArray(subtopic.videoLanguages)) {
                subtopic.videoLanguages = [];
              }

              if (typeof subtopic.audioLanguages === 'string') {
                try { subtopic.audioLanguages = JSON.parse(subtopic.audioLanguages); } catch(e) { subtopic.audioLanguages = []; }
              } else if (!Array.isArray(subtopic.audioLanguages)) {
                subtopic.audioLanguages = [];
              }
              
              if (typeof subtopic.otherUrl === 'string' && subtopic.otherUrl.trim().startsWith("{")) {
                try {
                  const sanitizedStr = subtopic.otherUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
                  let parsedOther = JSON.parse(sanitizedStr);
                  while (typeof parsedOther === 'string') {
                    parsedOther = JSON.parse(parsedOther);
                  }
                  if (typeof parsedOther === 'object' && parsedOther !== null) {
                    while (typeof parsedOther.otherUrl === 'string' && parsedOther.otherUrl.trim().startsWith("{")) {
                      try {
                        const nested = JSON.parse(parsedOther.otherUrl);
                        parsedOther = { ...nested, ...parsedOther, otherUrl: nested.otherUrl || "" };
                      } catch(e) {
                        break;
                      }
                    }
                    subtopic = { ...subtopic, ...parsedOther };
                  }
                  if (!subtopic.otherUrl || subtopic.otherUrl.trim() === "" || subtopic.otherUrl.trim().startsWith("{")) subtopic.otherUrl = "";
                  if (!subtopic.didYouKnowUrl || subtopic.didYouKnowUrl.trim() === "" || subtopic.didYouKnowUrl.trim().startsWith("{")) subtopic.didYouKnowUrl = "";
                  if (!subtopic.referenceUrl || subtopic.referenceUrl.trim() === "" || subtopic.referenceUrl.trim().startsWith("{")) subtopic.referenceUrl = "";
                  if (!subtopic.lessonContent || subtopic.lessonContent.trim() === "" || subtopic.lessonContent.trim().startsWith("{")) subtopic.lessonContent = "";
                  if (!subtopic.imageUrl || subtopic.imageUrl.trim() === "" || subtopic.imageUrl.trim().startsWith("{")) subtopic.imageUrl = "";
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
              const subtopicInfographics = moduleData.infographics?.filter((i: any) => i.title === subtopic.title) || [];

              let defaultVideoUrl = (subtopic.videoUrl && typeof subtopic.videoUrl === 'string' && !subtopic.videoUrl.trim().startsWith("{") && !subtopic.videoUrl.trim().startsWith("\""))
                ? subtopic.videoUrl 
                : (subtopic.type === 'videoUrl' && subtopic.mediaUrl && typeof subtopic.mediaUrl === 'string' && !subtopic.mediaUrl.trim().startsWith("{") && !subtopic.mediaUrl.trim().startsWith("\""))
                  ? subtopic.mediaUrl 
                  : (subtopic.videoLanguages?.[0]?.url || "");
              
              const defaultAudioUrl = (subtopic.audioUrl && typeof subtopic.audioUrl === 'string' && !subtopic.audioUrl.trim().startsWith("{") && !subtopic.audioUrl.trim().startsWith("\""))
                ? subtopic.audioUrl
                : (subtopic.type === 'audio' && subtopic.mediaUrl && typeof subtopic.mediaUrl === 'string' && !subtopic.mediaUrl.trim().startsWith("{") && !subtopic.mediaUrl.trim().startsWith("\""))
                  ? subtopic.mediaUrl
                  : (subtopic.audioLanguages?.[0]?.url || "");

              if (defaultVideoUrl === defaultAudioUrl && defaultVideoUrl) defaultVideoUrl = "";
              
              const finalNotesUrl = (subtopic.notesUrl && typeof subtopic.notesUrl === 'string' && !subtopic.notesUrl.trim().startsWith("{") && !subtopic.notesUrl.trim().startsWith("\""))
                ? subtopic.notesUrl 
                : (subtopic.type === 'notes' && subtopic.mediaUrl && typeof subtopic.mediaUrl === 'string' && !subtopic.mediaUrl.trim().startsWith("{") && !subtopic.mediaUrl.trim().startsWith("\""))
                  ? subtopic.mediaUrl 
                  : subtopic.imageUrl || "";

              return (
                <motion.div key={subtopic.id} variants={itemVariants}>
                  <Card className="border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(30,58,138,0.06)] hover:border-[#1E3A8A] hover:bg-slate-50/30 transition-all duration-300 overflow-hidden bg-white rounded-lg group">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-slate-50/60 w-full md:w-16 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 py-4 md:py-0 flex-shrink-0 select-none group-hover:bg-indigo-50/20 transition-colors duration-300">
                        <span className="text-2xl font-extrabold text-slate-300 group-hover:text-indigo-600 transition-colors duration-300">0{index + 1}</span>
                      </div>
                      <div className="flex-1 p-3.5 sm:p-6 flex flex-col">
                        <div className="mb-4">
                          <CardTitle className="text-base sm:text-lg font-bold text-slate-800 mb-1.5">{subtopic.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{subtopic.description}</CardDescription>
                        </div>

                        {/* Video Content */}
                        {(defaultVideoUrl || (subtopic.videoLanguages && subtopic.videoLanguages.length > 0)) && (
                          <div className="w-full mb-5">
                            {subtopic.videoLanguages && subtopic.videoLanguages.length > 0 && (
                              <div className="flex justify-end mb-2">
                                <select 
                                  className="bg-white border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 text-slate-750 font-medium focus:outline-none focus:border-[#1E3A8A] shadow-sm"
                                  value={selectedLanguages[subtopic.id]?.video || defaultVideoUrl}
                                  onChange={(e) => handleLanguageChange(subtopic.id, 'video', e.target.value)}
                                >
                                  {defaultVideoUrl && <option value={defaultVideoUrl}>English (Default)</option>}
                                  {subtopic.videoLanguages?.map((lang: any, i: number) => (
                                    <option key={i} value={lang.url}>{lang.language}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <div className="w-full">
                              <InlineVideoPlayer 
                                url={selectedLanguages[subtopic.id]?.video || defaultVideoUrl} 
                                title={subtopic.title} 
                                downloadUrl={subtopic.videoDownloadUrl}
                              />
                            </div>
                          </div>
                        )}

                        {/* Audio Content */}
                        {(defaultAudioUrl || (subtopic.audioLanguages && subtopic.audioLanguages.length > 0)) && (
                          <div className="w-full mb-5">
                            {subtopic.audioLanguages && subtopic.audioLanguages.length > 0 && (
                              <div className="flex justify-end mb-2">
                                <select 
                                  className="bg-white border border-slate-200 rounded-lg text-[10px] px-2 py-1 text-slate-750 font-medium focus:outline-none focus:border-[#1E3A8A] shadow-sm"
                                  value={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl}
                                  onChange={(e) => handleLanguageChange(subtopic.id, 'audio', e.target.value)}
                                >
                                  {defaultAudioUrl && <option value={defaultAudioUrl}>English (Default)</option>}
                                  {subtopic.audioLanguages.map((lang: any, i: number) => (
                                    <option key={i} value={lang.url}>{lang.language}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="audio">
                              <InlineAudioPlayer url={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl} title={subtopic.title} />
                            </ResourceLinkTracker>
                          </div>
                        )}

                        {/* Buttons grid - Mobile Compact Grid */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 border-t border-slate-100 pt-4 sm:pt-5 mt-auto">
                          {getParsedNotes(finalNotesUrl).map((note: any, idx: number) => (
                            <ResourceLinkTracker key={idx} subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                              <Button 
                                onClick={() => setActiveNote({ url: note.url, title: note.title, id: subtopic.id })}
                                variant="outline" 
                                className="w-full sm:w-auto bg-white hover:bg-red-50/30 border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                              >
                                <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" /> {note.title || "Read Notes"}
                              </Button>
                            </ResourceLinkTracker>
                          ))}
                          {subtopic.lessonContent && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                              <Button 
                                onClick={() => setActiveNote({ url: "", title: subtopic.title + " - Lesson", id: subtopic.id, content: subtopic.lessonContent || 'No lesson content found for this subtopic.' })}
                                variant="outline" 
                                className="w-full sm:w-auto bg-white hover:bg-blue-50/30 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Read Lesson
                              </Button>
                            </ResourceLinkTracker>
                          )}
                          {subtopic.didYouKnowUrl && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="didYouKnow">
                              <Button 
                                onClick={() => setActiveNote({ url: subtopic.didYouKnowUrl, title: "Did You Know", id: subtopic.id })}
                                variant="outline" 
                                className="w-full sm:w-auto bg-white hover:bg-amber-50/30 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                              >
                                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Did You Know
                              </Button>
                            </ResourceLinkTracker>
                          )}
                          {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes || subtopicQuizzes.length > 0) && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                              <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : subtopic.id}&moduleId=${id}&subtopicId=${subtopic.id}`} className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-emerald-50/30 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                  <Target className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Attempt Quiz
                                </Button>
                              </Link>
                            </ResourceLinkTracker>
                          )}
                          
                          {subtopicMindMaps.length > 0 && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="mindmap">
                              <Link href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${subtopicMindMaps[0].id}`} className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-purple-50/30 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                  <BrainCircuit className="w-3.5 h-3.5 text-purple-500 shrink-0" /> View Mind Map
                                </Button>
                              </Link>
                            </ResourceLinkTracker>
                          )}
                          {subtopicInfographics.length > 0 && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                              <Link href={`/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${subtopicInfographics[0].id}`} className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-pink-50/30 border-slate-200 hover:border-pink-300 text-slate-700 hover:text-pink-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                  <ImageIcon className="w-3.5 h-3.5 text-pink-500 shrink-0" /> Infographics
                                </Button>
                              </Link>
                            </ResourceLinkTracker>
                          )}
                          {(subtopic.simulationUrl || subtopicSims.length > 0) && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="simulation">
                              <Link href={
                                subtopicSims.length > 0 
                                  ? `/student/subjects/subject/simulations/item?subjectId=${subjectId}&id=${subtopicSims[0].id}&moduleId=${id}&subtopicId=${subtopic.id}`
                                  : `/student/subjects/subject/modules/item/simulations/subtopic?subjectId=${subjectId}&id=${id}&subtopicId=${subtopic.id}`
                              } className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-blue-50/30 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                  <Gamepad2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /> View Simulation
                                </Button>
                              </Link>
                            </ResourceLinkTracker>
                          )}
                          {subtopic.referenceUrl && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="reference">
                              <a href={subtopic.referenceUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-900 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                  <Book className="w-3.5 h-3.5 text-zinc-550 shrink-0" /> Reference
                                </Button>
                              </a>
                            </ResourceLinkTracker>
                          )}
                          
                          {subtopicFlashcards.length > 0 && (
                            <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${subtopicFlashcards[0].id}&moduleId=${id}&subtopicId=${subtopic.id}`} className="w-full sm:w-auto">
                              <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-amber-50/30 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Flashcards
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
    if (activeNote) {
      return (
        <div className="fixed inset-0 z-[100] bg-[#F8FAFC] text-slate-800 flex flex-col font-mono antialiased selection:bg-[#3776AB]/10 selection:text-[#3776AB] font-jetbrains">
          <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;750&display=swap');
            .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
          `}</style>
          <div className="bg-white border-b border-slate-200 px-4 md:px-6 h-12 flex items-center justify-between text-xs shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setActiveNote(null)} className="h-7 text-[10px] text-slate-600 font-mono px-2 rounded hover:bg-slate-50 border-slate-200 shadow-xs flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> exit()
              </Button>
              <span className="text-slate-200">|</span>
              <span className="font-bold text-[#2b5b84] hidden sm:inline">PYTHON DEVELOPMENT STUDIO</span>
              <span className="text-slate-400 hidden sm:inline">/</span>
              <span className="text-[#3776AB] font-bold tracking-wider truncate max-w-[300px]">{activeNote.title}</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-500">
              <a href={activeNote.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="h-7 text-[10px] text-[#3776AB] border-[#3776AB]/30 hover:bg-[#3776AB]/10 px-2 rounded flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> open_external()
                </Button>
              </a>
            </div>
          </div>
          <div className="flex-1 w-full bg-[#1e1e1e] relative p-1">
            <div className="w-full h-full bg-white rounded-sm overflow-hidden pt-6">
              {activeNote.content ? (
                <div className="w-full h-full overflow-auto p-4 sm:p-8 prose max-w-none" dangerouslySetInnerHTML={{ __html: activeNote.content }} />
              ) : (
                <iframe src={getExternalEmbedUrl(activeNote.url) || activeNote.url} className="w-full h-full border-0 absolute inset-0 pt-6" allow="autoplay; fullscreen" />
              )}
            </div>
          </div>
        </div>
      );
    }
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

        {sideNavIcons}

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
              <span className="text-[10px] text-slate-400 font-mono">READ-ONLY SCHEMA</span>
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

              if (typeof subtopic.videoLanguages === 'string') {
                try { subtopic.videoLanguages = JSON.parse(subtopic.videoLanguages); } catch(e) { subtopic.videoLanguages = []; }
              } else if (!Array.isArray(subtopic.videoLanguages)) {
                subtopic.videoLanguages = [];
              }

              if (typeof subtopic.audioLanguages === 'string') {
                try { subtopic.audioLanguages = JSON.parse(subtopic.audioLanguages); } catch(e) { subtopic.audioLanguages = []; }
              } else if (!Array.isArray(subtopic.audioLanguages)) {
                subtopic.audioLanguages = [];
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
              const subtopicInfographics = moduleData.infographics?.filter((i: any) => i.title === subtopic.title) || [];

              let defaultVideoUrl = subtopic.videoUrl || subtopic.mediaUrl || (subtopic.videoLanguages?.[0]?.url || "");
              const defaultAudioUrl = subtopic.audioUrl || (subtopic.audioLanguages?.[0]?.url || "");
              if (defaultVideoUrl === defaultAudioUrl && defaultVideoUrl) defaultVideoUrl = "";

              const finalNotesUrl = subtopic.notesUrl || (subtopic.type === 'notes' ? subtopic.mediaUrl : "") || subtopic.imageUrl || "";

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
                    {(defaultVideoUrl || (subtopic.videoLanguages && subtopic.videoLanguages.length > 0)) && (
                      <div className="w-full mb-5 pl-4 border-l border-slate-200">
                        {subtopic.videoLanguages && subtopic.videoLanguages.length > 0 && (
                          <div className="flex justify-end mb-2">
                            <select 
                              className="bg-white border border-slate-200 rounded font-mono text-[10px] px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-[#3776AB] shadow-xs"
                              value={selectedLanguages[subtopic.id]?.video || defaultVideoUrl}
                              onChange={(e) => handleLanguageChange(subtopic.id, 'video', e.target.value)}
                            >
                              {defaultVideoUrl && <option value={defaultVideoUrl}>English (Default)</option>}
                              {subtopic.videoLanguages.map((lang: any, i: number) => (
                                <option key={i} value={lang.url}>{lang.language}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="w-full">
                          <InlineVideoPlayer url={selectedLanguages[subtopic.id]?.video || defaultVideoUrl} title={subtopic.title} />
                        </div>
                      </div>
                    )}

                    {/* Audio Box */}
                    {(defaultAudioUrl || (subtopic.audioLanguages && subtopic.audioLanguages.length > 0)) && (
                      <div className="w-full mb-5">
                        {subtopic.audioLanguages && subtopic.audioLanguages.length > 0 && (
                          <div className="flex justify-end mb-2">
                            <select 
                              className="bg-white border border-slate-200 rounded font-mono text-[9px] px-2 py-0.5 text-slate-700 focus:outline-none focus:border-[#3776AB]"
                              value={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl}
                              onChange={(e) => handleLanguageChange(subtopic.id, 'audio', e.target.value)}
                            >
                              {defaultAudioUrl && <option value={defaultAudioUrl}>English (Default)</option>}
                              {subtopic.audioLanguages.map((lang: any, i: number) => (
                                <option key={i} value={lang.url}>{lang.language}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="audio">
                          <InlineAudioPlayer url={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl} title={subtopic.title} />
                        </ResourceLinkTracker>
                      </div>
                    )}
                    {/* Buttons */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 mt-auto">
                      {getParsedNotes(finalNotesUrl).map((note: any, idx: number) => (
                        <ResourceLinkTracker key={idx} subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                          <Button 
                            onClick={() => setActiveNote({ url: note.url, title: note.title, id: subtopic.id })}
                            variant="outline" 
                            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-red-500" /> {note.title ? note.title.toLowerCase().replace(/ /g, '_') + '()' : 'read_notes()'}
                          </Button>
                        </ResourceLinkTracker>
                      ))}
                      {subtopic.lessonContent && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                          <Button 
                            onClick={() => setActiveNote({ url: "", title: subtopic.title + " - Lesson", id: subtopic.id, content: subtopic.lessonContent || 'No lesson content found for this subtopic.' })}
                            variant="outline" 
                            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-blue-500" /> read_lesson()
                          </Button>
                        </ResourceLinkTracker>
                      )}
                      {subtopic.didYouKnowUrl && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="didYouKnow">
                          <Button 
                            onClick={() => setActiveNote({ url: subtopic.didYouKnowUrl, title: "Did You Know", id: subtopic.id })}
                            variant="outline" 
                            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1"
                          >
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> did_you_know()
                          </Button>
                        </ResourceLinkTracker>
                      )}
                      {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes || subtopicQuizzes.length > 0) && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                          <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : subtopic.id}&moduleId=${id}&subtopicId=${subtopic.id}`}>
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
                      {subtopicInfographics.length > 0 && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                          <Link href={`/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${subtopicInfographics[0].id}`}>
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-pink-500" /> view_infographic()
                            </Button>
                          </Link>
                        </ResourceLinkTracker>
                      )}
                      {(subtopic.simulationUrl || subtopicSims.length > 0) && (
                        <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="simulation">
                          <Link href={
                            subtopicSims.length > 0 
                              ? `/student/subjects/subject/simulations/item?subjectId=${subjectId}&id=${subtopicSims[0].id}&moduleId=${id}&subtopicId=${subtopic.id}`
                              : `/student/subjects/subject/modules/item/simulations/subtopic?subjectId=${subjectId}&id=${id}&subtopicId=${subtopic.id}`
                          }>
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-mono font-semibold h-8 px-2.5 rounded shadow-xs flex items-center gap-1">
                              <Gamepad2 className="w-3.5 h-3.5 text-blue-500" /> view_simulation()
                            </Button>
                          </Link>
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
                      
                      {subtopicFlashcards.length > 0 && (
                        <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${subtopicFlashcards[0].id}&moduleId=${id}&subtopicId=${subtopic.id}`}>
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

  if (activeNote) {
    return (
      <div className={`fixed inset-0 z-[100] ${t.bg} ${t.pattern} flex flex-col brutalist-transition transition-colors duration-300`}>
        <style jsx global>{`
          .brutalist-transition { transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        `}</style>
        <div className={`${isPremiumTheme ? 'bg-white border-b border-slate-200 shadow-sm' : t.cardBg + ' border-b-4 border-black'} px-4 md:px-6 h-14 flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-4">
            <Button onClick={() => setActiveNote(null)} className={isPremiumTheme ? "h-8 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs shadow-sm flex items-center gap-1 font-sans" : t.btnPrimary + " h-8 text-xs py-0 font-bold"}>
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> BACK
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-black uppercase tracking-tight">
              <span className="truncate max-w-[400px]">{activeNote.title}</span>
            </div>
          </div>
          <a href={activeNote.url} target="_blank" rel="noopener noreferrer" className={activeNote.url ? "" : "hidden"}>
            <Button className={isPremiumTheme ? "h-8 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold font-sans" : t.btnGhost + " h-8 text-xs border-2 border-black bg-white"}>
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> OPEN
            </Button>
          </a>
        </div>
        <div className={`flex-1 w-full bg-white relative overflow-hidden`}>
          
          {activeNote.content ? (
            <div className="w-full h-full overflow-auto p-4 sm:p-8 bg-white prose max-w-none" dangerouslySetInnerHTML={{ __html: activeNote.content }} />
          ) : activeNote.url ? (
            <iframe src={getExternalEmbedUrl(activeNote.url) || activeNote.url} className="w-full h-full border-0 absolute inset-0" allow="autoplay; fullscreen" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-50">
              No content available
            </div>
          )}

        </div>
      </div>
    );
  }

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

      {/* Layered Design-System inspired Background - Disabled for Clean EdTech Minimal */}

      <div className="container mx-auto px-4 max-w-5xl space-y-6 relative z-10">
        
        {/* Subtle Breadcrumb Navigation - Removed */}

        {sideNavIcons}

        {/* Back button */}
        <div className="mb-4 flex justify-between items-center">
          <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
            <motion.div
              whileHover={isPremiumTheme ? { x: -3 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button className={`font-black uppercase tracking-wider ${isPremiumTheme
                ? "bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-slate-900 shadow-xs rounded-lg px-4 py-2 text-xs font-mono font-bold uppercase transition-all duration-150"
                : t.btnPrimary
                }`}>
                ← Back to Modules
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Section Header Card */}
        <Card className={`${
          isPremiumTheme 
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
                  <span className="text-[10px] font-mono text-slate-400">module.console</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-[10px] font-mono px-2.5 py-1 ${t.badge}`}>
                    Workspace
                  </Badge>
                </div>
              )}
              <CardTitle className={`text-2xl md:text-3xl ${isPremiumTheme ? 'text-slate-900 font-semibold tracking-tight' : t.textHeading} flex items-center gap-3`}>
                {isPremiumTheme ? <Layers className="w-6 h-6 text-slate-500" /> : <BookOpen className="w-8 h-8" />} {moduleData.title}
              </CardTitle>
              <CardDescription className={`${isPremiumTheme ? 'text-slate-550 font-medium font-sans' : t.textMuted} mt-2 text-sm leading-relaxed`}>
                {moduleData.description}
              </CardDescription>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold font-sans">
                <span className={`px-2.5 py-1 border ${
                  isPremiumTheme 
                    ? 'bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold' 
                    : 'bg-zinc-100 border-2 border-black'
                }`}>{moduleData.co}</span>
                <span className={`px-2.5 py-1 border flex items-center gap-1 ${
                  isPremiumTheme 
                    ? 'bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold' 
                    : 'bg-zinc-100 border-2 border-black'
                }`}>
                  <Clock className="w-3.5 h-3.5" /> {moduleData.hours} Hours
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Subtopics stack */}
        <h2 className={`text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-4`}>
          [ SUBTOPICS | SCHEMA ]
        </h2>

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

            if (typeof subtopic.videoLanguages === 'string') {
              try { subtopic.videoLanguages = JSON.parse(subtopic.videoLanguages); } catch(e) { subtopic.videoLanguages = []; }
            } else if (!Array.isArray(subtopic.videoLanguages)) {
              subtopic.videoLanguages = [];
            }

            if (typeof subtopic.audioLanguages === 'string') {
              try { subtopic.audioLanguages = JSON.parse(subtopic.audioLanguages); } catch(e) { subtopic.audioLanguages = []; }
            } else if (!Array.isArray(subtopic.audioLanguages)) {
              subtopic.audioLanguages = [];
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
              const subtopicInfographics = moduleData.infographics?.filter((i: any) => i.title === subtopic.title) || [];

            let defaultVideoUrl = subtopic.videoUrl || subtopic.mediaUrl || (subtopic.videoLanguages?.[0]?.url || "");
            const defaultAudioUrl = subtopic.audioUrl || (subtopic.audioLanguages?.[0]?.url || "");
            if (defaultVideoUrl === defaultAudioUrl && defaultVideoUrl) defaultVideoUrl = "";

            const finalNotesUrl = subtopic.notesUrl || (subtopic.type === 'notes' ? subtopic.mediaUrl : "") || subtopic.imageUrl || "";

            const cardContentNode = (
              <div className="flex flex-col md:flex-row w-full">
                <div className={`w-full md:w-16 flex items-center justify-center py-4 md:py-0 flex-shrink-0 select-none ${
                  isPremiumTheme 
                    ? 'bg-slate-50/80 text-slate-400 border-b md:border-b-0 md:border-r border-slate-100' 
                    : 'bg-zinc-100 border-b-4 md:border-b-0 md:border-r-4 border-black text-black'
                }`}>
                  <span className="text-2xl font-black">{index + 1}</span>
                </div>
                <div className="flex-1 p-3.5 sm:p-6 flex flex-col">
                  <div className="mb-4">
                    <CardTitle className={`text-lg sm:text-xl mb-1.5 ${
                      isPremiumTheme ? 'text-slate-800 font-semibold font-sans tracking-tight' : 'text-black font-black uppercase tracking-tight'
                    }`}>{subtopic.title}</CardTitle>
                    <CardDescription className={`text-xs sm:text-sm ${
                      isPremiumTheme ? 'text-slate-550 font-medium font-sans leading-relaxed' : 'text-zinc-800 font-bold leading-relaxed'
                    }`}>{subtopic.description}</CardDescription>
                  </div>

                  {/* Video Content */}
                  {(defaultVideoUrl || (subtopic.videoLanguages && subtopic.videoLanguages.length > 0)) && (
                    <div className="w-full mb-5">
                      {subtopic.videoLanguages && subtopic.videoLanguages.length > 0 && (
                        <div className="flex justify-end mb-2">
                          <select 
                            className={`focus:outline-none text-xs font-bold px-3 py-1.5 ${
                              isPremiumTheme 
                                ? 'bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm font-sans' 
                                : 'bg-white border-2 border-black text-black'
                            }`}
                            value={selectedLanguages[subtopic.id]?.video || defaultVideoUrl}
                            onChange={(e) => handleLanguageChange(subtopic.id, 'video', e.target.value)}
                          >
                            {defaultVideoUrl && <option value={defaultVideoUrl}>English (Default)</option>}
                            {subtopic.videoLanguages.map((lang: any, i: number) => (
                              <option key={i} value={lang.url}>{lang.language}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="w-full">
                        <InlineVideoPlayer url={selectedLanguages[subtopic.id]?.video || defaultVideoUrl} title={subtopic.title} />
                      </div>
                    </div>
                  )}

                  {/* Audio Content */}
                  {(defaultAudioUrl || (subtopic.audioLanguages && subtopic.audioLanguages.length > 0)) && (
                    <div className="w-full mb-5">
                      {subtopic.audioLanguages && subtopic.audioLanguages.length > 0 && (
                        <div className="flex justify-end mb-2">
                          <select 
                            className={`focus:outline-none text-xs font-bold px-2 py-1 ${
                              isPremiumTheme 
                                ? 'bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm font-sans' 
                                : 'bg-white border-2 border-black text-black'
                            }`}
                            value={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl}
                            onChange={(e) => handleLanguageChange(subtopic.id, 'audio', e.target.value)}
                          >
                            {defaultAudioUrl && <option value={defaultAudioUrl}>English (Default)</option>}
                            {subtopic.audioLanguages.map((lang: any, i: number) => (
                              <option key={i} value={lang.url}>{lang.language}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="audio">
                        <InlineAudioPlayer url={selectedLanguages[subtopic.id]?.audio || defaultAudioUrl} title={subtopic.title} />
                      </ResourceLinkTracker>
                    </div>
                  )}

                  {/* Buttons - Mobile Grid Responsive */}
                  <div className={`grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 mt-auto pt-4 sm:pt-5 ${
                    isPremiumTheme ? 'border-t border-slate-100' : 'border-t-2 border-black'
                  }`}>
                    {getParsedNotes(finalNotesUrl).map((note: any, idx: number) => (
                      <ResourceLinkTracker key={idx} subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                        <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}} className="w-full sm:w-auto">
                          <Button 
                            onClick={() => setActiveNote({ url: note.url, title: note.title, id: subtopic.id })}
                            variant="outline" 
                            className={
                              (isPremiumTheme 
                                ? t.btnGhost 
                                : t.btnPrimary + ' flex items-center gap-1.5') + ' w-full sm:w-auto justify-center text-[11px] sm:text-xs h-9 sm:h-10 px-2.5 sm:px-4'
                            }
                          >
                            <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" /> {note.title || "Read Notes"}
                          </Button>
                        </motion.div>
                      </ResourceLinkTracker>
                    ))}
                    {subtopic.lessonContent && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                        <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}} className="w-full sm:w-auto">
                          <Button 
                            onClick={() => setActiveNote({ url: "", title: subtopic.title + " - Lesson", id: subtopic.id, content: subtopic.lessonContent || 'No lesson content found for this subtopic.' })}
                            variant="outline" 
                            className={
                              (isPremiumTheme 
                                ? t.btnGhost 
                                : t.btnPrimary + ' flex items-center gap-1.5') + ' w-full sm:w-auto justify-center text-[11px] sm:text-xs h-9 sm:h-10 px-2.5 sm:px-4'
                            }
                          >
                            <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Read Lesson
                          </Button>
                        </motion.div>
                      </ResourceLinkTracker>
                    )}
                    {subtopic.didYouKnowUrl && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="didYouKnow">
                        <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}} className="w-full sm:w-auto">
                          <Button 
                            onClick={() => setActiveNote({ url: subtopic.didYouKnowUrl, title: "Did You Know", id: subtopic.id })}
                            variant="outline" 
                            className={
                              (isPremiumTheme 
                                ? t.btnGhost 
                                : t.btnPrimary + ' flex items-center gap-1.5') + ' w-full sm:w-auto justify-center text-[11px] sm:text-xs h-9 sm:h-10 px-2.5 sm:px-4'
                            }
                          >
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" /> Did You Know
                          </Button>
                        </motion.div>
                      </ResourceLinkTracker>
                    )}
                    {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes || subtopicQuizzes.length > 0) && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                        <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : subtopic.id}&moduleId=${id}&subtopicId=${subtopic.id}`} className="w-full sm:w-auto">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}} className="w-full sm:w-auto">
                            <Button variant="outline" className={
                              (isPremiumTheme 
                                ? t.btnGhost 
                                : t.btnPrimary + ' flex items-center gap-1.5') + ' w-full sm:w-auto justify-center text-[11px] sm:text-xs h-9 sm:h-10 px-2.5 sm:px-4'
                            }>
                              <Target className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Attempt Quiz
                            </Button>
                          </motion.div>
                        </Link>
                      </ResourceLinkTracker>
                    )}
                    
                    {subtopicMindMaps.length > 0 && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="mindmap">
                        <Link href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${subtopicMindMaps[0].id}`} className="w-full sm:w-auto">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}} className="w-full sm:w-auto">
                            <Button variant="outline" className={
                              (isPremiumTheme 
                                ? t.btnGhost 
                                : t.btnPrimary + ' flex items-center gap-1.5') + ' w-full sm:w-auto justify-center text-[11px] sm:text-xs h-9 sm:h-10 px-2.5 sm:px-4'
                            }>
                              <BrainCircuit className="w-3.5 h-3.5 text-purple-500 shrink-0" /> View Mind Map
                            </Button>
                          </motion.div>
                        </Link>
                      </ResourceLinkTracker>
                    )}
                    {subtopicInfographics.length > 0 && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                        <Link href={`/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${subtopicInfographics[0].id}`} className="w-full sm:w-auto">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}} className="w-full sm:w-auto">
                            <Button variant="outline" className={
                              (isPremiumTheme 
                                ? t.btnGhost 
                                : t.btnPrimary + ' flex items-center gap-1.5') + ' w-full sm:w-auto justify-center text-[11px] sm:text-xs h-9 sm:h-10 px-2.5 sm:px-4'
                            }>
                              <ImageIcon className="w-3.5 h-3.5 text-pink-500 shrink-0" /> Infographics
                            </Button>
                          </motion.div>
                        </Link>
                      </ResourceLinkTracker>
                    )}
                    {(subtopic.simulationUrl || subtopicSims.length > 0) && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="simulation">
                        <Link href={
                          subtopicSims.length > 0 
                            ? `/student/subjects/subject/simulations/item?subjectId=${subjectId}&id=${subtopicSims[0].id}&moduleId=${id}&subtopicId=${subtopic.id}`
                            : `/student/subjects/subject/modules/item/simulations/subtopic?subjectId=${subjectId}&id=${id}&subtopicId=${subtopic.id}`
                        } className="w-full sm:w-auto">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}} className="w-full sm:w-auto">
                            <Button variant="outline" className={
                              (isPremiumTheme 
                                ? t.btnGhost 
                                : t.btnPrimary + ' flex items-center gap-1.5') + ' w-full sm:w-auto justify-center text-[11px] sm:text-xs h-9 sm:h-10 px-2.5 sm:px-4'
                            }>
                              <Gamepad2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /> View Simulation
                            </Button>
                          </motion.div>
                        </Link>
                      </ResourceLinkTracker>
                    )}
                    {subtopic.referenceUrl && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="reference">
                        <a href={subtopic.referenceUrl} target="_blank" rel="noopener noreferrer">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                            <Button variant="outline" className={
                              isPremiumTheme 
                                ? t.btnGhost 
                                : t.btnPrimary + ' flex items-center gap-1.5'
                            }>
                              <Book className="w-4 h-4 text-zinc-550" /> Reference Material
                            </Button>
                          </motion.div>
                        </a>
                      </ResourceLinkTracker>
                    )}
                    
                    {subtopicFlashcards.length > 0 && (
                      <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${subtopicFlashcards[0].id}&moduleId=${id}&subtopicId=${subtopic.id}`}>
                        <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                          <Button variant="outline" className={
                            isPremiumTheme 
                              ? t.btnGhost 
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
                  <DesignStudioCard isPremium={isPremiumTheme} label={`Subtopic.Card S0${index + 1}`} className={`h-full ${t.cardBg} ${t.borderClass} ${t.shadowClass} flex flex-col justify-between brutalist-transition overflow-hidden group relative`}
                  >
                    {/* Clean layout */}
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