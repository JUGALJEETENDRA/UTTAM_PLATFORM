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
import { FlashcardViewer } from "@/components/student/FlashcardViewer";

export default function FlashcardsViewerClientPage() {
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

  const activeDeck = useMemo(() => {
    if (!data || !data.flashcardDecks) return null;
    return data.flashcardDecks.find((d: any) => d.moduleId === moduleId && d.subtopicId === subtopicId) || null;
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

  if (!data || !activeDeck || !activeDeck.cards || activeDeck.cards.length === 0) {
    return (
      <ViewerLayout>
        <div className="p-8 text-center border border-stone-200 bg-white rounded-xl">
          <p className="text-stone-500 font-medium">Flashcards not found.</p>
        </div>
      </ViewerLayout>
    );
  }

  // Prev/Next inside flashcards of the same module
  const flashcardDecksInModule = (data.flashcardDecks || []).filter((d: any) => d.moduleId === moduleId);
  const currentIdx = flashcardDecksInModule.findIndex((d: any) => d.subtopicId === subtopicId);
  
  let prev = null;
  let next = null;

  if (currentIdx > 0) {
    const d = flashcardDecksInModule[currentIdx - 1];
    prev = { title: "Previous Deck", url: `/student/subjects/subject/flashcards/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${d.subtopicId}` };
  }
  if (currentIdx >= 0 && currentIdx < flashcardDecksInModule.length - 1) {
    const d = flashcardDecksInModule[currentIdx + 1];
    next = { title: "Next Deck", url: `/student/subjects/subject/flashcards/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${d.subtopicId}` };
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
    <ViewerLayout maxWidth="max-w-4xl">
      <ViewerBreadcrumbs subjectId={subjectId} subjectName={subjectName} resourceType="flashcards" />
      <ViewerHeader 
        title={activeSubtopic ? activeSubtopic.title + " Flashcards" : "Study Flashcards"}
        moduleName={moduleData?.title ? moduleData.title.replace(/^[●•]\s*/, "") : `Module ${moduleData?.moduleNo || ''}`}
        topicName={`${activeDeck.cards.length} Cards`}
      />

      <div className="mb-12">
        <FlashcardViewer cards={activeDeck.cards} />
      </div>

      <ViewerPreviousNext prev={prev} next={next} />
      <ViewerRelatedResources resources={relatedResources} />
    </ViewerLayout>
  );
}
