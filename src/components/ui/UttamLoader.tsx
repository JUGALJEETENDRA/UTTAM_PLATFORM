"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";

interface UttamLoaderProps {
  isLoading: boolean;
}

const MESSAGES = [
  "📚 Loading Notes...",
  "🎥 Preparing Videos...",
  "🧠 Organizing Mind Maps...",
  "🎮 Initializing Simulations...",
  "📝 Loading Quizzes...",
  "🎧 Preparing Audio Lessons...",
  "📄 Fetching Resources...",
  "✨ Almost Ready..."
];

export function UttamLoader({ isLoading }: UttamLoaderProps) {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [textFade, setTextFade] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  // Handle smooth fade out transition
  useEffect(() => {
    if (!isLoading) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsFadingOut(false);
      }, 300); // 300ms matches fade transition duration
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
      setIsFadingOut(false);
    }
  }, [isLoading]);

  // Handle status messages rotation every 900ms
  useEffect(() => {
    if (!shouldRender) return;

    const textInterval = setInterval(() => {
      setTextFade(false);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        setTextFade(true);
      }, 150); // half of the duration to handle fade-out/fade-in
    }, 900);

    return () => clearInterval(textInterval);
  }, [shouldRender]);

  // Handle dot animations every 300ms
  useEffect(() => {
    if (!shouldRender) return;

    const dotInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 300);

    return () => clearInterval(dotInterval);
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      role="alert"
      aria-busy="true"
      className={`fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center select-none transition-opacity ease-in-out duration-300 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center text-center max-w-sm px-4">
        {/* Animated UTTAM Logo Container */}
        <div className="w-16 h-16 bg-[#ef4444] text-white border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-uttam-logo mb-4 flex-shrink-0">
          <GraduationCap className="w-9 h-9" />
        </div>

        {/* UTTAM Title Header */}
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-black border-2 border-black px-5 py-1.5 bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-8 select-none">
          UTTAM
        </h2>

        {/* Status Text (Fade transition only) */}
        <div className="h-8 flex items-center justify-center">
          <p
            className={`transition-opacity duration-150 text-sm sm:text-base font-bold text-zinc-900 ${
              textFade ? "opacity-100" : "opacity-0"
            }`}
          >
            {MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Loading Indicator Dots */}
        <div className="flex justify-center items-center gap-2.5 mt-6">
          {[0, 1, 2].map((idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-black ${
                activeDot === idx
                  ? "bg-[#ef4444] scale-110 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  : "bg-zinc-200 shadow-none"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
