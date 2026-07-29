"use client";
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

import Link from "next/link";
import { ResourceLinkTracker } from "@/components/student/ResourceLinkTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ResourceHeader from "@/components/ui/ResourceHeader";
import { 
  ChevronLeft, PlayCircle, FileText, CheckCircle2, Gamepad2, Target, 
  Download, Book, BookOpen, BrainCircuit, CreditCard, Link as LinkIcon, 
  HelpCircle, Layers, Headphones, Lightbulb, Clock, Terminal, Activity, Code, Settings, ChevronRight, MousePointer, ExternalLink, X, Maximize2, Volume2, Play, Pause, Image as ImageIcon, VolumeX, RotateCcw,
  Zap, Presentation, Info, Brain
} from "lucide-react";
import { module1Quizzes } from "@/data/module1QuizData";
import { module2Quizzes } from "@/data/module2QuizData";
import { useEffect, useState, useRef } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { redirect, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UttamLoader } from "@/components/ui/UttamLoader";
import { getEmbedUrl, getExternalEmbedUrl, getGoogleDriveFileId, isYouTubeUrl, getAudioDirectSources } from "@/lib/mediaHelpers";

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

function getParsedNotes(notesUrl: string | null | undefined) {
  if (!notesUrl) return [];
  let cleanUrl = notesUrl.replace(/drive\.https:\/\//g, "https://");
  if (cleanUrl.startsWith("drive.google.com")) cleanUrl = "https://" + cleanUrl;
  
  try {
    const parsed = JSON.parse(cleanUrl);
    if (Array.isArray(parsed)) return parsed.map(p => ({ ...p, url: p.url.replace(/drive\.https:\/\//g, "https://") }));
    return [{ title: "Notes Document", url: cleanUrl }];
  } catch(e) {
    return [{ title: "Notes Document", url: cleanUrl }];
  }
}



const InlineVideoPlayer = ({ url, title }: { url: string; title: string }) => {
  if (!url || typeof url !== 'string') return null;

  const lowerUrl = url.toLowerCase();
  const isYouTube = lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be");
  const isDirectVideo = lowerUrl.endsWith(".mp4") || lowerUrl.endsWith(".webm") || lowerUrl.endsWith(".ogg") || lowerUrl.includes(".mp4?") || lowerUrl.includes(".webm?");
  const embedUrl = getEmbedUrl(url);

  return (
    <div className="w-full flex flex-col select-none">
      <div className="w-full aspect-video bg-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
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

const InlineAudioPlayer = ({ url, title, themeKey, t }: { url: string; title: string; themeKey: string; t: any }) => {
  const [useDriveFallback, setUseDriveFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  const cleanUrl = url ? url.replace(/drive\.https:\/\//g, "https://").trim() : "";

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setUseDriveFallback(false);
    setPlaybackRate(1);
  }, [url]);

  if (!cleanUrl) {
    return (
      <div className={`w-full bg-[#FAF9F5] p-6 ${t.borderClass} flex flex-col items-center justify-center text-center gap-2`}>
        <Headphones className="w-8 h-8 text-zinc-400" />
        <p className="font-bold text-xs uppercase font-mono text-zinc-700">No Audio Track Available</p>
        <p className="text-xs text-zinc-500">The audio file link is missing or empty.</p>
      </div>
    );
  }

  const driveFileId = getGoogleDriveFileId(cleanUrl);
  const isYouTube = isYouTubeUrl(cleanUrl);

  if (isYouTube) {
    const ytEmbedUrl = getEmbedUrl(cleanUrl) || cleanUrl;
    return (
      <div className={`w-full aspect-video max-h-[360px] bg-black relative overflow-hidden ${t.borderClass} ${t.shadowClass}`}>
        <iframe
          src={ytEmbedUrl}
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          title={title || "YouTube Audio Lesson"}
        />
      </div>
    );
  }

  if (driveFileId) {
    const driveEmbedUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;
    return (
      <div className={`w-full h-[180px] bg-black relative overflow-hidden ${t.borderClass} ${t.shadowClass}`}>
        <iframe
          src={driveEmbedUrl}
          className="w-full h-full border-0 absolute inset-0"
          allow="autoplay; fullscreen"
          title={title || "Google Drive Audio Player"}
        />
      </div>
    );
  }

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Play failed:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSpeedChange = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const playBtnClass = themeKey === "ui programming"
    ? "w-12 h-12 rounded-none bg-[#EF4444] hover:bg-[#dc2626] border-2 border-black text-white flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-none transition-all cursor-pointer focus:outline-none"
    : themeKey === "python programming"
      ? "w-12 h-12 rounded-full bg-[#3776AB] hover:bg-[#2b5b84] text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer"
      : themeKey === "digital business"
        ? "w-12 h-12 rounded-full bg-[#0F766E] hover:bg-[#0d635c] text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer"
        : "w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer";

  const rewindBtnClass = themeKey === "ui programming"
    ? "w-8 h-8 rounded-none bg-white border-2 border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[0.5px] hover:translate-x-[0.5px] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all cursor-pointer focus:outline-none"
    : "w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center cursor-pointer transition-all focus:outline-none";

  const trackColor = themeKey === "ui programming"
    ? "#000"
    : themeKey === "python programming"
      ? "#3776AB"
      : themeKey === "digital business"
        ? "#0F766E"
        : "#2563eb";

  return (
    <div className={`w-full bg-white p-5 flex flex-col gap-4 ${t.borderClass} ${t.shadowClass}`}>
      <audio 
        key={cleanUrl}
        ref={audioRef}
        src={cleanUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
        className="hidden"
      />

      <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2 ${themeKey === 'ui programming' ? 'border-black' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-2">
          <Headphones className={`w-5 h-5 ${t.iconColor}`} />
          <span className="font-bold text-xs uppercase tracking-tight text-black">{title || "Audio Lesson"}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full flex-wrap sm:flex-nowrap">
        <button
          type="button"
          onClick={togglePlay}
          className={playBtnClass}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current text-current" />
          ) : (
            <Play className="w-5 h-5 fill-current text-current translate-x-[1px]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
            }
          }}
          className={rewindBtnClass}
          title="Rewind 10s"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="flex-1 flex items-center gap-3 min-w-[200px]">
          <span className={`text-xs font-mono text-zinc-700 shrink-0 font-bold ${themeKey === 'python programming' ? 'font-mono' : ''}`}>
            {formatTime(currentTime)}
          </span>
          
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className={`flex-1 h-2 bg-zinc-200 border appearance-none cursor-pointer focus:outline-none ${
              themeKey === 'ui programming' ? 'border-2 border-black rounded-none' : 'border-slate-200 rounded'
            }`}
            style={{
              background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${
                duration ? (currentTime / duration) * 100 : 0
              }%, #e4e4e7 ${
                duration ? (currentTime / duration) * 100 : 0
              }%, #e4e4e7 100%)`
            }}
          />

          <span className={`text-xs font-mono text-zinc-700 shrink-0 font-bold ${themeKey === 'python programming' ? 'font-mono' : ''}`}>
            {formatTime(duration)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSpeedChange}
          className={`px-2 py-1 bg-white text-[11px] font-mono font-bold text-black hover:bg-zinc-50 shrink-0 cursor-pointer ${
            themeKey === 'ui programming' ? 'border-2 border-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] rounded-none' : 'border border-slate-200 rounded shadow-xs'
          }`}
          title="Playback Speed"
        >
          {playbackRate}x
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 text-zinc-700 text-xs pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="hover:text-black transition-colors focus:outline-none cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className={`w-20 sm:w-24 h-1.5 bg-zinc-200 border appearance-none cursor-pointer focus:outline-none ${
              themeKey === 'ui programming' ? 'border border-black' : 'border border-slate-200 rounded'
            }`}
            style={{
              background: `linear-gradient(to right, #000 0%, #000 ${
                (isMuted ? 0 : volume) * 100
              }%, #e4e4e7 ${(isMuted ? 0 : volume) * 100}%, #e4e4e7 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};

const BrandedViewerWrap = ({ title, children, subtitle, actions, themeKey, t }: { title: string; children: React.ReactNode; subtitle?: string; actions?: React.ReactNode; themeKey: string; t: any }) => {
  return (
    <div className={`bg-white p-4 md:p-6 transition-all duration-200 ${t.borderClass} ${t.shadowClass}`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b gap-2 ${
        themeKey === 'ui programming' ? 'border-black' : 'border-zinc-200'
      }`}>
        <div>
          <h3 className={`font-black text-sm uppercase tracking-tight text-black ${themeKey === 'python programming' ? 'font-mono' : ''}`}>{title}</h3>
          {subtitle && <p className={`text-xs text-zinc-500 font-medium mt-0.5 ${themeKey === 'python programming' ? 'font-mono' : 'font-sans'}`}>{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default function ModuleDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const subjectId = searchParams.get('subjectId') || '';
  const [moduleData, setModuleData] = useState<any>(null);
  const [allModules, setAllModules] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<{[id: string]: {video: string, audio: string}}>({});
  const [activeSubtopicIndex, setActiveSubtopicIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'lecture' | 'notes' | 'audio' | 'reference'>('notes');
  const [selectedNoteUrl, setSelectedNoteUrl] = useState<string>("");

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
    const targetSubtopicId = searchParams.get('subtopicId');
    const resourceType = searchParams.get('resourceType');
    
    if (targetSubtopicId && moduleData?.subtopics) {
      const idx = moduleData.subtopics.findIndex((st: any) => st.id === targetSubtopicId);
      if (idx !== -1) {
        setActiveSubtopicIndex(idx);
        if (resourceType === 'video') {
          setActiveTab('lecture');
        } else if (resourceType === 'audio') {
          setActiveTab('audio');
        } else if (resourceType === 'notes') {
          setActiveTab('notes');
        } else if (resourceType === 'reference' || resourceType === 'pdf') {
          setActiveTab('reference');
        }
      }
    }
  }, [searchParams, moduleData]);

  useEffect(() => {
    if (!moduleData?.subtopics?.[activeSubtopicIndex]) return;
    
    const targetSubtopicId = searchParams.get('subtopicId');
    const resourceType = searchParams.get('resourceType');
    const subtopic = moduleData.subtopics[activeSubtopicIndex];
    
    // Parse resources availability
    let sub = { ...subtopic };
    if (typeof sub.simulationData === 'string') {
      try { sub = { ...sub, ...JSON.parse(sub.simulationData) }; } catch(e) {}
    } else if (typeof sub.simulationData === 'object' && sub.simulationData !== null) {
      sub = { ...sub, ...sub.simulationData };
    }

    if (typeof sub.otherUrl === 'string' && sub.otherUrl.trim().startsWith("{")) {
      try {
        const sanitizedStr = sub.otherUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        let parsedOther = JSON.parse(sanitizedStr);
        while (typeof parsedOther === 'string') parsedOther = JSON.parse(parsedOther);
        if (typeof parsedOther === 'object' && parsedOther !== null) {
          while (typeof parsedOther.otherUrl === 'string' && parsedOther.otherUrl.trim().startsWith("{")) {
            try {
              const nested = JSON.parse(parsedOther.otherUrl);
              parsedOther = { ...nested, ...parsedOther, otherUrl: nested.otherUrl || "" };
            } catch(e) { break; }
          }
          sub = { ...sub, ...parsedOther };
        }
      } catch(e) {}
    }

    let defaultVideoUrl = sub.videoUrl || (sub.type === 'videoUrl' ? sub.mediaUrl : "") || (sub.videoLanguages?.[0]?.url || "");
    let defaultAudioUrl = sub.audioUrl || (sub.type === 'audio' ? sub.mediaUrl : "") || (sub.audioLanguages?.[0]?.url || "");
    if (defaultVideoUrl === defaultAudioUrl && defaultVideoUrl) defaultVideoUrl = "";
    
    const finalNotesUrl = sub.notesUrl || (sub.type === 'notes' ? sub.mediaUrl : "") || sub.imageUrl || "";
    
    const hasNotes = !!(finalNotesUrl || sub.lessonContent);
    const hasVideo = !!(defaultVideoUrl || (sub.videoLanguages && sub.videoLanguages.length > 0));
    const hasPdf = !!sub.referenceUrl;
    const hasAudio = !!(defaultAudioUrl || (sub.audioLanguages && sub.audioLanguages.length > 0));

    const available: string[] = [];
    if (hasVideo) available.push('lecture');
    if (hasNotes) available.push('notes');
    if (hasAudio) available.push('audio');
    if (hasPdf) available.push('reference');

    // Populate notes list for notes tab
    const notesList = getParsedNotes(finalNotesUrl);
    if (notesList.length > 0) {
      setSelectedNoteUrl(notesList[0].url);
    } else {
      setSelectedNoteUrl("");
    }

    // Direct match check from search query parameters
    if (targetSubtopicId === sub.id && resourceType) {
      let queryTab: 'lecture' | 'notes' | 'audio' | 'reference' = 'notes';
      if (resourceType === 'video') queryTab = 'lecture';
      else if (resourceType === 'audio') queryTab = 'audio';
      else if (resourceType === 'notes') queryTab = 'notes';
      else if (resourceType === 'reference' || resourceType === 'pdf') queryTab = 'reference';
      
      if (available.includes(queryTab)) {
        setActiveTab(queryTab);
        return;
      }
    }

    // Default tab check based on availability
    if (available.length > 0 && !available.includes(activeTab)) {
      setActiveTab(available[0] as any);
    }
  }, [activeSubtopicIndex, moduleData, searchParams]);

  useEffect(() => {
    if (id) {
      const loadModule = async () => {
        try {
          const [result, modulesResult, subjects] = await Promise.all([
            fetchGAS("getModule", { moduleId: id, userId: "anonymous" }),
            fetchGAS("getModules", { subjectId, userId: "anonymous" }),
            fetchGAS("getSubjects")
          ]);
          if (Array.isArray(modulesResult)) {
            setAllModules(modulesResult);
          }
          if (Array.isArray(subjects)) {
            const sub = subjects.find(s => s.id === subjectId);
            if (sub) setSubjectName(sub.name || "");
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
  }, [id, subjectId]);

  if (loading) {
    return <UttamLoader isLoading={true} />;
  }

  if (!moduleData || moduleData.error) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center p-8 text-center text-red-500 font-bold uppercase tracking-wider font-mono">
        <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Module not found.
        </div>
      </div>
    );
  }

  const subtopics = moduleData.subtopics || [];
  const activeSubtopicRaw = subtopics[activeSubtopicIndex];

  // Parse details for active subtopic
  let activeSubtopic = activeSubtopicRaw ? { ...activeSubtopicRaw } : null;
  if (activeSubtopic) {
    if (typeof activeSubtopic.simulationData === 'string') {
      try {
        const parsed = JSON.parse(activeSubtopic.simulationData);
        activeSubtopic = { ...activeSubtopic, ...parsed };
      } catch(e) {}
    } else if (typeof activeSubtopic.simulationData === 'object' && activeSubtopic.simulationData !== null) {
      activeSubtopic = { ...activeSubtopic, ...activeSubtopic.simulationData };
    }

    if (typeof activeSubtopic.otherUrl === 'string' && activeSubtopic.otherUrl.trim().startsWith("{")) {
      try {
        const sanitizedStr = activeSubtopic.otherUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
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
          activeSubtopic = { ...activeSubtopic, ...parsedOther };
        }
        if (!activeSubtopic.otherUrl || activeSubtopic.otherUrl.trim() === "" || activeSubtopic.otherUrl.trim().startsWith("{")) activeSubtopic.otherUrl = "";
        if (!activeSubtopic.didYouKnowUrl || activeSubtopic.didYouKnowUrl.trim() === "" || activeSubtopic.didYouKnowUrl.trim().startsWith("{")) activeSubtopic.didYouKnowUrl = "";
        if (!activeSubtopic.referenceUrl || activeSubtopic.referenceUrl.trim() === "" || activeSubtopic.referenceUrl.trim().startsWith("{")) activeSubtopic.referenceUrl = "";
        if (!activeSubtopic.lessonContent || activeSubtopic.lessonContent.trim() === "" || activeSubtopic.lessonContent.trim().startsWith("{")) activeSubtopic.lessonContent = "";
        if (!activeSubtopic.imageUrl || activeSubtopic.imageUrl.trim() === "" || activeSubtopic.imageUrl.trim().startsWith("{")) activeSubtopic.imageUrl = "";
      } catch(e) {
        activeSubtopic.otherUrl = "";
        activeSubtopic.didYouKnowUrl = "";
        activeSubtopic.referenceUrl = "";
      }
    }

    if (typeof activeSubtopic.videoLanguages === 'string') {
      try { activeSubtopic.videoLanguages = JSON.parse(activeSubtopic.videoLanguages); } catch(e) { activeSubtopic.videoLanguages = []; }
    } else if (!Array.isArray(activeSubtopic.videoLanguages)) {
      activeSubtopic.videoLanguages = [];
    }

    if (typeof activeSubtopic.audioLanguages === 'string') {
      try { activeSubtopic.audioLanguages = JSON.parse(activeSubtopic.audioLanguages); } catch(e) { activeSubtopic.audioLanguages = []; }
    } else if (!Array.isArray(activeSubtopic.audioLanguages)) {
      activeSubtopic.audioLanguages = [];
    }
  }

  // Resolve resources for active subtopic
  const subtopicQuizzes = activeSubtopic ? (moduleData.quizzes?.filter((q: any) => q.subtopicId === activeSubtopic.subtopicNo || q.subtopicId === activeSubtopic.id) || []) : [];
  const subtopicSims = activeSubtopic ? (moduleData.simulations?.filter((s: any) => s.subtopicId === activeSubtopic.subtopicNo || s.subtopicId === activeSubtopic.id) || []) : [];
  const subtopicFlashcards = activeSubtopic ? (moduleData.flashcardDecks?.filter((f: any) => f.subtopicId === activeSubtopic.subtopicNo || f.subtopicId === activeSubtopic.id) || []) : [];
  const subtopicMindMaps = activeSubtopic ? (moduleData.mindmaps?.filter((m: any) => m.title === activeSubtopic.title) || []) : [];
  const subtopicInfographics = activeSubtopic ? (moduleData.infographics?.filter((i: any) => i.title === activeSubtopic.title) || []) : [];

  let defaultVideoUrl = activeSubtopic ? (
    (activeSubtopic.videoUrl && typeof activeSubtopic.videoUrl === 'string' && !activeSubtopic.videoUrl.trim().startsWith("{") && !activeSubtopic.videoUrl.trim().startsWith("\""))
      ? activeSubtopic.videoUrl 
      : (activeSubtopic.type === 'videoUrl' && activeSubtopic.mediaUrl && typeof activeSubtopic.mediaUrl === 'string' && !activeSubtopic.mediaUrl.trim().startsWith("{") && !activeSubtopic.mediaUrl.trim().startsWith("\""))
        ? activeSubtopic.mediaUrl 
        : (activeSubtopic.videoLanguages?.[0]?.url || "")
  ) : "";

  let defaultAudioUrl = activeSubtopic ? (
    (activeSubtopic.audioUrl && typeof activeSubtopic.audioUrl === 'string' && !activeSubtopic.audioUrl.trim().startsWith("{") && !activeSubtopic.audioUrl.trim().startsWith("\""))
      ? activeSubtopic.audioUrl
      : (activeSubtopic.type === 'audio' && activeSubtopic.mediaUrl && typeof activeSubtopic.mediaUrl === 'string' && !activeSubtopic.mediaUrl.trim().startsWith("{") && !activeSubtopic.mediaUrl.trim().startsWith("\""))
        ? activeSubtopic.mediaUrl
        : (activeSubtopic.audioLanguages?.[0]?.url || "")
  ) : "";

  if (defaultVideoUrl === defaultAudioUrl && defaultVideoUrl) defaultVideoUrl = "";

  const finalNotesUrl = activeSubtopic ? (
    (activeSubtopic.notesUrl && typeof activeSubtopic.notesUrl === 'string' && !activeSubtopic.notesUrl.trim().startsWith("{") && !activeSubtopic.notesUrl.trim().startsWith("\""))
      ? activeSubtopic.notesUrl 
      : (activeSubtopic.type === 'notes' && activeSubtopic.mediaUrl && typeof activeSubtopic.mediaUrl === 'string' && !activeSubtopic.mediaUrl.trim().startsWith("{") && !activeSubtopic.mediaUrl.trim().startsWith("\""))
        ? activeSubtopic.mediaUrl 
        : activeSubtopic.imageUrl || ""
  ) : "";

  const hasNotes = !!(finalNotesUrl || activeSubtopic?.lessonContent);
  const hasVideo = !!(defaultVideoUrl || (activeSubtopic?.videoLanguages && activeSubtopic.videoLanguages.length > 0));
  const hasPdf = !!activeSubtopic?.referenceUrl;
  const hasAudio = !!(defaultAudioUrl || (activeSubtopic?.audioLanguages && activeSubtopic.audioLanguages.length > 0));

  const notesList = activeSubtopic ? getParsedNotes(finalNotesUrl) : [];

  // Determine available tabs
  const availableTabs: ('lecture' | 'notes' | 'audio' | 'reference')[] = [];
  if (hasVideo) availableTabs.push('lecture');
  if (hasNotes) availableTabs.push('notes');
  if (hasAudio) availableTabs.push('audio');
  if (hasPdf) availableTabs.push('reference');

  // Sidebar navigation and pagination helpers
    const subjectNameLower = String(subjectName || "").toLowerCase();
  const isDigitalBusiness = subjectId === 'id_pryay1ykw' || subjectNameLower.includes("digital business");
  const isUiProgramming = subjectId === 'id_mn573l5e5' || subjectNameLower.includes("ui programming");
  const isPythonProgramming = subjectId === 'id_hdzqxse2n' || subjectNameLower.includes("python");
  const isStartupEngineering = subjectNameLower.includes("startup") || subjectNameLower.includes("engineering");

  const themeKey = isUiProgramming 
    ? "ui programming" 
    : (isStartupEngineering 
      ? "startup engineering" 
      : (isDigitalBusiness 
        ? "digital business" 
        : (subjectNameLower.includes("python") ? "python programming" : "")));
  const t = THEME_MAP[themeKey] || DEFAULT_THEME;

const prevSubtopic = activeSubtopicIndex > 0 ? subtopics[activeSubtopicIndex - 1] : null;
  const nextSubtopic = activeSubtopicIndex < subtopics.length - 1 ? subtopics[activeSubtopicIndex + 1] : null;

  // Learning Toolkit Navigation configuration
  const toolkitItems = activeSubtopic ? [
    {
      name: "Topic Quiz",
      icon: <Target className="w-4 h-4 text-emerald-600" />,
      available: subtopicQuizzes.length > 0 || activeSubtopic.id in module1Quizzes || activeSubtopic.id in module2Quizzes,
      href: `/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${subtopicQuizzes.length > 0 ? subtopicQuizzes[0].id : activeSubtopic.id}&moduleId=${id}&subtopicId=${activeSubtopic.id}`,
      trackerType: "quiz"
    },
    {
      name: "Study Flashcards",
      icon: <Layers className="w-4 h-4 text-amber-600" />,
      available: subtopicFlashcards.length > 0,
      href: `/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${subtopicFlashcards.length > 0 ? subtopicFlashcards[0].id : ''}&moduleId=${id}&subtopicId=${activeSubtopic.id}`,
      trackerType: "flashcards"
    },
    {
      name: "Concept Mind Map",
      icon: <BrainCircuit className="w-4 h-4 text-purple-600" />,
      available: subtopicMindMaps.length > 0,
      href: `/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${subtopicMindMaps.length > 0 ? subtopicMindMaps[0].id : ''}`,
      trackerType: "mindmap"
    },
    {
      name: "Visual Infographics",
      icon: <ImageIcon className="w-4 h-4 text-pink-600" />,
      available: subtopicInfographics.length > 0,
      href: `/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${subtopicInfographics.length > 0 ? subtopicInfographics[0].id : ''}`,
      trackerType: "notes"
    },
    {
      name: "Interactive Simulation",
      icon: <Gamepad2 className="w-4 h-4 text-blue-600" />,
      available: !!activeSubtopic.simulationUrl || subtopicSims.length > 0,
      href: subtopicSims.length > 0 
        ? `/student/subjects/subject/simulations/item?subjectId=${subjectId}&id=${subtopicSims[0].id}&moduleId=${id}&subtopicId=${activeSubtopic.id}`
        : `/student/subjects/subject/modules/item/simulations/subtopic?subjectId=${subjectId}&id=${id}&subtopicId=${activeSubtopic.id}`,
      trackerType: "simulation"
    }
  ] : [];

  return (
    <div className={`min-h-screen ${t.bg} ${t.pattern} pb-16`}>
      
      {/* Global CSS style definitions */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
        
        .font-jetbrains {
          font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
        }
        .strategy-board-dot {
          background-image: radial-gradient(#e2e8f0 1.2px, transparent 1.2px);
          background-size: 24px 24px;
        }
      `}</style>

      {/* Clean Educational Header */}
      <header className={`border-b-2 bg-white py-4 px-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isUiProgramming
          ? 'border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-none'
          : 'border-slate-200 shadow-sm rounded-none'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 shrink-0 ${
            themeKey === 'ui programming'
              ? 'bg-red-50 border border-black text-[#EF4444] rounded-none'
              : themeKey === 'python programming'
                ? 'bg-blue-55/10 border border-slate-200 text-[#3776AB] rounded'
                : themeKey === 'digital business'
                  ? 'bg-[#0F766E]/10 text-[#0F766E] rounded-lg'
                  : 'bg-blue-50 text-blue-600 rounded-lg'
          }`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest text-zinc-500 ${isPythonProgramming ? 'font-mono' : ''}`}>
              {subjectName || "Subject Workspace"}
            </span>
            <h1 className={`font-black text-lg uppercase tracking-tight text-black mt-0.5 ${isPythonProgramming ? 'font-mono' : ''}`}>
              {moduleData.title || "Module Details"}
            </h1>
          </div>
        </div>
        <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
          <button className={`${t.btnGhost} flex items-center gap-2 uppercase`}>
            <ChevronLeft className="w-4 h-4" /> All Modules
          </button>
        </Link>
      </header>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-80 lg:shrink-0 lg:sticky lg:top-6 flex flex-col gap-6">
            
            {/* Parent Module Badge Header */}
            <div className={`p-4 bg-white ${t.borderClass} ${t.shadowClass}`}>
              <div className="flex items-center gap-2 mb-2">
                <Layers className={`w-4 h-4 ${t.iconColor}`} />
                <span className={`text-[10px] font-bold text-zinc-500 uppercase tracking-wider ${isPythonProgramming ? 'font-mono' : ''}`}>Module Navigation</span>
              </div>
              <h2 className={`font-black text-sm uppercase tracking-tight text-black line-clamp-2 ${isPythonProgramming ? 'font-mono' : ''}`}>
                {moduleData.title}
              </h2>
            </div>

            {/* Subtopics navigation stack */}
            <div className="flex flex-col gap-3">
              {subtopics.map((st: any, idx: number) => {
                const isActive = idx === activeSubtopicIndex;
                let btnClass = "";
                if (isActive) {
                  if (themeKey === "ui programming") {
                    btnClass = "border-black bg-[#fbbf24] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold rounded-none";
                  } else if (themeKey === "python programming") {
                    btnClass = "border-[#3776AB] bg-[#3776AB]/10 text-[#3776AB] font-bold rounded font-mono";
                  } else if (themeKey === "digital business") {
                    btnClass = "border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E] font-bold rounded-xl";
                  } else {
                    btnClass = "border-blue-500 bg-blue-50 text-blue-600 font-bold rounded-xl";
                  }
                } else {
                  if (themeKey === "ui programming") {
                    btnClass = "border-zinc-350 hover:border-black bg-white text-zinc-700 hover:text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none";
                  } else if (themeKey === "python programming") {
                    btnClass = "border-slate-200 hover:border-[#3776AB] bg-white text-slate-650 hover:text-[#3776AB] rounded font-mono";
                  } else if (themeKey === "digital business") {
                    btnClass = "border-slate-200 hover:border-[#0F766E] bg-white text-slate-650 hover:text-[#0F766E] rounded-xl";
                  } else {
                    btnClass = "border-slate-200 hover:border-blue-600 bg-white text-slate-655 hover:text-blue-600 rounded-xl";
                  }
                }
                
                return (
                  <button
                    key={st.id}
                    onClick={() => setActiveSubtopicIndex(idx)}
                    className={`w-full text-left p-3.5 border-2 transition-all flex items-center justify-between gap-3 ${btnClass}`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-black shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="text-xs font-bold truncate">{st.title}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content Workspace */}
          {activeSubtopic ? (
            <main className="flex-1 w-full space-y-6">
              
              {/* Breadcrumbs */}
              <nav className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center flex-wrap gap-2">
                <span>Subjects</span>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <span className="truncate max-w-[150px]">{subjectName}</span>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <span className="truncate max-w-[150px]">{moduleData.title}</span>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <span className="text-black font-extrabold truncate max-w-[200px]">{activeSubtopic.title}</span>
              </nav>

              {/* Subtopic Header Info */}
              <div className={`border-b-2 pb-4 ${isUiProgramming ? 'border-black' : 'border-slate-200'}`}>
                <h2 className={`text-3xl font-black uppercase tracking-tight text-black leading-tight ${isPythonProgramming ? 'font-mono' : ''}`}>
                  {activeSubtopic.title}
                </h2>
                <p className={`text-sm text-zinc-650 font-medium mt-2 max-w-3xl leading-relaxed ${isPythonProgramming ? 'font-mono text-slate-500' : 'font-sans'}`}>
                  {activeSubtopic.description}
                </p>
                {activeSubtopic.co && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                      isUiProgramming 
                        ? 'bg-zinc-200 border border-zinc-400 text-zinc-700' 
                        : isPythonProgramming
                          ? 'bg-slate-105 border border-slate-200 text-slate-500 rounded font-mono'
                          : 'bg-slate-100 text-slate-600 rounded border border-slate-200'
                    }`}>
                      {activeSubtopic.co}
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic Tabbed Resource Viewer */}
              {availableTabs.length > 0 ? (
                <div className="space-y-4">
                  
                  {/* Tabs header row */}
                  <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2">
                    {availableTabs.map((tab) => {
                      const tabLabels = {
                        lecture: "Lecture",
                        notes: "Notes",
                        audio: "Audio",
                        reference: "Reference"
                      };
                      const isActive = activeTab === tab;
                      let tabClass = "";
                      if (isActive) {
                        if (themeKey === "ui programming") {
                          tabClass = "bg-black text-[#FAF9F5] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] rounded-none";
                        } else if (themeKey === "python programming") {
                          tabClass = "bg-[#3776AB] text-white border border-[#3776AB] rounded font-mono font-bold";
                        } else if (themeKey === "digital business") {
                          tabClass = "bg-[#0F766E] text-white border border-[#0F766E] rounded-xl font-bold";
                        } else {
                          tabClass = "bg-blue-600 text-white border border-blue-600 rounded-xl font-bold";
                        }
                      } else {
                        if (themeKey === "ui programming") {
                          tabClass = "bg-white text-zinc-700 hover:bg-zinc-50 border-2 border-black rounded-none";
                        } else if (themeKey === "python programming") {
                          tabClass = "bg-white text-slate-600 hover:text-[#3776AB] border border-slate-200 rounded font-mono hover:border-[#3776AB]";
                        } else if (themeKey === "digital business") {
                          tabClass = "bg-white text-slate-655 hover:text-[#0F766E] border border-slate-200 rounded-xl hover:border-[#0F766E]";
                        } else {
                          tabClass = "bg-white text-slate-655 hover:text-blue-600 border border-slate-200 rounded-xl hover:border-blue-600";
                        }
                      }
                      
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-xs font-black uppercase tracking-wider px-4 py-2 border-2 transition-all cursor-pointer ${tabClass}`}
                        >
                          {tabLabels[tab]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Content Window */}
                  <div className="transition-all duration-300">
                    {activeTab === 'lecture' && (
                      <BrandedViewerWrap 
                        title="Lecture Video" 
                        subtitle="Watch the video explanation to master key concepts."
                        themeKey={themeKey}
                        t={t}
                      >
                        <div className="w-full flex flex-col gap-3">
                          {activeSubtopic.videoLanguages && activeSubtopic.videoLanguages.length > 0 && (
                            <div className="flex justify-end mb-1">
                              <select 
                                className={`bg-white border-2 border-black text-xs font-bold px-2 py-1 focus:outline-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase ${isPythonProgramming ? 'font-mono' : ''}`}
                                value={selectedLanguages[activeSubtopic.id]?.video || defaultVideoUrl}
                                onChange={(e) => handleLanguageChange(activeSubtopic.id, 'video', e.target.value)}
                              >
                                {defaultVideoUrl && <option value={defaultVideoUrl}>Default (English)</option>}
                                {activeSubtopic.videoLanguages.map((lang: any, i: number) => (
                                  <option key={i} value={lang.url}>{lang.language}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          <InlineVideoPlayer 
                            url={selectedLanguages[activeSubtopic.id]?.video || defaultVideoUrl} 
                            title={activeSubtopic.title} 
                          />
                        </div>
                      </BrandedViewerWrap>
                    )}

                    {activeTab === 'notes' && (
                      <BrandedViewerWrap 
                        title="Lecture Notes" 
                        subtitle="Read through conceptual summaries and study notes."
                        themeKey={themeKey}
                        t={t}
                        actions={notesList.length > 1 ? (
                          <select 
                            className={`bg-white border-2 border-black text-xs font-bold px-2 py-1 focus:outline-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase ${isPythonProgramming ? 'font-mono' : ''}`}
                            value={selectedNoteUrl}
                            onChange={(e) => setSelectedNoteUrl(e.target.value)}
                          >
                            {notesList.map((note: any, idx: number) => (
                              <option key={idx} value={note.url}>{note.title}</option>
                            ))}
                          </select>
                        ) : undefined}
                      >
                        <div className="space-y-4">

                          {activeSubtopic.lessonContent ? (
                            <div 
                              className={`prose max-w-none text-xs leading-relaxed text-slate-805 ${isPythonProgramming ? 'font-mono' : ''}`}
                              dangerouslySetInnerHTML={{ __html: marked.parse(activeSubtopic.lessonContent) }}
                            />
                          ) : selectedNoteUrl ? (
                            <div className={`w-full aspect-[4/3] h-[75vh] min-h-[500px] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden relative bg-[#FAF9F5]`}>
                              <iframe
                                src={getExternalEmbedUrl(selectedNoteUrl) || selectedNoteUrl}
                                className="w-full h-full border-0"
                                title="Document Viewer"
                                allow="autoplay; fullscreen"
                              />
                            </div>
                          ) : (
                            <div className="text-center py-12 text-zinc-400 text-xs font-bold uppercase">No note attachments present.</div>
                          )}
                        </div>
                      </BrandedViewerWrap>
                    )}

                    {activeTab === 'audio' && (
                      <BrandedViewerWrap 
                        title="Audio Lesson" 
                        subtitle="Listen to conceptual descriptions and lectures."
                        themeKey={themeKey}
                        t={t}
                      >
                        <div className="w-full flex flex-col gap-3">
                          {activeSubtopic.audioLanguages && activeSubtopic.audioLanguages.length > 0 && (
                            <div className="flex justify-end mb-1">
                              <select 
                                className={`bg-white border-2 border-black text-xs font-bold px-2 py-1 focus:outline-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase ${isPythonProgramming ? 'font-mono' : ''}`}
                                value={selectedLanguages[activeSubtopic.id]?.audio || defaultAudioUrl}
                                onChange={(e) => handleLanguageChange(activeSubtopic.id, 'audio', e.target.value)}
                              >
                                {defaultAudioUrl && <option value={defaultAudioUrl}>Default (English)</option>}
                                {activeSubtopic.audioLanguages.map((lang: any, i: number) => (
                                  <option key={i} value={lang.url}>{lang.language}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          
                          <InlineAudioPlayer 
                            url={selectedLanguages[activeSubtopic.id]?.audio || defaultAudioUrl} 
                            title={activeSubtopic.title}
                            themeKey={themeKey}
                            t={t}
                          />
                        </div>
                      </BrandedViewerWrap>
                    )}

                    {activeTab === 'reference' && (
                      <BrandedViewerWrap 
                        title="Reading PDF Resource" 
                        subtitle="Detailed textbook chapters and reading PDFs."
                        themeKey={themeKey}
                        t={t}
                      >
                        <div className="w-full aspect-video h-[75vh] min-h-[500px] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden relative bg-[#FAF9F5]">
                          <iframe
                            src={getExternalEmbedUrl(activeSubtopic.referenceUrl) || activeSubtopic.referenceUrl}
                            className="w-full h-full border-0"
                            title="Reference Manual"
                            allow="autoplay; fullscreen"
                          />
                        </div>
                      </BrandedViewerWrap>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`border-2 border-dashed bg-white p-12 text-center text-zinc-550 font-bold uppercase tracking-wider ${
                  isUiProgramming ? 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none' : 'border-slate-350 rounded-xl shadow-xs'
                }`}>
                  No learning resources registered for this topic yet.
                </div>
              )}

              {/* Topic Summary / Takeaways Section */}
              {activeSubtopic.didYouKnowUrl && (
                <div className={`${t.borderClass} ${
                  themeKey === 'ui programming' 
                    ? 'bg-[#FEF3C7] text-amber-950 shadow-[4px_4px_0px_rgba(0,0,0,1)]' 
                    : 'bg-amber-50 text-amber-900 border-amber-250 shadow-xs'
                } p-5 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 bg-amber-100 border border-amber-300 rounded shrink-0 ${isUiProgramming ? 'rounded-none border-black' : ''}`}>
                      <Lightbulb className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">Case Study & Key Takeaways</h4>
                      <p className="text-xs font-medium font-sans text-amber-900 mt-0.5">Explore real-world applications and key takeaways for this topic.</p>
                    </div>
                  </div>
                  <a
                    href={activeSubtopic.didYouKnowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${t.btnGhost} shrink-0`}
                  >
                    Read Case Study
                  </a>
                </div>
              )}

              {/* Learning Toolkit Section (List Style) */}
              {toolkitItems.length > 0 && (
                <div className={`bg-white p-4 ${t.borderClass} ${t.shadowClass} mt-8`}>
                  <div className={`flex items-center gap-2 border-b ${isUiProgramming ? 'border-black' : 'border-slate-200'} pb-2 mb-3`}>
                    <Brain className="w-4 h-4 text-[#fbbf24] fill-black stroke-black" />
                    <h3 className="font-black text-sm uppercase tracking-tight text-black">Learning Toolkit</h3>
                  </div>
                  <div className="flex flex-col divide-y divide-zinc-200">
                    {toolkitItems.map((item, idx) => {
                      const content = (
                        <div className={`flex items-center justify-between py-2.5 transition-colors ${item.available ? 'hover:bg-zinc-50 px-2' : 'opacity-55 px-2 cursor-not-allowed'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 shrink-0 ${isUiProgramming ? 'bg-[#FAF9F5] border border-black rounded-none' : 'bg-slate-50 border border-slate-250 rounded-lg'}`}>
                              {item.icon}
                            </div>
                            <span className="font-bold text-xs text-zinc-900">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                              item.available 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                                : 'bg-zinc-100 text-zinc-505 border-zinc-300'
                            }`}>
                              {item.available ? "Available" : "Not Assigned"}
                            </span>
                            {item.available && <ChevronRight className="w-4 h-4 text-zinc-400" />}
                          </div>
                        </div>
                      );

                      if (item.available) {
                        return (
                          <ResourceLinkTracker key={idx} subtopicId={activeSubtopic.id} moduleId={id} resourceType={item.trackerType as any}>
                            <Link href={item.href} className="block select-none">
                              {content}
                            </Link>
                          </ResourceLinkTracker>
                        );
                      } else {
                        return (
                          <div key={idx} className="block select-none">
                            {content}
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Controls with Specific Topic Names */}
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t ${isUiProgramming ? 'border-black' : 'border-slate-200'}`}>
                {prevSubtopic ? (
                  <button
                    onClick={() => setActiveSubtopicIndex(activeSubtopicIndex - 1)}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer ${t.btnGhost}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">Previous: {prevSubtopic.title}</span>
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {nextSubtopic ? (
                  <button
                    onClick={() => setActiveSubtopicIndex(activeSubtopicIndex + 1)}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer ml-auto ${t.btnPrimary}`}
                  >
                    <span className="truncate max-w-[200px] sm:max-w-xs">Next: {nextSubtopic.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>

            </main>
          ) : (
            <div className={`flex-1 p-12 text-center text-zinc-500 font-bold border-2 border-dashed bg-white ${
              isUiProgramming ? 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-slate-350 rounded-xl'
            }`}>
              NO ACTIVE SUBTOPIC SELECTION
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
