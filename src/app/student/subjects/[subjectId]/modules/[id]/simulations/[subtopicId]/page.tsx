"use client";

import { useEffect, useState, use } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { SimulationContainer } from "@/app/student/subjects/[subjectId]/simulations/[id]/SimulationContainer";
import { useSession } from "@/components/AuthProvider";
import { redirect, useParams } from "next/navigation";

export default function SubtopicSimulationPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const moduleId = params.id as string;
  const subtopicId = params.subtopicId as string;
  const { data: session, status } = useSession();
  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/sign-in");

    if (status === "authenticated" && session?.user) {
      const loadModule = async () => {
        try {
          const result = await fetchGAS("getModule", { moduleId, userId: session.user.id });
          if (result && !result.error) {
            setModuleData(result);
          }
        } catch (err) {
          console.error("Failed to load module", err);
        } finally {
          setLoading(false);
        }
      };
      loadModule();
    }
  }, [moduleId, status, session]);

  if (status === "loading" || loading) return <div className="p-8 text-center">Loading simulation...</div>;
  if (!moduleData || moduleData.error) return <div className="p-8 text-center text-red-500">Module not found.</div>;

  const subtopic = moduleData.subtopics?.find((s: any) => s.id === subtopicId);

  if (!subtopic || !subtopic.simulationUrl) {
    return <div className="p-8 text-center text-red-500">Simulation not found for this subtopic.</div>;
  }

  // Create a mock simulation object that SimulationContainer expects
  const simulation = {
    id: subtopic.id,
    title: subtopic.title,
    description: subtopic.description,
    difficulty: "Intermediate",
    xpReward: 100,
    estimatedTime: "15 mins",
    learningOutcome: subtopic.learningOutcome || "Practice and apply the principles from the learning materials in an interactive environment.",
    frontendUrl: subtopic.simulationUrl,
  };

  return (
    <SimulationContainer 
      simulation={simulation} 
      category={`Module ${moduleData.moduleNo}: ${moduleData.title}`} 
    />
  );
}
