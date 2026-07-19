"use client";

import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ArrowRight, Palette, Grid, Award } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// Interface for type safety
interface Subject {
  id: string;
  name: string;
  description?: string;
}

// 1. Floating UI elements wrapper component
function FloatingEducationElements() {
  const floatingItems = [
    {
      id: 1,
      x: "8%",
      y: "18%",
      duration: 7,
      delay: 0,
      yRange: [-10, 10],
      content: (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-lg text-white font-mono text-[10px] w-40">
          <div className="flex justify-between items-center mb-1 text-teal-300">
            <span>⚡ QUIZ ARENA</span>
            <span>85%</span>
          </div>
          <p className="font-sans font-bold leading-tight">What is the default tracking of a Neobrutalist header?</p>
        </div>
      )
    },
    {
      id: 2,
      x: "78%",
      y: "12%",
      duration: 9,
      delay: 0.5,
      yRange: [-14, 14],
      content: (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-lg text-white w-44">
          <div className="flex items-center gap-2 text-purple-300 mb-1">
            <Grid className="w-3.5 h-3.5" />
            <span className="font-mono text-[9px] font-bold">MIND MAP</span>
          </div>
          <p className="font-sans font-bold text-[11px] leading-tight">Typography Hierarchy Node</p>
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-400 h-full w-[70%]" />
          </div>
        </div>
      )
    },
    {
      id: 3,
      x: "4%",
      y: "55%",
      duration: 8,
      delay: 0.8,
      yRange: [-12, 12],
      content: (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-lg text-white w-36">
          <div className="flex items-center gap-1 text-amber-300 mb-1.5 font-mono text-[9px] font-bold">
            <Palette className="w-3 h-3" />
            <span>FLASHCARD</span>
          </div>
          <p className="font-sans text-[10px] leading-tight mb-2">Primary vs Secondary Colors</p>
          <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Reveal Answer</span>
        </div>
      )
    },
    {
      id: 4,
      x: "82%",
      y: "58%",
      duration: 7,
      delay: 0.2,
      yRange: [-8, 8],
      content: (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-lg text-white font-mono text-[10px] w-36">
          <span className="text-emerald-300 block mb-1">📐 MATHEMATICS</span>
          <code className="text-xs bg-black/30 px-2 py-1 rounded block">f&apos;(x) = lim (h&rarr;0) ...</code>
        </div>
      )
    },
    {
      id: 5,
      x: "18%",
      y: "80%",
      duration: 10,
      delay: 1.2,
      yRange: [-16, 16],
      content: (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl shadow-lg text-white flex items-center gap-2 w-32">
          <Award className="w-5 h-5 text-yellow-300" />
          <div>
            <p className="font-sans font-bold text-[10px]">UTTAM Verified</p>
            <span className="text-[8px] opacity-70 font-mono">12 Modules Done</span>
          </div>
        </div>
      )
    },
    {
      id: 6,
      x: "72%",
      y: "82%",
      duration: 8.5,
      delay: 1,
      yRange: [-10, 10],
      content: (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-xl shadow-lg text-white flex items-start gap-2 w-44">
          <div className="w-6 h-6 rounded-full bg-teal-400/20 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
            AI
          </div>
          <div>
            <p className="font-sans text-[10px] leading-tight">&quot;Let&apos;s trace your layout paths dynamically!&quot;</p>
            <span className="text-[8px] text-teal-300 font-mono mt-1 block">AI Tutor</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block z-0">
      {floatingItems.map((item) => (
        <motion.div
          key={item.id}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            opacity: 0.15,
          }}
          animate={{
            y: item.yRange,
            rotate: [-1.5, 1.5, -1.5]
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: item.duration,
            delay: item.delay,
            ease: "easeInOut"
          }}
        >
          {item.content}
        </motion.div>
      ))}
    </div>
  );
}

// 2. Hero Section component
interface HeroSectionProps {
  onStartLearning: () => void;
  heroOpacity: MotionValue<number>;
}

function HeroSection({ onStartLearning, heroOpacity }: HeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden px-4 pt-12 pb-24 z-10">
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
        className="container mx-auto max-w-5xl flex flex-col items-center text-center relative z-10 space-y-8 select-none"
      >
        {/* Small Badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs uppercase font-mono tracking-widest text-[#2dd4bf] font-black bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 rounded-none shadow-sm"
        >
          Gamified EdTech Platform
        </motion.span>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-white font-sans tracking-tight leading-none"
        >
          Learn Smarter.<br />
          <span className="text-[#2dd4bf]">Visualize Better.</span><br />
          Master Faster.
        </motion.h1>

        {/* Chalkboard Centered Image */}
        <div className="relative w-full max-w-[320px] sm:max-w-[450px] md:max-w-[620px] py-2 flex justify-center items-center">
          {/* Soft Teal Glow Behind Board */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.22)_0%,transparent_65%)] filter blur-3xl pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{ 
              opacity: { duration: 1, delay: 0.4 },
              scale: { duration: 1, delay: 0.4 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
            className="relative z-10 w-full rounded-xl overflow-hidden border-4 border-black/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/uttam-chalkboard.jpg" 
              alt="UTTAM Chalkboard" 
              className="w-full h-auto object-contain select-none bg-[#09291E]"
            />
          </motion.div>
        </div>

        {/* Concise Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-zinc-200 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed"
        >
          Welcome to UTTAM, where classical chalkboard teaching meets modern gamified learning modules. Master your curriculum through dynamic simulations, assessments, and maps.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full sm:w-auto"
        >
          <button
            onClick={onStartLearning}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:translate-x-1 active:translate-y-1 transition-all text-sm rounded-none tracking-wider cursor-pointer"
          >
            Start Learning
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-20 font-mono text-[9px] uppercase tracking-widest pointer-events-none">
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-white/70 rounded-full"
            />
          </div>
          <span>Scroll to Learn</span>
        </div>

      </motion.div>
    </section>
  );
}

// 3. Transition Divider
function TransitionDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-10 select-none pointer-events-none -mt-1 bg-[#145A32]">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px] fill-[#f4f4f0]">
        <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"></path>
      </svg>
    </div>
  );
}



// 5. Subject Selection Section (existing functionality)
interface SubjectSelectionSectionProps {
  subjects: Subject[];
  loading: boolean;
}

function SubjectSelectionSection({ subjects, loading }: SubjectSelectionSectionProps) {
  // Helper mapping function to inject individual subject themes dynamically
  const getSubjectTheme = (name: string) => {
    const fallback = {
      iconBg: "bg-[#2dd4bf]", // Default Teal
      titleHover: "group-hover:text-[#f43f5e]", // Default Pink
      arrowShadow: "shadow-[#2dd4bf]"
    };

    if (!name) return fallback;
    const lowerName = name.toLowerCase();

    if (lowerName.includes("ui programming")) {
      return {
        iconBg: "bg-[#d946ef]", // Neon Magenta
        titleHover: "group-hover:text-[#d946ef]",
        arrowShadow: "shadow-[#3b82f6]" // Contrast Blue Arrow Shadow
      };
    }
    if (lowerName.includes("digital business")) {
      return {
        iconBg: "bg-[#10b981]", // Matrix Emerald
        titleHover: "group-hover:text-[#10b981]",
        arrowShadow: "shadow-[#000000]"
      };
    }
    if (lowerName.includes("python")) {
      return {
        iconBg: "bg-[#3776ab]", // Python Brand Blue
        titleHover: "group-hover:text-[#eab308]", // Python Brand Yellow
        arrowShadow: "shadow-[#eab308]"
      };
    }

    return fallback;
  };

  if (loading) {
    return (
      <section id="subject-selection" className="py-24 bg-[#f4f4f0] text-black px-4 flex flex-col justify-center items-center relative z-20">
        <div className="text-center mb-12 space-y-4 w-full flex flex-col items-center">
          <Skeleton className="h-14 w-72 bg-zinc-300 border-4 border-black rounded-none" />
          <Skeleton className="h-5 w-5/6 max-w-md bg-zinc-300 border border-black rounded-none mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-4 border-black rounded-none h-full overflow-hidden flex flex-col justify-between bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-6 space-y-4">
                <Skeleton className="w-12 h-12 rounded-none bg-zinc-300 border-2 border-black" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4 bg-zinc-300 rounded-none" />
                  <Skeleton className="h-4 w-full bg-zinc-300 rounded-none" />
                </div>
              </div>
              <div className="bg-zinc-100 px-6 py-4 border-t-4 border-black flex justify-between items-center">
                <Skeleton className="h-4 w-24 bg-zinc-300 rounded-none" />
                <Skeleton className="h-6 w-6 bg-zinc-300 rounded-none" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="subject-selection" className="py-24 bg-[#f4f4f0] text-black px-4 flex flex-col justify-center items-center relative z-20">
      <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4 px-2">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight uppercase bg-[#eab308] border-2 md:border-4 border-black px-4 py-3 md:px-6 md:py-4 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-header-box font-sans leading-tight">
          Choose your subject to learn
        </h2>
        <p className="text-zinc-700 text-sm sm:text-base md:text-lg max-w-md mx-auto font-bold pt-2 md:pt-4 px-4">
          Pick an active study unit to pull open modules, retro practice arenas, and grading modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {subjects.map((subject) => {
          const theme = getSubjectTheme(subject.name);

          return (
            <Link key={subject.id} href={`/student/subjects/subject?subjectId=${subject.id}`} className="block">
              <Card className="border-4 border-black rounded-none bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-150 h-full cursor-pointer overflow-hidden flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-none ${theme.iconBg} border-2 border-black text-black flex items-center justify-center font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-150`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className={`text-xl font-black tracking-tight uppercase text-black ${theme.titleHover} transition-colors duration-150`}>
                      {subject.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-zinc-900 font-bold leading-relaxed">
                      {subject.description || "Jump into full interactive coursework, gamified test suites, and dynamic maps for this subject."}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="bg-zinc-50 group-hover:bg-zinc-100/80 px-6 py-4 border-t-4 border-black flex justify-between items-center transition-colors duration-150">
                  <span className="text-sm font-black uppercase tracking-wider text-black">Start Learning</span>
                  <div className={`bg-black text-white p-1.5 border-2 border-black shadow-[2px_2px_0px_0px] ${theme.arrowShadow} group-hover:shadow-[0px_0px_0px_0px] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-150`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}

        {subjects.length === 0 && (
          <div className="col-span-1 md:col-span-3 text-center py-12 text-black bg-white border-4 border-dashed border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-bold">
            <BookOpen className="w-10 h-10 text-black mx-auto mb-3" />
            <p className="text-xl uppercase tracking-tight">Sheet Node Empty!</p>
            <p className="text-sm text-zinc-800 font-bold mt-1">Please confirm the target sheet is formatted with matching &apos;id&apos; and &apos;name&apos; properties.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// Main Page component (Default Export Only)
export default function SubjectSelectionPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchGAS("getSubjects");
        setSubjects(data || []);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSubjects();
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const brutalistStyles = (
    <style jsx global>{`
      @keyframes soft-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.02); opacity: 0.95; }
      }
      .animate-header-box {
        animation: soft-pulse 4s infinite ease-in-out;
      }
    `}</style>
  );

  return (
    <div className="bg-[#f4f4f0] min-h-screen">
      {brutalistStyles}

      {/* Hero Section Container */}
      <div ref={heroRef}>
        <HeroSection 
          onStartLearning={() => scrollToSection("subject-selection")}
          heroOpacity={heroOpacity}
        />
      </div>

      {/* Curved Scroll Transition Divider */}
      <TransitionDivider />

      {/* Subject Selection Area */}
      <SubjectSelectionSection subjects={subjects} loading={loading} />
    </div>
  );
}