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

export default function InfographicViewerClientPage() {
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

  const activeInfographic = useMemo(() => {
    if (!data || !data.infographics) return null;
    return data.infographics.find((i: any) => i.moduleId === moduleId && (subtopicId ? i.subtopicId === subtopicId : true)) || null;
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

  if (!data || !activeInfographic || (!activeInfographic.fileUrl && !activeInfographic.link)) {
    return (
      <ViewerLayout>
        <div className="p-8 text-center border border-stone-200 bg-white rounded-xl">
          <p className="text-stone-500 font-medium">Infographic not found.</p>
        </div>
      </ViewerLayout>
    );
  }

  const fileUrl = activeInfographic.fileUrl || activeInfographic.link || "";
  const embedUrl = getExternalEmbedUrl(fileUrl) || fileUrl;

  const infographicsInModule = (data.infographics || []).filter((i: any) => i.moduleId === moduleId);
  const currentIdx = infographicsInModule.findIndex((i: any) => i.id === activeInfographic.id);
  
  let prev = null;
  let next = null;

  if (currentIdx > 0) {
    const i = infographicsInModule[currentIdx - 1];
    prev = { title: "Previous Infographic", url: `/student/subjects/subject/infographics/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${i.subtopicId || ""}` };
  }
  if (currentIdx >= 0 && currentIdx < infographicsInModule.length - 1) {
    const i = infographicsInModule[currentIdx + 1];
    next = { title: "Next Infographic", url: `/student/subjects/subject/infographics/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${i.subtopicId || ""}` };
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
      <ViewerBreadcrumbs subjectId={subjectId} subjectName={subjectName} resourceType="infographics" />
      <ViewerHeader 
        title={activeInfographic.title || "Visual Infographic"}
        moduleName={moduleData?.title ? moduleData.title.replace(/^[●•]\s*/, "") : `Module ${moduleData?.moduleNo || ''}`}
        topicName="Visual Learning"
      />

      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm mb-12 min-h-[60vh] h-[80vh] overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 rounded-xl bg-stone-100"
          title={activeInfographic.title || "Infographic"}
        />
      </div>

      <ViewerPreviousNext prev={prev} next={next} />
      <ViewerRelatedResources resources={relatedResources} />
    </ViewerLayout>
  );
}
