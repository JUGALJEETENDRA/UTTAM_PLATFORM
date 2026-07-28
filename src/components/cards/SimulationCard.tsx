import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Trophy } from "lucide-react";
import React, { useState } from "react";

export interface SimulationCardProps {
  simulation: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    xpReward: number;
    category?: string;
    module?: {
      moduleNo: number;
      title: string;
    } | null;
  };
  href: string;
  isUiProgramming?: boolean;
  themeKey?: string;
  t?: any;
}

// Figma-style component bounding box Selection Frame (Overlays removed per request)
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

export function SimulationCard({ simulation, href, isUiProgramming = false, themeKey, t }: SimulationCardProps) {
  const getDifficultyColor = (diff: string) => {
    if (isUiProgramming) {
      switch (diff) {
        case "Beginner": return "bg-green-100 text-green-800 font-sans font-semibold rounded-full px-2.5 py-0.5 text-[9px] hover:bg-green-100";
        case "Intermediate": return "bg-amber-100 text-amber-850 font-sans font-semibold rounded-full px-2.5 py-0.5 text-[9px] hover:bg-amber-100";
        case "Advanced": return "bg-red-100 text-red-800 font-sans font-semibold rounded-full px-2.5 py-0.5 text-[9px] hover:bg-red-100";
        default: return "bg-slate-100 text-slate-700 font-sans font-semibold rounded-full px-2.5 py-0.5 text-[9px]";
      }
    }
    switch (diff) {
      case "Beginner": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Intermediate": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Advanced": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-zinc-100 text-zinc-700";
    }
  };

  const categoryLabel = simulation.category || 
    (simulation.module ? `Module ${simulation.module.moduleNo}: ${simulation.module.title}` : "");

  const cardContent = (
    <Card className={`flex flex-col h-auto transition-all duration-300 overflow-hidden ${
      t 
        ? `${t.cardBg} ${t.borderClass} ${t.shadowClass}`
        : "hover:shadow-lg hover:border-primary/50 group bg-white"
    }`}>
      <CardHeader className={t ? "p-4 md:p-5 pb-1.5" : ""}>
        <div className="flex justify-between items-center mb-2">
          <Badge className={getDifficultyColor(simulation.difficulty)} variant={isUiProgramming ? "outline" : "secondary"}>
            {simulation.difficulty}
          </Badge>
          <Badge variant="outline" className={`flex items-center space-x-1 ${
            isUiProgramming 
              ? "text-indigo-750 border-indigo-200 bg-indigo-50 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full" 
              : "text-amber-600 border-amber-200 bg-amber-50"
          }`}>
            <Trophy className="w-3 h-3 mr-1" />
            {simulation.xpReward} XP
          </Badge>
        </div>
        <CardTitle className={`line-clamp-2 transition-colors ${
          isUiProgramming 
            ? "text-base font-bold font-sans tracking-tight text-slate-800" 
            : "text-xl group-hover:text-primary"
        }`}>{simulation.title}</CardTitle>
        <CardDescription className={`line-clamp-2 ${isUiProgramming ? "text-slate-500 font-medium text-xs font-sans mt-1.5" : ""}`}>{simulation.description}</CardDescription>
      </CardHeader>
      <CardContent className={`flex-grow ${t ? "p-4 md:p-5 pt-0 pb-3" : ""}`}>
        {categoryLabel && (
          <div className={`font-medium ${isUiProgramming ? "text-[10px] font-sans text-slate-400" : "text-sm text-zinc-500"}`}>
            {isUiProgramming ? "Context: " : "Related to: "}{categoryLabel}
          </div>
        )}
      </CardContent>
      <CardFooter className={`pt-3 mt-auto border-t ${t ? (themeKey === "ui programming" ? "p-4 md:p-5 border-black" : "p-4 md:p-5 border-slate-100") : "border-zinc-105"}`}>
        <Link href={href} className="w-full">
          <div className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-all duration-150 ${
            t 
              ? t.btnPrimary 
              : "bg-primary text-white hover:bg-primary/90"
          }`}>
            <Play className="w-4 h-4 fill-current" />
            <span>{isUiProgramming ? "Start Simulation" : "Start Simulation"}</span>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );

  if (isUiProgramming) {
    return (
      <DesignStudioCard isPremium={true} className="h-full">
        {cardContent}
      </DesignStudioCard>
    );
  }

  return cardContent;
}


