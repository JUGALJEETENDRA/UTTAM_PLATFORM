"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TopicFooterNavProps {
  subjectId: string;
  moduleId: string;
  topicId: string;
  prevTopicId: string | null;
  nextTopicId: string | null;
}

export default function TopicFooterNav({
  subjectId,
  moduleId,
  topicId,
  prevTopicId,
  nextTopicId,
}: TopicFooterNavProps) {
  const router = useRouter();

  const handleComplete = (e: React.MouseEvent, targetUrl: string) => {
    e.preventDefault();
    router.push(targetUrl);
    router.refresh();
  };

  return (
    <nav className="flex items-center justify-between gap-4">
      {prevTopicId ? (
        <Link
          href={`/subject/${subjectId}/module/${moduleId}/topic/${prevTopicId}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous Topic
        </Link>
      ) : (
        <Link
          href={`/subject/${subjectId}/module/${moduleId}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Module
        </Link>
      )}

      {nextTopicId ? (
        <a
          href={`/subject/${subjectId}/module/${moduleId}/topic/${nextTopicId}`}
          onClick={(e) => handleComplete(e, `/subject/${subjectId}/module/${moduleId}/topic/${nextTopicId}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 border border-red-700 shadow-sm rounded-xl text-sm font-semibold text-white hover:bg-red-700 transition-all"
        >
          Next Topic
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      ) : (
        <a
          href={`/subject/${subjectId}/module/${moduleId}`}
          onClick={(e) => handleComplete(e, `/subject/${subjectId}/module/${moduleId}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 border border-green-700 shadow-sm rounded-xl text-sm font-semibold text-white hover:bg-green-700 transition-all"
        >
          Finish Module
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </a>
      )}
    </nav>
  );
}
