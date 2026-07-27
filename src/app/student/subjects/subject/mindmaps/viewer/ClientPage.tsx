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
import { getExternalEmbedUrl } from "@/lib/mediaHelpers";
import { UttamLoader } from "@/components/ui/UttamLoader";

export default function MindMapViewerClientPage() {
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

  const activeMindMap = useMemo(() => {
    if (!data || !data.mindmaps) return null;
    return data.mindmaps.find((m: any) => m.moduleId === moduleId && (subtopicId ? m.subtopicId === subtopicId : true)) || null;
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

  if (!data || !activeMindMap || (!activeMindMap.fileUrl && !activeMindMap.link)) {
    return (
      <ViewerLayout>
        <div className="p-8 text-center border border-stone-200 bg-white rounded-xl">
          <p className="text-stone-500 font-medium">Mind Map not found.</p>
        </div>
      </ViewerLayout>
    );
  }

  const mapUrl = activeMindMap.fileUrl || activeMindMap.link || "";
  const embedUrl = getExternalEmbedUrl(mapUrl) || mapUrl;

  const mapsInModule = (data.mindmaps || []).filter((m: any) => m.moduleId === moduleId);
  const currentIdx = mapsInModule.findIndex((m: any) => m.id === activeMindMap.id);
  
  let prev = null;
  let next = null;

  if (currentIdx > 0) {
    const m = mapsInModule[currentIdx - 1];
    prev = { title: "Previous Mind Map", url: `/student/subjects/subject/mindmaps/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${m.subtopicId || ""}` };
  }
  if (currentIdx >= 0 && currentIdx < mapsInModule.length - 1) {
    const m = mapsInModule[currentIdx + 1];
    next = { title: "Next Mind Map", url: `/student/subjects/subject/mindmaps/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${m.subtopicId || ""}` };
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
      <ViewerBreadcrumbs subjectId={subjectId} subjectName={subjectName} resourceType="mindmaps" />
      <ViewerHeader 
        title={activeMindMap.title || "Concept Mind Map"}
        moduleName={moduleData?.title ? moduleData.title.replace(/^[●•]\s*/, "") : `Module ${moduleData?.moduleNo || ''}`}
        topicName="Visual Learning"
      />

      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm mb-12 h-[80vh] min-h-[600px] overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 rounded-xl bg-stone-100"
          title={activeMindMap.title || "Mind Map"}
        />
      </div>

      <ViewerPreviousNext prev={prev} next={next} />
      <ViewerRelatedResources resources={relatedResources} />
    </ViewerLayout>
  );
}
