"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";

export function MarkCompletedButton({ 
  subjectId, 
  moduleId, 
  subtopicId 
}: { 
  subjectId: string, 
  moduleId: string, 
  subtopicId: string 
}) {
  const [completed, setCompleted] = useState(false);

  const toggleCompleted = () => {
    setCompleted(!completed);
  };

  return (
    <Button 
      onClick={toggleCompleted}
      variant={completed ? "default" : "outline"}
      className={completed ? "bg-green-600 hover:bg-green-700 text-white" : "text-zinc-600 hover:text-green-600 border-zinc-300 hover:border-green-300"}
    >
      {completed ? <CheckCircle className="w-5 h-5 mr-2" /> : <Circle className="w-5 h-5 mr-2" />}
      {completed ? "Completed" : "Mark as Complete"}
    </Button>
  );
}
