"use client";

import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ArrowRight, ChevronDown, Gamepad2, Network, Presentation, FileText, Video, Headphones, Search, HelpCircle, Layers } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRouter } from "next/navigation";

// Interface for type safety
interface Subject {
  id: string;
  name: string;
  description?: string;
}


// 1. Floating UI elements wrapper component
function FloatingEducationElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block z-0">
      {/* Molecule / Atom */}
      <motion.svg 
        animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute left-[6%] top-[15%] w-24 h-24 text-white/5 opacity-40 select-none pointer-events-none" 
        viewBox="0 0 100 100" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <circle cx="50" cy="50" r="10" />
        <ellipse cx="50" cy="50" rx="32" ry="10" transform="rotate(30 50 50)" />
        <ellipse cx="50" cy="50" rx="32" ry="10" transform="rotate(90 50 50)" />
        <ellipse cx="50" cy="50" rx="32" ry="10" transform="rotate(150 50 50)" />
      </motion.svg>

      {/* Chemistry flask / Beaker */}
      <motion.svg 
        animate={{ y: [4, -4, 4], rotate: [1.5, -1.5, 1.5] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
        className="absolute right-[8%] top-[18%] w-20 h-20 text-white/5 opacity-40 select-none pointer-events-none" 
        viewBox="0 0 100 100" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M40 20 h20 v15 l20 40 a10 10 0 0 1 -10 10 h-40 a10 10 0 0 1 -10 -10 l20 -40 z" />
        <line x1="30" y1="65" x2="70" y2="65" />
        <circle cx="45" cy="55" r="1.5" />
        <circle cx="55" cy="60" r="2" />
        <circle cx="50" cy="48" r="1" />
      </motion.svg>

      {/* Mathematics Ruler / Triangle */}
      <motion.svg 
        animate={{ y: [-3, 3, -3], rotate: [-1, 1, -1] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 0.8 }}
        className="absolute left-[5%] bottom-[35%] w-20 h-20 text-white/5 opacity-40 select-none pointer-events-none" 
        viewBox="0 0 100 100" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M20 20 L80 80 H20 Z" />
        <line x1="25" y1="25" x2="28" y2="28" />
        <line x1="30" y1="30" x2="35" y2="35" />
        <line x1="40" y1="40" x2="43" y2="43" />
        <line x1="50" y1="50" x2="55" y2="55" />
        <line x1="60" y1="60" x2="63" y2="63" />
        <line x1="70" y1="70" x2="75" y2="75" />
      </motion.svg>

      {/* DNA double helix */}
      <motion.svg 
        animate={{ y: [5, -5, 5], rotate: [2, -2, 2] }}
        transition={{ repeat: Infinity, duration: 8.5, ease: "easeInOut", delay: 0.3 }}
        className="absolute right-[6%] bottom-[35%] w-20 h-24 text-white/5 opacity-40 select-none pointer-events-none" 
        viewBox="0 0 100 120" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M25 10 C 35 25, 65 35, 75 50 C 65 65, 35 75, 25 90 C 35 105, 65 110, 75 120" />
        <path d="M75 10 C 65 25, 35 35, 25 50 C 35 65, 65 75, 75 90 C 65 105, 35 110, 25 120" />
        <line x1="42" y1="20" x2="58" y2="20" />
        <line x1="48" y1="38" x2="52" y2="38" />
        <line x1="52" y1="62" x2="48" y2="62" />
        <line x1="42" y1="80" x2="58" y2="80" />
        <line x1="34" y1="98" x2="66" y2="98" />
      </motion.svg>
    </div>
  );
}

// 2. Hero Section component
interface HeroSectionProps {
  onStartLearning: () => void;
  heroOpacity: MotionValue<number>;
}

function HeroSection({ onStartLearning, heroOpacity }: HeroSectionProps) {
  const scrollToFeatures = () => {
    const el = document.getElementById("features-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[calc(100vh-4rem)] flex flex-col justify-center items-center overflow-hidden px-6 py-6 md:py-8 z-10">
      {/* Soft Dark Green Chalkboard Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B3D2E] via-[#0F5132] to-[#145A32] pointer-events-none" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)] pointer-events-none" />
      {/* Chalk Dust SVG Noise */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay pointer-events-none">
        <filter id="chalk-dust">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#chalk-dust)" />
      </svg>

      {/* Floating Elements Background */}
      <FloatingEducationElements />

      {/* Content Container */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="container mx-auto max-w-6xl flex-1 flex flex-col lg:flex-row justify-center lg:justify-between items-center text-center relative z-10 gap-12 lg:gap-16 select-none py-2"
      >
        {/* Left Column: Badges, Headers, Descriptions, and CTA Buttons */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 max-w-xl">
          {/* Small Badge */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-[#2dd4bf] font-black bg-[#2dd4bf]/10 border border-[#2dd4bf]/25 px-4 py-1.5 rounded-full shadow-sm w-fit"
          >
            Gamified learning platform
          </motion.span>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-sans tracking-tight leading-none"
          >
            Learn Smarter.<br />
            <span className="text-[#2dd4bf]">Visualize Better.</span><br />
            Master Faster.
          </motion.h1>

          {/* Small Teal horizontal line */}
          <div className="w-12 h-1 bg-[#2dd4bf] rounded-full" />

          {/* Concise Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-zinc-200 text-sm md:text-base max-w-md font-medium leading-relaxed"
          >
            Classical chalkboard teaching meets modern learning. Explore interactive resources that make learning engaging, effective and enjoyable.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center pt-2 w-full sm:w-auto"
          >
            <button
              onClick={onStartLearning}
              className="w-full sm:w-auto px-7 py-3 bg-teal-500 hover:bg-teal-600 text-white font-black uppercase tracking-wider rounded-lg shadow-lg shadow-teal-500/20 hover:shadow-none hover:translate-y-0.5 active:translate-y-1 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <button 
            onClick={scrollToFeatures}
            className="flex items-center gap-2.5 text-white/40 font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:text-white/70 transition-colors pt-4 text-left"
          >
            <div className="w-4 h-6 border-2 border-white/30 rounded-full flex justify-center p-0.5 bg-black/10 backdrop-blur-sm">
              <motion.div
                animate={{ 
                  y: [0, 6, 0],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.8, 
                  ease: "easeInOut" 
                }}
                className="w-1.5 h-1.5 bg-[#2dd4bf] rounded-full shadow-[0_0_4px_#2dd4bf]"
              />
            </div>
            <span className="animate-pulse">Scroll to explore</span>
          </button>
        </div>

        {/* Right Column: Chalkboard Wooden Board Design */}
        <div className="relative w-full max-w-[90%] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[560px] flex justify-center items-center">
          {/* Soft Teal Glow Behind Board */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.18)_0%,transparent_65%)] filter blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full rounded-lg overflow-visible bg-[#092B21]/15 border-[12px] md:border-[16px] border-t-[#8B5A2B] border-r-[#5C3A21] border-b-[#3D2517] border-l-[#704214] shadow-[inset_0_5px_15px_rgba(0,0,0,0.95),0_20px_50px_rgba(0,0,0,0.7)]"
          >
            {/* Bevel Lining Shadow */}
            <div className="absolute inset-0 border border-black/50 pointer-events-none z-20" />

            {/* Blackboard Canvas Wrapper */}
            <div className="w-full overflow-hidden mix-blend-screen p-1 relative z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/uttam-new-banner.png" 
                alt="UTTAM Chalkboard" 
                className="w-full h-auto object-contain select-none"
              />
            </div>

            {/* Wooden Chalk Shelf / Ledge Tray */}
            <div className="absolute bottom-[-12px] md:bottom-[-16px] left-[-12px] md:left-[-16px] right-[-12px] md:right-[-16px] h-[12px] md:h-[16px] bg-gradient-to-r from-[#6e3f16] via-[#855325] to-[#593410] border-b-[3px] border-black/50 shadow-md z-30 select-none pointer-events-auto">
              
              {/* Chalk Dust Smudges */}
              {/* White Dust Ledge Smudge */}
              <div className="absolute bottom-[2px] right-[23%] w-10 h-1 bg-white/15 blur-[1.5px] rounded-full pointer-events-none z-35" />
              {/* Duster Dust Ledge Smudge */}
              <div className="absolute bottom-[2px] right-[9%] w-12 h-1 bg-zinc-200/10 blur-[1.5px] rounded-full pointer-events-none z-35" />

              {/* White Chalk stick */}
              <motion.div 
                whileHover={{ y: -1, rotate: 5 }}
                className="absolute bottom-[3px] md:bottom-[4px] right-[24%] w-6 md:w-8 h-1 md:h-1.5 bg-zinc-100 rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.4)] z-45 cursor-pointer border-r border-zinc-350"
                title="White Chalk"
              />

              {/* Blackboard Duster */}
              <motion.div 
                whileHover={{ y: -1, rotate: 1 }}
                className="absolute bottom-[3.5px] md:bottom-[4.5px] right-[8%] flex flex-col justify-end w-10 md:w-12 z-45 cursor-pointer shadow-[0_1.5px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
                title="Blackboard Duster"
              >
                {/* Wood Handle - Dark Charcoal Wood handle */}
                <div className="bg-[#2e2e2e] bg-gradient-to-b from-[#3a3a3a] to-[#202020] h-2 md:h-2.5 rounded-t border-t border-zinc-600" />
                {/* Felt Bottom Layer */}
                <div className="bg-zinc-800 h-1.5 rounded-b border-t border-zinc-700" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// 3. Features Section component
function FeaturesSection() {
  const features = [
    {
      title: "Simulations",
      description: "Interactive simulations to learn by doing.",
      icon: Gamepad2
    },
    {
      title: "Mind Maps",
      description: "Visualize concepts with structured mind maps.",
      icon: Network
    },
    {
      title: "Infographics",
      description: "Learn complex topics through simple and engaging visuals.",
      icon: Presentation
    },
    {
      title: "Notes",
      description: "Well-structured notes for quick revision and better understanding.",
      icon: FileText
    },
    {
      title: "Videos",
      description: "Concept videos to explain and simplify difficult topics.",
      icon: Video
    },
    {
      title: "Audios",
      description: "Listen and learn anytime, anywhere with audio lessons.",
      icon: Headphones
    },
    {
      title: "Case Studies",
      description: "Real-world case studies to understand applications better.",
      icon: Search
    },
    {
      title: "Reference Books",
      description: "Curated reference books and reading resources.",
      icon: BookOpen
    },
    {
      title: "Quizzes",
      description: "Interactive practice quizzes and question banks.",
      icon: HelpCircle
    },
    {
      title: "Flashcards",
      description: "Quick revision deck cards to memorize key terms.",
      icon: Layers
    }
  ];

  return (
    <section id="features-section" className="w-full py-24 md:py-32 px-6 select-none relative z-10 border-t border-white/5 bg-gradient-to-b from-[#145A32] to-[#0A3D2C]">
      <div className="container mx-auto max-w-6xl flex flex-col items-center space-y-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase text-white font-sans text-center">
          Everything you need in one place
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-teal-500/50 hover:bg-white/[0.06] p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[170px] transition-all duration-300 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#2dd4bf] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(45,212,191,0.1)] group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 my-3">
                <h3 className="text-white font-black uppercase text-xs tracking-wider">
                  {feature.title}
                </h3>
                <p className="text-[10px] text-zinc-400 font-medium leading-normal">
                  {feature.description}
                </p>
              </div>
              <div className="w-4 h-1 bg-zinc-700 group-hover:bg-teal-500 rounded-full transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Page component (Default Export Only)
export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div className="bg-gradient-to-b from-[#0B3D2E] via-[#0F5132] to-[#145A32] min-h-screen text-white flex flex-col">
      {/* Hero Section Container */}
      <div ref={heroRef}>
        <HeroSection
          onStartLearning={() => router.push("/student/subjects")}
          heroOpacity={heroOpacity}
        />
      </div>

      {/* Features List Section */}
      <FeaturesSection />
    </div>
  );
}