"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";

export function DeleteSubjectButton({ subjectId }: { subjectId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the subject link
    if (!confirm("Are you sure you want to delete this subject? All associated modules, simulations, and quizzes will be removed. This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetchGAS("deleteSubject", { subjectId });
      if (res && res.success) {
        toast.success("Subject deleted successfully");
        window.location.reload();
      } else {
        toast.error(res?.error || "Failed to delete subject");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors absolute top-2 right-2 z-10"
      title="Delete Subject"
    >
      <Trash className="w-4 h-4" />
    </button>
  );
}
