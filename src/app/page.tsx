"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Play, 
  HelpCircle, 
  Layers, 
  Gamepad2, 
  Headphones, 
  Folder, 
  TrendingUp, 
  ChevronRight, 
  Trophy,
  Book,
  Network,
  Rocket
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  // Simple animations for whiteboard elements
  const floatTransition = {
    animate: {
      y: [0, -6, 0],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const floatTransitionDelay = {
    animate: {
      y: [0, -5, 0],
    },
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.5
    }
  };

  return (
    <div className="bg-[#f4f4f0] min-h-screen text-black flex flex-col font-sans relative antialiased px-4 sm:px-6 md:px-8 selection:bg-red-500 selection:text-white brutalist-grid-bg">
      
      {/* Structural Embedded CSS for Dot Matrix Background */}
      <style dangerouslySetInnerHTML={{ __html: `
        .brutalist-grid-bg {
          background-color: #f4f4f0;
          background-image: radial-gradient(#d8d8d2 1.5px, transparent 1.5px);
          background-size: 24px 24px;
        }
      `}} />

      {/* 1. Header Navigation Bar */}
      <header className="container mx-auto max-w-6xl py-5 flex items-center justify-between z-50">
        <Link href="/" className="flex items-center space-x-3 group select-none">
          <div className="w-10 h-10 bg-[#ef4444] text-white border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-black uppercase tracking-wider text-black font-sans leading-none">
            UTTAM
          </span>
        </Link>
        
        <Link href="/faculty/login">
          <button
            className="border-2 border-black bg-[#ef4444] text-white font-extrabold px-4 py-2 text-xs uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer rounded-none"
          >
            <span>Faculty Login</span>
            <span className="w-4 h-4 flex items-center justify-center border border-black bg-[#a81a1a] rounded-none">
              <ArrowRight className="w-2.5 h-2.5 text-white" />
            </span>
          </button>
        </Link>
      </header>

      {/* 2. Hero Section */}
      <main className="container mx-auto max-w-6xl py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1">
        
        {/* Hero Copy (Left Column) */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-6 text-left">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black uppercase text-black leading-tight tracking-tight font-sans">
              Everything you<br />need to <span className="text-[#ef4444]">master<br />your subjects.</span>
            </h1>
            <p className="text-zinc-700 text-sm sm:text-base font-semibold max-w-md leading-relaxed font-sans">
              Learn with interactive notes, simulations, videos, quizzes, flashcards, mind maps and more — all in one organized platform.
            </p>
          </div>

          <button
            onClick={() => router.push("/student/subjects")}
            className="inline-flex items-center border-2 border-black bg-[#dc2626] text-white font-black uppercase tracking-wider hover:bg-[#dc2626]/95 transition-all cursor-pointer shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none rounded-none"
          >
            <span className="px-6 py-3.5 text-xs sm:text-sm font-black">Start Learning</span>
            <span className="border-l-2 border-black p-3.5 bg-[#a81a1a] flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </span>
          </button>
        </div>

        {/* Hero Interactive Whiteboard (Right Column) */}
        <div className="lg:col-span-7 w-full flex flex-col select-none justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/uttam-whiteboard.png" 
            alt="UTTAM Whiteboard" 
            className="w-full h-auto object-contain select-none max-w-full rounded-none"
          />
        </div>
      </main>

      {/* 3. Features Row ("EVERYTHING YOU NEED IN ONE PLACE") */}
      <section className="container mx-auto max-w-6xl py-12 border-t border-black/10 select-none">
        <div className="flex flex-col items-center space-y-8">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-black font-sans text-center">
            Everything you need in <span className="text-[#ef4444]">one place</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
            {[
              { title: "Structured Notes", desc: "Well-organized notes to understand concepts better.", color: "bg-[#a855f7]", icon: <Book className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { title: "Concept Videos", desc: "Watch, learn and build clarity with concept videos.", color: "bg-[#22c55e]", icon: <Play className="w-5 h-5 text-black fill-black stroke-[2.5px]" /> },
              { title: "Interactive Quizzes", desc: "Test your knowledge with topic-wise quizzes.", color: "bg-[#eab308]", icon: <span className="text-black font-black text-lg font-sans">?</span> },
              { title: "Mind Maps", desc: "Visualize and remember complex concepts with ease.", color: "bg-[#3b82f6]", icon: <Network className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { title: "Flashcards", desc: "Quick revision cards for better retention.", color: "bg-[#ec4899]", icon: <Layers className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { title: "Simulations", desc: "Learn by doing with interactive simulations.", color: "bg-[#f97316]", icon: <Gamepad2 className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { title: "Audio Lectures", desc: "Listen and learn anytime, anywhere.", color: "bg-[#06b6d4]", icon: <Headphones className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { title: "Resources", desc: "Helpful references and downloads in one place.", color: "bg-[#71717a]", icon: <Folder className="w-5 h-5 text-black stroke-[2.5px]" /> }
            ].map((feat, idx) => (
              <div 
                key={idx}
                onClick={() => router.push("/student/subjects")}
                className="bg-white border-2 border-black p-4 flex flex-col justify-between items-center text-center shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all min-h-[160px] group cursor-pointer rounded-none"
              >
                <div className={`w-10 h-10 border-2 border-black flex items-center justify-center font-bold shadow-[1px_1px_0px_rgba(0,0,0,1)] ${feat.color}`}>
                  {feat.icon}
                </div>
                <div className="space-y-2 mt-3 flex-1 flex flex-col">
                  <h3 className="text-black font-black uppercase text-[10px] tracking-wider font-mono leading-tight">
                    {feat.title}
                  </h3>
                  <p className="text-[9.5px] text-zinc-650 font-bold leading-normal font-sans">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Your Learning Journey Pathway */}
      <section className="container mx-auto max-w-6xl py-12 border-t border-black/10 select-none">
        <div className="flex flex-col items-center space-y-8">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-black font-sans text-center">
            Your <span className="text-[#ef4444]">Learning Journey</span> on UTTAM
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 w-full items-stretch">
            {[
              { step: "1. Choose Subject", desc: "Pick a subject you want to learn.", icon: <GraduationCap className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { step: "2. Read Notes", desc: "Understand concepts with structured notes.", icon: <Book className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { step: "3. Watch Videos", desc: "Watch concept videos to build clarity.", icon: <Play className="w-5 h-5 text-black fill-black stroke-[2.5px]" /> },
              { step: "4. Practice Quiz", desc: "Test your knowledge with quizzes.", icon: <HelpCircle className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { step: "5. Explore Simulation", desc: "Visualize concepts with interactive simulations.", icon: <Gamepad2 className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { step: "6. Revise Flashcards", desc: "Reinforce memory with flashcards.", icon: <Layers className="w-5 h-5 text-black stroke-[2.5px]" /> },
              { step: "7. Master the Topic", desc: "Strengthen and master every concept.", icon: <Trophy className="w-5 h-5 text-black stroke-[2.5px]" /> }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="bg-white border-2 border-black p-4 text-center shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-between min-h-[140px] rounded-none relative"
              >
                <div className="w-8 h-8 rounded-full border border-black bg-zinc-50 flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="space-y-1 mt-3">
                  <h4 className="font-mono text-[9.5px] font-black uppercase text-black">
                    {step.step}
                  </h4>
                  <p className="text-[9px] text-zinc-650 font-bold leading-normal font-sans">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA Box ("READY TO LEARN SMARTER?") */}
      <section className="container mx-auto max-w-6xl py-12 border-t border-black/10 select-none">
        <div className="border-4 border-black bg-white p-8 md:p-12 shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center w-full gap-8 relative overflow-hidden rounded-none">
          
          {/* Books Drawing (Left) */}
          <div className="hidden lg:block select-none max-w-[150px] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/uttam-cta-books.png" 
              alt="UTTAM Books" 
              className="w-full h-auto object-contain mix-blend-multiply"
            />
          </div>

          {/* Text & Button (Center) */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-md flex-1">
            <h3 className="text-2xl font-black uppercase text-black font-sans leading-none">
              Ready to Learn <span className="text-[#ef4444]">Smarter?</span>
            </h3>
            <p className="text-zinc-650 text-xs sm:text-sm font-semibold">
              Join thousands of students learning better every day.
            </p>
            <button
              onClick={() => router.push("/student/subjects")}
              className="inline-flex items-center border-2 border-black bg-[#dc2626] text-white font-black uppercase tracking-wider hover:bg-[#dc2626]/95 transition-all cursor-pointer shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-none"
            >
              <span className="px-6 py-3 text-xs font-black">Start Learning</span>
              <span className="border-l-2 border-black p-3 bg-[#a81a1a] flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </span>
            </button>
          </div>

          {/* Backpack Drawing (Right) */}
          <div className="hidden lg:block select-none max-w-[150px] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/uttam-cta-backpack.png" 
              alt="UTTAM Backpack" 
              className="w-full h-auto object-contain mix-blend-multiply"
            />
          </div>

        </div>
      </section>

      {/* 6. Custom Neubrutalist Footer */}
      <footer className="border-t-4 border-black bg-[#f4f4f0] py-10 mt-auto select-none">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo & Intro Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#ef4444] text-white border-2 border-black rounded flex items-center justify-center shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-black tracking-wider uppercase font-sans">UTTAM</span>
            </div>
            <p className="text-zinc-700 text-[11px] font-bold leading-relaxed font-sans max-w-xs">
              An interactive EdTech platform that brings together simulations, quizzes, flashcards, mind maps, and infographics helping students learn through interactive and visual content.
            </p>
          </div>

          {/* Team Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-black font-sans flex items-center">
              <span className="w-2.5 h-2.5 bg-[#ef4444] border border-black rounded-full mr-2"></span>
              Our Team
            </h4>
            <p className="text-zinc-700 text-[11px] font-bold leading-relaxed font-sans max-w-xs">
              Discover the engineering roles, layout frameworks, and collaborative contributions behind this project.
            </p>
            <button
              onClick={() => router.push("/team")}
              className="border border-black bg-white text-black font-black text-[10px] px-3.5 py-1.5 uppercase shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer rounded-none"
            >
              <span>View Team Description</span>
              <ArrowRight className="w-3 h-3 text-black" />
            </button>
          </div>

          {/* Build Details Column */}
          <div className="flex flex-col justify-end items-start md:items-end text-zinc-500 font-mono text-[9px] font-bold">
            <p>Last updated: 26 Jul 2026, 03:54 pm IST</p>
          </div>

        </div>
      </footer>

    </div>
  );
}