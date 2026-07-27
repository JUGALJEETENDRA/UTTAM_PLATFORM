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

export default function PDFViewerClientPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
  const moduleId = searchParams.get('moduleId') || '';
  const subtopicId = searchParams.get('subtopicId') || '';
  const resourceId = searchParams.get('resourceId') || '';

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

  const activePdf = useMemo(() => {
    if (!data) return null;
    
    // Case 1: General PDF Resource
    if (moduleId === "general" || resourceId) {
      const resources = data.subjectResources || [];
      return resources.find((r: any) => r.id === resourceId || r.link === resourceId) || null;
    }
    
    // Case 2: Subtopic Reference PDF
    if (moduleId && subtopicId) {
      const module = (data.modules || []).find((m: any) => m.id === moduleId);
      if (module && module.subtopics) {
        return module.subtopics.find((st: any) => st.id === subtopicId);
      }
    }
    
    return null;
  }, [data, moduleId, subtopicId, resourceId]);

  if (loading) {
    return <UttamLoader isLoading={true} />;
  }

  if (!data || !activePdf || (!activePdf.referenceUrl && !activePdf.link)) {
    return (
      <ViewerLayout>
        <div className="p-8 text-center border border-stone-200 bg-white rounded-xl">
          <p className="text-stone-500 font-medium">PDF Document not found.</p>
        </div>
      </ViewerLayout>
    );
  }

  const pdfUrl = activePdf.referenceUrl || activePdf.link || "";
  const embedUrl = getExternalEmbedUrl(pdfUrl) || pdfUrl;

  const isGeneral = moduleId === "general" || !!resourceId;
  const moduleData = (data.modules || []).find((m: any) => m.id === activePdf.moduleId || m.id === moduleId);

  // Compute Prev/Next
  let prev = null;
  let next = null;

  if (isGeneral) {
    const resources = data.subjectResources || [];
    const idx = resources.findIndex((r: any) => r.id === resourceId || r.link === resourceId);
    if (idx > 0) {
      const r = resources[idx - 1];
      prev = { title: r.title, url: `/student/subjects/subject/pdfs/viewer?subjectId=${subjectId}&moduleId=general&resourceId=${encodeURIComponent(r.id || r.link)}` };
    }
    if (idx >= 0 && idx < resources.length - 1) {
      const r = resources[idx + 1];
      next = { title: r.title, url: `/student/subjects/subject/pdfs/viewer?subjectId=${subjectId}&moduleId=general&resourceId=${encodeURIComponent(r.id || r.link)}` };
    }
  } else if (moduleData) {
    const pdfSubtopics = moduleData.subtopics.filter((st: any) => !!st.referenceUrl);
    const currentIdx = pdfSubtopics.findIndex((st: any) => st.id === subtopicId);
    if (currentIdx > 0) {
      const st = pdfSubtopics[currentIdx - 1];
      prev = { title: st.title + " Reference", url: `/student/subjects/subject/pdfs/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${st.id}` };
    }
    if (currentIdx >= 0 && currentIdx < pdfSubtopics.length - 1) {
      const st = pdfSubtopics[currentIdx + 1];
      next = { title: st.title + " Reference", url: `/student/subjects/subject/pdfs/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${st.id}` };
    }
  }

  // Related Resources (only for subtopics, not general PDFs)
  const relatedResources: any[] = [];
  if (!isGeneral && activePdf) {
    const videoUrl = activePdf.videoUrl || (activePdf.type === 'videoUrl' ? activePdf.mediaUrl : "");
    if (videoUrl) {
      relatedResources.push({
        id: "video", title: "Video Lesson", type: "videos",
        url: `/student/subjects/subject/videos/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activePdf.id}`
      });
    }
    
    const notesUrl = activePdf.notesUrl || (activePdf.type === 'notes' ? activePdf.mediaUrl : "");
    if (notesUrl || activePdf.lessonContent) {
      relatedResources.push({
        id: "notes", title: "Study Notes", type: "notes",
        url: `/student/subjects/subject/notes/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activePdf.id}`
      });
    }
  }

  return (
    <ViewerLayout maxWidth="max-w-5xl">
      <ViewerBreadcrumbs subjectId={subjectId} subjectName={subjectName} resourceType="pdfs" />
      <ViewerHeader 
        title={isGeneral ? activePdf.title : `${activePdf.title} Reference`}
        moduleName={isGeneral ? "General Reference" : (moduleData?.title ? moduleData.title.replace(/^[●•]\s*/, "") : `Module ${moduleData?.moduleNo}`)}
        topicName={isGeneral ? undefined : "PDF Document"}
      />

      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm mb-12 h-[80vh] min-h-[600px] overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 rounded-xl bg-stone-100"
          title={activePdf.title || "PDF Document"}
        />
      </div>

      <ViewerPreviousNext prev={prev} next={next} />
      <ViewerRelatedResources resources={relatedResources} />
    </ViewerLayout>
  );
}
