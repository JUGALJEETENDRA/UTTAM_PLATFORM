"use client";
import { useEffect, useState, use } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { SimulationContainer } from "./SimulationContainer";
import { redirect, useSearchParams } from "next/navigation";
export default function SimulationDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
    const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (status === "unauthenticated") redirect("/sign-in");
    if (status === "authenticated" && session?.user) {
      const loadSimulation = async () => {
        try {
          const result = await fetchGAS("getSimulation", { simulationId: id });
          if (result && !result.error) {
            setSimulation(result);
          }
        } catch (err) {
          console.error("Failed to load simulation", err);
        } finally {
          setLoading(false);
        }
      };
      loadSimulation();
    }
  }, [id, status, session]);
  if (status === "loading" || loading) return <div className="p-8 text-center">Loading simulation...</div>;
  if (!simulation) return <div className="p-8 text-center text-red-500">Simulation not found.</div>;
  const category = simulation.module ? `Module ${simulation.module.moduleNo}: ${simulation.module.title}` : "General";
  // Cast type to match SimulationContainer expectations
  const typedSimulation = {
    id: simulation.id,
    title: simulation.title,
    description: simulation.description,
    difficulty: simulation.difficulty || 'medium',
    estimatedTime: simulation.estimatedTime || 15,
    learningOutcome: simulation.learningOutcome || "Apply concepts practically.",
    frontendUrl: simulation.frontendUrl,
  };
  return <SimulationContainer simulation={typedSimulation} category={category} />;
}