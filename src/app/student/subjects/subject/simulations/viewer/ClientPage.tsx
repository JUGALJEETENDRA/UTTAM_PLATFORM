"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";
import { 
  ViewerLayout, 
  ViewerBreadcrumbs, 
  ViewerHeader, 
  ViewerPreviousNext, 
  ViewerRelatedResources 
} from "@/components/student/viewers/ViewerComponents";
import { UttamLoader } from "@/components/ui/UttamLoader";

export default function SimulationViewerClientPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
  const moduleId = searchParams.get('moduleId') || '';
  const subtopicId = searchParams.get('subtopicId') || '';

  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState("Subject");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (subjectId) {
      const loadData = async () => {
        try {
          const [dashboardResult, subjectsResult] = await Promise.all([
            fetchGAS("getStudentDashboard", { subjectId, userId: "anonymous" }),
            fetchGAS("getSubjects")
          ]);
          
          if (Array.isArray(subjectsResult)) {
            const sub = subjectsResult.find(s => s.id === subjectId);
            if (sub) setSubjectName(sub.name || "Subject");
          }
          
          setData(dashboardResult);
        } catch (err) {
          console.error("Failed to load viewer data:", err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [subjectId]);

  const activeSimulation = useMemo(() => {
    if (!data || !data.simulations) return null;
    return data.simulations.find((s: any) => s.moduleId === moduleId && (subtopicId ? s.subtopicId === subtopicId : true)) || null;
  }, [data, moduleId, subtopicId]);

  const moduleData = useMemo(() => {
    if (!data || !data.modules) return null;
    return data.modules.find((m: any) => m.id === moduleId) || null;
  }, [data, moduleId]);

  const activeSubtopic = useMemo(() => {
    if (!moduleData || !moduleData.subtopics) return null;
    return moduleData.subtopics.find((st: any) => st.id === subtopicId) || null;
  }, [moduleData, subtopicId]);

  if (loading) {
    return <UttamLoader isLoading={true} />;
  }

  if (!data || !activeSimulation || !activeSimulation.url) {
    return (
      <ViewerLayout>
        <div className="p-8 text-center border border-stone-200 bg-white rounded-xl">
          <p className="text-stone-500 font-medium">Simulation not found.</p>
        </div>
      </ViewerLayout>
    );
  }

  const simUrl = activeSimulation.url;

  const simulationsInModule = (data.simulations || []).filter((s: any) => s.moduleId === moduleId);
  const currentIdx = simulationsInModule.findIndex((s: any) => s.id === activeSimulation.id);
  
  let prev = null;
  let next = null;

  if (currentIdx > 0) {
    const s = simulationsInModule[currentIdx - 1];
    prev = { title: "Previous Simulation", url: `/student/subjects/subject/simulations/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${s.subtopicId || ""}` };
  }
  if (currentIdx >= 0 && currentIdx < simulationsInModule.length - 1) {
    const s = simulationsInModule[currentIdx + 1];
    next = { title: "Next Simulation", url: `/student/subjects/subject/simulations/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${s.subtopicId || ""}` };
  }

  const relatedResources: any[] = [];
  if (activeSubtopic) {
    const videoUrl = activeSubtopic.videoUrl || (activeSubtopic.type === 'videoUrl' ? activeSubtopic.mediaUrl : "");
    if (videoUrl) {
      relatedResources.push({
        id: "video", title: "Video Lesson", type: "videos",
        url: `/student/subjects/subject/videos/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activeSubtopic.id}`
      });
    }
    
    const notesUrl = activeSubtopic.notesUrl || (activeSubtopic.type === 'notes' ? activeSubtopic.mediaUrl : "");
    if (notesUrl || activeSubtopic.lessonContent) {
      relatedResources.push({
        id: "notes", title: "Study Notes", type: "notes",
        url: `/student/subjects/subject/notes/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activeSubtopic.id}`
      });
    }
  }

  return (
    <ViewerLayout maxWidth="max-w-5xl">
      <ViewerBreadcrumbs subjectId={subjectId} subjectName={subjectName} resourceType="simulations" />
      <ViewerHeader 
        title={activeSimulation.title || "Interactive Simulation"}
        moduleName={moduleData?.title ? moduleData.title.replace(/^[●•]\s*/, "") : `Module ${moduleData?.moduleNo || ''}`}
        topicName="Interactive Learning"
      />

      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm mb-12 h-[80vh] min-h-[600px] overflow-hidden">
        <iframe
          src={simUrl}
          className="w-full h-full border-0 rounded-xl bg-stone-100"
          title={activeSimulation.title || "Simulation"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        />
      </div>

      <ViewerPreviousNext prev={prev} next={next} />
      <ViewerRelatedResources resources={relatedResources} />
    </ViewerLayout>
  );
}
