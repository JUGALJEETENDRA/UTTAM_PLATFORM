"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  FileText, 
  Search, 
  Save, 
  Check, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  ExternalLink,
  Loader2,
  UploadCloud
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { useSearchParams } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";

interface Subtopic {
  id: string;
  subtopicNo: string;
  title: string;
  description: string;
  videoUrl: string | null;
  notesUrl: string | null;
}

interface Module {
  id: string;
  moduleNo: number;
  title: string;
  description: string;
  subtopics: Subtopic[];
}

export default function QuickUpdatePage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Track input values locally for each subtopic to prevent re-rendering the whole page
  const [inputStates, setInputStates] = useState<Record<string, { 
    videoUrl: string; 
    videoDownloadUrl: string;
    notesUrl: string; 
    videoLanguages: { language: string; url: string }[];
    audioUrl: string;
    audioLanguages: { language: string; url: string }[];
  }>>({});
  const [savingStates, setSavingStates] = useState<Record<string, "idle" | "saving" | "saved">>({});

  useEffect(() => {
    fetchModules();
  }, [subjectId]);

  const fetchModules = async () => {
    try {
      const data = await fetchGAS("getModules", { subjectId });
      if (data && !data.error) {
        setModules(data);
        
        // Initialize inputs
        const initialInputs: Record<string, { 
          videoUrl: string; 
          videoDownloadUrl: string;
          notesUrl: string; 
          videoLanguages: { language: string; url: string }[];
          audioUrl: string;
          audioLanguages: { language: string; url: string }[];
        }> = {};
        data.forEach((mod: Module) => {
          mod.subtopics.forEach((st: any) => {
            let simData: any = {};
            if (typeof st.simulationData === 'string') {
              try { simData = JSON.parse(st.simulationData); } catch (e) {}
            } else if (typeof st.simulationData === 'object') {
              simData = st.simulationData || {};
            }
            let parsedOther: any = {};
            if (typeof st.otherUrl === 'string' && st.otherUrl.trim().startsWith("{")) {
              try { parsedOther = JSON.parse(st.otherUrl); } catch (e) {}
            }
            initialInputs[st.id] = {
              videoUrl: st.videoUrl || simData.videoUrl || (st.type === 'videoUrl' ? st.mediaUrl : ""),
              videoDownloadUrl: st.videoDownloadUrl || parsedOther.videoDownloadUrl || "",
              notesUrl: st.notesUrl || simData.notesUrl || (st.type === 'notes' ? st.mediaUrl : ""),
              videoLanguages: st.videoLanguages || simData.videoLanguages || [],
              audioUrl: st.audioUrl || simData.audioUrl || (st.type === 'audio' ? st.mediaUrl : ""),
              audioLanguages: st.audioLanguages || simData.audioLanguages || []
            };
          });
        });
        setInputStates(initialInputs);
      } else {
        toast.error("Failed to load modules");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while loading content");
    } finally {
      setLoading(false);
    }
  };

  const [uploadingSubtopicId, setUploadingSubtopicId] = useState<string | null>(null);

  const handleCloudinaryAudioUpload = async (subtopicId: string, e: React.ChangeEvent<HTMLInputElement>, langIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSubtopicId(subtopicId + (langIndex !== undefined ? `-${langIndex}` : ''));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "faculty_uploads");

      const res = await fetch("https://api.cloudinary.com/v1_1/dboelpizj/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.secure_url) {
        toast.success("Audio uploaded to Cloudinary!");
        if (langIndex !== undefined) {
          handleLanguageChange(subtopicId, "audioLanguages", langIndex, "url", data.secure_url);
        } else {
          handleInputChange(subtopicId, "audioUrl", data.secure_url);
        }
      } else {
        toast.error(data.error?.message || "Failed to upload audio");
      }
    } catch (err: any) {
      toast.error(err.message || "Cloudinary upload error");
    } finally {
      setUploadingSubtopicId(null);
      e.target.value = "";
    }
  };

  const handleInputChange = (subtopicId: string, field: "videoUrl" | "videoDownloadUrl" | "notesUrl" | "videoLanguages" | "audioUrl" | "audioLanguages", value: string | { language: string; url: string }[]) => {
    setInputStates(prev => ({
      ...prev,
      [subtopicId]: {
        ...prev[subtopicId],
        [field]: value
      }
    }));
    
    // Reset save state back to idle when user types
    if (savingStates[subtopicId] === "saved") {
      setSavingStates(prev => ({ ...prev, [subtopicId]: "idle" }));
    }
  };

  const handleLanguageChange = (subtopicId: string, type: "videoLanguages" | "audioLanguages", index: number, field: "language" | "url", value: string) => {
    setInputStates(prev => {
      const langs = [...(prev[subtopicId][type] || [])];
      langs[index] = { ...langs[index], [field]: value };
      return { ...prev, [subtopicId]: { ...prev[subtopicId], [type]: langs } };
    });
    if (savingStates[subtopicId] === "saved") {
      setSavingStates(prev => ({ ...prev, [subtopicId]: "idle" }));
    }
  };

  const handleAddLanguage = (subtopicId: string, type: "videoLanguages" | "audioLanguages") => {
    setInputStates(prev => ({
      ...prev,
      [subtopicId]: {
        ...prev[subtopicId],
        [type]: [...(prev[subtopicId][type] || []), { language: "", url: "" }]
      }
    }));
    if (savingStates[subtopicId] === "saved") {
      setSavingStates(prev => ({ ...prev, [subtopicId]: "idle" }));
    }
  };

  const handleSaveSubtopic = async (moduleId: string, subtopicId: string) => {
    const inputs = inputStates[subtopicId];
    setSavingStates(prev => ({ ...prev, [subtopicId]: "saving" }));

    try {
      const targetModule: any = modules.find(m => m.id === moduleId);
      if (!targetModule) throw new Error("Module not found locally");
      
      const updatedSubtopics = targetModule.subtopics.map((st: any) => {
        if (st.id === subtopicId) {
          // Keep all existing fields but update the ones from the quick editor
          const updatedSt = {
            ...st,
            videoUrl: inputs.videoUrl,
            videoDownloadUrl: inputs.videoDownloadUrl,
            notesUrl: inputs.notesUrl,
            videoLanguages: inputs.videoLanguages,
            audioUrl: inputs.audioUrl,
            audioLanguages: inputs.audioLanguages
          };
          
          // Re-pack otherUrl because saveModule expects it
          const otherFields = {
            otherUrl: updatedSt.otherUrl || "",
            otherDownloadUrl: updatedSt.otherDownloadUrl || "",
            didYouKnowUrl: updatedSt.didYouKnowUrl || "",
            didYouKnowDownloadUrl: updatedSt.didYouKnowDownloadUrl || "",
            referenceUrl: updatedSt.referenceUrl || "",
            referenceDownloadUrl: updatedSt.referenceDownloadUrl || "",
            videoDownloadUrl: inputs.videoDownloadUrl || "",
          };
          const hasAnyOtherField = Object.values(otherFields).some(val => val !== "");
          updatedSt.otherUrl = hasAnyOtherField ? JSON.stringify(otherFields) : "";
          
          return updatedSt;
        } else {
          // Re-pack other subtopics too since saveModule overwrites the whole module
          let parsedOther: any = {};
          if (typeof st.otherUrl === 'string' && st.otherUrl.trim().startsWith("{")) {
            try { parsedOther = JSON.parse(st.otherUrl); } catch(e){}
          }
          const otherFields = {
            otherUrl: st.otherUrl || "",
            otherDownloadUrl: st.otherDownloadUrl || "",
            didYouKnowUrl: st.didYouKnowUrl || "",
            didYouKnowDownloadUrl: st.didYouKnowDownloadUrl || "",
            referenceUrl: st.referenceUrl || "",
            referenceDownloadUrl: st.referenceDownloadUrl || "",
            videoDownloadUrl: st.videoDownloadUrl || parsedOther.videoDownloadUrl || "",
          };
          const hasAnyOtherField = Object.values(otherFields).some(val => val !== "");
          return {
            ...st,
            otherUrl: hasAnyOtherField ? JSON.stringify(otherFields) : ""
          };
        }
      });

      const payload = {
        subjectId,
        moduleId: targetModule.id,
        moduleNo: targetModule.moduleNo,
        title: targetModule.title,
        hours: targetModule.hours || 0,
        co: targetModule.co || "",
        description: targetModule.description || "",
        subtopics: updatedSubtopics
      };

      const data = await fetchGAS("saveModule", payload);

      if (data && data.success) {
        setSavingStates(prev => ({ ...prev, [subtopicId]: "saved" }));
        toast.success("Successfully updated subtopic links!");
        
        // Update the local modules state so the UI stays in sync without a refresh
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, subtopics: updatedSubtopics } : m));

        setInputStates(prev => ({
          ...prev,
          [subtopicId]: {
            videoUrl: inputs.videoUrl || "",
            videoDownloadUrl: inputs.videoDownloadUrl || "",
            notesUrl: inputs.notesUrl || "",
            videoLanguages: inputs.videoLanguages || [],
            audioUrl: inputs.audioUrl || "",
            audioLanguages: inputs.audioLanguages || []
          }
        }));

        setTimeout(() => {
          setSavingStates(prev => {
            if (prev[subtopicId] === "saved") {
              return { ...prev, [subtopicId]: "idle" };
            }
            return prev;
          });
        }, 3000);
      } else {
        setSavingStates(prev => ({ ...prev, [subtopicId]: "idle" }));
        toast.error(data?.error || "Failed to update subtopic");
      }
    } catch (err: any) {
      setSavingStates(prev => ({ ...prev, [subtopicId]: "idle" }));
      toast.error(err.message || "Failed to connect to database");
    }
  };

  // Filter modules/subtopics based on search query
  const filteredModules = modules.map(mod => {
    const matchingSubtopics = mod.subtopics.filter(st => 
      st.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      st.subtopicNo.includes(searchQuery)
    );
    return {
      ...mod,
      subtopics: searchQuery ? matchingSubtopics : mod.subtopics
    };
  }).filter(mod => mod.subtopics.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Premium Hero Banner */}
      <div className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 py-12 px-6 shadow-lg overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-20 -translate-y-20"></div>
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold backdrop-blur-md mb-3 border border-white/10 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Quick Resource Manager</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              EdTech Live Link Editor
            </h1>
            <p className="text-indigo-100 mt-2 text-sm md:text-base max-w-xl">
              Instantly update course subtopic learning resources. Paste your External video/notes URL, click save, and the result goes live on the app dynamically.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={`/student/subjects/subject?subjectId=${subjectId}/modules`} 
              target="_blank" 
              className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-slate-100 rounded-xl text-sm font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>View Student App</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-8 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subtopics by title or number (e.g. 1.1)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-base"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium">Fetching syllabus structure...</p>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No matching subtopics found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search keywords.</p>
          </div>
        ) : (
          /* Module Cards */
          <div className="space-y-8">
            {filteredModules.map((mod) => (
              <div 
                key={mod.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Module Header */}
                <div className="bg-gradient-to-r from-slate-50 to-indigo-50/20 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      M{mod.moduleNo}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base md:text-lg">{mod.title}</h3>
                      <p className="text-xs text-slate-500">{mod.description}</p>
                    </div>
                  </div>
                </div>

                {/* Subtopics List */}
                <div className="divide-y divide-slate-100">
                  {mod.subtopics.map((st) => {
                    const inputs = inputStates[st.id] || { videoUrl: "", notesUrl: "", videoLanguages: [] };
                    const saveState = savingStates[st.id] || "idle";

                    return (
                      <div key={st.id} className="p-6 hover:bg-slate-50/40 transition-colors">
                        <div className="flex flex-col gap-4">
                          {/* Subtopic Title Info */}
                          <div className="flex items-start gap-2">
                            <span className="inline-flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-xs px-2.5 py-1 rounded-md mt-0.5">
                              {st.subtopicNo}
                            </span>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm md:text-base">
                                {st.title.replace(/^\d\.\d\s+/, '')}
                              </h4>
                              {st.description && (
                                <p className="text-xs text-slate-500 mt-0.5">{st.description}</p>
                              )}
                            </div>
                          </div>

                          {/* Inputs Row */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            {/* Video URL Input */}
                            <div className="md:col-span-6 space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 justify-between w-full">
                                <div className="flex items-center gap-1.5">
                                  <Play className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                                  <span>Video URL (Hybrid)</span>
                                </div>
                                <button 
                                  onClick={() => handleAddLanguage(st.id, "videoLanguages")}
                                  className="text-[10px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-0.5 rounded font-semibold transition-colors"
                                >
                                  + Add Language
                                </button>
                              </label>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                  <input
                                    type="text"
                                    placeholder="Paste video view/preview/sharing URL..."
                                    value={inputs.videoUrl}
                                    onChange={(e) => handleInputChange(st.id, "videoUrl", e.target.value)}
                                    className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                  />
                                </div>
                                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                  <input
                                    type="text"
                                    placeholder="Video Download Link (Drive export=download)..."
                                    value={inputs.videoDownloadUrl || ""}
                                    onChange={(e) => handleInputChange(st.id, "videoDownloadUrl", e.target.value)}
                                    className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                                  />
                                </div>
                              </div>
                              {(inputs.videoLanguages || []).map((lang, lIndex) => (
                                <div key={lIndex} className="flex items-center gap-2 mt-2">
                                  <input 
                                    type="text" 
                                    placeholder="Lang (e.g. Hindi)" 
                                    value={lang.language} 
                                    onChange={(e) => handleLanguageChange(st.id, "videoLanguages", lIndex, "language", e.target.value)}
                                    className="w-1/3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Hybrid URL..." 
                                    value={lang.url} 
                                    onChange={(e) => handleLanguageChange(st.id, "videoLanguages", lIndex, "url", e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Audio URL Input */}
                            <div className="md:col-span-6 space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 justify-between w-full">
                                <div className="flex items-center gap-1.5">
                                  <Play className="w-3.5 h-3.5 text-purple-500 fill-purple-500/20" />
                                  <span>Audio URL (Cloudinary / Direct MP3)</span>
                                </div>
                                <button 
                                  onClick={() => handleAddLanguage(st.id, "audioLanguages")}
                                  className="text-[10px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-0.5 rounded font-semibold transition-colors"
                                >
                                  + Add Language
                                </button>
                              </label>
                              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                <input
                                  type="text"
                                  placeholder="Paste audio URL or upload file..."
                                  value={inputs.audioUrl || ""}
                                  onChange={(e) => handleInputChange(st.id, "audioUrl", e.target.value)}
                                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                                <input
                                  type="file"
                                  accept="audio/*"
                                  id={`cloudinary-quick-${st.id}`}
                                  className="hidden"
                                  onChange={(e) => handleCloudinaryAudioUpload(st.id, e)}
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`cloudinary-quick-${st.id}`)?.click()}
                                  disabled={uploadingSubtopicId === st.id}
                                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors shrink-0 flex items-center gap-1"
                                  title="Upload MP3 to Cloudinary"
                                >
                                  {uploadingSubtopicId === st.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <UploadCloud className="w-3 h-3 text-purple-600" />
                                  )}
                                  Upload
                                </button>
                              </div>
                              {(inputs.audioLanguages || []).map((lang, lIndex) => (
                                <div key={lIndex} className="flex items-center gap-2 mt-2">
                                  <input 
                                    type="text" 
                                    placeholder="Lang (e.g. Hindi)" 
                                    value={lang.language} 
                                    onChange={(e) => handleLanguageChange(st.id, "audioLanguages", lIndex, "language", e.target.value)}
                                    className="w-1/3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Hybrid URL..." 
                                    value={lang.url} 
                                    onChange={(e) => handleLanguageChange(st.id, "audioLanguages", lIndex, "url", e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                                  />
                                  <input
                                    type="file"
                                    accept="audio/*"
                                    id={`cloudinary-quick-${st.id}-${lIndex}`}
                                    className="hidden"
                                    onChange={(e) => handleCloudinaryAudioUpload(st.id, e, lIndex)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => document.getElementById(`cloudinary-quick-${st.id}-${lIndex}`)?.click()}
                                    className="text-purple-600 hover:bg-purple-100 p-1 rounded transition-colors"
                                    title="Upload MP3 to Cloudinary for this language"
                                  >
                                    <UploadCloud className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Notes URL Input */}
                            <div className="md:col-span-10 space-y-1.5 mt-2">
                              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                <span>External Notes URL</span>
                              </label>
                              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                <input
                                  type="text"
                                  placeholder="Paste notes folder/file URL..."
                                  value={inputs.notesUrl}
                                  onChange={(e) => handleInputChange(st.id, "notesUrl", e.target.value)}
                                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Save Button */}
                            <div className="md:col-span-2">
                              <button
                                onClick={() => handleSaveSubtopic(mod.id, st.id)}
                                disabled={saveState === "saving"}
                                className={`w-full h-[38px] rounded-xl text-xs font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5
                                  ${saveState === "saving" 
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                                    : saveState === "saved"
                                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10"
                                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10"
                                  }
                                `}
                              >
                                {saveState === "saving" ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Saving</span>
                                  </>
                                ) : saveState === "saved" ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Saved!</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save Link</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}