"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, ExternalLink, Image as ImageIcon, Layers, Book, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Infographic {
  id: string;
  subjectId: string;
  moduleId: string;
  title: string;
  imageUrl: string;
}

// Theme Configuration lookup table used by fallback default and custom layouts
const THEME_MAP: Record<string, {
  bg: string;
  cardBg: string;
  borderClass: string;
  shadowClass: string;
  btnPrimary: string;
  btnGhost: string;
  titleHover: string;
  textHeading: string;
  textMuted: string;
  badge: string;
  pattern: string;
}> = {
  "ui programming": {
    bg: "bg-slate-50 text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-sm transition-all duration-200",
    btnPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-500 hover:text-indigo-655 font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-indigo-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg",
    pattern: ""
  },
  "digital business": {
    bg: "bg-slate-50 text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-sm transition-all duration-200",
    btnPrimary: "bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-600 hover:text-slate-900 font-sans text-xs hover:bg-slate-100 border border-slate-200/85 rounded-xl px-4 py-2 transition-all inline-flex items-center bg-white shadow-xs",
    titleHover: "group-hover:text-blue-700",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg",
    pattern: ""
  }
};

const DEFAULT_THEME = {
  bg: "bg-[#f4f4f0]",
  cardBg: "bg-white",
  borderClass: "border-4 border-black rounded-none",
  shadowClass: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2",
  btnPrimary: "bg-[#2dd4bf] text-black hover:bg-[#2dd4bf]/90 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  btnGhost: "text-black font-black hover:bg-zinc-200 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs h-9 px-3 flex items-center bg-white",
  titleHover: "group-hover:text-primary",
  textHeading: "text-black font-black uppercase",
  textMuted: "text-zinc-700 font-medium",
  badge: "bg-zinc-200 text-black border-2 border-black rounded-none",
  pattern: ""
};

// Premium Figma-style component bounding box selection frame (Overlays removed per request)
const DesignStudioCard = ({ children, className = "", style = {}, isPremium, label, ...props }: any) => {
  return (
    <div
      className={`relative transition-all duration-300 ease-out rounded-lg ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default function StudentInfographicsList() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  const [infographics, setInfographics] = useState<Infographic[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{[id: string]: boolean}>({});

  useEffect(() => {
    if (subjectId) {
      loadData();
    }
  }, [subjectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mapsData, modsData, subjects] = await Promise.all([
        fetchGAS("getInfographics", { subjectId }),
        fetchGAS("getModules", { subjectId }),
        fetchGAS("getSubjects")
      ]);
      setInfographics(Array.isArray(mapsData) ? mapsData : []);
      setModules(Array.isArray(modsData) ? modsData : []);
      if (Array.isArray(subjects)) {
        const currentSub = subjects.find((s: any) => s.id === subjectId);
        if (currentSub) setSubjectName(currentSub.name || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subjectNameLower = (subjectName || "").toLowerCase();
  const isDigitalBusiness = subjectId === 'id_pryay1ykw' || subjectNameLower.includes("digital business");
  const isUiProgramming = subjectId === 'id_mn573l5e5' || String(subjectName || "").toLowerCase().includes("ui programming");
  const isPythonProgramming = subjectId === 'id_hdzqxse2n' || String(subjectName || "").toLowerCase().includes("python");
  const themeKey = isUiProgramming ? "ui programming" : isPythonProgramming ? "python programming" : isDigitalBusiness ? "digital business" : "";
  const t = THEME_MAP[themeKey] || DEFAULT_THEME;
  const isPremiumTheme = isUiProgramming || isPythonProgramming || isDigitalBusiness;

  const renderInfographicPlaceholder = () => (
    <svg className="w-full h-full text-slate-350 bg-slate-50 border-b border-slate-200" viewBox="0 0 200 120" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="0" y="0" width="200" height="120" fill="#F8FAFC" />
      <circle cx="100" cy="60" r="14" stroke="#7C3AED" strokeWidth="1.5" fill="#7C3AED" fillOpacity="0.05" />
      <text x="88" y="63" fill="#7C3AED" fontSize="8" fontWeight="bold" fontFamily="monospace">ROOT</text>
      
      <path d="M 100 46 L 100 24 M 100 74 L 100 96 M 86 60 L 50 60 M 114 60 L 150 60" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" />
      
      <circle cx="100" cy="20" r="8" stroke="#3B82F6" strokeWidth="1.2" fill="#3B82F6" fillOpacity="0.05" />
      <circle cx="100" cy="100" r="8" stroke="#10B981" strokeWidth="1.2" fill="#10B981" fillOpacity="0.05" />
      <circle cx="42" cy="60" r="8" stroke="#F59E0B" strokeWidth="1.2" fill="#F59E0B" fillOpacity="0.05" />
      <circle cx="158" cy="60" r="8" stroke="#EC4899" strokeWidth="1.2" fill="#EC4899" fillOpacity="0.05" />
      
      <text x="96" y="23" fill="#3B82F6" fontSize="6.5" fontWeight="bold" fontFamily="monospace">M1</text>
      <text x="96" y="103" fill="#10B981" fontSize="6.5" fontWeight="bold" fontFamily="monospace">M2</text>
      <text x="38" y="63" fill="#F59E0B" fontSize="6.5" fontWeight="bold" fontFamily="monospace">M3</text>
      <text x="154" y="63" fill="#EC4899" fontSize="6.5" fontWeight="bold" fontFamily="monospace">M4</text>
      
      <path d="M 10 10 L 190 10 M 10 110 L 190 110" stroke="#E2E8F0" strokeWidth="0.5" />
      <circle cx="10" cy="10" r="1.5" fill="#EF4444" opacity="0.4" />
      <circle cx="190" cy="10" r="1.5" fill="#EF4444" opacity="0.4" />
      <circle cx="10" cy="110" r="1.5" fill="#EF4444" opacity="0.4" />
      <circle cx="190" cy="110" r="1.5" fill="#EF4444" opacity="0.4" />
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-center items-center font-mono text-zinc-800 space-y-4">
        <div className="w-12 h-12 border-4 border-t-[#3b82f6] border-zinc-200 rounded-full animate-spin" />
        <p className="text-xs uppercase font-bold tracking-wider animate-pulse text-zinc-500">Retrieving infographics topology...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 14 } }
  };

  return (
    <div className={`min-h-screen relative ${t.bg} ${t.pattern} pb-16 pt-8 brutalist-transition transition-colors duration-300 overflow-hidden`}>
      {isDigitalBusiness && (
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(#e2e8f0 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px"
        }} />
      )}
      {/* Structural Embedded CSS Overrides */}
      <style jsx global>{`
        .brutalist-transition {
          transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ui-blueprint-grid {
          background-color: #F8F9FC;
          position: relative;
        }
      `}</style>

      {/* Layered Design-System inspired Background - Disabled for Clean EdTech Minimal */}

      <div className="container mx-auto px-4 max-w-5xl space-y-6 relative z-10">
        {/* Subtle Breadcrumb Navigation - Removed */}

        {/* Back button */}
        <div className="mb-4 flex justify-between items-center">
          <Link href={`/student/subjects/subject?subjectId=${subjectId}`}>
            <motion.div
              whileHover={isPremiumTheme ? { x: -3 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button className={`font-black uppercase tracking-wider ${isPremiumTheme
                ? "bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-slate-900 shadow-xs rounded-lg px-4 py-2 text-xs font-mono font-bold uppercase transition-all duration-150"
                : t.btnGhost
                }`}>
                ← Back to Dashboard
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Section Header Card */}
        <Card className={`${isPremiumTheme
          ? 'bg-white border border-slate-200 shadow-xs'
          : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass
          } brutalist-transition mb-8 relative overflow-hidden rounded-lg`}>
          <CardHeader className="pt-8 pb-6 relative z-10">
            <div>
              {isPremiumTheme ? (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/50">
                    Workspace
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">infographics.console</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-[10px] font-mono px-2.5 py-1 ${t.badge}`}>
                    Workspace
                  </Badge>
                </div>
              )}
              <CardTitle className={`text-2xl md:text-3xl ${isPremiumTheme ? 'text-slate-900 font-semibold tracking-tight' : t.textHeading} flex items-center gap-3`}>
                <Brain className={`w-7 h-7 ${isPremiumTheme ? "text-slate-500" : "text-purple-600"}`} /> Infographics
              </CardTitle>
              <CardDescription className={`${isPremiumTheme ? 'text-slate-550 font-medium font-sans' : t.textMuted} mt-2 text-sm leading-relaxed`}>
                Navigate structural relationships and components layout hierarchy visually.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Infographics Grid */}
        {infographics.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {infographics.map((map) => {
              const module = modules.find(m => m.id === map.moduleId);

              const cardContent = (
                <Card className={`overflow-hidden transition-all duration-300 flex flex-col h-full ${
                  isPremiumTheme
                    ? "bg-white border border-slate-200/80 shadow-xs hover:border-slate-350"
                    : "hover:shadow-lg hover:border-purple-300 group"
                }`}>
                  <div className="h-48 w-full bg-slate-50 border-b border-slate-200/80 overflow-hidden relative">
                    {map.imageUrl && !imageErrors[map.id] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={(() => {
                          let url = map.imageUrl || "";
                          if (url.includes('drive.google.com')) {
                            const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                            if (match && match[1]) {
                              return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800-h400`;
                            }
                          }
                          return url.startsWith('/') || url.startsWith('http') ? url : `/${url}`;
                        })()} 
                        alt={map.title} 
                        className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                        onError={() => setImageErrors(prev => ({ ...prev, [map.id]: true }))}
                      />
                    ) : (
                      isPremiumTheme ? renderInfographicPlaceholder() : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50">
                          <ImageIcon className="w-12 h-12 text-purple-200 mb-2" />
                          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Infographic</span>
                        </div>
                      )
                    )}
                    
                    {module && (
                      <div className={`absolute top-3 left-3 px-2.5 py-1 rounded shadow-xs ${isPremiumTheme ? "bg-white/95 border border-slate-200" : "bg-white/90 backdrop-blur-sm"}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isPremiumTheme ? "text-slate-700 font-mono" : "text-purple-700"}`}>Module {module.moduleNo}</span>
                      </div>
                    )}
                    
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 ${
                      isPremiumTheme 
                        ? "bg-[#0A0E1A]/40 backdrop-blur-xs" 
                        : "bg-gradient-to-t from-purple-900/60 to-transparent"
                    }`}>
                      <Button className={`w-full ${isPremiumTheme ? "bg-white text-slate-900 border border-slate-200 font-mono text-xs uppercase hover:bg-slate-50 shadow-sm" : "bg-white text-purple-700 hover:bg-zinc-100"}`}>
                        Open Viewer <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-grow">
                    <h3 className={`font-bold line-clamp-2 ${isPremiumTheme ? "text-sm text-slate-800 font-sans tracking-tight" : "text-lg text-zinc-800"}`}>{map.title}</h3>
                  </CardContent>
                </Card>
              );

              return (
                <motion.div key={map.id} variants={itemVariants}>
                  <Link href={`/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${map.id}`} className="group block h-full">
                    {isPremiumTheme ? (
                      <motion.div
                        whileHover="hover"
                        animate="rest"
                        className="h-full"
                      >
                        <motion.div
                          variants={{
                            rest: { y: 0, scale: 1 },
                            hover: { y: -8, scale: 1.012 }
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 22 }}
                          className="h-full"
                        >
                          <DesignStudioCard isPremium={true} label={`Map.Node ${map.id.slice(0, 5)}`} className="h-full">
                            {cardContent}
                          </DesignStudioCard>
                        </motion.div>
                      </motion.div>
                    ) : (
                      cardContent
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className={`text-center py-16 font-bold border border-dashed rounded-xl ${isPremiumTheme
            ? 'bg-white/50 border-slate-200 text-slate-400 shadow-none'
            : 'bg-zinc-50 border-zinc-300 text-zinc-700'
            }`}>
            <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold">No Infographics Available</h3>
            <p className="text-sm text-slate-500 font-normal mt-1">Your faculty hasn't uploaded any infographics yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
