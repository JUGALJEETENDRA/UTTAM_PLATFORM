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
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center font-sans space-y-4">
        <div className="w-10 h-10 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 animate-pulse">Loading Resource Library...</p>
      </div>
    );
  }

  const allModulesList = data?.modules || [];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-black pb-24 relative overflow-hidden font-sans antialiased selection:bg-[#4f46e5]/10 selection:text-[#4f46e5]">
      {/* Decorative neobrutalist header strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black" />

      <div className="container mx-auto px-4 mt-8 relative z-10 max-w-4xl space-y-8">

        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Link href={`/student/subjects/subject?subjectId=${subjectId}`}>
            <Button className="bg-white hover:bg-slate-50 border-2 border-black text-black font-extrabold uppercase text-xs px-4 py-2 h-9 rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="w-4 h-4 text-black" />
              <span>Workspace Dashboard</span>
            </Button>
          </Link>
          <span className="text-[10px] font-mono font-bold text-zinc-550 uppercase tracking-widest bg-indigo-50/50 border border-black px-2 py-0.5 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
            {subjectName || "WORKSPACE"}
          </span>
        </div>

        {/* RESOURCE HEADER HERO */}
        <header className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className={`w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] ${config.iconColor}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight leading-none">
              {config.title}
            </h1>
            <p className="text-zinc-655 text-xs font-bold mt-2.5 leading-relaxed max-w-xl">
              {config.subtitle}
            </p>
          </div>
        </header>

        {/* SEARCH & FILTERS BAR */}
        <section className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-4">

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by topic title, module title or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs text-black bg-[#FAF9F5] border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_rgba(79,70,229,1)] focus:translate-y-[-1px] transition-all font-bold outline-none"
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
                className="bg-white border-2 border-black p-1.5 text-xs font-bold outline-none cursor-pointer rounded-none"
              >
                <option value="all">📚 All Modules</option>
                {allModulesList.map((mod: any) => (
                  <option key={mod.id} value={mod.id}>
                    Module {mod.moduleNo}: {mod.title ? mod.title.replace(/^[●•]\s*/, "").substring(0, 24) : ""}...
                  </option>
                ))}
                {resourceType === "pdfs" && <option value="general">💼 General PDFs</option>}
              </select>
            </div>

            {/* Video/Audio Duration Filter */}
            {(resourceType === "videos" || resourceType === "audio") && (
              <div className="flex flex-col gap-1 min-w-[130px] flex-1">
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="bg-white border-2 border-black p-1.5 text-xs font-bold outline-none cursor-pointer rounded-none"
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
                className="bg-white border-2 border-black p-1.5 text-xs font-bold outline-none cursor-pointer rounded-none"
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
                className="border-4 border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden transition-all duration-150"
              >
                {/* Collapsible Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(group.id)}
                  className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100 border-b-4 border-black text-left cursor-pointer outline-none focus-visible:bg-zinc-150"
                >
                  <div>
                    <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-[#4f46e5] bg-indigo-50 border border-black px-1.5 py-0.5 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      {group.moduleNo === 99 ? "GENERAL" : `Module ${group.moduleNo < 10 ? `0${group.moduleNo}` : group.moduleNo}`}
                    </span>
                    <h3 className="text-sm font-black uppercase text-black leading-snug mt-1.5">
                      {group.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono font-bold uppercase bg-slate-200/80 px-2 py-0.5 border border-black text-zinc-800">
                      {group.resources.length} {group.resources.length === 1 ? "Item" : "Items"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-black transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} />
                  </div>
                </button>

                {/* Collapsed Items Container */}
                {!isCollapsed && (
                  <div className="divide-y-2 divide-zinc-200 bg-white">
                    {group.resources.map((item: any) => (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-none border border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_rgba(0,0,0,1)] group-hover:bg-[#4f46e5] group-hover:text-white transition-colors duration-150 ${config.iconColor}`}>
                            <IconComponent className="w-4.5 h-4.5" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-black font-extrabold text-xs tracking-wide uppercase leading-tight group-hover:text-[#4f46e5] transition-colors duration-150">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-zinc-655 font-bold leading-relaxed mt-1 line-clamp-2">
                              {item.description}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          {item.duration && (
                            <span className="text-[8px] font-mono font-bold uppercase bg-slate-100 border border-black px-1.5 py-0.5 text-zinc-700 shrink-0">
                              {item.duration}
                            </span>
                          )}
                          <Link href={item.link}>
                            <Button className="bg-black hover:bg-zinc-900 text-white font-black uppercase tracking-wider text-[10px] px-3.5 py-1.5 h-8.5 rounded-none border-2 border-black shadow-[2.5px_2.5px_0px_rgba(79,70,229,1)] hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] transition-all cursor-pointer">
                              <span>{config.actionLabel}</span>
                              <span className="ml-1">→</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {groupedModules.length === 0 && (
            <div className="text-center py-12 border-4 border-dashed border-zinc-300 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <Info className="w-8 h-8 mx-auto text-zinc-400" />
              <p className="text-sm font-bold text-zinc-700 mt-2">No matching resource files found in this library.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedModuleId("all");
                  setSelectedDuration("all");
                }}
                className="mt-3 text-xs font-mono font-extrabold uppercase text-[#4f46e5] hover:underline"
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
