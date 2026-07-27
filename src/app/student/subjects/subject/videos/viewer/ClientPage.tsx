"use client";

import React from "react";
import { 
  ViewerLayout, 
  ViewerBreadcrumbs, 
  ViewerHeader, 
  ViewerPreviousNext, 
  ViewerRelatedResources 
} from "@/components/student/viewers/ViewerComponents";
import { getEmbedUrl } from "@/lib/mediaHelpers";
import { UttamLoader } from "@/components/ui/UttamLoader";
import { useViewerData } from "@/components/student/viewers/useViewerData";

export default function VideoViewerClientPage() {
  const { 
    subjectId, moduleId, subtopicId, loading, subjectName, moduleData, activeSubtopic 
  } = useViewerData();

  if (loading) {
    return <UttamLoader isLoading={true} />;
  }

  if (!moduleData || !activeSubtopic) {
    return (
      <ViewerLayout>
        <div className="p-8 text-center border border-stone-200 bg-white rounded-xl">
          <p className="text-stone-500 font-medium">Video not found.</p>
        </div>
      </ViewerLayout>
    );
  }

  let videoUrl = activeSubtopic.videoUrl || 
                 (activeSubtopic.type === 'videoUrl' ? activeSubtopic.mediaUrl : "") || 
                 (activeSubtopic.videoLanguages?.[0]?.url || "");
                 
  if (typeof activeSubtopic.otherUrl === 'string' && activeSubtopic.otherUrl.startsWith("{")) {
    try {
      const parsed = JSON.parse(activeSubtopic.otherUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""));
      if (parsed.videoUrl) videoUrl = parsed.videoUrl;
    } catch (e) {}
  }

  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo = videoUrl?.toLowerCase().endsWith(".mp4") || videoUrl?.toLowerCase().endsWith(".webm");

  const videoSubtopics = moduleData.subtopics.filter((st: any) => {
    return st.videoUrl || (st.type === 'videoUrl' && st.mediaUrl) || (st.videoLanguages?.length > 0) || 
           (typeof st.otherUrl === 'string' && st.otherUrl.includes('"videoUrl"'));
  });

  const currentVideoIdx = videoSubtopics.findIndex((st: any) => st.id === subtopicId);
  const prevVideo = currentVideoIdx > 0 ? videoSubtopics[currentVideoIdx - 1] : null;
  const nextVideo = currentVideoIdx >= 0 && currentVideoIdx < videoSubtopics.length - 1 ? videoSubtopics[currentVideoIdx + 1] : null;

  const prev = prevVideo ? {
    title: prevVideo.title,
    url: `/student/subjects/subject/videos/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${prevVideo.id}`
  } : null;

  const next = nextVideo ? {
    title: nextVideo.title,
    url: `/student/subjects/subject/videos/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${nextVideo.id}`
  } : null;

  const relatedResources: any[] = [];
  
  const notesUrl = activeSubtopic.notesUrl || (activeSubtopic.type === 'notes' ? activeSubtopic.mediaUrl : "");
  if (notesUrl || activeSubtopic.lessonContent) {
    relatedResources.push({
      id: "notes", title: "Lecture Notes", type: "notes",
      url: `/student/subjects/subject/notes/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activeSubtopic.id}`
    });
  }
  
  const audioUrl = activeSubtopic.audioUrl || (activeSubtopic.type === 'audio' ? activeSubtopic.mediaUrl : "");
  if (audioUrl && audioUrl !== videoUrl) {
    relatedResources.push({
      id: "audio", title: "Audio Version", type: "audio",
      url: `/student/subjects/subject/audio/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activeSubtopic.id}`
    });
  }

  if (activeSubtopic.referenceUrl) {
    relatedResources.push({
      id: "pdf", title: "Reference Material", type: "pdfs",
      url: `/student/subjects/subject/pdfs/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activeSubtopic.id}`
    });
  }

  return (
    <ViewerLayout maxWidth="max-w-5xl">
      <ViewerBreadcrumbs subjectId={subjectId} subjectName={subjectName} resourceType="videos" />
      <ViewerHeader 
        title={activeSubtopic.title}
        moduleName={moduleData.title ? moduleData.title.replace(/^[●•]\s*/, "") : `Module ${moduleData.moduleNo}`}
        topicName="Video Lesson"
        duration={activeSubtopic.hours ? `${activeSubtopic.hours} Hrs` : undefined}
      />

      <div className="bg-white p-2 md:p-4 rounded-2xl border border-stone-200 shadow-sm mb-8">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative">
          {!videoUrl ? (
            <div className="w-full h-full flex items-center justify-center text-stone-400 font-medium">
              No video available
            </div>
          ) : isDirectVideo ? (
            <video controls playsInline preload="metadata" className="w-full h-full object-contain bg-black">
              <source src={videoUrl} />
            </video>
          ) : (
            <iframe
              src={embedUrl || videoUrl}
              className="w-full h-full border-0 bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              title={activeSubtopic.title}
            />
          )}
        </div>
      </div>

      {activeSubtopic.description && (
        <div className="prose prose-stone max-w-none mb-12 text-stone-600">
          <p>{activeSubtopic.description}</p>
        </div>
      )}

      <ViewerPreviousNext prev={prev} next={next} />
      <ViewerRelatedResources resources={relatedResources} />
    </ViewerLayout>
  );
}
