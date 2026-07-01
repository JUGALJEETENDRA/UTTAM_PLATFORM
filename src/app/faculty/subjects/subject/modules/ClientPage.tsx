"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Trash2, CheckCircle2, ChevronDown, ChevronUp, Edit3, UploadCloud, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { fetchGAS } from "@/lib/apiClient";

interface SubtopicForm {
  id?: string;
  title: string;
  description: string;
  learningOutcome: string;
  videoUrl: string;
  videoDownloadUrl?: string;
  videoLanguages: { language: string; url: string }[];
  notesUrl: string;
  notesDownloadUrl?: string;
  otherUrl: string;
  otherDownloadUrl?: string;
  audioUrl: string;
  audioLanguages: { language: string; url: string }[];
  audioDownloadUrl?: string;
  didYouKnowUrl?: string;
  didYouKnowDownloadUrl?: string;
  referenceUrl?: string;
  referenceDownloadUrl?: string;
  selectedResourceType?: string;
  type?: string;
  mediaUrl?: string;
  isVisible?: boolean;
}
const initialSubtopicState = { 
  title: "", description: "", learningOutcome: "", 
  videoUrl: "", videoDownloadUrl: "", videoLanguages: [], 
  notesUrl: "", notesDownloadUrl: "", 
  otherUrl: "", otherDownloadUrl: "", 
  audioUrl: "", audioLanguages: [], audioDownloadUrl: "",
  didYouKnowUrl: "", didYouKnowDownloadUrl: "",
  referenceUrl: "", referenceDownloadUrl: "",
  selectedResourceType: "none",
  type: "", mediaUrl: "",
  isVisible: true
};
export default function ManageModulesPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
  const [modules, setModules] = useState<any[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  // Form states
  const [moduleNo, setModuleNo] = useState("");
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState("");
  const [co, setCo] = useState("");
  const [description, setDescription] = useState("");
  const [subtopics, setSubtopics] = useState<SubtopicForm[]>([{...initialSubtopicState}]);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [convertingAudioKey, setConvertingAudioKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isUploadingSyllabus, setIsUploadingSyllabus] = useState(false);

  const convertDriveAudioToCloudinary = async (rawUrl: string, onSuccess: (cloudinaryUrl: string) => void, keyIdentifier: string) => {
    if (!rawUrl || !rawUrl.trim()) return;
    
    let driveFileId: string | null = null;
    if (rawUrl.includes("drive.google.com") || rawUrl.includes("docs.google.com")) {
      if (rawUrl.includes("/file/d/")) {
        const match = rawUrl.match(/\/file\/d\/([^\/]+)/);
        if (match && match[1]) driveFileId = match[1];
      } else if (rawUrl.includes("id=")) {
        const match = rawUrl.match(/id=([^&]+)/);
        if (match && match[1]) driveFileId = match[1];
      }
    }

    if (!driveFileId) {
      toast.error("Please enter a valid Google Drive share link.");
      return;
    }

    setConvertingAudioKey(keyIdentifier);
    const toastId = toast.loading("Converting Google Drive Audio link to Cloudinary CDN Stream...");

    const directDriveUrl = `https://lh3.googleusercontent.com/d/${driveFileId}`;
    try {
      const formData = new FormData();
      formData.append("file", directDriveUrl);
      formData.append("upload_preset", "faculty_uploads");
      formData.append("resource_type", "video");

      const res = await fetch("https://api.cloudinary.com/v1_1/dboelpizj/video/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.secure_url) {
        toast.success("Successfully converted to Cloudinary Audio Stream!", { id: toastId });
        onSuccess(data.secure_url);
      } else {
        const fetchUrl = `https://res.cloudinary.com/dboelpizj/video/upload/fetch/${encodeURIComponent(directDriveUrl)}`;
        toast.success("Connected to Cloudinary Stream CDN!", { id: toastId });
        onSuccess(fetchUrl);
      }
    } catch (err: any) {
      const fetchUrl = `https://res.cloudinary.com/dboelpizj/video/upload/fetch/${encodeURIComponent(directDriveUrl)}`;
      toast.success("Connected to Cloudinary Stream CDN!", { id: toastId });
      onSuccess(fetchUrl);
    } finally {
      setConvertingAudioKey(null);
    }
  };
  useEffect(() => {
    fetchModules();
  }, []);
  const fetchModules = async () => {
    try {
      const data = await fetchGAS("getModules", { subjectId });
      if (Array.isArray(data)) {
        const parsedModules = data.map((mod: any) => {
          if (mod.subtopics) {
            mod.subtopics = mod.subtopics.map((st: any) => {
              let parsedData = {};
              if (typeof st.simulationData === 'string') {
                try { parsedData = JSON.parse(st.simulationData); } catch (e) {}
              } else if (typeof st.simulationData === 'object' && st.simulationData) {
                parsedData = st.simulationData;
              }
              let parsedOther: any = {};
              if (typeof st.otherUrl === 'string' && st.otherUrl.trim().startsWith("{")) {
                try { 
                  const sanitizedStr = st.otherUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
                  parsedOther = JSON.parse(sanitizedStr); 
                  
                  // Handle double-encoded JSON strings
                  while (typeof parsedOther === 'string') {
                    parsedOther = JSON.parse(parsedOther);
                  }
                  
                  if (typeof parsedOther !== 'object' || parsedOther === null) {
                    parsedOther = {};
                  }
                  
                  // Force empty strings
                  if (!parsedOther.otherUrl || parsedOther.otherUrl.trim() === "" || parsedOther.otherUrl.trim().startsWith("{")) parsedOther.otherUrl = "";
                  if (!parsedOther.didYouKnowUrl || parsedOther.didYouKnowUrl.trim() === "" || parsedOther.didYouKnowUrl.trim().startsWith("{")) parsedOther.didYouKnowUrl = "";
                  if (!parsedOther.referenceUrl || parsedOther.referenceUrl.trim() === "" || parsedOther.referenceUrl.trim().startsWith("{")) parsedOther.referenceUrl = "";
                } catch (e) {
                  // Fallback: clear the string so it doesn't cause Truthy UI bugs
                  parsedOther = { otherUrl: "", didYouKnowUrl: "", referenceUrl: "" };
                }
              }
              return { ...st, ...parsedData, ...parsedOther };
            });
          }
          return mod;
        });
        setModules(parsedModules);
      } else {
        setModules([]);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };
  const handleAddSubtopicField = () => {
    setSubtopics([...subtopics, {...initialSubtopicState}]);
  };
  const handleRemoveSubtopicField = (index: number) => {
    if (subtopics.length > 1) {
      setSubtopics(subtopics.filter((_, i) => i !== index));
    }
  };
  const handleSubtopicChange = (index: number, field: keyof SubtopicForm, value: string) => {
    const updated = [...subtopics];
    updated[index][field] = value as any;
    setSubtopics(updated);
  };

  const handleLanguageChange = (index: number, type: "videoLanguages" | "audioLanguages", langIndex: number, field: "language" | "url", value: string) => {
    const updated = [...subtopics];
    if (!updated[index][type]) updated[index][type] = [];
    updated[index][type][langIndex][field] = value;
    setSubtopics(updated);
  };

  const handleAddLanguage = (index: number, type: "videoLanguages" | "audioLanguages") => {
    const updated = [...subtopics];
    if (!updated[index][type]) updated[index][type] = [];
    updated[index][type].push({ language: "", url: "" });
    setSubtopics(updated);
  };

  const handleRemoveLanguage = (index: number, type: "videoLanguages" | "audioLanguages", langIndex: number) => {
    const updated = [...subtopics];
    if (updated[index][type]) {
      updated[index][type] = updated[index][type].filter((_, i) => i !== langIndex);
    }
    setSubtopics(updated);
  };
  const handleEditModule = (e: React.MouseEvent, mod: any) => {
    e.stopPropagation();
    setEditingModuleId(mod.id);
    setModuleNo(mod.moduleNo?.toString() || "");
    setTitle(mod.title || "");
    setHours(mod.hours?.toString() || "");
    setCo(mod.co || "");
    setDescription(mod.description || "");
    
    if (mod.subtopics && mod.subtopics.length > 0) {
      setSubtopics(mod.subtopics.map((st: any) => {
        let parsedData: any = {};
        if (typeof st.simulationData === 'string' && st.simulationData) {
          try { parsedData = JSON.parse(st.simulationData); } catch(e) {}
        } else if (typeof st.simulationData === 'object' && st.simulationData !== null) {
          parsedData = st.simulationData;
        }

        let unpackedOther = { otherUrl: st.otherUrl, otherDownloadUrl: st.otherDownloadUrl, didYouKnowUrl: "", didYouKnowDownloadUrl: "", referenceUrl: "", referenceDownloadUrl: "" };
        if (typeof st.otherUrl === 'string' && st.otherUrl.startsWith("{")) {
          try {
            const parsedOther = JSON.parse(st.otherUrl);
            unpackedOther = { ...unpackedOther, ...parsedOther };
          } catch(e) {}
        }

        return {
          ...initialSubtopicState,
          id: st.id,
          title: st.title || "",
          description: st.description || "",
          learningOutcome: st.learningOutcome || "",
          videoUrl: st.videoUrl || (st.type === 'videoUrl' ? st.mediaUrl : "") || "",
          videoLanguages: st.videoLanguages || [],
          notesUrl: parsedData.notesUrl || st.notesUrl || (st.type === 'notes' ? st.mediaUrl : "") || "",
          notesDownloadUrl: parsedData.notesDownloadUrl || st.notesDownloadUrl || "",
          otherUrl: unpackedOther.otherUrl || parsedData.otherUrl || (st.type === 'other' ? st.mediaUrl : "") || "",
          otherDownloadUrl: unpackedOther.otherDownloadUrl || parsedData.otherDownloadUrl || st.otherDownloadUrl || "",
          audioUrl: parsedData.audioUrl || st.audioUrl || (st.type === 'audio' ? st.mediaUrl : "") || "",
          audioLanguages: parsedData.audioLanguages || st.audioLanguages || [],
          audioDownloadUrl: parsedData.audioDownloadUrl || st.audioDownloadUrl || "",
          didYouKnowUrl: unpackedOther.didYouKnowUrl || parsedData.didYouKnowUrl || st.didYouKnowUrl || "",
          didYouKnowDownloadUrl: unpackedOther.didYouKnowDownloadUrl || parsedData.didYouKnowDownloadUrl || st.didYouKnowDownloadUrl || "",
          referenceUrl: unpackedOther.referenceUrl || parsedData.referenceUrl || st.referenceUrl || "",
          referenceDownloadUrl: unpackedOther.referenceDownloadUrl || parsedData.referenceDownloadUrl || st.referenceDownloadUrl || "",
          type: st.type || "",
          mediaUrl: st.mediaUrl || "",
          isVisible: st.isVisible !== false,
        };
      }));
    } else {
      setSubtopics([{...initialSubtopicState}]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleCancelEdit = () => {
    setEditingModuleId(null);
    setModuleNo("");
    setTitle("");
    setHours("");
    setCo("");
    setDescription("");
    setSubtopics([{...initialSubtopicState}]);
    setMessage(null);
  };

  const handleUploadFile = async (subtopicId: string, index: number, resourceType: string) => {
    if (!subtopicId) return;
    const fileInput = document.getElementById(`file-${index}-${resourceType}`) as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subtopicId", subtopicId);
      formData.append("resourceType", resourceType);
      const res = await fetch("/api/faculty/modules/upload-file", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("File uploaded successfully!");
        
        const urlField = resourceType === "notes" ? "notesUrl" :
                         resourceType === "quizFile" ? "quizFileUrl" :
                         resourceType === "mindMap" ? "mindMapUrl" :
                         resourceType === "flashCards" ? "flashCardsUrl" :
                         resourceType === "reference" ? "referenceUrl" :
                         resourceType === "audio" ? "audioUrl" :
                         "otherUrl";
                         
        const downloadField = resourceType === "notes" ? "notesDownloadUrl" :
                              resourceType === "quizFile" ? "quizFileDownloadUrl" :
                              resourceType === "mindMap" ? "mindMapDownloadUrl" :
                              resourceType === "flashCards" ? "flashCardsDownloadUrl" :
                              resourceType === "reference" ? "referenceDownloadUrl" :
                              resourceType === "audio" ? "audioDownloadUrl" :
                              "otherDownloadUrl";
        handleSubtopicChange(index, urlField as any, data.subtopic[urlField]);
        handleSubtopicChange(index, downloadField as any, data.subtopic[downloadField]);
        fetchModules();
      } else {
        toast.error(data.error || "Failed to upload file");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setUploadingIndex(null);
      if (fileInput) fileInput.value = "";
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const validSubtopics = subtopics.filter(st => st.title.trim() !== "").map(st => {
      const {
        didYouKnowUrl, didYouKnowDownloadUrl,
        referenceUrl, referenceDownloadUrl,
        otherUrl, otherDownloadUrl, 
        notesUrl, notesDownloadUrl,
        audioUrl, audioLanguages, audioDownloadUrl,
        ...rest
      } = st;

      // Pack new fields into otherUrl to bypass backend schema limitations
      const otherFields = {
        otherUrl: otherUrl || "",
        otherDownloadUrl: otherDownloadUrl || "",
        didYouKnowUrl: didYouKnowUrl || "",
        didYouKnowDownloadUrl: didYouKnowDownloadUrl || "",
        referenceUrl: referenceUrl || "",
        referenceDownloadUrl: referenceDownloadUrl || "",
        videoDownloadUrl: st.videoDownloadUrl || "",
      };
      const hasAnyOtherField = Object.values(otherFields).some(val => val !== "");
      const packedOtherUrl = hasAnyOtherField ? JSON.stringify(otherFields) : "";

      return {
        ...rest,
        otherUrl: packedOtherUrl,
        notesUrl: notesUrl || "",
        notesDownloadUrl: notesDownloadUrl || "",
        audioUrl: audioUrl || "",
        audioLanguages: audioLanguages || [],
        audioDownloadUrl: audioDownloadUrl || "",
        simulationData: "" // Backend will recreate this
      };
    });

    if (validSubtopics.length === 0) {
      toast.error("At least one subtopic with a title is required.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        subjectId,
        moduleId: editingModuleId, // used for PUT equivalent
        moduleNo,
        title,
        hours,
        co,
        description,
        subtopics: validSubtopics
      };

      const data = await fetchGAS("saveModule", payload);
      if (data && data.success) {
        toast.success(editingModuleId ? "Module updated successfully!" : "Module created successfully!");
        handleCancelEdit();
        fetchModules();
      } else {
        toast.error(data?.error || "Failed to save module");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleSyllabusUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingSyllabus(true);
    const loadingToast = toast.loading("Parsing syllabus PDF...");
    
    try {
      const { parsePdfToModules } = await import("@/lib/pdfParser");
      const parsedModules = await parsePdfToModules(file);
      
      if (parsedModules.length === 0) {
        toast.error("Could not find any modules in the PDF format.", { id: loadingToast });
        setIsUploadingSyllabus(false);
        return;
      }

      toast.loading(`Creating ${parsedModules.length} modules...`, { id: loadingToast });
      
      let successCount = 0;
      for (const mod of parsedModules) {
        const payload = {
          subjectId,
          moduleNo: mod.moduleNo,
          title: mod.title,
          hours: mod.hours,
          co: mod.co,
          description: mod.description,
          subtopics: mod.subtopics
        };
        const res = await fetchGAS("saveModule", payload);
        if (res && res.success) {
          successCount++;
        } else {
          console.error("Failed to create module", mod.title, res);
        }
      }
      
      toast.success(`Successfully created ${successCount}/${parsedModules.length} modules!`, { id: loadingToast });
      fetchModules(); // refresh list
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to process syllabus", { id: loadingToast });
    } finally {
      setIsUploadingSyllabus(false);
    }
  };

  const handleDeleteModule = async (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this module and all of its subtopics, quizzes, flashcards, simulations, and mind maps? This action cannot be undone.")) {
      return;
    }
    
    try {
      const res = await fetchGAS("deleteModule", { moduleId });
      if (res && res.success) {
        toast.success("Module deleted successfully!");
        fetchModules();
        if (editingModuleId === moduleId) {
          handleCancelEdit();
        }
      } else {
        toast.error(res?.error || "Failed to delete module");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting the module");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-primary" />
            Manage Modules & Subtopics
          </h1>
          <p className="text-zinc-500 mt-1">Add or edit curriculum modules and define subtopic learning materials.</p>
        </div>
        <div>
          <input type="file" accept="application/pdf" className="hidden" id="syllabus-upload" onChange={handleSyllabusUpload} />
          <Button onClick={() => document.getElementById('syllabus-upload')?.click()} variant="outline" className="border-primary text-primary" disabled={isUploadingSyllabus}>
            {isUploadingSyllabus ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
            Auto-Generate from Syllabus
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`border-zinc-200 shadow-md ${editingModuleId ? 'border-primary ring-1 ring-primary/20' : ''}`}>
            <CardHeader className="bg-zinc-50 border-b border-zinc-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-zinc-900">
                  {editingModuleId ? "Edit Module" : "Create New Module"}
                </CardTitle>
                <CardDescription>
                  {editingModuleId ? "Update course module details and subtopics." : "Enter course module details and subtopics."}
                </CardDescription>
              </div>
              {editingModuleId && (
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-zinc-500 hover:text-zinc-900">
                  Cancel Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div className={`p-4 rounded-lg text-sm font-semibold ${message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-primary border border-red-200"}`}>
                    {message.text}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Module Number *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1"
                      value={moduleNo}
                      onChange={(e) => setModuleNo(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Module Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. User Interface Fundamentals"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Duration (Hours)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Course Outcome (CO)</label>
                    <input
                      type="text"
                      placeholder="e.g. CO1"
                      value={co}
                      onChange={(e) => setCo(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the module content..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="border-t border-zinc-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-zinc-900">Subtopics</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSubtopicField}
                      className="border-primary text-primary hover:bg-primary/5 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" /> <span>Add Subtopic</span>
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {subtopics.map((st, index) => (
                      <div key={index} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl relative space-y-4">
                        {subtopics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtopicField(index)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-primary transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        <div className="flex items-center justify-between mt-2 mb-4">
                          <h4 className="font-bold text-zinc-800 text-sm">Subtopic #{index + 1}</h4>
                          <label className="flex items-center space-x-2 text-sm font-medium text-zinc-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={st.isVisible !== false}
                              onChange={(e) => handleSubtopicChange(index, "isVisible", e.target.checked)}
                              className="w-4 h-4 text-primary rounded border-zinc-300 focus:ring-primary"
                            />
                            <span>Visible to Students</span>
                          </label>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Subtopic Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Cognitive Constraints"
                              value={st.title}
                              onChange={(e) => handleSubtopicChange(index, "title", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Learning Outcome</label>
                            <input
                              type="text"
                              placeholder="e.g. Explain memory limitations in UI design"
                              value={st.learningOutcome}
                              onChange={(e) => handleSubtopicChange(index, "learningOutcome", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Subtopic Description</label>
                          <textarea
                            rows={2}
                            placeholder="Description of the subtopic..."
                            value={st.description}
                            onChange={(e) => handleSubtopicChange(index, "description", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="pt-4 border-t border-zinc-200">
                          <label className="block text-xs font-bold text-zinc-700 mb-2">Add Resource</label>
                          <select
                            value={st.selectedResourceType || "none"}
                            onChange={(e) => handleSubtopicChange(index, "selectedResourceType", e.target.value)}
                            className="w-full sm:w-1/2 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary mb-4"
                          >
                            <option value="none">Select resource type...</option>
                            <option value="videoUrl">Video</option>
                            <option value="notes">Notes</option>
                            <option value="audio">Audio</option>
                            <option value="didYouKnow">Did You Know</option>
                            <option value="reference">Reference</option>
                            <option value="other">Other</option>
                          </select>
                          {st.selectedResourceType === "videoUrl" && (
                            <div className="mb-4 bg-zinc-50 p-4 border border-zinc-200 rounded-lg">
                              <div className="mb-4">
                                <div>
                                  <label className="block text-xs font-bold text-zinc-700 mb-1">English Video URL (Default)</label>
                                  <input
                                    type="text"
                                    placeholder="https://drive.google.com/..."
                                    value={st.videoUrl}
                                    onChange={(e) => handleSubtopicChange(index, "videoUrl", e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                                  />
                                </div>
                              </div>
                              <div className="pt-3 border-t border-zinc-200">
                                <div className="flex justify-between items-center mb-3">
                                  <label className="block text-xs font-bold text-zinc-700">Additional Video Languages</label>
                                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddLanguage(index, "videoLanguages")} className="h-7 text-xs px-2">
                                    <Plus className="w-3 h-3 mr-1" /> Add Language
                                  </Button>
                                </div>
                                {(st.videoLanguages || []).map((lang, lIndex) => (
                                  <div key={lIndex} className="flex items-center space-x-2 mb-2">
                                    <input 
                                      type="text" 
                                      placeholder="e.g. Spanish" 
                                      value={lang.language} 
                                      onChange={(e) => handleLanguageChange(index, "videoLanguages", lIndex, "language", e.target.value)}
                                      className="w-1/3 px-2 py-1.5 bg-white border border-zinc-300 rounded text-xs focus:border-primary"
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="URL" 
                                      value={lang.url} 
                                      onChange={(e) => handleLanguageChange(index, "videoLanguages", lIndex, "url", e.target.value)}
                                      className="flex-1 px-2 py-1.5 bg-white border border-zinc-300 rounded text-xs focus:border-primary"
                                    />
                                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveLanguage(index, "videoLanguages", lIndex)} className="text-red-500 p-1 h-auto">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {st.selectedResourceType === "audio" && (
                            <div className="mb-4 bg-zinc-50 p-4 border border-zinc-200 rounded-lg">
                              <label className="block text-xs font-bold text-zinc-700 mb-1">English Audio Link (Default)</label>
                              <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                                <input
                                  type="text"
                                  placeholder="Paste Google Drive Share Link or MP3 URL..."
                                  value={st.audioUrl}
                                  onChange={(e) => handleSubtopicChange(index, "audioUrl", e.target.value)}
                                  className="w-full sm:flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                                />
                                {(st.audioUrl.includes("drive.google.com") || st.audioUrl.includes("docs.google.com")) && (
                                  <Button
                                    type="button"
                                    onClick={() => convertDriveAudioToCloudinary(st.audioUrl, (url) => handleSubtopicChange(index, "audioUrl", url), `main-${index}`)}
                                    disabled={convertingAudioKey === `main-${index}`}
                                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9 px-3 shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                                  >
                                    {convertingAudioKey === `main-${index}` ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <UploadCloud className="w-3.5 h-3.5" />
                                    )}
                                    <span>Convert Drive to Cloudinary</span>
                                  </Button>
                                )}
                              </div>
                              {st.audioUrl.includes("cloudinary.com") && (
                                <p className="text-[11px] text-purple-700 font-bold mb-3 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Powered by Cloudinary Audio Stream CDN
                                </p>
                              )}

                              <div className="pt-3 border-t border-zinc-200">
                                <div className="flex justify-between items-center mb-3">
                                  <label className="block text-xs font-bold text-zinc-700">Additional Audio Languages</label>
                                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddLanguage(index, "audioLanguages")} className="h-7 text-xs px-2">
                                    <Plus className="w-3 h-3 mr-1" /> Add Language
                                  </Button>
                                </div>
                                {(st.audioLanguages || []).map((lang, lIndex) => (
                                  <div key={lIndex} className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                                    <input 
                                      type="text" 
                                      placeholder="e.g. Spanish" 
                                      value={lang.language} 
                                      onChange={(e) => handleLanguageChange(index, "audioLanguages", lIndex, "language", e.target.value)}
                                      className="w-full sm:w-1/3 px-2 py-1.5 bg-white border border-zinc-300 rounded text-xs focus:border-primary"
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="Paste Drive Share Link or URL..." 
                                      value={lang.url} 
                                      onChange={(e) => handleLanguageChange(index, "audioLanguages", lIndex, "url", e.target.value)}
                                      className="w-full sm:flex-1 px-2 py-1.5 bg-white border border-zinc-300 rounded text-xs focus:border-primary"
                                    />
                                    <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
                                      {(lang.url.includes("drive.google.com") || lang.url.includes("docs.google.com")) && (
                                        <Button
                                          type="button"
                                          size="sm"
                                          onClick={() => convertDriveAudioToCloudinary(lang.url, (url) => handleLanguageChange(index, "audioLanguages", lIndex, "url", url), `lang-${index}-${lIndex}`)}
                                          disabled={convertingAudioKey === `lang-${index}-${lIndex}`}
                                          className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold h-7 px-2 flex items-center gap-1"
                                          title="Convert to Cloudinary Stream"
                                        >
                                          {convertingAudioKey === `lang-${index}-${lIndex}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                                          <span>Cloudinary</span>
                                        </Button>
                                      )}
                                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveLanguage(index, "audioLanguages", lIndex)} className="text-red-500 p-1 h-auto">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {["notes", "didYouKnow", "reference", "other"].includes(st.selectedResourceType || "") && (
                            <div className="mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3">
                              <div>
                                <label className="block text-[10px] font-bold text-blue-900 mb-1">Paste External Resource Link</label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    placeholder="https://..."
                                    value={st[`${st.selectedResourceType}Url` as keyof SubtopicForm] as string || ""}
                                    onChange={(e) => handleSubtopicChange(index, `${st.selectedResourceType}Url` as keyof SubtopicForm, e.target.value)}
                                    className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-blue-900 text-xs focus:outline-none focus:border-blue-400"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="mt-4 space-y-2">
                            {st.videoUrl && <div className="text-[11px] flex justify-between bg-zinc-100 p-2 rounded items-center"><span>🎥 YouTube Video Attached</span> <Button type="button" variant="ghost" size="sm" className="h-5 text-red-500 p-0" onClick={() => handleSubtopicChange(index, "videoUrl", "")}>Remove</Button></div>}
                            {st.notesUrl && <div className="text-[11px] flex justify-between bg-zinc-100 p-2 rounded items-center"><span>📄 Notes File Attached</span> <Button type="button" variant="ghost" size="sm" className="h-5 text-red-500 p-0" onClick={() => {handleSubtopicChange(index, "notesUrl", ""); handleSubtopicChange(index, "notesDownloadUrl", "")}}>Remove</Button></div>}
                            {st.didYouKnowUrl && <div className="text-[11px] flex justify-between bg-zinc-100 p-2 rounded items-center"><span>💡 Did You Know Attached</span> <Button type="button" variant="ghost" size="sm" className="h-5 text-red-500 p-0" onClick={() => {handleSubtopicChange(index, "didYouKnowUrl", ""); handleSubtopicChange(index, "didYouKnowDownloadUrl", "")}}>Remove</Button></div>}
                            {st.referenceUrl && <div className="text-[11px] flex justify-between bg-zinc-100 p-2 rounded items-center"><span>📚 Reference File Attached</span> <Button type="button" variant="ghost" size="sm" className="h-5 text-red-500 p-0" onClick={() => {handleSubtopicChange(index, "referenceUrl", ""); handleSubtopicChange(index, "referenceDownloadUrl", "")}}>Remove</Button></div>}
                            {st.audioUrl && <div className="text-[11px] flex justify-between bg-zinc-100 p-2 rounded items-center"><span>🎵 Audio File Attached</span> <Button type="button" variant="ghost" size="sm" className="h-5 text-red-500 p-0" onClick={() => {handleSubtopicChange(index, "audioUrl", ""); handleSubtopicChange(index, "audioDownloadUrl", "")}}>Remove</Button></div>}
                            {st.otherUrl && <div className="text-[11px] flex justify-between bg-zinc-100 p-2 rounded items-center"><span>🔗 Other File Attached</span> <Button type="button" variant="ghost" size="sm" className="h-5 text-red-500 p-0" onClick={() => {handleSubtopicChange(index, "otherUrl", ""); handleSubtopicChange(index, "otherDownloadUrl", "")}}>Remove</Button></div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 shadow-md transition-colors"
                >
                  {loading ? "Saving..." : (editingModuleId ? "Save Changes" : "Create Module & Subtopics")}
                </Button>
                <p className="text-xs text-zinc-500 text-center mt-3">
                  Note: The changes will not be visible on the student dashboard until the "Publish to Student Dashboard" button is clicked.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Right Column: Existing Modules List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">Current Course Syllabus</h3>
          <div className="space-y-3">
            {modules.map((mod) => (
              <Card key={mod.id} className="border-zinc-200 shadow-sm p-0 gap-0 overflow-hidden">
                <div
                  onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id)}
                  className="p-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary font-bold rounded-lg flex items-center justify-center text-sm">
                      M{mod.moduleNo}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-800 text-sm">{mod.title}</h4>
                      <p className="text-xs text-zinc-500">{mod.subtopics?.length || 0} subtopics • {mod.hours || 0} hrs</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-zinc-500 hover:text-primary z-10"
                      onClick={(e) => handleEditModule(e, mod)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-zinc-500 hover:text-red-600 z-10"
                      onClick={(e) => handleDeleteModule(e, mod.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {expandedModuleId === mod.id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </div>
                </div>
                {expandedModuleId === mod.id && (
                  <CardContent className="p-4 bg-white space-y-3">
                    <p className="text-xs text-zinc-600 leading-relaxed italic">{mod.description}</p>
                    <div className="space-y-2 border-t border-zinc-100 pt-3">
                      <h5 className="text-xs font-bold text-zinc-700">Subtopics:</h5>
                      {mod.subtopics && mod.subtopics.length > 0 ? (
                        mod.subtopics.map((st: any) => (
                          <div key={st.id} className="text-xs flex items-start space-x-2 text-zinc-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-zinc-800">{st.subtopicNo} - {st.title}</span>
                              {st.learningOutcome && (
                                <p className="text-[10px] text-zinc-400 italic">LO: {st.learningOutcome}</p>
                              )}
                              {(st.notesUrl || st.videoUrl || st.audioUrl) && (
                                <div className="mt-1 flex gap-2">
                                  {st.notesUrl && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">Notes Attached</span>}
                                  {st.videoUrl && <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold">Video Attached</span>}
                                  {st.audioUrl && <span className="text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold">Audio Attached</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-zinc-400 italic">No subtopics defined.</p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}