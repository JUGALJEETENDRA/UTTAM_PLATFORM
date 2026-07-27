"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  ViewerLayout, 
  ViewerBreadcrumbs, 
  ViewerHeader, 
  ViewerPreviousNext, 
  ViewerRelatedResources 
} from "@/components/student/viewers/ViewerComponents";
import { getExternalEmbedUrl, getGoogleDriveFileId } from "@/lib/mediaHelpers";
import { UttamLoader } from "@/components/ui/UttamLoader";
import { useViewerData } from "@/components/student/viewers/useViewerData";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Headphones } from "lucide-react";

export default function AudioViewerClientPage() {
  const { 
    subjectId, moduleId, subtopicId, loading, subjectName, moduleData, activeSubtopic 
  } = useViewerData();

  const [useDriveFallback, setUseDriveFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  if (loading) {
    return <UttamLoader isLoading={true} />;
  }

  if (!moduleData || !activeSubtopic) {
    return (
      <ViewerLayout>
        <div className="p-8 text-center border border-stone-200 bg-white rounded-xl">
          <p className="text-stone-500 font-medium">Audio not found.</p>
        </div>
      </ViewerLayout>
    );
  }

  let audioUrl = activeSubtopic.audioUrl || 
                 (activeSubtopic.type === 'audio' ? activeSubtopic.mediaUrl : "") || 
                 (activeSubtopic.audioLanguages?.[0]?.url || "");

  if (typeof activeSubtopic.otherUrl === 'string' && activeSubtopic.otherUrl.startsWith("{")) {
    try {
      const parsed = JSON.parse(activeSubtopic.otherUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""));
      if (parsed.audioUrl) audioUrl = parsed.audioUrl;
    } catch (e) {}
  }

  const driveFileId = getGoogleDriveFileId(audioUrl);
  const embedUrl = getExternalEmbedUrl(audioUrl);
  const googleDriveDirectUrl = driveFileId 
    ? `https://docs.google.com/uc?export=download&id=${driveFileId}` 
    : audioUrl;
  
  const activeAudioSrc = googleDriveDirectUrl;

  const audioSubtopics = moduleData.subtopics.filter((st: any) => {
    return st.audioUrl || (st.type === 'audio' && st.mediaUrl) || (st.audioLanguages?.length > 0) || 
           (typeof st.otherUrl === 'string' && st.otherUrl.includes('"audioUrl"'));
  });

  const currentIdx = audioSubtopics.findIndex((st: any) => st.id === subtopicId);
  const prevSub = currentIdx > 0 ? audioSubtopics[currentIdx - 1] : null;
  const nextSub = currentIdx >= 0 && currentIdx < audioSubtopics.length - 1 ? audioSubtopics[currentIdx + 1] : null;

  const prev = prevSub ? {
    title: prevSub.title,
    url: `/student/subjects/subject/audio/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${prevSub.id}`
  } : null;

  const next = nextSub ? {
    title: nextSub.title,
    url: `/student/subjects/subject/audio/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${nextSub.id}`
  } : null;

  const relatedResources: any[] = [];
  
  const notesUrl = activeSubtopic.notesUrl || (activeSubtopic.type === 'notes' ? activeSubtopic.mediaUrl : "");
  if (notesUrl || activeSubtopic.lessonContent) {
    relatedResources.push({
      id: "notes", title: "Lecture Notes", type: "notes",
      url: `/student/subjects/subject/notes/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activeSubtopic.id}`
    });
  }
  
  const videoUrl = activeSubtopic.videoUrl || (activeSubtopic.type === 'videoUrl' ? activeSubtopic.mediaUrl : "");
  if (videoUrl && videoUrl !== audioUrl) {
    relatedResources.push({
      id: "video", title: "Video Version", type: "videos",
      url: `/student/subjects/subject/videos/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activeSubtopic.id}`
    });
  }

  if (activeSubtopic.referenceUrl) {
    relatedResources.push({
      id: "pdf", title: "Reference Material", type: "pdfs",
      url: `/student/subjects/subject/pdfs/viewer?subjectId=${subjectId}&moduleId=${moduleId}&subtopicId=${activeSubtopic.id}`
    });
  }

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => { if (driveFileId) setUseDriveFallback(true); });
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ViewerLayout maxWidth="max-w-4xl">
      <ViewerBreadcrumbs subjectId={subjectId} subjectName={subjectName} resourceType="audio" />
      <ViewerHeader 
        title={activeSubtopic.title}
        moduleName={moduleData.title ? moduleData.title.replace(/^[●•]\s*/, "") : `Module ${moduleData.moduleNo}`}
        topicName="Audio Lesson"
      />

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm mb-12">
        {!useDriveFallback && activeAudioSrc ? (
          <div className="flex flex-col gap-6">
            <audio 
              key={activeAudioSrc}
              ref={audioRef}
              src={activeAudioSrc}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration || 0)}
              onEnded={() => setIsPlaying(false)}
              preload="metadata"
              className="hidden"
              onError={() => { if (driveFileId) setUseDriveFallback(true); }}
            />

            <div className="flex items-center gap-4 w-full bg-stone-50 p-6 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm transition-all shrink-0 focus:outline-none"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-[2px]" />}
              </button>

              <button
                type="button"
                onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); }}
                className="w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-600 flex items-center justify-center shadow-sm hover:bg-stone-50 transition-all shrink-0 focus:outline-none"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex-1 flex items-center gap-4">
                <span className="text-sm font-mono text-stone-500 font-medium w-12 text-right shrink-0">
                  {formatTime(currentTime)}
                </span>
                
                <input
                  type="range" min="0" max={duration || 100} value={currentTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCurrentTime(val);
                    if (audioRef.current) audioRef.current.currentTime = val;
                  }}
                  className="flex-1 h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${
                      duration ? (currentTime / duration) * 100 : 0
                    }%, #e7e5e4 ${
                      duration ? (currentTime / duration) * 100 : 0
                    }%, #e7e5e4 100%)`
                  }}
                />

                <span className="text-sm font-mono text-stone-500 font-medium w-12 shrink-0">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {driveFileId ? (
                <button
                  type="button"
                  onClick={() => setUseDriveFallback(true)}
                  className="text-xs text-stone-400 hover:text-stone-600 font-medium underline"
                >
                  Use Alternative Player
                </button>
              ) : <div />}
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!audioRef.current) return;
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }}
                  className="text-stone-500 hover:text-stone-800 transition-colors focus:outline-none"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (audioRef.current) {
                      audioRef.current.volume = val;
                      audioRef.current.muted = val === 0;
                      setIsMuted(val === 0);
                    }
                  }}
                  className="w-24 h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-500 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #78716c 0%, #78716c ${
                      (isMuted ? 0 : volume) * 100
                    }%, #e7e5e4 ${(isMuted ? 0 : volume) * 100}%, #e7e5e4 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video md:aspect-[21/9] bg-stone-100 rounded-xl border border-stone-200 overflow-hidden relative">
            <iframe
              src={embedUrl || audioUrl}
              className="w-full h-full border-0 absolute inset-0"
              allow="autoplay"
              title={activeSubtopic.title || "Drive Audio Player"}
            />
          </div>
        )}
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
