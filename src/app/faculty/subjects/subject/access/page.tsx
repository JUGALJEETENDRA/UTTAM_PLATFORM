"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";
import { Users, Trash2, Plus, Upload, FileUp, Loader2, Globe, Lock, Search, Edit2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Papa from "papaparse";

export default function AccessManagementPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId");

  const [students, setStudents] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [togglingPrivacy, setTogglingPrivacy] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", rollNo: "", email: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single student form
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  const loadStudents = async () => {
    if (!subjectId) return;
    setLoading(true);
    try {
      const data = await fetchGAS("getAuthorizedStudents", { subjectId });
      if (data && data.students) {
        setStudents(data.students);
        setIsPublic(data.isPublic);
      } else {
        // Fallback if backend hasn't updated yet
        setStudents(Array.isArray(data) ? data : []);
        setIsPublic(false);
      }
    } catch (err) {
      toast.error("Failed to load authorized students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [subjectId]);

  const handleTogglePrivacy = async () => {
    setTogglingPrivacy(true);
    try {
      const res = await fetchGAS("toggleSubjectPrivacy", { subjectId, isPublic: !isPublic });
      if (res.success) {
        setIsPublic(!isPublic);
        toast.success(`Subject is now ${!isPublic ? 'Public' : 'Private'}`);
      } else {
        toast.error("Failed to update privacy setting.");
      }
    } catch (err) {
      toast.error("Error updating privacy setting.");
    } finally {
      setTogglingPrivacy(false);
    }
  };

  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setAdding(true);
    try {
      const res = await fetchGAS("addAuthorizedStudent", { subjectId, email, name, rollNo });
      if (res.success) {
        toast.success(res.message || "Student authorized successfully!");
        setEmail("");
        setName("");
        setRollNo("");
        loadStudents();
      } else {
        toast.error(res.error || "Failed to authorize student.");
      }
    } catch (err) {
      toast.error("Failed to authorize student.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove access for this student?")) return;
    try {
      const res = await fetchGAS("removeAuthorizedStudent", { id });
      if (res.success) {
        toast.success("Student removed successfully.");
        loadStudents();
      } else {
        toast.error(res.error || "Failed to remove student.");
      }
    } catch (err) {
      toast.error("Failed to remove student.");
    }
  };

  const startEdit = (student: any) => {
    setEditingId(student.id);
    setEditForm({ name: student.name || "", email: student.email || "", rollNo: student.rollNo || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editForm.email) return;
    try {
      const res = await fetchGAS("updateAuthorizedStudent", {
        id: editingId,
        ...editForm
      });
      if (res.success) {
        toast.success("Student updated successfully");
        setEditingId(null);
        loadStudents();
      } else {
        toast.error("Failed to update student");
      }
    } catch (err) {
      toast.error("Error updating student");
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as string[][];
        let rows = data;
        if (
          rows.length > 0 &&
          rows[0].some((c) => c.toLowerCase().includes("email") || c.toLowerCase().includes("name"))
        ) {
          rows = rows.slice(1);
        }

        const newStudents = rows.map((row) => ({
          rollNo: row[0]?.trim() || "",
          name: row[1]?.trim() || "",
          email: row[2]?.trim() || "",
        })).filter(s => s.email !== "");

        if (newStudents.length === 0) {
          toast.error("No valid emails found in CSV.");
          return;
        }

        setAdding(true);
        try {
          const res = await fetchGAS("addAuthorizedStudentsBulk", { subjectId, students: newStudents });
          if (res.success) {
            toast.success(`Successfully added ${res.addedCount} students!`);
            loadStudents();
          } else {
            toast.error(res.error || "Failed to process CSV.");
          }
        } catch (err) {
          toast.error("Error processing CSV upload.");
        } finally {
          setAdding(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: () => {
        toast.error("Failed to parse CSV file.");
      }
    });
  };

  if (!subjectId) return <div className="p-8">No subject selected.</div>;

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      String(s.name || "").toLowerCase().includes(q) ||
      String(s.email || "").toLowerCase().includes(q) ||
      String(s.rollNo || "").toLowerCase().includes(q)
    );
  });


  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" />
            Access Management
          </h1>
          <p className="text-zinc-500 mt-1">Manage which students can access this subject.</p>
        </div>

        <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-zinc-900">Privacy Status</span>
            <span className="text-xs text-zinc-500">{isPublic ? 'Open to everyone' : 'Whitelist only'}</span>
          </div>
          <button
            onClick={handleTogglePrivacy}
            disabled={togglingPrivacy}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isPublic ? 'bg-green-500' : 'bg-zinc-300'}`}
          >
            <span
              className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white transition-transform ${isPublic ? 'translate-x-7' : 'translate-x-1'}`}
            >
              {isPublic ? <Globe className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-zinc-400" />}
            </span>
          </button>
        </div>
      </div>

      {isPublic && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-start">
          <Globe className="w-5 h-5 mr-3 mt-0.5 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Subject is currently Public</h3>
            <p className="text-sm mt-1">
              Anyone with the link can access this subject without signing in. You do not need to manage the student whitelist while the subject is public.
            </p>
          </div>
        </div>
      )}

      {!isPublic && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900">Add Student Individually</h2>
            <form onSubmit={handleAddSingle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Roll No</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="CS101"
                />
              </div>
              <button
                type="submit"
                disabled={adding || !email}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Add Student</span>
              </button>
            </form>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900">Bulk Add via CSV</h2>
            <p className="text-sm text-zinc-500 mb-4">
              Upload a CSV file without headers or with headers containing "email" or "name".<br />
              Expected columns: <strong>1. Roll No</strong>, <strong>2. Name</strong>, <strong>3. Email</strong>.
            </p>
            <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center bg-zinc-50 hover:bg-zinc-100 transition-colors">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleCsvUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="p-3 bg-white border border-zinc-200 rounded-full text-zinc-500">
                  <FileUp className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-zinc-700">Click to upload CSV</span>
                <span className="text-xs text-zinc-500">Only .csv files are supported</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-zinc-900">Authorized Students ({students.length})</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-zinc-500 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No students have been authorized yet.
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No students found matching "{searchQuery}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-3 text-sm font-medium text-zinc-600">Roll No</th>
                  <th className="px-6 py-3 text-sm font-medium text-zinc-600">Name</th>
                  <th className="px-6 py-3 text-sm font-medium text-zinc-600">Email</th>
                  <th className="px-6 py-3 text-sm font-medium text-zinc-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredStudents.map((student) => {
                  const isEditing = editingId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-zinc-900 w-1/4">
                        {isEditing ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-zinc-300 rounded focus:ring-2 focus:ring-primary"
                            value={editForm.rollNo}
                            onChange={e => setEditForm({ ...editForm, rollNo: e.target.value })}
                          />
                        ) : (
                          student.rollNo || "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900 w-1/4">
                        {isEditing ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-zinc-300 rounded focus:ring-2 focus:ring-primary"
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        ) : (
                          student.name || "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 font-medium w-1/3">
                        {isEditing ? (
                          <input
                            type="email"
                            className="w-full px-2 py-1 border border-zinc-300 rounded focus:ring-2 focus:ring-primary"
                            value={editForm.email}
                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                          />
                        ) : (
                          student.email
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1.5 rounded-lg transition-colors"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 p-1.5 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => startEdit(student)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                              title="Edit Student"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemove(student.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                              title="Remove Access"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
