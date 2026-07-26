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
    borderClass: "border border-slate-200 rounded-lg",
    shadowClass: "shadow-sm transition-all duration-200",
    btnPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-550 hover:text-indigo-650 font-sans text-xs hover:bg-slate-55 border border-slate-200 rounded-lg px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-indigo-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg",
    pattern: ""
  },
  "startup engineering": {
    bg: "bg-slate-50 text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-lg",
    shadowClass: "shadow-sm transition-all duration-200",
    btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-550 hover:text-blue-650 font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-blue-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg",
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

const InlineAudioPlayer = ({ url, title }: { url: string; title: string }) => {
  if (!url || typeof url !== 'string') return null;
  const driveFileId = getGoogleDriveFileId(url);
  const embedUrl = getExternalEmbedUrl(url);
  
  const googleDriveDirectUrl = driveFileId 
    ? `https://docs.google.com/uc?export=download&id=${driveFileId}` 
    : url;

  const [useDriveFallback, setUseDriveFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setUseDriveFallback(false);
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Play failed:", err);
          if (driveFileId) {
            setUseDriveFallback(true);
          }
        });
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

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activeAudioSrc = googleDriveDirectUrl;

  return (
    <div className="w-full">
      {!useDriveFallback && activeAudioSrc ? (
        <div className="w-full bg-[#FAF9F5] p-5 border-2 border-black flex flex-col gap-4">
          <audio 
            key={activeAudioSrc}
            ref={audioRef}
            src={activeAudioSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
            className="hidden"
            onError={() => {
              if (driveFileId) setUseDriveFallback(true);
            }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-350 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-zinc-950" />
              <span className="font-bold text-xs uppercase tracking-tight">{title || "Audio Lesson"}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Audio Workspace</span>
          </div>

          <div className="flex items-center gap-4 w-full">
            <button
              type="button"
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 border-2 border-black text-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all shrink-0 focus:outline-none"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black text-black" />
              ) : (
                <Play className="w-5 h-5 fill-black text-black translate-x-[1px]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                }
              }}
              className="w-8 h-8 rounded-full bg-white border-2 border-black text-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all shrink-0 focus:outline-none"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex-1 flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-655 shrink-0">
                {formatTime(currentTime)}
              </span>
              
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-2 bg-zinc-200 border border-black appearance-none cursor-pointer accent-black focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #000 0%, #000 ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, #e4e4e7 ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, #e4e4e7 100%)`
                }}
              />

              <span className="text-xs font-mono text-zinc-655 shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-zinc-655 text-xs pt-2">
            <button
              type="button"
              onClick={toggleMute}
              className="hover:text-black transition-colors focus:outline-none"
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
              className="w-24 h-1.5 bg-zinc-200 border border-black appearance-none cursor-pointer accent-black focus:outline-none"
              style={{
                background: `linear-gradient(to right, #000 0%, #000 ${
                  (isMuted ? 0 : volume) * 100
                }%, #e4e4e7 ${(isMuted ? 0 : volume) * 100}%, #e4e4e7 100%)`
              }}
            />
          </div>

          {driveFileId && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setUseDriveFallback(true)}
                className="text-[10px] text-zinc-500 hover:text-black underline font-bold uppercase font-mono"
              >
                Use Alternative Player
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[250px] bg-black border-2 border-black relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <iframe
            src={embedUrl || url}
            className="w-full h-full border-0 absolute inset-0"
            allow="autoplay"
            title={title || "Drive Audio Player"}
          />
        </div>
      )}
    </div>
  );
};

const BrandedViewerWrap = ({ title, children, subtitle, actions }: { title: string; children: React.ReactNode; subtitle?: string; actions?: React.ReactNode }) => {
  return (
    <div className="border-2 border-black bg-white p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-zinc-200 gap-2">
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-black">{title}</h3>
          {subtitle && <p className="text-xs text-zinc-500 font-medium font-sans mt-0.5">{subtitle}</p>}
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
    <div className="min-h-screen bg-[#FAF9F5] text-zinc-905 font-sans pb-16 selection:bg-[#2dd4bf]/20 selection:text-black">
      
      {/* Clean Educational Header */}
      <header className="border-b-2 border-black bg-white py-4 px-6 mb-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 border border-black rounded shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{subjectName || "Subject Workspace"}</span>
            <h1 className="font-black text-lg uppercase tracking-tight text-black mt-0.5">{moduleData.title || "Module Details"}</h1>
          </div>
        </div>
        <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
          <button className="bg-white border-2 border-black hover:bg-zinc-50 text-black font-bold text-xs py-2 px-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all flex items-center gap-2 uppercase font-mono">
            <ChevronLeft className="w-4 h-4" /> All Modules
          </button>
        </Link>
      </header>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-80 lg:shrink-0 lg:sticky lg:top-6 flex flex-col gap-6">
            
            {/* Parent Module Badge Header */}
            <div className="border-2 border-black bg-[#FAF9F5] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Module Navigation</span>
              </div>
              <h2 className="font-black text-sm uppercase tracking-tight text-black line-clamp-2">
                {moduleData.title}
              </h2>
            </div>

            {/* Subtopics navigation stack */}
            <div className="flex flex-col gap-3">
              {subtopics.map((st: any, idx: number) => {
                const isActive = idx === activeSubtopicIndex;
                return (
                  <button
                    key={st.id}
                    onClick={() => setActiveSubtopicIndex(idx)}
                    className={`w-full text-left p-3.5 border-2 transition-all flex items-center justify-between gap-3 ${
                      isActive 
                        ? 'border-black bg-[#fbbf24] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold' 
                        : 'border-zinc-300 hover:border-black bg-white text-zinc-700 hover:text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-black shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="text-xs font-bold truncate">{st.title}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 shrink-0 text-black" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content Workspace */}
          {activeSubtopic ? (
            <main className="flex-1 w-full space-y-6">
              
              {/* Breadcrumbs */}
              <nav className="text-[10px] font-bold uppercase tracking-widest text-zinc-505 flex items-center flex-wrap gap-2">
                <span>Subjects</span>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <span className="truncate max-w-[150px]">{subjectName}</span>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <span className="truncate max-w-[150px]">{moduleData.title}</span>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <span className="text-black font-extrabold truncate max-w-[200px]">{activeSubtopic.title}</span>
              </nav>

              {/* Subtopic Header Info */}
              <div className="border-b-2 border-black pb-4">
                <h2 className="text-3xl font-black uppercase tracking-tight text-black leading-tight">
                  {activeSubtopic.title}
                </h2>
                <p className="text-sm text-zinc-650 font-medium font-sans mt-2 max-w-3xl leading-relaxed">
                  {activeSubtopic.description}
                </p>
                {activeSubtopic.co && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-200 border border-zinc-400 text-zinc-700 px-2 py-0.5">
                      {activeSubtopic.co}
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic Tabbed Resource Viewer */}
              {availableTabs.length > 0 ? (
                <div className="space-y-4">
                  
                  {/* Tabs header row */}
                  <div className="flex flex-wrap gap-2 border-b border-zinc-205 pb-2">
                    {availableTabs.map((tab) => {
                      const tabLabels = {
                        lecture: "Lecture",
                        notes: "Notes",
                        audio: "Audio",
                        reference: "Reference"
                      };
                      const isActive = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-xs font-black uppercase tracking-wider px-4 py-2 border-2 border-black transition-all ${
                            isActive 
                              ? 'bg-black text-[#FAF9F5] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]' 
                              : 'bg-white text-zinc-700 hover:bg-zinc-50'
                          }`}
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
                      >
                        <div className="w-full flex flex-col gap-3">
                          {activeSubtopic.videoLanguages && activeSubtopic.videoLanguages.length > 0 && (
                            <div className="flex justify-end mb-1">
                              <select 
                                className="bg-white border-2 border-black text-xs font-bold px-2 py-1 focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono uppercase"
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
                        title="Study Notes & Lessons" 
                        subtitle="Read through compiled lessons and documentation."
                        actions={
                          notesList.length > 1 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {notesList.map((n: any, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedNoteUrl(n.url)}
                                  className={`text-[10px] font-bold px-2 py-1 border border-black transition-all ${
                                    selectedNoteUrl === n.url 
                                      ? 'bg-[#fbbf24] text-black font-extrabold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' 
                                      : 'bg-white hover:bg-zinc-50'
                                  }`}
                                >
                                  {n.title || `Doc ${idx + 1}`}
                                </button>
                              ))}
                            </div>
                          ) : null
                        }
                      >
                        {activeSubtopic.lessonContent ? (
                          <div className="prose max-w-none prose-slate p-4 sm:p-6 bg-white overflow-auto max-h-[600px] border border-zinc-200">
                            <div dangerouslySetInnerHTML={{ __html: marked.parse(activeSubtopic.lessonContent || '') as string }} />
                          </div>
                        ) : selectedNoteUrl ? (
                          <div className="w-full aspect-video min-h-[500px] bg-black overflow-hidden relative border border-zinc-300">
                            <iframe
                              src={getExternalEmbedUrl(selectedNoteUrl) || selectedNoteUrl}
                              className="w-full h-full border-0 bg-black absolute inset-0"
                              allow="autoplay; fullscreen"
                            />
                          </div>
                        ) : (
                          <div className="p-8 text-center text-zinc-550 font-sans border border-dashed border-zinc-350">
                            No notes content available.
                          </div>
                        )}
                      </BrandedViewerWrap>
                    )}

                    {activeTab === 'audio' && (
                      <BrandedViewerWrap 
                        title="Audio Lesson" 
                        subtitle="Listen to audio explanations and discussions."
                      >
                        <div className="w-full">
                          {activeSubtopic.audioLanguages && activeSubtopic.audioLanguages.length > 0 && (
                            <div className="flex justify-end mb-2">
                              <select 
                                className="bg-white border-2 border-black text-xs font-bold px-2 py-1 focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono uppercase"
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
                          <ResourceLinkTracker subtopicId={activeSubtopic.id} moduleId={id} resourceType="audio">
                            <InlineAudioPlayer 
                              url={selectedLanguages[activeSubtopic.id]?.audio || defaultAudioUrl} 
                              title={activeSubtopic.title} 
                            />
                          </ResourceLinkTracker>
                        </div>
                      </BrandedViewerWrap>
                    )}

                    {activeTab === 'reference' && (
                      <BrandedViewerWrap 
                        title="Reference Material" 
                        subtitle="Access reference sheets, books, and external documents."
                        actions={
                          activeSubtopic.referenceUrl ? (
                            <a 
                              href={activeSubtopic.referenceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-white border border-black hover:bg-zinc-50 text-black font-bold text-[10px] py-1 px-2.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 uppercase font-mono"
                            >
                              <ExternalLink className="w-3 h-3" /> External Link
                            </a>
                          ) : null
                        }
                      >
                        {activeSubtopic.referenceUrl ? (
                          <div className="w-full aspect-video min-h-[500px] bg-black overflow-hidden relative border border-zinc-300">
                            <iframe
                              src={getExternalEmbedUrl(activeSubtopic.referenceUrl) || activeSubtopic.referenceUrl}
                              className="w-full h-full border-0 bg-black absolute inset-0"
                              allow="autoplay; fullscreen"
                            />
                          </div>
                        ) : (
                          <div className="p-8 text-center text-zinc-550 font-sans border border-dashed border-zinc-350">
                            No reference material available.
                          </div>
                        )}
                      </BrandedViewerWrap>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-black bg-white p-12 text-center text-zinc-550 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase tracking-wider">
                  No learning resources registered for this topic yet.
                </div>
              )}

              {/* Topic Summary / Takeaways Section */}
              {activeSubtopic.didYouKnowUrl && (
                <div className="border-2 border-black bg-[#FEF3C7] text-amber-950 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 border border-amber-300 rounded shrink-0">
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
                    className="bg-white border-2 border-black hover:bg-zinc-50 text-black font-bold text-xs py-1.5 px-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all shrink-0 uppercase font-mono"
                  >
                    Read Case Study
                  </a>
                </div>
              )}

              {/* Learning Toolkit Section (List Style) */}
              {toolkitItems.length > 0 && (
                <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-8">
                  <div className="flex items-center gap-2 border-b border-black pb-2 mb-3">
                    <Brain className="w-4 h-4 text-[#fbbf24] fill-black stroke-black" />
                    <h3 className="font-black text-sm uppercase tracking-tight text-black">Learning Toolkit</h3>
                  </div>
                  <div className="flex flex-col divide-y divide-zinc-200">
                    {toolkitItems.map((item, idx) => {
                      const content = (
                        <div className={`flex items-center justify-between py-2.5 transition-colors ${item.available ? 'hover:bg-zinc-50 px-2' : 'opacity-50 px-2 cursor-not-allowed'}`}>
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-[#FAF9F5] border border-black rounded shrink-0">
                              {item.icon}
                            </div>
                            <span className="font-bold text-xs text-zinc-900">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                              item.available 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                                : 'bg-zinc-100 text-zinc-500 border-zinc-300'
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-zinc-300">
                {prevSubtopic ? (
                  <button
                    onClick={() => setActiveSubtopicIndex(activeSubtopicIndex - 1)}
                    className="w-full sm:w-auto bg-white border-2 border-black hover:bg-zinc-50 text-black font-bold text-xs py-3 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all flex items-center justify-center gap-2 uppercase font-mono"
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
                    className="w-full sm:w-auto bg-[#2dd4bf] border-2 border-black hover:bg-[#2dd4bf]/90 text-black font-bold text-xs py-3 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all flex items-center justify-center gap-2 uppercase font-mono ml-auto"
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
            <div className="flex-1 p-12 text-center text-zinc-505 font-bold border-2 border-dashed border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              NO ACTIVE SUBTOPIC SELECTION
            </div>
          )}

        </div>
      </div>
    </div>
  );
}