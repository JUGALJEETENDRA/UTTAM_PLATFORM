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
import { QuizActive } from "@/components/student/QuizActive";

export default function QuizzesViewerClientPage() {
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

  const activeQuiz = useMemo(() => {
    if (!data || !data.quizzes) return null;
    return data.quizzes.find((q: any) => q.moduleId === moduleId && q.subtopicId === subtopicId) || null;
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

  if (!data || !activeQuiz || !activeQuiz.questions || activeQuiz.questions.length === 0) {
    return (
      <ViewerLayout>
        <div className="p-8 text-center border border-stone-200 bg-white rounded-xl">
          <p className="text-stone-500 font-medium">Quiz not found.</p>
        </div>
      </ViewerLayout>
    );
  }

  // Prev/Next inside quizzes of the same module
  const quizzesInModule = (data.quizzes || []).filter((q: any) => q.moduleId === moduleId);
  const currentIdx = quizzesInModule.findIndex((q: any) => q.subtopicId === subtopicId);
  
  let prev = null;
  let next = null;

  if (currentIdx > 0) {
    const q = quizzesInModule[currentIdx - 1];
    prev = { title: "Previous Quiz", url: `/student/subjects/subject/quizzes/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${q.subtopicId}` };
  }
  if (currentIdx >= 0 && currentIdx < quizzesInModule.length - 1) {
    const q = quizzesInModule[currentIdx + 1];
    next = { title: "Next Quiz", url: `/student/subjects/subject/quizzes/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${q.subtopicId}` };
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
      <ViewerBreadcrumbs subjectId={subjectId} subjectName={subjectName} resourceType="quizzes" />
      <ViewerHeader 
        title={activeSubtopic ? activeSubtopic.title + " Quiz" : "Practice Quiz"}
        moduleName={moduleData?.title ? moduleData.title.replace(/^[●•]\s*/, "") : `Module ${moduleData?.moduleNo || ''}`}
        topicName={`${activeQuiz.questions.length} Questions`}
      />

      <div className="mb-12">
        <QuizActive 
          quiz={activeQuiz} 
          subjectId={subjectId} 
          moduleId={moduleId} 
          subtopicId={subtopicId} 
        />
      </div>

      <ViewerPreviousNext prev={prev} next={next} />
      <ViewerRelatedResources resources={relatedResources} />
    </ViewerLayout>
  );
}
