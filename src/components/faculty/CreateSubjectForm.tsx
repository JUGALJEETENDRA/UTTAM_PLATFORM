"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";

export function CreateSubjectForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const res = await fetchGAS("createSubject", { name, description, password });

      if (res && !res.error) {
        setName("");
        setDescription("");
        setPassword("");
        window.location.reload(); // Refresh to see new data
      } else {
        alert(res?.error || "Failed to create subject");
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Subject Name</label>
        <input
          type="text"
          placeholder="e.g. Human-Computer Interaction"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Description (Optional)</label>
        <input
          type="text"
          placeholder="Brief overview of the subject"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Access Password (Optional)</label>
        <input
          type="text"
          placeholder="Leave blank for public access"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={loading}
        />
        <p className="text-xs text-zinc-500 mt-1">If set, students must enter this password to access the subject.</p>
      </div>
      <Button type="submit" disabled={loading || !name} className="w-full">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-2" />}
        Create Subject
      </Button>
    </form>
  );
}
