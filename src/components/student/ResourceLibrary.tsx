"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import {
  ChevronDown, ArrowLeft, Search, Play, Headphones, BookOpen,
  FileText, Layers, Target, Brain, Image as ImageIcon, Gamepad2, SlidersHorizontal, Info
} from "lucide-react";

// Resource type configuration
const TYPE_CONFIG: Record<string, {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  actionLabel: string;
  iconColor: string;
}> = {
  videos: {
    title: "Video Library",
    subtitle: "Watch video tutorials and code-along walkthroughs grouped by module.",
    icon: Play,
    actionLabel: "Watch",
    iconColor: "text-red-500 bg-red-50"
  },
  audio: {
    title: "Audio Lessons",
    subtitle: "Listen to conceptual explanations and audio lectures on the go.",
    icon: Headphones,
    actionLabel: "Listen",
    iconColor: "text-blue-500 bg-blue-50"
  },
  notes: {
    title: "Lecture Notes",
    subtitle: "Browse study notes, detailed subtopic readouts, and lecture summaries.",
    icon: BookOpen,
    actionLabel: "Read",
    iconColor: "text-teal-500 bg-teal-50"
  },
  pdfs: {
    title: "PDF Resources",
    subtitle: "Explore textbook chapters, reference files, and reading guides.",
    icon: FileText,
    actionLabel: "Open PDF",
    iconColor: "text-[#4f46e5] bg-indigo-50"
  },
  flashcards: {
    title: "Spaced Flashcards",
    subtitle: "Test your retention with active recall spaced repetition decks.",
    icon: Layers,
    actionLabel: "Study",
    iconColor: "text-amber-500 bg-amber-50"
  },
  quizzes: {
    title: "Assessment Quizzes",
    subtitle: "Evaluate your understanding with adaptive subtopic quizzes.",
    icon: Target,
    actionLabel: "Attempt",
    iconColor: "text-emerald-500 bg-emerald-50"
  },
  mindmaps: {
    title: "Concept Mind Maps",
    subtitle: "Visualize relationships and topology hierarchies between design patterns.",
    icon: Brain,
    actionLabel: "View Map",
    iconColor: "text-purple-500 bg-purple-50"
  },
  infographics: {
    title: "Visual Infographics",
    subtitle: "Examine visual guidelines, padding structures, and design cheatsheets.",
    icon: ImageIcon,
    actionLabel: "View Image",
    iconColor: "text-pink-500 bg-pink-50"
  },
  simulations: {
    title: "Interactive Simulations",
    subtitle: "Practice design system rules inside interactive visual sandboxes.",
    icon: Gamepad2,
    actionLabel: "Run Sim",
    iconColor: "text-sky-500 bg-sky-50"
  }
};

interface ResourceLibraryProps {
  resourceType: "videos" | "audio" | "notes" | "pdfs" | "flashcards" | "quizzes" | "mindmaps" | "infographics" | "simulations";
  dataSource?: any;
}

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

export default function ResourceLibrary({ resourceType, dataSource }: ResourceLibraryProps) {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId") || "";

  const [loading, setLoading] = useState(!dataSource);
  const [data, setData] = useState<any>(dataSource || null);
  const [subjectName, setSubjectName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filters state
  const [selectedModuleId, setSelectedModuleId] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all"); // For videos/audio
  const [sortBy, setSortBy] = useState("default"); // 'default' | 'alphabetical'

  // Collapsed sections tracking state (moduleId: boolean)
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  const config = TYPE_CONFIG[resourceType] || TYPE_CONFIG.notes;

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

  const IconComponent = config.icon;

  // Load subject workspace data if not pre-provided
  useEffect(() => {
    if (dataSource) {
      setData(dataSource);
      setLoading(false);
      return;
    }

    if (subjectId) {
      const loadDashboardData = async () => {
        try {
          const result = await fetchGAS("getStudentDashboard", {
            userId: "anonymous",
            subjectId: subjectId
          });
          setData(result);
        } catch (err) {
          console.error("Failed to load library dashboard data", err);
        } finally {
          setLoading(false);
        }
      };
      loadDashboardData();
    }
  }, [subjectId, dataSource]);

  // Extract subject name
  useEffect(() => {
    if (data?.subject?.name) {
      setSubjectName(data.subject.name);
    }
  }, [data]);

  // Helper to parse notes URL
  const getParsedNotes = (notesUrl: string | null | undefined) => {
    if (!notesUrl) return [];
    let cleanUrl = notesUrl.replace(/drive\.https:\/\//g, "https://");
    if (cleanUrl.startsWith("drive.google.com")) cleanUrl = "https://" + cleanUrl;
    try {
      const parsed = JSON.parse(cleanUrl);
      if (Array.isArray(parsed)) return parsed;
      return [{ title: "Study Guide Notes", url: cleanUrl }];
    } catch (e) {
      return [{ title: "Study Guide Notes", url: cleanUrl }];
    }
  };

  // Helper to resolve subtopic from title for mindmaps/infographics/sims
  const findSubtopicByTitle = (title: string, modulesList: any[]) => {
    for (const mod of modulesList) {
      const matched = (mod.subtopics || []).find(
        (st: any) => st.title.toLowerCase().trim() === title.toLowerCase().trim()
      );
      if (matched) return { moduleId: mod.id, subtopicId: matched.id };
    }
    return null;
  };

  // Process raw data into uniform resource item objects
  const rawResourceItems = useMemo(() => {
    if (!data) return [];
    const modules = data.modules || [];
    const items: any[] = [];

    // Mappings based on Resource Type
    if (resourceType === "videos") {
      modules.forEach((mod: any) => {
        (mod.subtopics || []).forEach((sub: any) => {
          const hasVideo = sub.videoUrl || (sub.videoLanguages && sub.videoLanguages.length > 0);
          if (hasVideo) {
            items.push({
              id: sub.id,
              title: sub.title,
              description: sub.description || "Video lessons covering topics in depth.",
              moduleId: mod.id,
              moduleTitle: mod.title,
              moduleNo: mod.moduleNo,
              duration: sub.hours ? `${sub.hours} Hrs` : "Video",
              durationVal: sub.hours || 1,
              link: `/student/subjects/subject/videos/viewer?subjectId=${subjectId}&moduleId=${mod.id}&subtopicId=${sub.id}`
            });
          }
        });
      });
    } else if (resourceType === "audio") {
      modules.forEach((mod: any) => {
        (mod.subtopics || []).forEach((sub: any) => {
          const hasAudio = sub.audioUrl || (sub.audioLanguages && sub.audioLanguages.length > 0);
          if (hasAudio) {
            items.push({
              id: sub.id,
              title: sub.title,
              description: sub.description || "Audio explanation of layouts and properties.",
              moduleId: mod.id,
              moduleTitle: mod.title,
              moduleNo: mod.moduleNo,
              duration: "Audio Lesson",
              durationVal: 1,
              link: `/student/subjects/subject/audio/viewer?subjectId=${subjectId}&moduleId=${mod.id}&subtopicId=${sub.id}`
            });
          }
        });
      });
    } else if (resourceType === "notes") {
      modules.forEach((mod: any) => {
        (mod.subtopics || []).forEach((sub: any) => {
          const hasNotes = sub.notesUrl || sub.lessonContent || (sub.type === "notes" && sub.mediaUrl);
          if (hasNotes) {
            items.push({
              id: sub.id,
              title: sub.title,
              description: sub.description || "Comprehensive lecture notes and references.",
              moduleId: mod.id,
              moduleTitle: mod.title,
              moduleNo: mod.moduleNo,
              duration: "Study Notes",
              link: `/student/subjects/subject/notes/viewer?subjectId=${subjectId}&moduleId=${mod.id}&subtopicId=${sub.id}`
            });
          }
        });
      });
    } else if (resourceType === "pdfs") {
      // 1. Gather from subjectResources
      const subjectResources = data.subjectResources || [];
      subjectResources.forEach((res: any) => {
        const matchingMod = modules.find((m: any) => m.id === res.moduleId);
        items.push({
          id: res.id || res.link,
          title: res.title,
          description: "Subject level reading guide or manual.",
          moduleId: res.moduleId || "general",
          moduleTitle: matchingMod ? matchingMod.title : "General Reference PDFs",
          moduleNo: matchingMod ? matchingMod.moduleNo : 99,
          duration: "PDF Manual",
          link: `/student/subjects/subject/pdfs/viewer?subjectId=${subjectId}&moduleId=${res.moduleId || "general"}&resourceId=${encodeURIComponent(res.id || res.link)}`
        });
      });

      // 2. Gather from subtopic references
      modules.forEach((mod: any) => {
        (mod.subtopics || []).forEach((sub: any) => {
          if (sub.referenceUrl) {
            items.push({
              id: sub.id + "-ref",
              title: `${sub.title} Reference PDF`,
              description: "PDF files and textbook documents attached to subtopic.",
              moduleId: mod.id,
              moduleTitle: mod.title,
              moduleNo: mod.moduleNo,
              duration: "Subtopic PDF",
              link: `/student/subjects/subject/pdfs/viewer?subjectId=${subjectId}&moduleId=${mod.id}&subtopicId=${sub.id}`
            });
          }
        });
      });
    } else if (resourceType === "flashcards") {
      const decks = data.flashcardDecks || [];
      decks.forEach((deck: any) => {
        const matchingMod = modules.find((m: any) => m.id === deck.moduleId);
        // Clean title
        let cleanTitle = deck.title || "Active Recall Deck";
        const isNumeric = /^\d+(\.\d+)?$/.test(cleanTitle);
        if (isNumeric && matchingMod) {
          const parts = cleanTitle.split(".");
          const subNo = parts.length === 2 ? parseInt(parts[1], 10) : (deck.subtopicId || 1);
          const subtopic = (matchingMod.subtopics || []).find((st: any) => st.subtopicNo === subNo || st.order === subNo);
          if (subtopic?.title) cleanTitle = subtopic.title;
        }

        items.push({
          id: deck.id,
          title: cleanTitle,
          description: `${deck.cards?.length || 0} active recall cards.`,
          moduleId: deck.moduleId,
          moduleTitle: matchingMod ? matchingMod.title : "Flashcards module",
          moduleNo: matchingMod ? matchingMod.moduleNo : 1,
          duration: `${deck.cards?.length || 0} Cards`,
          link: `/student/subjects/subject/flashcards/viewer?subjectId=${subjectId}&moduleId=${deck.moduleId}&subtopicId=${deck.subtopicId}`
        });
      });
    } else if (resourceType === "quizzes") {
      const quizzes = data.quizzesWithAttempts || data.quizzes || [];
      quizzes.forEach((quiz: any) => {
        const matchingMod = modules.find((m: any) => m.id === quiz.moduleId);
        // Clean title
        let displayTitle = quiz.title || "Subject Assessment";
        if (matchingMod && (displayTitle.includes("Module") || displayTitle.match(/^\d+(\.\d+)?$/))) {
          const subNo = quiz.subtopicId || 1;
          const subtopic = (matchingMod.subtopics || []).find((st: any) => st.subtopicNo === subNo || st.id === quiz.subtopicId);
          if (subtopic?.title) displayTitle = subtopic.title;
        }

        items.push({
          id: quiz.id,
          title: displayTitle,
          description: `${quiz.questions?.length || 0} questions to test core knowledge.`,
          moduleId: quiz.moduleId,
          moduleTitle: matchingMod ? matchingMod.title : "Module Quiz",
          moduleNo: matchingMod ? matchingMod.moduleNo : 1,
          duration: `${quiz.questions?.length || 0} Qs`,
          link: `/student/subjects/subject/quizzes/viewer?subjectId=${subjectId}&moduleId=${quiz.moduleId}&subtopicId=${quiz.subtopicId}`
        });
      });
    } else if (resourceType === "mindmaps") {
      const maps = data.mindmaps || [];
      maps.forEach((map: any) => {
        const matchingMod = modules.find((m: any) => m.id === map.moduleId);
        const resolvedSub = findSubtopicByTitle(map.title, modules);

        items.push({
          id: map.id,
          title: map.title,
          description: "Visual concept map illustrating layouts and nodes.",
          moduleId: map.moduleId,
          moduleTitle: matchingMod ? matchingMod.title : "Mind Maps Group",
          moduleNo: matchingMod ? matchingMod.moduleNo : 1,
          duration: "Mind Map",
          link: `/student/subjects/subject/mindmaps/viewer?subjectId=${subjectId}&moduleId=${map.moduleId}&subtopicId=${resolvedSub ? resolvedSub.subtopicId : ""}`
        });
      });
    } else if (resourceType === "infographics") {
      const graphics = data.infographics || [];
      graphics.forEach((info: any) => {
        const matchingMod = modules.find((m: any) => m.id === info.moduleId);
        const resolvedSub = findSubtopicByTitle(info.title, modules);

        items.push({
          id: info.id,
          title: info.title,
          description: "Graphic blueprints detailing rules and ratios.",
          moduleId: info.moduleId,
          moduleTitle: matchingMod ? matchingMod.title : "Infographic Group",
          moduleNo: matchingMod ? matchingMod.moduleNo : 1,
          duration: "Infographic",
          link: `/student/subjects/subject/infographics/viewer?subjectId=${subjectId}&moduleId=${info.moduleId}&subtopicId=${resolvedSub ? resolvedSub.subtopicId : ""}`
        });
      });
    } else if (resourceType === "simulations") {
      const sims = data.simulations || [];
      sims.forEach((sim: any) => {
        const matchingMod = modules.find((m: any) => m.id === sim.moduleId);

        items.push({
          id: sim.id,
          title: sim.title,
          description: sim.description || "Interactive browser preview or workspace sandbox.",
          moduleId: sim.moduleId,
          moduleTitle: matchingMod ? matchingMod.title : "Simulation Group",
          moduleNo: matchingMod ? matchingMod.moduleNo : 1,
          duration: "Simulation",
          link: `/student/subjects/subject/simulations/viewer?subjectId=${subjectId}&moduleId=${sim.moduleId}&subtopicId=${sim.subtopicId || ""}`
        });
      });
    }

    return items;
  }, [data, resourceType, subjectId]);

  // Filtered & Sorted Resource list
  const filteredResourceItems = useMemo(() => {
    let items = [...rawResourceItems];

    // Search query filter (matches module title, topic title, resource title)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          String(item.title).toLowerCase().includes(query) ||
          String(item.description).toLowerCase().includes(query) ||
          String(item.moduleTitle).toLowerCase().includes(query)
      );
    }

    // Module selection filter
    if (selectedModuleId !== "all") {
      items = items.filter((item) => item.moduleId === selectedModuleId);
    }

    // Duration filter (only for videos/audio)
    if ((resourceType === "videos" || resourceType === "audio") && selectedDuration !== "all") {
      items = items.filter((item) => {
        const hours = item.durationVal || 0;
        if (selectedDuration === "short") return hours <= 1;
        if (selectedDuration === "medium") return hours > 1 && hours <= 3;
        if (selectedDuration === "long") return hours > 3;
        return true;
      });
    }

    // Alphabetical Sorting
    if (sortBy === "alphabetical") {
      items.sort((a, b) => String(a.title).localeCompare(String(b.title)));
    }

    return items;
  }, [rawResourceItems, searchQuery, selectedModuleId, selectedDuration, sortBy, resourceType]);

  // Group items by Module to display Collapsible Blocks
  const groupedModules = useMemo(() => {
    const modulesMap: Record<string, {
      id: string;
      title: string;
      moduleNo: number;
      resources: any[];
    }> = {};

    // Get all module headers to render empty if filtered
    const allModulesList = data?.modules || [];
    allModulesList.forEach((mod: any) => {
      // Only include module if it is not filtered by Module selector
      if (selectedModuleId === "all" || selectedModuleId === mod.id) {
        modulesMap[mod.id] = {
          id: mod.id,
          title: mod.title ? mod.title.replace(/^[●•]\s*/, "") : `Module ${mod.moduleNo}`,
          moduleNo: mod.moduleNo,
          resources: []
        };
      }
    });

    // Add extra row for General Reference Resources (like pdfs without module)
    if (selectedModuleId === "all" || selectedModuleId === "general") {
      modulesMap["general"] = {
        id: "general",
        title: "General Reference Materials",
        moduleNo: 99,
        resources: []
      };
    }

    // Group actual resources
    filteredResourceItems.forEach((item) => {
      if (modulesMap[item.moduleId]) {
        modulesMap[item.moduleId].resources.push(item);
      }
    });

    // Sort groups by moduleNo and filter out groups with no resources
    return Object.values(modulesMap)
      .filter((group) => group.resources.length > 0)
      .sort((a, b) => a.moduleNo - b.moduleNo);
  }, [filteredResourceItems, data, selectedModuleId]);

  // Toggle Collapse block helper
  const toggleModule = (id: string) => {
    setCollapsedModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${t.bg} flex flex-col justify-center items-center font-sans space-y-4`}>
        <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${isUiProgramming ? 'border-black' : isPythonProgramming ? 'border-[#3776AB]' : isDigitalBusiness ? 'border-[#0F766E]' : 'border-blue-650'}`} />
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 animate-pulse">Loading Resource Library...</p>
      </div>
    );
  }

  const allModulesList = data?.modules || [];

  return (
    <div className={`min-h-screen ${t.bg} ${t.pattern} pb-24 relative overflow-hidden antialiased selection:bg-[#4f46e5]/10 selection:text-[#4f46e5] ${isPythonProgramming ? 'font-mono' : 'font-sans'}`}>
      {/* Dynamic top thick strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isUiProgramming
          ? 'bg-black'
          : isPythonProgramming
            ? 'bg-[#3776AB]'
            : isDigitalBusiness
              ? 'bg-[#0F766E]'
              : 'bg-blue-600'
      }`} />

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

      <div className="container mx-auto px-4 mt-8 relative z-10 max-w-4xl space-y-8">

        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Link href={`/student/subjects/subject?subjectId=${subjectId}`}>
            <button className={`${t.btnGhost} flex items-center gap-1.5 uppercase h-9 shadow-xs text-xs px-4 py-2 cursor-pointer`}>
              <ArrowLeft className="w-4 h-4" />
              <span>Workspace Dashboard</span>
            </button>
          </Link>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border ${
            isUiProgramming
              ? 'text-zinc-800 bg-white border-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]'
              : 'bg-white border-slate-200 text-zinc-550 rounded shadow-xs'
          }`}>
            {subjectName || "WORKSPACE"}
          </span>
        </div>

        {/* RESOURCE HEADER HERO */}
        <header className={`bg-white p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center ${t.borderClass} ${t.shadowClass}`}>
          <div className={`w-12 h-12 flex items-center justify-center shrink-0 ${
            isUiProgramming
              ? 'border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-none'
              : isPythonProgramming
                ? 'border border-slate-200 bg-blue-50/10 rounded text-[#3776AB]'
                : isDigitalBusiness
                  ? 'border border-[#0F766E]/10 bg-[#0F766E]/5 rounded-lg text-[#0F766E]'
                  : 'border border-blue-200 bg-blue-55 rounded-lg text-blue-600'
          }`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight leading-none ${isPythonProgramming ? 'font-mono' : ''}`}>
              {config.title}
            </h1>
            <p className={`text-zinc-500 text-xs font-bold mt-2.5 leading-relaxed max-w-xl ${isPythonProgramming ? 'font-mono' : ''}`}>
              {config.subtitle}
            </p>
          </div>
        </header>

        {/* SEARCH & FILTERS BAR */}
        <section className={`bg-white p-4 space-y-4 ${t.borderClass} ${t.shadowClass}`}>

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
            <input
              type="text"
              placeholder="Search by topic title, module title or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 text-xs text-black focus:outline-hidden transition-all font-bold ${
                isUiProgramming
                  ? 'bg-[#FAF9F5] border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_rgba(239,68,68,1)] focus:-translate-x-0.5 focus:-translate-y-0.5'
                  : isPythonProgramming
                    ? 'bg-white border border-slate-200 rounded shadow-xs focus:border-[#3776AB] focus:ring-1 focus:ring-[#3776AB] font-mono'
                    : 'bg-white border border-slate-200 rounded-xl shadow-xs focus:ring-2 focus:ring-[#0F766E] font-sans'
              }`}
            />
          </div>

          {/* Filters controls */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">

            {/* Filter icon prefix */}
            <div className="flex items-center gap-1.5 text-zinc-700 font-extrabold uppercase shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </div>

            {/* Modules Filter Dropdown */}
            <div className="flex flex-col gap-1 min-w-[140px] flex-1">
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className={`bg-white p-1.5 text-xs font-bold outline-none cursor-pointer ${
                  isUiProgramming
                    ? 'border-2 border-black rounded-none'
                    : isPythonProgramming
                      ? 'border border-slate-200 rounded font-mono'
                      : 'border border-slate-200 rounded-xl font-sans'
                }`}
              >
                <option value="all">📚 All Modules</option>
                {allModulesList.map((mod: any) => (
                  <option key={mod.id} value={mod.id}>
                    Module {mod.moduleNo}: {mod.title ? mod.title.replace(/^[●•]\s*/, "").substring(0, 24) : ""}...
                  </option>
                ))}
                {resourceType === "pdfs" && <option value="general">General Reference Materials</option>}
              </select>
            </div>

            {/* Video/Audio Duration Filter */}
            {(resourceType === "videos" || resourceType === "audio") && (
              <div className="flex flex-col gap-1 min-w-[130px] flex-1">
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className={`bg-white p-1.5 text-xs font-bold outline-none cursor-pointer ${
                    isUiProgramming
                      ? 'border-2 border-black rounded-none'
                      : isPythonProgramming
                        ? 'border border-slate-200 rounded font-mono'
                        : 'border border-slate-200 rounded-xl font-sans'
                  }`}
                >
                  <option value="all">⏱ All Durations</option>
                  <option value="short">⚡ Short (≤ 1 hr)</option>
                  <option value="medium">⌛ Medium (1 - 3 hrs)</option>
                  <option value="long">🚀 Extended (&gt; 3 hrs)</option>
                </select>
              </div>
            )}

            {/* Sort order Dropdown */}
            <div className="flex flex-col gap-1 min-w-[120px] flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`bg-white p-1.5 text-xs font-bold outline-none cursor-pointer ${
                  isUiProgramming
                    ? 'border-2 border-black rounded-none'
                    : isPythonProgramming
                      ? 'border border-slate-200 rounded font-mono'
                      : 'border border-slate-200 rounded-xl font-sans'
                }`}
              >
                <option value="default">🔢 Default Index</option>
                <option value="alphabetical">🔤 Alphabetical (A-Z)</option>
              </select>
            </div>

          </div>
        </section>

        {/* COLLAPSIBLE MODULE GROUPS SECTION */}
        <section className="space-y-6">
          {groupedModules.map((group) => {
            const isCollapsed = !!collapsedModules[group.id];
            return (
              <div
                key={group.id}
                className={`bg-white overflow-hidden transition-all duration-150 ${t.borderClass} ${t.shadowClass}`}
              >
                {/* Collapsible Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(group.id)}
                  className={`w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 border-b ${
                    isUiProgramming ? 'border-b-2 border-black' : 'border-slate-100'
                  } text-left cursor-pointer outline-none`}
                >
                  <div>
                    <span className={`text-[9px] font-mono font-extrabold uppercase tracking-widest px-1.5 py-0.5 ${
                      isUiProgramming
                        ? 'text-[#EF4444] bg-red-50 border border-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]'
                        : isPythonProgramming
                          ? 'text-[#3776AB] bg-blue-50/30 border border-slate-200 rounded'
                          : isDigitalBusiness
                            ? 'text-[#0F766E] bg-[#0F766E]/5 border border-[#0F766E]/10 rounded-md'
                            : 'text-blue-600 bg-blue-50 border border-blue-200 rounded-md'
                    }`}>
                      {group.moduleNo === 99 ? "GENERAL" : `Module ${group.moduleNo < 10 ? `0${group.moduleNo}` : group.moduleNo}`}
                    </span>
                    <h3 className={`text-sm font-black uppercase text-black leading-snug mt-1.5 ${isPythonProgramming ? 'font-mono' : ''}`}>
                      {group.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border text-zinc-800 ${
                      isUiProgramming ? 'bg-slate-200/80 border-black rounded-none' : 'bg-slate-100 border-slate-200 rounded-md'
                    }`}>
                      {group.resources.length} {group.resources.length === 1 ? "Item" : "Items"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-black transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} />
                  </div>
                </button>

                {/* Collapsed Items Container */}
                {!isCollapsed && (
                  <div className={`divide-y bg-white ${isUiProgramming ? 'divide-black divide-y-2' : 'divide-slate-100'}`}>
                    {group.resources.map((item: any) => {
                      const actionBtnClass = isUiProgramming
                        ? "bg-[#EF4444] hover:bg-[#dc2626] border-2 border-black rounded-none shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] text-white font-black uppercase tracking-wider text-[10px] px-3.5 py-1.5 h-8.5 hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] transition-all cursor-pointer"
                        : isPythonProgramming
                          ? "bg-[#3776AB] hover:bg-[#2b5b84] text-white font-bold text-xs px-3.5 py-1.5 h-8.5 rounded transition-all cursor-pointer font-mono shadow-xs"
                          : isDigitalBusiness
                            ? "bg-[#0F766E] hover:bg-[#0d635c] text-white font-semibold text-xs px-3.5 py-1.5 h-8.5 rounded-xl transition-all cursor-pointer shadow-xs"
                            : "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 h-8.5 rounded-xl transition-all cursor-pointer shadow-xs";

                      const itemTitleClass = isUiProgramming 
                        ? 'group-hover:text-[#EF4444]' 
                        : isPythonProgramming 
                          ? 'group-hover:text-[#3776AB] font-mono' 
                          : isDigitalBusiness 
                            ? 'group-hover:text-[#0F766E]' 
                            : 'group-hover:text-blue-600';

                      return (
                        <div
                          key={item.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-start gap-3.5 min-w-0 flex-1">
                            <div className={`w-8 h-8 flex items-center justify-center shrink-0 transition-colors duration-150 bg-white ${
                              isUiProgramming
                                ? 'border border-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] rounded-none group-hover:bg-[#EF4444] group-hover:text-white'
                                : isPythonProgramming
                                  ? 'border border-slate-200 rounded group-hover:bg-[#3776AB] group-hover:text-white text-[#3776AB]'
                                  : isDigitalBusiness
                                    ? 'border border-slate-200 rounded-lg group-hover:bg-[#0F766E] group-hover:text-white text-[#0F766E]'
                                    : 'border border-slate-200 rounded-lg group-hover:bg-blue-600 group-hover:text-white text-blue-600'
                            }`}>
                              <IconComponent className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className={`text-black font-extrabold text-xs tracking-wide uppercase leading-tight ${itemTitleClass} transition-colors duration-150`}>
                                {item.title}
                              </span>
                              <span className={`text-[10px] text-zinc-500 font-bold leading-relaxed mt-1 line-clamp-2 ${isPythonProgramming ? 'font-mono' : 'font-sans'}`}>
                                {item.description}
                              </span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            {item.duration && (
                              <span className={`text-[8px] font-mono font-bold uppercase bg-slate-100 border px-1.5 py-0.5 text-zinc-700 shrink-0 ${
                                isUiProgramming ? 'border-black rounded-none' : 'border-slate-200 rounded'
                              }`}>
                                {item.duration}
                              </span>
                            )}
                            <Link href={item.link}>
                              <button className={actionBtnClass}>
                                <span>{config.actionLabel}</span>
                                <span className="ml-1">→</span>
                              </button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {groupedModules.length === 0 && (
            <div className={`text-center py-12 border-4 border-dashed bg-white ${
              isUiProgramming ? 'border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]' : 'border-slate-200 shadow-xs rounded-xl'
            }`}>
              <Info className="w-8 h-8 mx-auto text-zinc-400" />
              <p className="text-sm font-bold text-zinc-700 mt-2">No matching resource files found in this library.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedModuleId("all");
                  setSelectedDuration("all");
                }}
                className={`mt-3 text-xs font-mono font-extrabold uppercase hover:underline ${
                  isUiProgramming ? 'text-[#EF4444]' : isPythonProgramming ? 'text-[#3776AB]' : isDigitalBusiness ? 'text-[#0F766E]' : 'text-blue-600'
                }`}
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
