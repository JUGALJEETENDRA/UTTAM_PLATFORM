"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Target, Gamepad2, PlusCircle, Activity, HardDrive, GraduationCap, Trophy, Sparkles, Loader2 } from "lucide-react";
import { CreateSubjectForm } from "@/components/faculty/CreateSubjectForm";
import { DeleteSubjectButton } from "@/components/faculty/DeleteSubjectButton";
import { EditSubjectButton } from "@/components/faculty/EditSubjectButton";
import { useSession } from "@/components/AuthProvider";
import { redirect, useRouter } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export default function FacultyDashboardPage() {
  const { isAuthenticated, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !isAuthenticated) {
      redirect("/faculty/login");
    } else if (status === "authenticated") {

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
  }, [status, isAuthenticated]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-zinc-500 font-medium">Loading faculty dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  const { subjects, totalSubjects } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Faculty Dashboard</h1>
          <p className="text-sm md:text-base text-zinc-500 mt-1">Manage subjects, content, and monitor student progress.</p>
        </div>
      </div>
 

 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Subjects List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">Your Subjects</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {subjects && subjects.length > 0 ? (
              subjects.map((subject: any) => (
                <Card 
                  key={subject.id} 
                  onClick={() => router.push(`/faculty/subjects/subject/modules?subjectId=${subject.id}`)}
                  className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full border-zinc-200 relative min-h-[150px]"
                >
                  <DeleteSubjectButton subjectId={subject.id} />
                  <EditSubjectButton subject={subject} />
                  <CardHeader className="pb-2 pr-16">
                    <CardTitle className="text-xl text-primary">{subject.name}</CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px] text-sm">{subject.description || "No description provided."}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-zinc-500 mt-2">
                      <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {subject._count?.modules || 0} Modules</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-3 p-8 text-center border border-dashed border-zinc-300 rounded-lg bg-zinc-50">
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
              <p className="text-xs text-zinc-500 mt-2 text-center mb-4">Run this once to create required Google Sheets.</p>
              
              <Button 
                variant="default" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={async () => {
                  try {
                    const res = await fetchGAS("triggerDeploy");
                    if (res && res.success) {
                      alert("Deployment triggered successfully! The deployed site will be updated in a few minutes.");
                    } else {
                      alert(res?.error || "Failed to trigger deployment.");
                    }
                  } catch (e) {
                    alert("Error communicating with server.");
                  }
                }}
              >
                <Target className="w-4 h-4 mr-2" />
                Publish to Student Dashboard
              </Button>
              <p className="text-xs text-zinc-500 mt-2 text-center">Make all your recent changes live and visible to students.</p>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
