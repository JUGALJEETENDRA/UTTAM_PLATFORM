"use client";

import { useState } from "react";
import { Edit2, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";

export function EditSubjectButton({ subject }: { subject: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(subject.name || "");
  const [description, setDescription] = useState(subject.description || "");
  const [loading, setLoading] = useState(false);

  const handleEdit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const res = await fetchGAS("updateSubject", { subjectId: subject.id, name, description });
      if (res && res.success) {
        toast.success("Subject updated successfully");
        window.location.reload();
      } else {
        toast.error(res?.error || "Failed to update subject");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleEdit}
        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors absolute top-2 right-10 z-10"
        title="Edit Subject"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => { e.preventDefault(); setIsEditing(false); }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-4">Edit Subject</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !name}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
