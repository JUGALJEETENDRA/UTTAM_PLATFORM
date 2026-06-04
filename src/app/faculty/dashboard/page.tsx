"use client";

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
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
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
                <Link key={subject.id} href={`/faculty/subjects/subject/modules?subjectId=${subject.id}`}>
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
