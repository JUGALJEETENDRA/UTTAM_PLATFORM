"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Terminal, Layout, Shield, Cpu, Compass } from "lucide-react";
import Link from "next/link";

interface TeamMember {
  name: string;
  role: string;
  avatarBg: string;
  icon: React.ReactNode;
  githubUrl?: string;
  linkedinUrl?: string;
  imageUrl?: string;
}

const team: TeamMember[] = [
  {
    name: "Prof. Jugal Manek",
    role: "Team Mentor",
    avatarBg: "from-blue-500 to-cyan-500",
    icon: <Terminal className="w-5 h-5 text-white" />,
    linkedinUrl: "https://www.linkedin.com/in/jugal-jeetendra-manek/",
    imageUrl: "/team/jugal-jeetendra-manek.jpg"
  },
  {
    name: "Jainam Davda",
    role: "Team Member",
    avatarBg: "from-indigo-500 to-purple-500",
    icon: <Layout className="w-5 h-5 text-white" />,
    githubUrl: "https://github.com/jainamdavda1-pixel",
    linkedinUrl: "https://www.linkedin.com/in/jainam-davda-a9589a328/",
    imageUrl: "/team/jainam-davda-a9589a328.jpg"
  },
  {
    name: "Chinmay Chavan",
    role: "Team Member",
    avatarBg: "from-emerald-500 to-teal-500",
    icon: <Cpu className="w-5 h-5 text-white" />,
    githubUrl: "https://github.com/Chinmay741",
    linkedinUrl: "https://www.linkedin.com/in/chinmay-chavan-55b6a6334/",
    imageUrl: "/team/chinmay-chavan-55b6a6334.jpg"
  },
  {
    name: "Sourish Ashtikar",
    role: "Team Member",
    avatarBg: "from-rose-500 to-orange-500",
    icon: <Shield className="w-5 h-5 text-white" />,
    githubUrl: "https://github.com/SourishAshtikar",
    linkedinUrl: "https://www.linkedin.com/in/sourishashtikar/",
    imageUrl: "/team/sourishashtikar.jpg"
  },
  {
    name: "Rohan Patil",
    role: "Team Member",
    avatarBg: "from-amber-500 to-yellow-500",
    icon: <Compass className="w-5 h-5 text-white" />,
    githubUrl: "https://github.com/rohanpatil2905",
    linkedinUrl: "https://www.linkedin.com/in/rohan-patil-84b919372/",
    imageUrl: "/team/rohan-patil-84b919372.jpg"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 }
  }
};

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback: React.ReactNode;
}

function ImageWithFallback({ src, alt, fallback }: ImageWithFallbackProps) {
  const [error, setError] = React.useState(false);

  if (!src || error) return <>{fallback}</>;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const imageSrc = src.startsWith('http') || src.startsWith('data:') ? src : `${basePath}${src}`;

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={() => setError(true)}
      className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0 border border-slate-200"
    />
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-8 relative overflow-hidden font-sans">
      {/* Decorative subtle background blueprint overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{
        backgroundImage: `linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container mx-auto px-4 max-w-5xl relative z-10 space-y-8">

        {/* Back Link */}
        <div className="mb-2">
          <Link href="/">
            <motion.span
              whileHover={{ x: -3 }}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </motion.span>
          </Link>
        </div>

        {/* Title Area */}
        <div className="text-center space-y-3 max-w-2xl mx-auto py-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-2"
          >
            <Users className="w-6 h-6 text-indigo-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Meet the Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm md:text-base text-slate-555 font-medium"
          >
            The team behind the Gamified HCI EdTech Platform.
          </motion.p>
        </div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" }}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xs transition-shadow duration-300 group"
            >
              {/* Card Decorative Edge */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-slate-100 to-slate-200/50 group-hover:from-indigo-400 group-hover:to-purple-400 transition-colors duration-300" />

              <div className="space-y-4">
                {/* Header with avatar / icon */}
                <div className="flex items-center space-x-3.5">
                  <ImageWithFallback
                    src={member.imageUrl || ""}
                    alt={member.name}
                    fallback={
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center shadow-sm shrink-0`}>
                        {member.icon}
                      </div>
                    }
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      {member.name}
                    </h3>
                    <span className={`inline-block mt-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded ${member.role === "Team Mentor"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Icons Link Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-4 text-slate-500 text-xs">
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900 transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-slate-100"
                    title="GitHub Profile"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    <span className="text-xs font-mono font-bold">GitHub</span>
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-slate-100"
                    title="LinkedIn Profile"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span className="text-xs font-mono font-bold">LinkedIn</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
