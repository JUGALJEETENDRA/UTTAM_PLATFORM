"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Grid, CheckCircle2, XCircle, ChevronRight, Video, Headphones, FileText, FileQuestion, BookOpen, Link as LinkIcon, Gamepad2, Layers, Brain, Search, Map, Eye } from "lucide-react";
import { fetchGAS } from "@/lib/apiClient";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const RESOURCE_TYPES = [
  { id: "video", label: "Video", icon: Video, color: "text-red-500", href: "modules" },
  { id: "audio", label: "Audio", icon: Headphones, color: "text-orange-500", href: "modules" },
  { id: "notes", label: "Notes", icon: FileText, color: "text-blue-500", href: "modules" },
  { id: "quiz", label: "Quiz", icon: Brain, color: "text-purple-500", href: "quizzes" },
  { id: "simulation", label: "Simulation", icon: Gamepad2, color: "text-indigo-500", href: "simulations" },
  { id: "flashcard", label: "Flashcards", icon: Layers, color: "text-pink-500", href: "flashcards" },
  { id: "mindmap", label: "Mind Map", icon: Map, color: "text-cyan-500", href: "mindmaps" },
  { id: "infographic", label: "Infographic", icon: Map, color: "text-teal-500", href: "infographics" },
  { id: "reference", label: "Reference", icon: BookOpen, color: "text-emerald-500", href: "modules" },
  { id: "didYouKnow", label: "Did You Know", icon: FileQuestion, color: "text-amber-500", href: "modules" },
  { id: "other", label: "Other Link", icon: LinkIcon, color: "text-slate-500", href: "modules" },
];

export default function ContentMatrixClientPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [mindmaps, setMindmaps] = useState<any[]>([]);
  const [infographics, setInfographics] = useState<any[]>([]);
  
  const [selectedModuleId, setSelectedModuleId] = useState<string>("ALL");

  const [editingResource, setEditingResource] = useState<{
    moduleId: string;
    subtopicId: string;
    resourceType: string;
    currentUrl: string;
  } | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingVisibility, setEditingVisibility] = useState<{
    moduleId: string;
    subtopicId: string;
    subtopicNo: string;
    isVisible: boolean;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, [subjectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [modRes, qRes, simRes, flashRes, mindRes, infoRes] = await Promise.all([
        fetchGAS("getModules", { subjectId }).catch(() => []),
        fetchGAS("getQuizzes", { subjectId }).catch(() => []),
        fetchGAS("getSimulations", { subjectId }).catch(() => []),
        fetchGAS("getFlashcardDecks", { subjectId }).catch(() => []),
        fetchGAS("getMindMaps", { subjectId }).catch(() => []),
        fetchGAS("getInfographics", { subjectId }).catch(() => []),
      ]);
      
      setModules(Array.isArray(modRes) ? modRes : []);
      setQuizzes(Array.isArray(qRes) ? qRes : []);
      setSimulations(Array.isArray(simRes) ? simRes : []);
      setFlashcards(Array.isArray(flashRes) ? flashRes : []);
      setMindmaps(Array.isArray(mindRes) ? mindRes : []);
      setInfographics(Array.isArray(infoRes) ? infoRes : []);
      
    } catch (err) {
      console.error("Error fetching matrix data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSubtopicResourceStatus = (mod: any, st: any) => {
    let unpackedOther = { otherUrl: st.otherUrl, didYouKnowUrl: "", referenceUrl: "" };
    if (typeof st.otherUrl === 'string' && st.otherUrl.startsWith("{")) {
      try {
        const parsedOther = JSON.parse(st.otherUrl);
        unpackedOther = { ...unpackedOther, ...parsedOther };
      } catch(e) {}
    }
    
    let parsedData: any = {};
    if (typeof st.simulationData === 'string' && st.simulationData) {
      try { parsedData = JSON.parse(st.simulationData); } catch(e) {}
    } else if (typeof st.simulationData === 'object' && st.simulationData !== null) {
      parsedData = st.simulationData;
    }

    const hasVideo = !!(st.videoUrl || (st.type === 'video' ? st.mediaUrl : "") || (st.videoLanguages && st.videoLanguages.length > 0));
    const hasAudio = !!(parsedData.audioUrl || st.audioUrl || (st.type === 'audio' ? st.mediaUrl : "") || (st.audioLanguages && st.audioLanguages.length > 0));
    const hasNotes = !!(parsedData.notesUrl || st.notesUrl || (st.type === 'notes' ? st.mediaUrl : ""));
    const hasOther = !!(unpackedOther.otherUrl || parsedData.otherUrl || (st.type === 'other' ? st.mediaUrl : ""));
    const hasDidYouKnow = !!(unpackedOther.didYouKnowUrl || parsedData.didYouKnowUrl || st.didYouKnowUrl);
    const hasReference = !!(unpackedOther.referenceUrl || parsedData.referenceUrl || st.referenceUrl);

    // Interactive resources
    // Quizzes, Simulations, Flashcards map by subtopicId or subtopicNo
    const isMappedById = (items: any[]) => items.some(item => 
      item.subtopicId === st.id || item.subtopicId === st.subtopicNo
    );

    // Mindmaps and Infographics map by subtopicId OR (title and moduleId)
    const isMappedByTitle = (items: any[]) => items.some(item => 
      (item.subtopicId && (item.subtopicId === st.id || item.subtopicId === st.subtopicNo)) ||
      ((item.title || "").trim() === (st.title || "").trim() && item.moduleId === mod.id) ||
      ((item.title || "").trim() === (mod.title || "").trim() && item.moduleId === mod.id)
    );

    return {
      video: hasVideo,
      audio: hasAudio,
      notes: hasNotes,
      other: hasOther,
      didYouKnow: hasDidYouKnow,
      reference: hasReference,
      quiz: isMappedById(quizzes),
      simulation: isMappedById(simulations),
      flashcard: isMappedById(flashcards),
      mindmap: isMappedByTitle(mindmaps),
      infographic: isMappedByTitle(infographics)
    };
  };

  const getSubtopicResourceUrl = (st: any, resourceId: string) => {
    let unpackedOther = { otherUrl: st.otherUrl, didYouKnowUrl: "", referenceUrl: "" };
    if (typeof st.otherUrl === 'string' && st.otherUrl.startsWith("{")) {
      try {
        const parsedOther = JSON.parse(st.otherUrl);
        unpackedOther = { ...unpackedOther, ...parsedOther };
      } catch(e) {}
    }
    
    let parsedData: any = {};
    if (typeof st.simulationData === 'string' && st.simulationData) {
      try { parsedData = JSON.parse(st.simulationData); } catch(e) {}
    } else if (typeof st.simulationData === 'object' && st.simulationData !== null) {
      parsedData = st.simulationData;
    }
    
    switch (resourceId) {
      case 'video': return st.videoUrl || (st.type === 'video' ? st.mediaUrl : "") || "";
      case 'audio': return parsedData.audioUrl || st.audioUrl || (st.type === 'audio' ? st.mediaUrl : "") || "";
      case 'notes': return parsedData.notesUrl || st.notesUrl || (st.type === 'notes' ? st.mediaUrl : "") || "";
      case 'other': return unpackedOther.otherUrl || parsedData.otherUrl || (st.type === 'other' ? st.mediaUrl : "") || "";
      case 'didYouKnow': return unpackedOther.didYouKnowUrl || parsedData.didYouKnowUrl || st.didYouKnowUrl || "";
      case 'reference': return unpackedOther.referenceUrl || parsedData.referenceUrl || st.referenceUrl || "";
      default: return "";
    }
  };

  const openEditModal = (mod: any, st: any, resourceId: string) => {
    const currentUrl = getSubtopicResourceUrl(st, resourceId);
    setEditingResource({
      moduleId: mod.id,
      subtopicId: st.id,
      resourceType: resourceId,
      currentUrl
    });
    setNewUrl(currentUrl);
  };

  const handleSaveLink = async () => {
    if (!editingResource) return;
    setIsSaving(true);
    try {
      const targetModule = modules.find(m => m.id === editingResource.moduleId);
      if (!targetModule) throw new Error("Module not found locally");
      
      const updatedSubtopics = targetModule.subtopics.map((st: any) => {
        let parsedData: any = {};
        if (typeof st.simulationData === 'string' && st.simulationData) {
          try { parsedData = JSON.parse(st.simulationData); } catch(e) {}
        } else if (typeof st.simulationData === 'object' && st.simulationData !== null) {
          parsedData = st.simulationData;
        }

        let unpackedOther = { 
          otherUrl: st.otherUrl || "", 
          otherDownloadUrl: st.otherDownloadUrl || "", 
          didYouKnowUrl: st.didYouKnowUrl || "", 
          didYouKnowDownloadUrl: st.didYouKnowDownloadUrl || "", 
          referenceUrl: st.referenceUrl || "", 
          referenceDownloadUrl: st.referenceDownloadUrl || "",
          videoDownloadUrl: st.videoDownloadUrl || ""
        };
        if (typeof st.otherUrl === 'string' && st.otherUrl.startsWith("{")) {
          try { unpackedOther = { ...unpackedOther, ...JSON.parse(st.otherUrl) }; } catch(e) {}
        }

        if (st.id === editingResource.subtopicId) {
          if (editingResource.resourceType === 'video') st.videoUrl = newUrl;
          if (editingResource.resourceType === 'audio') { parsedData.audioUrl = newUrl; st.audioUrl = newUrl; }
          if (editingResource.resourceType === 'notes') { parsedData.notesUrl = newUrl; st.notesUrl = newUrl; }
          if (editingResource.resourceType === 'other') { unpackedOther.otherUrl = newUrl; st.otherUrl = newUrl; }
          if (editingResource.resourceType === 'didYouKnow') { unpackedOther.didYouKnowUrl = newUrl; st.didYouKnowUrl = newUrl; }
          if (editingResource.resourceType === 'reference') { unpackedOther.referenceUrl = newUrl; st.referenceUrl = newUrl; }
        }

        const newSimulationData = JSON.stringify({
          audioUrl: parsedData.audioUrl || st.audioUrl || "",
          audioLanguages: parsedData.audioLanguages || st.audioLanguages || [],
          notesUrl: parsedData.notesUrl || st.notesUrl || "",
          notesDownloadUrl: parsedData.notesDownloadUrl || st.notesDownloadUrl || "",
          videoUrl: st.videoUrl || "",
          videoDownloadUrl: unpackedOther.videoDownloadUrl || st.videoDownloadUrl || "",
          otherUrl: unpackedOther.otherUrl || "",
          otherDownloadUrl: unpackedOther.otherDownloadUrl || "",
          didYouKnowUrl: unpackedOther.didYouKnowUrl || "",
          didYouKnowDownloadUrl: unpackedOther.didYouKnowDownloadUrl || "",
          referenceUrl: unpackedOther.referenceUrl || "",
          referenceDownloadUrl: unpackedOther.referenceDownloadUrl || ""
        });

        const hasAnyOtherField = Object.values(unpackedOther).some(val => val !== "");
        const newOtherUrl = hasAnyOtherField ? JSON.stringify(unpackedOther) : "";

        let vidLangs = st.videoLanguages || [];
        if (typeof vidLangs === 'string') {
          try { vidLangs = JSON.parse(vidLangs); } catch(e){ vidLangs = []; }
        }
        let audLangs = st.audioLanguages || [];
        if (typeof audLangs === 'string') {
          try { audLangs = JSON.parse(audLangs); } catch(e){ audLangs = []; }
        }

        return {
          id: st.id,
          subtopicNo: st.subtopicNo || "",
          title: st.title || "",
          description: st.description || "",
          learningOutcome: st.learningOutcome || "",
          videoUrl: st.videoUrl || "",
          videoLanguages: JSON.stringify(vidLangs),
          notesUrl: st.notesUrl || "",
          notesDownloadUrl: st.notesDownloadUrl || "",
          otherUrl: newOtherUrl,
          otherDownloadUrl: st.otherDownloadUrl || "",
          audioUrl: st.audioUrl || "",
          audioLanguages: JSON.stringify(audLangs),
          audioDownloadUrl: st.audioDownloadUrl || "",
          didYouKnowUrl: st.didYouKnowUrl || "",
          didYouKnowDownloadUrl: st.didYouKnowDownloadUrl || "",
          referenceUrl: st.referenceUrl || "",
          referenceDownloadUrl: st.referenceDownloadUrl || "",
          simulationData: newSimulationData,
          type: st.type || "",
          mediaUrl: st.mediaUrl || "",
          isVisible: st.isVisible !== false
        };
      });

      const moduleDataToSave = {
        subjectId,
        moduleId: targetModule.id,
        moduleNo: targetModule.moduleNo?.toString() || "",
        title: targetModule.title || "",
        hours: targetModule.hours?.toString() || "0",
        co: targetModule.co || "",
        description: targetModule.description || "",
        subtopics: updatedSubtopics
      };

      await fetchGAS("saveModule", moduleDataToSave);
      
      setModules(prevModules => prevModules.map(m => m.id === targetModule.id ? { ...m, subtopics: updatedSubtopics } : m));
      setEditingResource(null);
    } catch (err) {
      alert("Failed to save link. Error: " + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVisibility = async () => {
    if (!editingVisibility) return;
    setIsSaving(true);
    try {
      const targetModule = modules.find(m => m.id === editingVisibility.moduleId);
      if (!targetModule) throw new Error("Module not found locally");
      
      const updatedSubtopics = targetModule.subtopics.map((st: any) => {
        if (st.id === editingVisibility.subtopicId) {
          return { ...st, isVisible: editingVisibility.isVisible };
        }
        return st;
      });

      const moduleDataToSave = {
        subjectId,
        moduleId: targetModule.id,
        moduleNo: targetModule.moduleNo?.toString() || "",
        title: targetModule.title || "",
        hours: targetModule.hours?.toString() || "0",
        co: targetModule.co || "",
        description: targetModule.description || "",
        subtopics: updatedSubtopics
      };

      await fetchGAS("saveModule", moduleDataToSave);
      
      setModules(prevModules => prevModules.map(m => m.id === targetModule.id ? { ...m, subtopics: updatedSubtopics } : m));
      setEditingVisibility(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save visibility.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-zinc-500 font-medium">Generating Content Matrix...</p>
      </div>
    );
  }

  const displayedModules = selectedModuleId === "ALL" 
    ? modules 
    : modules.filter(m => m.id === selectedModuleId);

  let totalSubtopics = 0;
  displayedModules.forEach(m => {
    if (m.subtopics) totalSubtopics += m.subtopics.length;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
            <Grid className="w-8 h-8 mr-3 text-primary" />
            Content Matrix
          </h1>
          <p className="text-zinc-500 mt-1">Visually track uploaded resources and interactive content across all subtopics.</p>
        </div>
        <div className="w-full md:w-64">
          <label className="block text-xs font-bold text-zinc-700 mb-1">Filter by Module</label>
          <select 
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:border-primary text-sm shadow-sm"
          >
            <option value="ALL">All Modules</option>
            {modules.map(mod => (
              <option key={mod.id} value={mod.id}>M{mod.moduleNo} - {mod.title}</option>
            ))}
          </select>
        </div>
      </div>

      {displayedModules.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
          <Search className="w-12 h-12 text-zinc-300 mb-4" />
          <h3 className="text-lg font-bold text-zinc-700">No content found</h3>
          <p className="text-zinc-500 text-sm mt-1">There are no subtopics to display in the matrix.</p>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200">
                  <th className="p-4 text-left font-bold text-zinc-700 w-48 min-w-[200px] border-r border-zinc-200 sticky left-0 bg-zinc-50/95 z-20 backdrop-blur-sm">
                    Resource Type
                  </th>
                  {displayedModules.map(mod => (
                    <th key={mod.id} colSpan={mod.subtopics?.length || 1} className="p-2 text-center border-r border-zinc-200 border-b border-zinc-200 last:border-r-0">
                      <div className="font-extrabold text-zinc-800 text-xs truncate max-w-[200px] mx-auto" title={mod.title}>
                        M{mod.moduleNo}: {mod.title}
                      </div>
                    </th>
                  ))}
                </tr>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="p-3 text-left text-xs font-semibold text-zinc-500 border-r border-zinc-200 sticky left-0 bg-zinc-50/95 z-20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span>Total: {totalSubtopics} Subtopics</span>
                    </div>
                  </th>
                  {displayedModules.map(mod => (
                    (mod.subtopics || []).map((st: any) => (
                      <th key={st.id} className="p-2 text-center border-r border-zinc-200 last:border-r-0 font-bold text-xs text-zinc-700 min-w-[60px]" title={st.title}>
                        <div className="flex flex-col items-center">
                          <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] mb-1">{st.subtopicNo}</span>
                        </div>
                      </th>
                    ))
                  ))}
                </tr>
              </thead>
              <tbody>
                {RESOURCE_TYPES.map((resourceType) => (
                  <tr key={resourceType.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors group">
                    <td className="p-3 font-semibold text-zinc-700 border-r border-zinc-200 sticky left-0 bg-white group-hover:bg-zinc-50/95 z-10">
                      <div className="flex items-center gap-2">
                        <resourceType.icon className={`w-4 h-4 ${resourceType.color}`} />
                        <span>{resourceType.label}</span>
                      </div>
                    </td>
                    
                    {displayedModules.map(mod => (
                      (mod.subtopics || []).map((st: any) => {
                        const status = getSubtopicResourceStatus(mod, st);
                        const isPresent = status[resourceType.id as keyof typeof status];
                        const isInteractive = ['quiz', 'simulation', 'flashcard', 'mindmap', 'infographic'].includes(resourceType.id);
                        
                        return (
                          <td key={`${resourceType.id}-${st.id}`} className="p-2 text-center border-r border-zinc-100 last:border-r-0 relative group/cell hover:bg-zinc-100/50 transition-colors">
                            {isInteractive ? (
                              <Link 
                                href={`/faculty/subjects/subject/${resourceType.href}?subjectId=${subjectId}`}
                                className="w-full h-full flex items-center justify-center cursor-pointer"
                                title={isPresent ? "Uploaded. Click to manage." : "Missing. Click to add."}
                              >
                                {isPresent ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <span className="text-zinc-300 font-bold text-lg leading-none">—</span>
                                )}
                              </Link>
                            ) : (
                              <button
                                onClick={() => openEditModal(mod, st, resourceType.id)}
                                className="w-full h-full flex items-center justify-center cursor-pointer"
                                title="Click to edit link"
                              >
                                {isPresent ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <span className="text-zinc-300 font-bold text-lg leading-none">—</span>
                                )}
                              </button>
                            )}
                          </td>
                        );
                      })
                    ))}
                  </tr>
                ))}
                {/* Visibility Row */}
                <tr className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors group bg-zinc-50/30">
                  <td className="p-3 font-semibold text-zinc-700 border-r border-zinc-200 sticky left-0 bg-white group-hover:bg-zinc-50/95 z-10">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-zinc-500" />
                      <span>Visible to Student</span>
                    </div>
                  </td>
                  
                  {displayedModules.map(mod => (
                    (mod.subtopics || []).map((st: any) => {
                      const isVisible = st.isVisible !== false;
                      
                      return (
                        <td key={`visibility-${st.id}`} className="p-2 text-center border-r border-zinc-100 last:border-r-0 relative group/cell hover:bg-zinc-100/50 transition-colors">
                          <button
                            onClick={() => setEditingVisibility({ moduleId: mod.id, subtopicId: st.id, isVisible, subtopicNo: st.subtopicNo })}
                            className="w-full h-full flex items-center justify-center cursor-pointer"
                            title="Click to toggle visibility"
                          >
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${isVisible ? '' : 'bg-zinc-200'}`}>
                              {isVisible ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                              )}
                            </div>
                          </button>
                        </td>
                      );
                    })
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Link Modal */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-zinc-900 capitalize">Edit {editingResource.resourceType} Link</h3>
              <button 
                onClick={() => setEditingResource(null)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Resource URL</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLink}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : "Save Link"}
                </button>
              </div>
              <p className="text-xs text-zinc-500 text-center mt-3 mb-1">
                Note: The changes will not be visible on the student dashboard until the "Publish to Student Dashboard" button is clicked.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Visibility Modal */}
      {editingVisibility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-zinc-900">Subtopic {editingVisibility.subtopicNo} Visibility</h3>
              <button 
                onClick={() => setEditingVisibility(null)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingVisibility.isVisible}
                  onChange={(e) => setEditingVisibility({ ...editingVisibility, isVisible: e.target.checked })}
                  className="w-5 h-5 text-primary rounded border-zinc-300 focus:ring-primary"
                />
                <span className="font-semibold text-zinc-700">Visible to Students</span>
              </label>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingVisibility(null)}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVisibility}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : "Save Changes"}
                </button>
              </div>
              <p className="text-xs text-zinc-500 text-center mt-3 mb-1">
                Note: The changes will not be visible on the student dashboard until the "Publish to Student Dashboard" button is clicked.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
