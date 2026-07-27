"use client";

import React, { useState } from "react";
import { 
  ViewerLayout, 
  ViewerBreadcrumbs, 
  ViewerHeader, 
  ViewerPreviousNext, 
  ViewerRelatedResources 
} from "@/components/student/viewers/ViewerComponents";
import { getParsedNotes, getExternalEmbedUrl } from "@/lib/mediaHelpers";
import { UttamLoader } from "@/components/ui/UttamLoader";
import { useViewerData } from "@/components/student/viewers/useViewerData";
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

export default function NotesViewerClientPage() {
  const { 
    subjectId, moduleId, subtopicId, loading, subjectName, moduleData, activeSubtopic 
  } = useViewerData();
  
  const [selectedNoteUrl, setSelectedNoteUrl] = useState<string>("");

  if (loading) {
    return <UttamLoader isLoading={true} />;
  }

  if (!moduleData || !activeSubtopic) {
    return (
      <ViewerLayout>
        <div className="p-8 text-center border border-stone-200 bg-white rounded-xl">
          <p className="text-stone-500 font-medium">Notes not found.</p>
        </div>
      </ViewerLayout>
    );
  }

  const finalNotesUrl = activeSubtopic.notesUrl || (activeSubtopic.type === 'notes' ? activeSubtopic.mediaUrl : "") || activeSubtopic.imageUrl || "";
  const notesList = getParsedNotes(finalNotesUrl);
  
  if (!selectedNoteUrl && notesList.length > 0) {
    setSelectedNoteUrl(notesList[0].url);
  }

  const notesSubtopics = moduleData.subtopics.filter((st: any) => {
    const hasUrl = st.notesUrl || (st.type === 'notes' && st.mediaUrl) || st.imageUrl;
    return hasUrl || st.lessonContent;
  });

  const currentIdx = notesSubtopics.findIndex((st: any) => st.id === subtopicId);
  const prevSub = currentIdx > 0 ? notesSubtopics[currentIdx - 1] : null;
  const nextSub = currentIdx >= 0 && currentIdx < notesSubtopics.length - 1 ? notesSubtopics[currentIdx + 1] : null;

  const prev = prevSub ? {
    title: prevSub.title,
    url: `/student/subjects/subject/notes/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${prevSub.id}`
  } : null;

  const next = nextSub ? {
    title: nextSub.title,
    url: `/student/subjects/subject/notes/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${nextSub.id}`
  } : null;

  const relatedResources: any[] = [];
  
  const videoUrl = activeSubtopic.videoUrl || (activeSubtopic.type === 'videoUrl' ? activeSubtopic.mediaUrl : "");
  if (videoUrl) {
    relatedResources.push({
      id: "video", title: "Video Lesson", type: "videos",
      url: `/student/subjects/subject/videos/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activeSubtopic.id}`
    });
  }
  
  const audioUrl = activeSubtopic.audioUrl || (activeSubtopic.type === 'audio' ? activeSubtopic.mediaUrl : "");
  if (audioUrl) {
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
    <ViewerLayout maxWidth="max-w-4xl">
      <ViewerBreadcrumbs subjectId={subjectId} subjectName={subjectName} resourceType="notes" />
      <ViewerHeader 
        title={activeSubtopic.title}
        moduleName={moduleData.title ? moduleData.title.replace(/^[●•]\s*/, "") : `Module ${moduleData.moduleNo}`}
        topicName="Study Notes"
      />

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm mb-12 overflow-hidden">
        {notesList.length > 1 && (
          <div className="flex flex-wrap gap-2 p-4 border-b border-stone-200 bg-stone-50">
            {notesList.map((note: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedNoteUrl(note.url)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                  selectedNoteUrl === note.url 
                    ? "bg-indigo-600 text-white" 
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                {note.title || `Part ${idx + 1}`}
              </button>
            ))}
          </div>
        )}
        
        {activeSubtopic.lessonContent ? (
          <div 
            className="prose prose-stone max-w-none p-6 md:p-10 font-sans"
            dangerouslySetInnerHTML={{ __html: marked(activeSubtopic.lessonContent) as string }}
          />
        ) : selectedNoteUrl ? (
          <div className="w-full min-h-[70vh]">
            <iframe
              src={getExternalEmbedUrl(selectedNoteUrl) || selectedNoteUrl}
              className="w-full h-full min-h-[70vh] border-0"
              title={activeSubtopic.title}
            />
          </div>
        ) : (
          <div className="p-12 text-center text-stone-500 font-medium">
            No notes available for this topic.
          </div>
        )}
      </div>

      <ViewerPreviousNext prev={prev} next={next} />
      <ViewerRelatedResources resources={relatedResources} />
    </ViewerLayout>
  );
}
