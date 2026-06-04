"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { fetchGAS } from "@/lib/apiClient";
import { useSession } from "@/components/AuthProvider";

interface MarkCompletedButtonProps {
  subtopicId: string;
  moduleId: string;
  isInitiallyCompleted: boolean;
  canComplete: boolean;
}

export function MarkCompletedButton({ subtopicId, moduleId, isInitiallyCompleted, canComplete }: MarkCompletedButtonProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isInitiallyCompleted);
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subjectId as string;
  const { data: session } = useSession();

  const toggleCompleted = async () => {
    if (!canComplete && !completed) {
      toast.error("Please view/complete all attached resources (Notes, Quiz, Simulation) first!");
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchGAS("completeSubtopic", {
        userId: session.user.id,
        subjectId: subjectId,
        moduleId: moduleId,
        subtopicId: subtopicId,
        completed: !completed
      });

      if (res.success) {
        setCompleted(!completed);
        router.refresh();
        toast.success(completed ? "Marked as incomplete" : "Marked as completed!");
      } else {
        toast.error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={completed ? "default" : "secondary"}
      onClick={toggleCompleted}
      disabled={loading}
      className={`ml-auto text-sm font-bold h-11 px-6 shadow-sm ${
        completed 
          ? "bg-green-600 hover:bg-green-700 text-white" 
          : !canComplete 
            ? "bg-zinc-100 text-zinc-400 border border-zinc-200"
            : "text-green-750 bg-green-50 hover:bg-green-100 border border-green-200"
      }`}
    >
      {!completed && !canComplete ? (
        <Lock className="w-5 h-5 mr-2 text-zinc-400" />
      ) : (
        <CheckCircle2 className={`w-5 h-5 mr-2 ${completed ? "text-white" : "text-green-600"}`} /> 
      )}
      {completed ? "Completed" : "Mark Completed"}
    </Button>
  );
}
