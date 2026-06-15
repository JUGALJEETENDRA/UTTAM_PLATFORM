"use client";

import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectSelectionPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const brutalistStyles = (
    <style jsx global>{`
      .brutalist-shadow-deep {
        box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
        transform: translate(0px, 0px);
      }
      .brutalist-transition {
        transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                    box-shadow 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                    background-color 0.2s ease;
      }
      .brutalist-card-hover:hover {
        transform: translate(8px, 8px);
        box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
      }
      @keyframes soft-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.02); opacity: 0.95; }
      }
      .animate-header-box {
        animation: soft-pulse 4s infinite ease-in-out;
      }
    `}</style>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f0] text-black px-4 py-16 flex flex-col justify-center items-center relative">
        {brutalistStyles}
        <div className="text-center mb-12 space-y-4 w-full flex flex-col items-center">
          <Skeleton className="h-14 w-72 bg-zinc-300 border-4 border-black rounded-none" />
          <Skeleton className="h-5 w-5/6 max-w-md bg-zinc-300 border border-black rounded-none mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-4 border-black rounded-none h-full overflow-hidden flex flex-col justify-between bg-white brutalist-shadow-deep">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black px-4 py-16 flex flex-col justify-center items-center relative">
      {brutalistStyles}
      
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase bg-[#eab308] border-4 border-black px-6 py-4 inline-block brutalist-shadow-deep animate-header-box font-sans">
          Choose your subject to learn
        </h1>
        <p className="text-zinc-700 text-lg max-w-md mx-auto font-bold pt-4">
          Pick an active study unit to pull open modules, retro practice arenas, and grading modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {subjects.map((subject) => {
          // Destructure custom parameters per card inside loop context
          const theme = getSubjectTheme(subject.name);

          return (
            <Link key={subject.id} href={`/student/subjects/subject?subjectId=${subject.id}`} className="block">
              <Card className="border-4 border-black rounded-none bg-white brutalist-shadow-deep brutalist-card-hover brutalist-transition h-full cursor-pointer overflow-hidden flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  
                  {/* Applied Dynamic Theme Icon BG */}
                  <div className={`w-12 h-12 rounded-none ${theme.iconBg} border-2 border-black text-black flex items-center justify-center font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-150`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-2">
                    {/* Applied Dynamic Hover Text Color */}
                    <CardTitle className={`text-xl font-black tracking-tight uppercase text-black ${theme.titleHover} transition-colors duration-150`}>
                      {subject.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-zinc-900 font-bold leading-relaxed">
                      {subject.description || "Jump into full interactive coursework, gamified test suites, and dynamic maps for this subject."}
                    </CardDescription>
                  </div>
                </div>
                
                {/* Applied Dynamic Bottom Border Highlights */}
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
          <div className="col-span-1 md:col-span-3 text-center py-12 text-black bg-white border-4 border-dashed border-black brutalist-shadow-deep font-bold">
            <BookOpen className="w-10 h-10 text-black mx-auto mb-3" />
            <p className="text-xl uppercase tracking-tight">Sheet Node Empty!</p>
            <p className="text-sm text-zinc-800 font-bold mt-1">Please confirm the target sheet is formatted with matching 'id' and 'name' properties.</p>
          </div>
        )}
      </div>
    </div>
  );
}