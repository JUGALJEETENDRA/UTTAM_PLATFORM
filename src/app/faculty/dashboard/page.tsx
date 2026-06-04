"use client";

<<<<<<< Updated upstream
=======
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
>>>>>>> Stashed changes
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Target, Gamepad2, PlusCircle, Activity, HardDrive, GraduationCap, Trophy, Sparkles } from "lucide-react";
import { CreateSubjectForm } from "@/components/faculty/CreateSubjectForm";
import { DeleteSubjectButton } from "@/components/faculty/DeleteSubjectButton";
import { FacultyListCard } from "@/components/faculty/FacultyListModal";
import { useSession } from "@/components/AuthProvider";
import { redirect } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export default function FacultyDashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/sign-in");
    } else if (status === "authenticated") {
      if (session?.user?.role !== "faculty") {
        // If not faculty, redirect to student dashboard
        redirect("/student/dashboard");
      }

      const loadData = async () => {
        try {
          const data = await fetchGAS("getFacultyDashboard");
          setDashboardData(data);
        } catch (err) {
          console.error("Failed to load faculty dashboard data", err);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [status, session]);

  if (status === "loading" || loading) {
    return <div className="p-8 text-center">Loading faculty dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  const { subjects, totalStudents, facultyMembers, totalSubjects, totalFaculty } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Faculty Dashboard</h1>
          <p className="text-zinc-500 mt-1">Manage subjects, content, and monitor student progress.</p>
        </div>
      </div>
 
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-zinc-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Students</p>
              <h3 className="text-2xl font-bold">{totalStudents}</h3>
            </div>
<<<<<<< Updated upstream
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
=======
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/faculty/dashboard' }, { prompt: 'consent', access_type: 'offline', scope: 'openid email profile https://www.googleapis.com/auth/drive.file' })}
              className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
              title="Connect to Google Drive to upload and link materials"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              Connect Drive
            </button>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingId(null);
                setFormData({ code: "", title: "", description: "", instructor: (session.user as any)?.name || "", credits: 3, semester: 1, coverColor: "from-rose-500 to-red-600" });
              }}
              className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Subject
            </button>
            <div className="h-8 w-px bg-gray-300/50"></div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="btn-secondary px-4 py-2.5 rounded-xl text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 xl:grid-cols-12 gap-10">

        {/* Main Content Area */}
        <div className="xl:col-span-8 space-y-8">

          {/* Stats Hero Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-sm font-medium text-gray-500 mb-1">Subjects</p>
              <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
>>>>>>> Stashed changes
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Subjects</p>
              <h3 className="text-2xl font-bold">{totalSubjects}</h3>
            </div>
          </CardContent>
        </Card>
        <FacultyListCard totalFaculty={totalFaculty} facultyMembers={facultyMembers} />
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Subjects List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">Your Subjects</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects && subjects.length > 0 ? (
              subjects.map((subject: any) => (
                <Link key={subject.id} href={`/faculty/subjects/${subject.id}/modules`}>
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full border-zinc-200 relative">
                    <DeleteSubjectButton subjectId={subject.id} />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-primary">{subject.name}</CardTitle>
                      <CardDescription className="line-clamp-2 min-h-[40px]">{subject.description || "No description provided."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {subject._count?.modules || 0} Modules</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {subject._count?.enrollments || 0} Enrolled</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 p-8 text-center border border-dashed border-zinc-300 rounded-lg bg-zinc-50">
                <p className="text-zinc-500">No subjects created yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Forms */}
        <div className="space-y-6">
          {/* Create Subject */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Subject</CardTitle>
              <CardDescription>Start a new learning path.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateSubjectForm />
            </CardContent>
          </Card>

          {/* Admin Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Controls</CardTitle>
              <CardDescription>System maintenance and setup.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full text-zinc-700 border-zinc-300"
                onClick={async () => {
                  try {
                    const res = await fetchGAS("setupDatabase");
                    if (res && res.success) {
                      alert("Database initialized successfully!");
                    } else {
                      alert(res?.error || "Failed to initialize database.");
                    }
                  } catch (e) {
                    alert("Error communicating with server.");
                  }
                }}
              >
                <HardDrive className="w-4 h-4 mr-2" />
                Initialize Database
              </Button>
              <p className="text-xs text-zinc-500 mt-2 text-center">Run this once to create required Google Sheets.</p>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
