"use client";
import { SimulationCard } from "@/components/cards/SimulationCard";
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, use } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { redirect, useSearchParams } from "next/navigation";
export default function SimulationsPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
    const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (status === "unauthenticated") redirect("/sign-in");
    if (status === "authenticated" && session?.user) {
      const loadSimulations = async () => {
        try {
          const result = await fetchGAS("getSimulations", { subjectId });
          if (Array.isArray(result)) {
            setSimulations(result);
          }
        } catch (err) {
          console.error("Failed to load simulations", err);
        } finally {
          setLoading(false);
        }
      };
      loadSimulations();
    }
  }, [status, session, subjectId]);
  if (status === "loading" || loading) return <div className="p-8 text-center">Loading simulations...</div>;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">Interactive</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <Gamepad2 className="w-8 h-8 mr-3 text-primary" />
          Simulations Library
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Apply principles practically by completing these {simulations.length} interactive sandboxes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations.map((sim) => (
          <SimulationCard key={sim.id} simulation={sim} href={`/student/subjects/subject/simulations/item?subjectId=${subjectId}&id=${sim.id}`} />
        ))}
      </div>
      {simulations.length === 0 && (
        <p className="text-zinc-500 text-center py-12">No simulations available yet.</p>
      )}
    </div>
  );
}