"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Play, Headphones, BookOpen, Layers, Target, Brain, Image as ImageIcon, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ICONS: Record<string, React.ComponentType<any>> = {
  videos: Play,
  audio: Headphones,
  notes: BookOpen,
  pdfs: FileText,
  flashcards: Layers,
  quizzes: Target,
  mindmaps: Brain,
  infographics: ImageIcon,
  simulations: Gamepad2,
};

export const RESOURCE_LABELS: Record<string, string> = {
  videos: "Video Library",
  audio: "Audio Library",
  notes: "Notes Library",
  pdfs: "PDF Library",
  flashcards: "Flashcard Library",
  quizzes: "Quiz Library",
  mindmaps: "Mind Map Library",
  infographics: "Infographic Library",
  simulations: "Simulation Library",
};

interface BreadcrumbProps {
  subjectId: string;
  subjectName?: string;
  resourceType: string;
}

export function ViewerBreadcrumbs({ subjectId, subjectName = "Subject", resourceType }: BreadcrumbProps) {
  const Icon = ICONS[resourceType] || FileText;
  const libraryLabel = RESOURCE_LABELS[resourceType] || "Resource Library";

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-6 font-sans">
      <Link href={`/student/subjects/subject?subjectId=${subjectId}`} className="hover:text-stone-900 transition-colors flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        <span>{subjectName}</span>
      </Link>
      <span className="text-stone-300">/</span>
      <Link href={`/student/subjects/subject/${resourceType === 'videos' ? 'videos' : resourceType === 'audio' ? 'audio' : resourceType === 'notes' ? 'notes' : resourceType === 'pdfs' ? 'pdfs' : resourceType}?subjectId=${subjectId}`} className="hover:text-stone-900 transition-colors flex items-center gap-1.5">
        <Icon className="w-4 h-4" />
        <span>{libraryLabel}</span>
      </Link>
      <span className="text-stone-300">/</span>
      <span className="text-stone-900 font-semibold">Viewer</span>
    </div>
  );
}

interface ViewerHeaderProps {
  title: string;
  moduleName?: string;
  topicName?: string;
  duration?: string;
}

export function ViewerHeader({ title, moduleName, topicName, duration }: ViewerHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-tight mb-4 font-sans">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-600 font-sans">
        {moduleName && (
          <span className="bg-stone-200/50 px-3 py-1 rounded-full text-stone-800 border border-stone-200">
            {moduleName}
          </span>
        )}
        {topicName && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            {topicName}
          </span>
        )}
        {duration && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}

interface PrevNextProps {
  prev?: { url: string; title: string } | null;
  next?: { url: string; title: string } | null;
}

export function ViewerPreviousNext({ prev, next }: PrevNextProps) {
  if (!prev && !next) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-stone-200">
      {prev ? (
        <Link href={prev.url} className="w-full sm:w-auto group">
          <Button variant="ghost" className="w-full sm:w-auto justify-start h-auto py-3 px-4 flex flex-col items-start gap-1 text-left bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-xl transition-all">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </span>
            <span className="text-sm font-bold text-stone-800 group-hover:text-stone-900 truncate max-w-[200px]">
              {prev.title}
            </span>
          </Button>
        </Link>
      ) : <div className="hidden sm:block flex-1" />}
      
      {next ? (
        <Link href={next.url} className="w-full sm:w-auto group sm:text-right">
          <Button variant="ghost" className="w-full sm:w-auto justify-end sm:items-end h-auto py-3 px-4 flex flex-col items-start gap-1 text-left sm:text-right bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-xl transition-all">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 w-full justify-start sm:justify-end">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-bold text-stone-800 group-hover:text-stone-900 truncate max-w-[200px]">
              {next.title}
            </span>
          </Button>
        </Link>
      ) : <div className="hidden sm:block flex-1" />}
    </div>
  );
}

export function ViewerLayout({ children, maxWidth = "max-w-4xl" }: { children: React.ReactNode, maxWidth?: string }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 pb-24 font-sans selection:bg-amber-100 selection:text-amber-900">
      <div className={`container mx-auto px-4 pt-8 md:pt-12 ${maxWidth}`}>
        {children}
      </div>
    </div>
  );
}

interface RelatedResourcesProps {
  resources: { id: string; title: string; type: string; url: string }[];
}

export function ViewerRelatedResources({ resources }: RelatedResourcesProps) {
  if (!resources || resources.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-stone-300 rounded-full" />
        Related Resources
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {resources.map(res => {
          const Icon = ICONS[res.type] || FileText;
          return (
            <Link key={res.id} href={res.url} className="group flex items-start gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-sm transition-all">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 group-hover:bg-stone-200 transition-colors">
                <Icon className="w-4 h-4 text-stone-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-800 group-hover:text-stone-950 line-clamp-2 leading-snug">
                  {res.title}
                </h4>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mt-1.5">
                  {RESOURCE_LABELS[res.type]?.replace(" Library", "") || "Resource"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
