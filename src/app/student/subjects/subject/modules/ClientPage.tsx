"use client";

import { ModuleCard } from "@/components/cards/ModuleCard";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import { fetchGAS } from "@/lib/apiClient";

import { redirect } from "next/navigation";

export default function ModulesPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/sign-in");
    
    if (status === "authenticated" && session?.user) {
      const loadModules = async () => {
        try {
          const result = await fetchGAS("getModules", { subjectId, userId: session.user.id });
          setData(result);
        } catch (err) {
          console.error("Failed to load modules", err);
        } finally {
          setLoading(false);
        }
      };
      loadModules();
    }
  }, [status, session, subjectId]);

  if (status === "loading" || loading) return <div className="p-8 text-center">Loading modules...</div>;

  const modules = data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">Subject Modules</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-primary" />
          Learning Modules
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Master the concepts across {modules.length} comprehensive modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module: any) => {
          // Provide totalXpAvailable to 0 since XP is removed, and xpEarned to 0
          const moduleWithProps = { ...module, totalXpAvailable: 0, xpEarned: 0 };
          return (
            <ModuleCard key={module.id} module={moduleWithProps} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${module.id}`} />
          );
        })}
      </div>
      {modules.length === 0 && (
        <p className="text-zinc-500 text-center py-12">No modules available yet.</p>
      )}
    </div>
  );
}
