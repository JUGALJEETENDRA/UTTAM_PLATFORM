import React from "react";
import { 
  Layers, 
  BrainCircuit, 
  BarChart2, 
  Network, 
  Route, 
  BookOpen, 
  MonitorPlay, 
  FlaskConical, 
  TrendingUp, 
  Award, 
  Bot, 
  Bookmark, 
  Download, 
  ClipboardCheck, 
  MessageSquare,
  LucideIcon
} from "lucide-react";

export type ResourceType =
  | "flashcards"
  | "quizzes"
  | "infographics"
  | "mindmaps"
  | "journey"
  | "resources"
  | "videos"
  | "labs"
  | "progress"
  | "achievements"
  | "ai-tutor"
  | "bookmarks"
  | "downloads"
  | "assignments"
  | "discussions";

interface ResourceHeaderProps {
  type: ResourceType;
  title: string;
  subtitle?: string;
  className?: string;
}

const TYPE_CONFIGS: Record<ResourceType, {
  Icon: LucideIcon;
  subtitle: string;
  colorClass: string; // Tailwind colors mapped at 6-8% opacity
  iconColor: string;
}> = {
  flashcards: {
    Icon: Layers,
    subtitle: "Practice with active recall and spaced repetition.",
    colorClass: "bg-blue-600/8 border-blue-600/15 text-blue-600",
    iconColor: "stroke-blue-600",
  },
  quizzes: {
    Icon: BrainCircuit,
    subtitle: "Test your understanding with adaptive quizzes.",
    colorClass: "bg-emerald-600/8 border-emerald-600/15 text-emerald-600",
    iconColor: "stroke-emerald-600",
  },
  infographics: {
    Icon: BarChart2,
    subtitle: "Visual explanations of key concepts.",
    colorClass: "bg-pink-600/8 border-pink-600/15 text-pink-600",
    iconColor: "stroke-pink-600",
  },
  mindmaps: {
    Icon: Network,
    subtitle: "Explore relationships between concepts.",
    colorClass: "bg-purple-600/8 border-purple-600/15 text-purple-600",
    iconColor: "stroke-purple-600",
  },
  journey: {
    Icon: Route,
    subtitle: "Follow your structured learning path.",
    colorClass: "bg-indigo-600/8 border-indigo-600/15 text-indigo-600",
    iconColor: "stroke-indigo-600",
  },
  resources: {
    Icon: BookOpen,
    subtitle: "Browse notes, PDFs and supporting resources.",
    colorClass: "bg-slate-600/8 border-slate-600/15 text-slate-600",
    iconColor: "stroke-slate-600",
  },
  videos: {
    Icon: MonitorPlay,
    subtitle: "Watch recorded lectures anytime.",
    colorClass: "bg-red-600/8 border-red-600/15 text-red-600",
    iconColor: "stroke-red-600",
  },
  labs: {
    Icon: FlaskConical,
    subtitle: "Learn through interactive experimentation.",
    colorClass: "bg-teal-600/8 border-teal-600/15 text-teal-600",
    iconColor: "stroke-teal-600",
  },
  progress: {
    Icon: TrendingUp,
    subtitle: "Track your learning progress.",
    colorClass: "bg-sky-600/8 border-sky-600/15 text-sky-600",
    iconColor: "stroke-sky-600",
  },
  achievements: {
    Icon: Award,
    subtitle: "Celebrate milestones and accomplishments.",
    colorClass: "bg-amber-600/8 border-amber-600/15 text-amber-600",
    iconColor: "stroke-amber-600",
  },
  "ai-tutor": {
    Icon: Bot,
    subtitle: "Ask questions and receive personalized guidance.",
    colorClass: "bg-cyan-600/8 border-cyan-600/15 text-cyan-600",
    iconColor: "stroke-cyan-600",
  },
  bookmarks: {
    Icon: Bookmark,
    subtitle: "Save resources for quick access.",
    colorClass: "bg-rose-600/8 border-rose-600/15 text-rose-600",
    iconColor: "stroke-rose-600",
  },
  downloads: {
    Icon: Download,
    subtitle: "Access your learning resources offline.",
    colorClass: "bg-blue-600/8 border-blue-600/15 text-blue-600",
    iconColor: "stroke-blue-600",
  },
  assignments: {
    Icon: ClipboardCheck,
    subtitle: "Complete and submit assigned work.",
    colorClass: "bg-green-600/8 border-green-600/15 text-green-600",
    iconColor: "stroke-green-600",
  },
  discussions: {
    Icon: MessageSquare,
    subtitle: "Collaborate with classmates and instructors.",
    colorClass: "bg-orange-600/8 border-orange-600/15 text-orange-600",
    iconColor: "stroke-orange-600",
  },
};

export default function ResourceHeader({ type, title, subtitle, className = "" }: ResourceHeaderProps) {
  const config = TYPE_CONFIGS[type];
  if (!config) return null;

  const { Icon, subtitle: defaultSubtitle, colorClass, iconColor } = config;
  const displaySubtitle = subtitle || defaultSubtitle;

  return (
    <div className={`flex items-start gap-4 select-none ${className}`}>
      {/* Icon Container: 44x44px, rounded-[14px], 7% opacity background */}
      <div className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-[14px] border ${colorClass}`}>
        <Icon className={`w-[22px] h-[22px] ${iconColor}`} strokeWidth={1.8} />
      </div>

      {/* Text Container: Title (18px) and Subtitle (14px, muted) */}
      <div className="space-y-1.5 min-w-0">
        <h1 className="text-[18px] font-semibold text-slate-900 tracking-tight leading-snug">
          {title}
        </h1>
        <p className="text-sm font-medium text-slate-500 leading-relaxed">
          {displaySubtitle}
        </p>
      </div>
    </div>
  );
}
