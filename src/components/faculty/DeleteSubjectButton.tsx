"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export function DeleteSubjectButton({ subjectId, subjectName }: { subjectId: string; subjectName: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the subject link
    e.stopPropagation(); // Prevent triggering Card onClick
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetchGAS("deleteSubject", { subjectId });
      if (res && res.success) {
        toast.success("Subject deleted successfully");
        setIsConfirmOpen(false);
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
    <>
      <button
        type="button"
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors absolute top-2 right-2 z-10"
        title="Delete Subject"
      >
        <Trash className="w-4 h-4" />
      </button>

      <DeleteConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${subjectName}?`}
        message="This action will permanently delete this item and cannot be undone. All associated modules, quizzes, flashcards, simulations, resources, mindmaps, and infographics will also be deleted."
        isDeleting={isDeleting}
      />
    </>
  );
}
