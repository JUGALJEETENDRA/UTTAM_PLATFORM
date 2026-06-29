"use client";

import Link from "next/link";
import { ResourceLinkTracker } from "@/components/student/ResourceLinkTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, PlayCircle, FileText, CheckCircle2, Gamepad2, Target, 
  Download, Book, BookOpen, BrainCircuit, CreditCard, Link as LinkIcon, 
  HelpCircle, Layers, Headphones, Lightbulb, Clock, Terminal, Activity, Code, Settings, ChevronRight, MousePointer, ExternalLink, X, Maximize2, Volume2, Play, Pause
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
  
  if (url.includes("drive.google.com")) {
    if (url.includes("/file/d/")) {
      return url.replace(/\/view.*$/, "/preview").replace(/\/edit.*$/, "/preview").replace(/\/sharing.*$/, "/preview");
    }
    if (url.includes("id=")) {
      const match = url.match(/id=([^&]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
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

function getExternalEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("drive.google.com")) {
    if (url.includes("/file/d/")) {
      return url.replace(/\/view.*$/, "/preview").replace(/\/edit.*$/, "/preview");
    }
    if (url.includes("id=")) {
      const match = url.match(/id=([^&]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
  }
  return url;
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
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  if (!url) return null;

  const lowerUrl = url.toLowerCase();
  const isYouTube = lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be");
  const isDirectVideo = lowerUrl.endsWith(".mp4") || lowerUrl.endsWith(".webm") || lowerUrl.endsWith(".ogg") || lowerUrl.includes(".mp4?") || lowerUrl.includes(".webm?");
  const driveFileId = getGoogleDriveFileId(url);
  const embedUrl = getEmbedUrl(url);

  const downloadVideoUrl = (downloadUrl && downloadUrl.trim() !== "")
    ? downloadUrl
    : driveFileId 
      ? `https://drive.google.com/uc?export=download&id=${driveFileId}` 
      : url;
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

      {/* White Action Bar Positioned Below Video - Mobile Grid Responsive */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 p-3 bg-white text-slate-800 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 truncate">
          <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[150px] sm:max-w-md">{title || "Video Lesson"}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {/* Mobile App Open Button */}
          {driveFileId && (
            <a
              href={driveAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-3 rounded-lg shadow-xs flex items-center gap-1.5 transition-all shrink-0"
              title="Open in Drive App / Native Player"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Drive App
            </a>
          )}

          {/* Full-App Player Modal Trigger */}
          <Button
            type="button"
            size="sm"
            onClick={() => setIsFullscreenModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-3 rounded-lg shadow-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Full-App Player
          </Button>
        </div>
      </div>

      {/* In-App Fullscreen Theater Modal */}
      {isFullscreenModalOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-2xl flex flex-col p-3 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar with Prominent Go Back / Return Button */}
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-3 gap-2">
            <div className="flex items-center space-x-3 truncate">
              <Button
                type="button"
                onClick={() => setIsFullscreenModalOpen(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-3 py-1.5 h-8 rounded-lg flex items-center gap-1.5 shrink-0 border border-zinc-700 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Go Back
              </Button>
              <div className="flex items-center space-x-2 truncate">
                <PlayCircle className="w-4 h-4 text-blue-500 shrink-0 hidden sm:block" />
                <h3 className="text-white font-bold text-xs sm:text-base truncate max-w-[180px] sm:max-w-xl">{title}</h3>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreenModalOpen(false)}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-8 w-8 shrink-0"
              title="Close Fullscreen"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 w-full h-full relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
            {isYouTube || (!isDirectVideo && embedUrl) ? (
              <iframe
                src={`${embedUrl || url}${ (embedUrl || url).includes('?') ? '&' : '?' }autoplay=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                title={title}
              />
            ) : isDirectVideo ? (
              <video
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              >
                <source src={url} />
              </video>
            ) : (
              <iframe
                src={`${embedUrl || url}${ (embedUrl || url).includes('?') ? '&' : '?' }autoplay=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                title={title}
              />
            )}
          </div>

          {/* Bottom Control Bar with explicit Exit / Go Back button */}
          <div className="mt-3 flex justify-between items-center pt-2 border-t border-zinc-800">
            {driveFileId && (
              <a
                href={driveAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 h-8 rounded-lg flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in Drive App
              </a>
            )}
            <Button
              type="button"
              onClick={() => setIsFullscreenModalOpen(false)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 h-9 rounded-lg shadow-md flex items-center gap-2 ml-auto"
            >
              <ChevronLeft className="w-4 h-4" /> Return to Lesson Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const InlineAudioPlayer = ({ url, title }: { url: string; title: string }) => {
  if (!url) return null;

  const isCloudinary = url.includes("cloudinary.com");
  const driveFileId = getGoogleDriveFileId(url);
  const embedUrl = getExternalEmbedUrl(url);
  const viewUrl = driveFileId 
    ? `https://drive.google.com/file/d/${driveFileId}/view` 
    : url;

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
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-800 p-1.5 rounded bg-slate-100 border border-slate-200 transition-colors"
              title="Open in Google Drive"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Audio Player Container */}
      {isCloudinary || (!driveFileId && url.match(/\.(mp3|wav|ogg|m4a|aac)($|\?)/i)) ? (
        <div className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center">
          <audio 
            src={url} 
            controls 
            playsInline
            preload="metadata"
            className="w-full h-10 accent-blue-600 rounded-md"
          >
            Your browser does not support the audio element.
          </audio>
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
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 relative overflow-hidden antialiased selection:bg-[#1E3A8A]/10 selection:text-[#1E3A8A] font-sans">
        {/* Strategy-board dot pattern grid overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(#e2e8f0 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px"
        }} />

        <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl space-y-6">
          
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
              {moduleData.title}
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

              const defaultVideoUrl = subtopic.videoUrl || subtopic.mediaUrl || (subtopic.videoLanguages?.[0]?.url || "");
              const defaultAudioUrl = subtopic.audioUrl || (subtopic.audioLanguages?.[0]?.url || "");

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
                              <div className="flex justify-end mb-2 max-w-3xl mx-auto">
                                <select 
                                  className="bg-white border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 text-slate-750 font-medium focus:outline-none focus:border-[#1E3A8A] shadow-sm"
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
                            <div className="w-full max-w-3xl mx-auto">
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
                          <div className="w-full mb-5 max-w-3xl mx-auto">
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
                          {subtopic.notesUrl && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                              <a href={subtopic.notesUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-red-50/30 border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" /> Read Notes
                                </Button>
                              </a>
                            </ResourceLinkTracker>
                          )}
                          {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes || subtopicQuizzes.length > 0) && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                              <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : subtopic.id}`} className="w-full sm:w-auto">
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
                          {(subtopic.simulationUrl || subtopicSims.length > 0) && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="simulation">
                              <Link href={
                                subtopicSims.length > 0 
                                  ? `/student/subjects/subject/simulations/item?subjectId=${subjectId}&id=${subtopicSims[0].id}`
                                  : `/student/subjects/subject/modules/item/simulations/subtopic?subjectId=${subjectId}&id=${id}&subtopicId=${subtopic.id}`
                              } className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-blue-50/30 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                  <Gamepad2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /> View Simulation
                                </Button>
                              </Link>
                            </ResourceLinkTracker>
                          )}
                          {subtopic.didYouKnowUrl && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="didYouKnow">
                              <a href={subtopic.didYouKnowUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-amber-50/30 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Did You Know
                                </Button>
                              </a>
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
                          {subtopic.otherUrl && (
                            <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="other">
                              <a href={subtopic.otherUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-900 text-[11px] sm:text-xs font-bold h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
                                  <LinkIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" /> External Link
                                </Button>
                              </a>
                            </ResourceLinkTracker>
                          )}
                          {subtopicFlashcards.length > 0 && (
                            <Link href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${subtopicFlashcards[0].id}`} className="w-full sm:w-auto">
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

              const defaultVideoUrl = subtopic.videoUrl || subtopic.mediaUrl || (subtopic.videoLanguages?.[0]?.url || "");
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
                    {(defaultVideoUrl || (subtopic.videoLanguages && subtopic.videoLanguages.length > 0)) && (
                      <div className="w-full mb-5 pl-4 border-l border-slate-200">
                        {subtopic.videoLanguages && subtopic.videoLanguages.length > 0 && (
                          <div className="flex justify-end mb-2 max-w-3xl mx-auto">
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
                        <div className="w-full max-w-2xl">
                          <InlineVideoPlayer url={selectedLanguages[subtopic.id]?.video || defaultVideoUrl} title={subtopic.title} />
                        </div>
                      </div>
                    )}

                    {/* Audio Box */}
                    {(defaultAudioUrl || (subtopic.audioLanguages && subtopic.audioLanguages.length > 0)) && (
                      <div className="w-full mb-5 max-w-2xl">
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

      {/* Layered Design-System inspired Background - Disabled for Clean EdTech Minimal */}

      <div className="container mx-auto px-4 max-w-4xl space-y-6 relative z-10">
        
        {/* Subtle Breadcrumb Navigation - Removed */}

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

            const defaultVideoUrl = subtopic.videoUrl || subtopic.mediaUrl || (subtopic.videoLanguages?.[0]?.url || "");
            const defaultAudioUrl = subtopic.audioUrl || (subtopic.audioLanguages?.[0]?.url || "");

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
                            {defaultVideoUrl && <option value={defaultVideoUrl}>English (Default)</option>}
                            {subtopic.videoLanguages.map((lang: any, i: number) => (
                              <option key={i} value={lang.url}>{lang.language}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="w-full max-w-3xl mx-auto">
                        <InlineVideoPlayer url={selectedLanguages[subtopic.id]?.video || defaultVideoUrl} title={subtopic.title} />
                      </div>
                    </div>
                  )}

                  {/* Audio Content */}
                  {(defaultAudioUrl || (subtopic.audioLanguages && subtopic.audioLanguages.length > 0)) && (
                    <div className="w-full mb-5 max-w-3xl mx-auto">
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
                    {subtopic.notesUrl && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                        <a href={subtopic.notesUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}} className="w-full sm:w-auto">
                            <Button variant="outline" className={
                              (isPremiumTheme 
                                ? t.btnGhost 
                                : t.btnPrimary + ' flex items-center gap-1.5') + ' w-full sm:w-auto justify-center text-[11px] sm:text-xs h-9 sm:h-10 px-2.5 sm:px-4'
                            }>
                              <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" /> Read Notes
                            </Button>
                          </motion.div>
                        </a>
                      </ResourceLinkTracker>
                    )}
                    {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes || subtopicQuizzes.length > 0) && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                        <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : subtopic.id}`} className="w-full sm:w-auto">
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
                    {(subtopic.simulationUrl || subtopicSims.length > 0) && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="simulation">
                        <Link href={
                          subtopicSims.length > 0 
                            ? `/student/subjects/subject/simulations/item?subjectId=${subjectId}&id=${subtopicSims[0].id}`
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
                    {subtopic.didYouKnowUrl && (
                      <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="didYouKnow">
                        <a href={subtopic.didYouKnowUrl} target="_blank" rel="noopener noreferrer">
                          <motion.div whileHover={isPremiumTheme ? { y: -2 } : {}}>
                            <Button variant="outline" className={
                              isPremiumTheme 
                                ? t.btnGhost 
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
                                ? t.btnGhost 
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
                                ? t.btnGhost 
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