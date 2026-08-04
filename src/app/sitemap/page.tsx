"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGAS } from "@/lib/apiClient";
import {
  GraduationCap,
  Home,
  BookOpen,
  Lock,
  FileCode,
  ArrowLeft,
  ArrowRight,
  Map
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  description?: string;
}

export default function SitemapPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchGAS("getSubjects");
        setSubjects(data || []);
      } catch (e) {
        console.error("Failed to load subjects for sitemap:", e);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, []);

  return (
    <div className="bg-[#f4f4f0] min-h-screen text-black font-sans py-12 px-4 sm:px-6 md:px-8 selection:bg-red-500 selection:text-white relative">
      <div className="container mx-auto max-w-4xl space-y-12">

        {/* Header Navigation */}
        <header className="flex items-center justify-between pb-6 border-b-2 border-black/10">
          <Link href="/" className="flex items-center space-x-3 group select-none">
            <div className="w-10 h-10 bg-[#ef4444] text-white border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-black uppercase tracking-wider text-black">
              UTTAM
            </span>
          </Link>

          <Link href="/" className="inline-flex items-center gap-2 border-2 border-black bg-white text-black font-black uppercase text-xs px-4 py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-none">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </header>

        {/* Page Title */}
        <div className="text-center space-y-4">
          <div className="inline-block bg-[#eab308] border-4 border-black p-4 shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-4">
            <Map className="w-10 h-10 text-black mx-auto" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none">
            Website Sitemap
          </h1>
          <p className="text-zinc-700 text-sm sm:text-base font-bold max-w-md mx-auto leading-relaxed">
            Index of all available landing zones, study modules, resources, and faculty administration portals.
          </p>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Column 1: Public & Student Hubs */}
          <div className="space-y-6">
            <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full translate-x-10 -translate-y-10 -z-10" />
              <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Main Pages
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="group flex items-center justify-between font-bold text-sm text-zinc-800 hover:text-red-500 transition-colors">
                    <span>🏠 Landing Homepage</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="group flex items-center justify-between font-bold text-sm text-zinc-800 hover:text-red-500 transition-colors">
                    <span>👥 Meet the Team</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full translate-x-10 -translate-y-10 -z-10" />
              <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Student Hub
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/student/subjects" className="group flex items-center justify-between font-bold text-sm text-zinc-800 hover:text-red-500 transition-colors">
                    <span>📚 Subjects list</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: Faculty & Technical */}
          <div className="space-y-6">
            <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full translate-x-10 -translate-y-10 -z-10" />
              <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                Faculty Portal
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/faculty/login" className="group flex items-center justify-between font-bold text-sm text-zinc-800 hover:text-red-500 transition-colors">
                    <span>🔑 Faculty Login</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/faculty/dashboard" className="group flex items-center justify-between font-bold text-sm text-zinc-800 hover:text-red-500 transition-colors">
                    <span>💼 Faculty Management Dashboard</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full translate-x-10 -translate-y-10 -z-10" />
              <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-orange-600" />
                Metadata & Search indexing
              </h2>
              <ul className="space-y-3">
                <li>
                  <a href={`${basePath}/sitemap.xml`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between font-bold text-sm text-zinc-800 hover:text-red-500 transition-colors">
                    <span>📄 XML Sitemap (Search Engine Bots)</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Dynamic Subjects Workspaces Section */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-full translate-x-10 -translate-y-10 -z-10" />
          <h2 className="text-xl font-black uppercase tracking-wider mb-6 border-b-2 border-black pb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-600" />
            Subject Links
          </h2>

          {loading ? (
            <p className="font-bold text-sm text-zinc-500 animate-pulse">Loading dynamic subjects workspaces...</p>
          ) : subjects.length === 0 ? (
            <p className="font-bold text-sm text-zinc-500">No active subjects found in the sheet database.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((subj) => (
                <div key={subj.id} className="border-2 border-black p-4 bg-zinc-50 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-zinc-100/50 transition-colors duration-150">
                  <h3 className="font-black uppercase text-sm border-b border-black pb-1 mb-3 text-black">
                    📚 {subj.name}
                  </h3>
                  <ul className="space-y-2 text-xs font-bold text-zinc-700">
                    <li>
                      <Link href={`/student/subjects/subject?subjectId=${subj.id}`} className="hover:text-red-500 flex items-center gap-1.5 transition-colors">
                        <ArrowRight className="w-3 h-3 text-red-500" /> Subject Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href={`/student/subjects/subject/modules?subjectId=${subj.id}`} className="hover:text-red-500 flex items-center gap-1.5 transition-colors">
                        <ArrowRight className="w-3 h-3 text-red-500" /> Modules & Chapters
                      </Link>
                    </li>
                    <li>
                      <Link href={`/student/subjects/subject/quizzes?subjectId=${subj.id}`} className="hover:text-red-500 flex items-center gap-1.5 transition-colors">
                        <ArrowRight className="w-3 h-3 text-red-500" /> Quizzes & Tests
                      </Link>
                    </li>
                    <li>
                      <Link href={`/student/subjects/subject/flashcards?subjectId=${subj.id}`} className="hover:text-red-500 flex items-center gap-1.5 transition-colors">
                        <ArrowRight className="w-3 h-3 text-red-500" /> Flashcards Review
                      </Link>
                    </li>
                    <li>
                      <Link href={`/student/subjects/subject/simulations?subjectId=${subj.id}`} className="hover:text-red-500 flex items-center gap-1.5 transition-colors">
                        <ArrowRight className="w-3 h-3 text-red-500" /> Interactive Simulations
                      </Link>
                    </li>
                    <li>
                      <Link href={`/student/subjects/subject/mindmaps?subjectId=${subj.id}`} className="hover:text-red-500 flex items-center gap-1.5 transition-colors">
                        <ArrowRight className="w-3 h-3 text-red-500" /> Conceptual Mind Maps
                      </Link>
                    </li>
                    <li>
                      <Link href={`/student/subjects/subject/infographics?subjectId=${subj.id}`} className="hover:text-red-500 flex items-center gap-1.5 transition-colors">
                        <ArrowRight className="w-3 h-3 text-red-500" /> Visual Infographics
                      </Link>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
