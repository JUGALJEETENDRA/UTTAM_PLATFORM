"use client";

import React from "react";
import toast from "react-hot-toast";

interface ResourceLinkTrackerProps {
  children: React.ReactNode;
  subtopicId: string;
  moduleId: string;
  resourceType: string;
}

export function ResourceLinkTracker({ children }: ResourceLinkTrackerProps) {
  // Progress tracking via local API is disabled since moving to Google Apps Script backend.
  // XP rewards have also been removed from the platform.
  return (
    <div className="inline-block">
      {children}
    </div>
  );
}
