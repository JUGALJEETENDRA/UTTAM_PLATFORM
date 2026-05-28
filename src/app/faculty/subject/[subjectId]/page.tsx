"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FacultySubjectManagePage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { data: session, status } = useSession();
  const { subjectId } = use(params);
  const router = useRouter();

  const [subject, setSubject] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);

  // UI State
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", order: 1 });

  const [creatingTopicForModule, setCreatingTopicForModule] = useState<string | null>(null);
  const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);
  const [topicForm, setTopicForm] = useState({ title: "", type: "notes", durationMinutes: 10, videoId: "", ebookContent: "", simulationUrl: "", assignmentDescription: "" });

  const [uploadingTopic, setUploadingTopic] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const [quizFile, setQuizFile] = useState<File | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizTotalQuestions, setQuizTotalQuestions] = useState("");

  const [uploadingFlashcards, setUploadingFlashcards] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSubjectData();
    }
  }, [status]);

  const fetchSubjectData = async () => {
    try {
      const res = await fetch(`/api/faculty/subjects`);
      const subjects = await res.json();
      const current = subjects.find((s: any) => s.id === subjectId);
      if (current) {
        setSubject(current);
        setModules(current.modules.sort((a: any, b: any) => a.order - b.order) || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (status === "loading" || !subject) return <div className="p-8">Loading...</div>;
  if (!session || (session.user as any).role !== "TEACHER") {
    return <div className="p-8 text-red-500">Access Denied. Faculty only.</div>;
  }

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm("Are you sure you want to delete this material? It will also be deleted from Google Drive if possible.")) return;
    try {
      const res = await fetch(`/api/faculty/material?id=${materialId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSubjectData();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete material");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete material");
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/faculty/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...moduleForm, subjectId })
      });
      if (res.ok) {
        setIsCreatingModule(false);
        setModuleForm({ title: "", description: "", order: modules.length + 1 });
        fetchSubjectData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      await fetch(`/api/faculty/modules?id=${id}`, { method: "DELETE" });
      fetchSubjectData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    setIsSubmittingTopic(true);
    try {
      const res = await fetch("/api/faculty/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...topicForm, moduleId })
      });
      if (res.ok) {
        setCreatingTopicForModule(null);
        setTopicForm({ title: "", type: "notes", durationMinutes: 10, videoId: "", ebookContent: "", simulationUrl: "", assignmentDescription: "" });
        alert("Topic created successfully! If it's a notes topic, you can upload a file now.");
        fetchSubjectData(); // Refresh to show topic in module list (needs deeper fetch or we just tell them it worked)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingTopic(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;
    try {
      const res = await fetch(`/api/faculty/topics?id=${topicId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSubjectData();
      } else {
        alert("Failed to delete topic");
      }
    } catch (e) {
      alert("Error deleting topic");
    }
  };

  const handleUploadNotes = async (e: React.FormEvent, topicId: string) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploadStatus("Uploading to Google Drive...");

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("topicId", topicId);

    try {
      const res = await fetch("/api/faculty/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus("Successfully uploaded to Drive!");
        setUploadFile(null);
        setUploadingTopic(null);
      } else {
        setUploadStatus(data.error || "Failed to upload");
      }
    } catch (error) {
      setUploadStatus("An error occurred");
    }
  };

  const handleUploadQuizOrFlashcards = async (e: React.FormEvent, moduleId: string, topicType: "quiz" | "flashcard") => {
    e.preventDefault();
    if (!quizFile) return;

    setUploadStatus("Extracting questions...");
    const formData = new FormData();
    formData.append("file", quizFile);
    formData.append("moduleId", moduleId);
    formData.append("title", quizTitle);
    formData.append("totalQuestions", quizTotalQuestions);
    formData.append("topicType", topicType);

    try {
      const res = await fetch("/api/faculty/quiz-upload", { method: "POST", body: formData });
      if (res.ok) {
        setUploadStatus(`${topicType === "quiz" ? "Quiz" : "Flashcards"} imported successfully!`);
        setUploadingTopic(null);
        setUploadingFlashcards(null);
        setQuizFile(null);
        setQuizTitle("");
        setQuizTotalQuestions("5");
        router.refresh();
      } else {
        const err = await res.json();
        setUploadStatus(err.error || "Upload failed");
      }
    } catch (error) {
      setUploadStatus("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-mesh font-sans text-gray-900 pb-20">

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <Link href="/faculty/dashboard" className="flex items-center gap-2 hover:text-rose-600 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 px-3 py-1 bg-white/50 rounded-full border border-gray-200">{subject.code}</span>
          </div>
          <button
            onClick={() => setIsCreatingModule(true)}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Module
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">{subject.title}</h1>
          <p className="text-gray-500 max-w-2xl">{subject.description}</p>
        </div>

        {/* Create Module Modal */}
        {isCreatingModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 p-8 animate-in zoom-in-95 slide-in-from-bottom-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Module</h2>
                <button onClick={() => setIsCreatingModule(false)} className="text-gray-400 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 p-2 rounded-full transition">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleCreateModule} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Module Title</label>
                  <input type="text" required value={moduleForm.title} onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" placeholder="e.g. Introduction to Variables" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition h-24 resize-none" placeholder="What will students learn?" />
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="btn-primary w-full py-3 rounded-xl">Save Module</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {modules.length === 0 && (
            <div className="glass-card p-12 rounded-3xl text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No modules yet</h3>
              <p className="text-gray-500 max-w-md">Start building your course structure by adding your first module.</p>
              <button onClick={() => setIsCreatingModule(true)} className="btn-primary px-6 py-2.5 rounded-xl text-sm mt-6">Create Module</button>
            </div>
          )}

          {modules.map((mod: any, modIdx: number) => (
            <div key={mod.id} className="relative">
              <div className="glass-card rounded-3xl overflow-hidden border border-gray-200/50 shadow-sm">
                <div className="bg-white/80 border-b border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-rose-500 to-red-600"></div>
                  <div className="pl-4">
                    <span className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1 block">Module {modIdx + 1}</span>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{mod.title}</h3>
                    {mod.description && <p className="text-sm text-gray-500 mt-1">{mod.description}</p>}
                  </div>
                  <div className="flex gap-2 pl-4 md:pl-0">
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                      <button onClick={() => setCreatingTopicForModule(mod.id)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white shadow-sm rounded-lg hover:text-rose-600 transition">
                        + Topic
                      </button>
                      <button onClick={() => setUploadingTopic(mod.id)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white shadow-sm rounded-lg hover:text-rose-600 transition">
                        + Quiz
                      </button>
                      <button onClick={() => setUploadingFlashcards(mod.id)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white shadow-sm rounded-lg hover:text-rose-600 transition">
                        + Flashcards
                      </button>
                    </div>
                    <button onClick={() => handleDeleteModule(mod.id)} className="p-2.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition" title="Delete Module">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>


                <div className="p-4 sm:p-6 bg-white/40">
                  {mod.topics && mod.topics.length > 0 ? (
                    <div className="space-y-3">
                      {mod.topics.map((topic: any, idx: number) => (
                        <div key={topic.id} className="group bg-white border border-gray-200/60 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">
                                {idx + 1}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${topic.type === 'video' ? 'bg-purple-50 text-purple-600' :
                                      topic.type === 'quiz' ? 'bg-orange-50 text-orange-600' :
                                        'bg-blue-50 text-blue-600'
                                    }`}>
                                    {topic.type}
                                  </span>
                                </div>
                                <p className="font-bold text-gray-900">{topic.title}</p>
                              </div>
                            </div>
                            <button onClick={() => handleDeleteTopic(topic.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition opacity-0 group-hover:opacity-100">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>

                          {/* Attachments Section */}
                          {topic.fileMaterials && topic.fileMaterials.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100/60 pl-14">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Attached Materials</p>
                              <div className="flex flex-col gap-2">
                                {topic.fileMaterials.map((mat: any) => (
                                  <div key={mat.id} className="flex items-center justify-between bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <div className="p-1 bg-rose-100 text-rose-600 rounded">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                      </div>
                                      <a href={mat.webContentLink || mat.webViewLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gray-700 hover:text-rose-600 transition truncate">
                                        {mat.fileName}
                                      </a>
                                    </div>
                                    <button onClick={() => handleDeleteMaterial(mat.id)} className="text-[10px] text-gray-400 hover:text-rose-600 px-2 py-1 rounded transition uppercase font-bold tracking-wider">Remove</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {["reading", "notes", "mindmap", "flashcard", "extra"].includes(topic.type) && (
                            <div className="mt-4 pt-4 border-t border-gray-100/60 pl-14 flex items-center justify-end">
                              <button type="button" onClick={() => setUploadingTopic(topic.id)} className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl hover:bg-rose-100 transition flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Attach File
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                      <p className="text-sm font-medium text-gray-500">No topics added to this module yet.</p>
                    </div>
                  )}
                  {uploadStatus && <p className="text-sm text-center font-medium text-emerald-600 bg-emerald-50 py-2 rounded-lg mt-4">{uploadStatus}</p>}
                </div>
              </div>

              {/* Upload Quiz Modal */}
              {uploadingTopic === mod.id && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in">
                  <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 p-8 animate-in zoom-in-95 slide-in-from-bottom-10">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Upload Quiz</h2>
                      <button type="button" onClick={() => setUploadingTopic(null)} className="text-gray-400 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 p-2 rounded-full transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <form onSubmit={(e) => handleUploadQuizOrFlashcards(e, mod.id, "quiz")} className="space-y-5">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                        <p className="font-semibold text-amber-900">DOCX Format Guide:</p>
                        <pre className="font-mono bg-white/60 p-3 rounded-lg border border-amber-100 whitespace-pre-wrap">
{"1. What is 2 + 2?\nA) 3\nB) 4\nC) 5\nD) 6\nAnswer: B. Basic math!"}
                        </pre>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Quiz Title</label>
                        <input type="text" required placeholder="e.g. Variables Pop Quiz" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Quiz File (.docx or .json)</label>
                        <input type="file" accept=".json,.docx" required onChange={e => setQuizFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Total Questions to Extract</label>
                        <input type="number" min="1" required placeholder="e.g. 30" value={quizTotalQuestions} onChange={e => setQuizTotalQuestions(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" />
                      </div>
                      <div className="pt-2 flex flex-col gap-2">
                        <button type="submit" className="btn-primary w-full py-3 rounded-xl">Upload & Extract</button>
                        {uploadStatus && <p className="text-sm text-center font-medium text-emerald-600 bg-emerald-50 py-2 rounded-lg">{uploadStatus}</p>}
                      </div>
                    </form>
                  </div>
                </div>
              )}

                              {/* Upload Flashcards Modal */}
                              {uploadingFlashcards === mod.id && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in">
                                  <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 p-8 animate-in zoom-in-95 slide-in-from-bottom-10">
                                    <div className="flex justify-between items-center mb-6">
                                      <h2 className="text-2xl font-bold text-gray-900">Upload Flashcards</h2>
                                      <button type="button" onClick={() => setUploadingFlashcards(null)} className="text-gray-400 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 p-2 rounded-full transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                      </button>
                                    </div>
                                    <form onSubmit={(e) => handleUploadQuizOrFlashcards(e, mod.id, "flashcard")} className="space-y-5">
                                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                                        <p className="font-semibold text-amber-900">DOCX Format Guide:</p>
                                        <pre className="font-mono bg-white/60 p-3 rounded-lg border border-amber-100 whitespace-pre-wrap">
                                          1. Question Text?
                                          Answer: The answer that will be shown on the back of the flashcard!
                                        </pre>
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Topic Title</label>
                                        <input type="text" required placeholder="e.g. Chapter 1 Flashcards" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Flashcards File (.docx or .json)</label>
                                        <input type="file" accept=".json,.docx" required onChange={e => setQuizFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Total Flashcards to Extract</label>
                                        <input type="number" min="1" required placeholder="e.g. 30" value={quizTotalQuestions} onChange={e => setQuizTotalQuestions(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" />
                                      </div>
                                      <div className="pt-2 flex flex-col gap-2">
                                        <button type="submit" className="btn-primary w-full py-3 rounded-xl">Upload & Extract</button>
                                        {uploadStatus && <p className="text-sm text-center font-medium text-emerald-600 bg-emerald-50 py-2 rounded-lg">{uploadStatus}</p>}
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              )}

                              {/* Create Topic Modal */}
                              {creatingTopicForModule === mod.id && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in">
                                  <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 p-8 animate-in zoom-in-95 slide-in-from-bottom-10">
                                    <div className="flex justify-between items-center mb-6">
                                      <h2 className="text-2xl font-bold text-gray-900">Add Topic</h2>
                                      <button type="button" onClick={() => setCreatingTopicForModule(null)} className="text-gray-400 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 p-2 rounded-full transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                      </button>
                                    </div>
                                    <form onSubmit={(e) => handleCreateTopic(e, mod.id)} className="space-y-5">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                          <label className="text-sm font-semibold text-gray-700">Topic Title</label>
                                          <input type="text" required value={topicForm.title} onChange={e => setTopicForm({ ...topicForm, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" />
                                        </div>
                                        <div className="space-y-1.5">
                                          <label className="text-sm font-semibold text-gray-700">Content Type</label>
                                          <select value={topicForm.type} onChange={e => setTopicForm({ ...topicForm, type: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition appearance-none">
                                            <option value="notes">Notes (PDF/PPT)</option>
                                            <option value="video">Video (YouTube)</option>
                                            <option value="reading">Reading Text</option>
                                            <option value="simulation">Simulation</option>
                                            <option value="mindmap">Mind Map</option>
                                            <option value="flashcard">Flash Cards</option>
                                            <option value="extra">Extra Content</option>
                                          </select>
                                        </div>
                                      </div>
                                      {topicForm.type === "video" && (
                                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                          <label className="text-sm font-semibold text-gray-700">YouTube Video ID</label>
                                          <input type="text" required value={topicForm.videoId} onChange={e => setTopicForm({ ...topicForm, videoId: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" placeholder="e.g. dQw4w9WgXcQ" />
                                        </div>
                                      )}
                                      {topicForm.type === "simulation" && (
                                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                          <label className="text-sm font-semibold text-gray-700">Simulation URL</label>
                                          <input type="text" required value={topicForm.simulationUrl} onChange={e => setTopicForm({ ...topicForm, simulationUrl: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" placeholder="https://..." />
                                        </div>
                                      )}
                                      {["reading", "simulation", "mindmap", "flashcard", "extra"].includes(topicForm.type) && (
                                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                          <label className="text-sm font-semibold text-gray-700">Text Content</label>
                                          <textarea value={topicForm.ebookContent} onChange={e => setTopicForm({ ...topicForm, ebookContent: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition h-24" placeholder="Add text explanation..." />
                                        </div>
                                      )}
                                      <div className="pt-4">
                                        <button type="submit" disabled={isSubmittingTopic} className="btn-primary w-full py-3 rounded-xl disabled:opacity-50">
                                          {isSubmittingTopic ? "Creating..." : "Save Topic"}
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              )}

                              {/* Upload File Modals (need to loop over topics here outside the glass card) */}
                              {mod.topics?.map((topic: any) => (
                                uploadingTopic === topic.id && ["reading", "notes", "mindmap", "flashcard", "extra"].includes(topic.type) && (
                                  <div key={`notes-modal-${topic.id}`} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in">
                                    <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 p-8 animate-in zoom-in-95 slide-in-from-bottom-10">
                                      <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Upload File</h2>
                                        <button type="button" onClick={() => setUploadingTopic(null)} className="text-gray-400 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 p-2 rounded-full transition">
                                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                      </div>
                                      <form onSubmit={(e) => handleUploadNotes(e, topic.id)} className="space-y-5 text-left">
                                        <div className="space-y-1.5">
                                          <label className="text-sm font-semibold text-gray-700">Notes File</label>
                                          <input type="file" required onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
                                        </div>
                                        <div className="pt-2 flex flex-col gap-2">
                                          <button type="submit" className="btn-primary w-full py-3 rounded-xl">Upload to Drive</button>
                                          {uploadStatus && <p className="text-sm text-center font-medium text-emerald-600 bg-emerald-50 py-2 rounded-lg">{uploadStatus}</p>}
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                )
                              ))}
                            </div>
          ))}
                            </div>

                          </div>
                      </div>
                      );
}
