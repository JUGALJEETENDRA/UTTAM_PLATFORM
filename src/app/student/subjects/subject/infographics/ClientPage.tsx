"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ResourceHeader from "@/components/ui/ResourceHeader";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, ExternalLink, Image as ImageIcon, Layers, Book, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { UttamLoader } from "@/components/ui/UttamLoader";

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
  iconColor: string;
}> = {
  "ui programming": {
    bg: "bg-[#FAF9F5] text-black font-sans",
    cardBg: "bg-white",
    borderClass: "border-2 border-black rounded-none",
    shadowClass: "shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(239,68,68,1)] hover:-translate-y-0.5",
    btnPrimary: "bg-[#EF4444] hover:bg-[#dc2626] text-white font-black uppercase text-[11px] tracking-wider px-3.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer rounded-none",
    btnGhost: "text-black hover:text-[#EF4444] font-bold text-xs bg-white hover:bg-slate-50 border-2 border-black rounded-none px-3 py-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] transition-all inline-flex items-center",
    titleHover: "group-hover:text-[#EF4444]",
    textHeading: "text-slate-900 font-black uppercase tracking-tight font-sans",
    textMuted: "text-zinc-655 font-bold",
    badge: "font-mono text-[9px] font-black uppercase tracking-wider text-white bg-zinc-900 px-2 py-0.5 border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]",
    pattern: "",
    iconColor: "text-[#EF4444]"
  },

  "startup engineering": {
    bg: "bg-[#F8FAFC] text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-xs hover:shadow-md hover:-translate-y-0.5",
    btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-555 hover:text-blue-650 font-sans text-xs hover:bg-slate-50 border border-slate-202 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-blue-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg",
    pattern: "",
    iconColor: "text-blue-600"
  },

  "python programming": {
    bg: "bg-[#F8FAFC] text-slate-755 font-mono font-jetbrains",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded",
    shadowClass: "shadow-xs hover:shadow-sm hover:-translate-y-0.5",
    btnPrimary: "bg-[#3776AB] hover:bg-[#2b5b84] text-white font-bold text-xs rounded shadow-xs py-2 px-4 transition-all font-mono",
    btnGhost: "text-slate-655 hover:text-[#3776AB] font-mono text-xs hover:bg-slate-50 border border-slate-200 rounded px-3 py-1.5 transition-all bg-white shadow-sm inline-flex items-center",
    titleHover: "group-hover:text-[#3776AB]",
    textHeading: "text-slate-900 font-bold tracking-tight font-mono",
    textMuted: "text-slate-500 font-mono",
    badge: "bg-blue-50 text-[#3776AB] border border-blue-200 rounded font-mono",
    pattern: "",
    iconColor: "text-[#3776AB]"
  },

  "digital business": {
    bg: "bg-[#F8FAFC] text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-xs hover:shadow-md hover:-translate-y-0.5",
    btnPrimary: "bg-[#0F766E] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-555 hover:text-[#0F766E] font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-[#0F766E]",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-[#0F766E]/5 text-[#0F766E] border border-[#0F766E]/10 px-2.5 py-1 rounded-lg",
    pattern: "strategy-board-dot",
    iconColor: "text-[#0F766E]"
  }
};

const DEFAULT_THEME = {
  bg: "bg-[#F8FAFC] text-slate-800 font-sans",
  cardBg: "bg-white",
  borderClass: "border border-slate-200 rounded-xl",
  shadowClass: "shadow-xs transition-all duration-200",
  btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
  btnGhost: "text-slate-555 hover:text-blue-650 font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
  titleHover: "group-hover:text-blue-600",
  textHeading: "text-slate-900 font-bold tracking-tight font-sans",
  textMuted: "text-slate-500 font-medium font-sans",
  badge: "font-sans text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg",
  pattern: "",
  iconColor: "text-blue-600"
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

const sortInfographics = (items: Infographic[], modulesList: any[]) => {
  return [...items].sort((a, b) => {
    const modA = modulesList.find(m => m.id === a.moduleId);
    const modB = modulesList.find(m => m.id === b.moduleId);
    
    const modNumA = modA ? parseInt(modA.moduleNo) || 0 : 9999;
    const modNumB = modB ? parseInt(modB.moduleNo) || 0 : 9999;
    
    if (modNumA !== modNumB) {
      return modNumA - modNumB;
    }
    
    const getSubtopicInfo = (item: Infographic, mod: any) => {
      if (!mod) return { isModule: true, index: -1, parts: [0] };
      
      const subtopics = mod.subtopics || [];
      const idx = subtopics.findIndex((s: any) => s.title === item.title);
      
      if (idx !== -1) {
        const sub = subtopics[idx];
        const subNo = sub.subtopicNo || "";
        const parts = subNo.split(".").map((p: string) => parseInt(p) || 0);
        return { isModule: item.title === mod.title, index: idx, parts };
      }
      
      const match = (item.title || "").match(/^(\d+)\.(\d+)/);
      if (match) {
        return { isModule: false, index: 999, parts: [parseInt(match[1]), parseInt(match[2])] };
      }
      
      return { isModule: true, index: -1, parts: [0] };
    };
    
    const infoA = getSubtopicInfo(a, modA);
    const infoB = getSubtopicInfo(b, modB);
    
    if (infoA.isModule && !infoB.isModule) return -1;
    if (!infoA.isModule && infoB.isModule) return 1;
    if (infoA.isModule && infoB.isModule) return 0;
    
    if (infoA.index !== -1 && infoB.index !== -1) {
      return infoA.index - infoB.index;
    }
    
    const maxLen = Math.max(infoA.parts.length, infoB.parts.length);
    for (let i = 0; i < maxLen; i++) {
      const partA = infoA.parts[i] || 0;
      const partB = infoB.parts[i] || 0;
      if (partA !== partB) {
        return partA - partB;
      }
    }
    
    return 0;
  });
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
      const sortedInfos = Array.isArray(mapsData) ? sortInfographics(mapsData, modsData) : [];
      setInfographics(sortedInfos);
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
  const isStartupEngineering = subjectNameLower.includes("startup") || subjectNameLower.includes("engineering");
  const themeKey = isUiProgramming 
    ? "ui programming" 
    : isPythonProgramming 
      ? "python programming" 
      : isDigitalBusiness 
        ? "digital business" 
        : isStartupEngineering 
          ? "startup engineering" 
          : "";
  const t = THEME_MAP[themeKey] || DEFAULT_THEME;
  const isPremiumTheme = !isPythonProgramming;

  const renderInfographicPlaceholder = () => {
    const primaryColorHex = isStartupEngineering ? "#2563EB" : "#7C3AED";
    return (
      <svg className="w-full h-full text-slate-350 bg-slate-50 border-b border-slate-200" viewBox="0 0 200 120" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="0" y="0" width="200" height="120" fill="#F8FAFC" />
        <circle cx="100" cy="60" r="14" stroke={primaryColorHex} strokeWidth="1.5" fill={primaryColorHex} fillOpacity="0.05" />
        <text x="88" y="63" fill={primaryColorHex} fontSize="8" fontWeight="bold" fontFamily="monospace">ROOT</text>
        
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
  };

  if (loading) {
    return <UttamLoader isLoading={true} />;
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
              <Button className={`${t.btnGhost} uppercase`}>
                ← Back to Dashboard
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Section Header Card */}
        <div className={`bg-white ${t.borderClass} p-6 md:p-8 ${t.shadowClass} mb-8`}>
          <ResourceHeader 
            type="infographics" 
            title="Visual Infographics" 
            subtitle="Visual explanations of key concepts." 
            colorClass={isStartupEngineering ? "bg-blue-600/8 border-blue-600/15 text-blue-600" : undefined}
            iconColor={isStartupEngineering ? "stroke-blue-600" : undefined}
          />
        </div>

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
                <Card className={`overflow-hidden transition-all duration-300 flex flex-col h-auto ${
                  isPremiumTheme
                    ? `${t.cardBg} ${t.borderClass} ${t.shadowClass}`
                    : "hover:shadow-lg hover:border-purple-300 group"
                }`}>
                  <div className="h-36 w-full bg-slate-50 border-b border-slate-200/80 overflow-hidden relative">
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
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isPremiumTheme ? (isStartupEngineering ? "text-blue-600 font-mono" : "text-slate-700 font-mono") : "text-purple-700"}`}>Module {module.moduleNo}</span>
                      </div>
                    )}
                    
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 ${
                      isPremiumTheme 
                        ? "bg-[#0A0E1A]/40 backdrop-blur-xs" 
                        : "bg-gradient-to-t from-purple-900/60 to-transparent"
                    }`}>
                      <Button className={`w-full ${isPremiumTheme ? t.btnPrimary : "bg-white text-purple-700 hover:bg-zinc-100"}`}>
                        Open Viewer <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 md:p-5">
                    <h3 className={`font-bold line-clamp-2 ${isPremiumTheme ? "text-sm text-slate-800 font-sans tracking-tight" : "text-lg text-zinc-800"}`}>{map.title}</h3>
                  </CardContent>
                </Card>
              );

              return (
                <motion.div key={map.id} variants={itemVariants} className="h-fit">
                  <Link href={`/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${map.id}`} className="group block h-full">
                    {isPremiumTheme ? (
                      <motion.div
                        whileHover="hover"
                        animate="rest"
                        className="h-auto"
                      >
                        <motion.div
                          variants={{
                            rest: { y: 0, scale: 1 },
                            hover: { y: -8, scale: 1.012 }
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 22 }}
                          className="h-auto"
                        >
                          <DesignStudioCard isPremium={true} label={`Map.Node ${map.id.slice(0, 5)}`} className="h-auto">
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
          <div className={`text-center py-16 font-bold border border-dashed rounded-lg ${isPremiumTheme
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
