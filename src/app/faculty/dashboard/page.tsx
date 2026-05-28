"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FacultyDashboard() {
  const { data: session, status } = useSession();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");

  const [subjects, setSubjects] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    instructor: "",
    credits: 3,
    semester: 1,
    coverColor: "from-red-500 to-red-700"
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchSubjects();
    }
  }, [status]);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/faculty/subjects");
      const data = await res.json();
      if (res.ok) {
        setSubjects(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (status === "loading") return <div className="p-8">Loading...</div>;
  if (!session || (session.user as any).role !== "TEACHER") {
    return <center><div className="p-8 text-red-500">Access Denied. Faculty only.</div></center>;
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus("Inviting...");
    try {
      const res = await fetch("/api/faculty/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setInviteStatus(`Successfully whitelisted ${inviteEmail}`);
        setInviteEmail("");
      } else {
        setInviteStatus(data.error || "Failed to invite");
      }
    } catch (error) {
      setInviteStatus("An error occurred");
    }
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/faculty/subjects/${editingId}` : "/api/faculty/subjects";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsCreating(false);
        setEditingId(null);
        setFormData({ code: "", title: "", description: "", instructor: "", credits: 3, semester: 1, coverColor: "from-red-500 to-red-700" });
        fetchSubjects();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save subject");
      }
    } catch (e) {
      alert("Error saving subject");
    }
  };

  const startEdit = (subject: any) => {
    setEditingId(subject.id);
    setFormData({
      code: subject.code,
      title: subject.title,
      description: subject.description,
      instructor: subject.instructor,
      credits: subject.credits,
      semester: subject.semester,
      coverColor: subject.coverColor
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject? All its modules and content will be lost forever.")) return;
    try {
      const res = await fetch(`/api/faculty/subjects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchSubjects();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete");
      }
    } catch (e) {
      alert("Error deleting subject");
    }
  };

  return (
    <div className="min-h-screen bg-mesh font-sans text-gray-900 pb-16">

      {/* Top Navbar / Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Welcome Back, {(session.user as any)?.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingId(null);
                setFormData({ code: "", title: "", description: "", instructor: (session.user as any)?.name || "", credits: 3, semester: 1, coverColor: "from-rose-500 to-red-600" });
              }}
              className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Subject
            </button>
            <div className="h-8 w-px bg-gray-300/50"></div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="btn-secondary px-4 py-2.5 rounded-xl text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 xl:grid-cols-12 gap-10">

        {/* Main Content Area */}
        <div className="xl:col-span-8 space-y-8">

          {/* Stats Hero Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-sm font-medium text-gray-500 mb-1">Subjects</p>
              <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
            </div>
          </div>

          {/* Modal for Creating/Editing Subject */}
          {isCreating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white/95 backdrop-blur-xl w-full max-w-2xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-in zoom-in-95 slide-in-from-bottom-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">{editingId ? "Edit Subject" : "Create Subject"}</h2>
                  <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 p-2 rounded-full transition">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleSaveSubject} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Course Code</label>
                      <input type="text" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" placeholder="e.g. CS101" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Course Title</label>
                      <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" placeholder="e.g. Data Structures" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Description</label>
                      <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition h-28 resize-none" placeholder="Brief subject description..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Instructor Name</label>
                      <input type="text" required value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Credits</label>
                        <input type="number" min="1" max="10" required value={formData.credits} onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Semester</label>
                        <input type="number" min="1" max="8" required value={formData.semester} onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary px-6 py-3 rounded-xl">Cancel</button>
                    <button type="submit" className="btn-primary px-8 py-3 rounded-xl">{editingId ? "Update Subject" : "Create Subject"}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your Subjects</h2>
            </div>

            {subjects.length === 0 ? (
              <div className="glass-card p-12 rounded-3xl flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No subjects yet</h3>
                <p className="text-gray-500 max-w-sm mb-6">Create your first subject to start building modules, topics, and quizzes.</p>
                <button onClick={() => setIsCreating(true)} className="btn-primary px-6 py-2.5 rounded-xl text-sm">Create First Subject</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map(subject => (
                  <div key={subject.id} className="group glass-card rounded-3xl overflow-hidden flex flex-col">
                    <div className={`h-24 w-full bg-gradient-to-r ${subject.coverColor || 'from-rose-500 to-red-600'} relative`}>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(subject)} className="w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(subject.id)} className="w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold tracking-wider mb-3">
                          {subject.code}
                        </span>
                        <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2 leading-tight">{subject.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{subject.description}</p>
                      </div>
                      <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">
                          {subject.modules?.length || 0} Modules • {subject.modules?.reduce((acc: number, m: any) => acc + (m._count?.topics || 0), 0) || 0} Topics
                        </span>
                        <Link href={`/faculty/subject/${subject.id}`} className="text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition">
                          Manage
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-4">
          <div className="glass-panel p-6 rounded-3xl sticky top-28">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-gray-900/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">Faculty Access</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Whitelist a Google email address so a new instructor can access the faculty portal.
            </p>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="teacher@example.com"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-900/20">
                Grant Access
              </button>
            </form>
            {inviteStatus && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <p className="text-xs font-semibold text-emerald-700">{inviteStatus}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
