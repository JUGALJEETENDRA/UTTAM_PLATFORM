"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, Target, Gamepad2, AlertTriangle, Frown } from "lucide-react";
import { useEffect, useState, use } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { useSession } from "@/components/AuthProvider";
import { redirect, useParams } from "next/navigation";

export default function FacultyAnalyticsPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "faculty")) {
      redirect("/sign-in");
    }

    if (status === "authenticated" && session?.user?.role === "faculty") {
      const loadAnalytics = async () => {
        try {
          const result = await fetchGAS("getSubjectAnalytics", { subjectId });
          setData(result);
        } catch (err) {
          console.error("Failed to load analytics", err);
        } finally {
          setLoading(false);
        }
      };
      loadAnalytics();
    }
  }, [subjectId, status, session]);

  if (status === "loading" || loading) return <div className="p-8 text-center">Loading analytics...</div>;
  if (!data || !data.subject) return <div className="p-8 text-center text-red-500">Subject analytics not found.</div>;

  const {
    subject,
    students,
    averageQuizScorePercent,
    totalQuizzesAttempted,
    totalSimulationsCompleted,
    weakTopics,
    inactiveStudents
  } = data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Badge className="mb-2 bg-primary/10 text-primary border-none">Subject Analytics</Badge>
          <h1 className="text-3xl font-bold text-zinc-900">{subject.name}</h1>
          <p className="text-zinc-500 mt-1">Monitor class performance, identify weak areas, and view leaderboards.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Avg Quiz Score</span>
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{averageQuizScorePercent}%</h3>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Quizzes Taken</span>
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{totalQuizzesAttempted}</h3>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Sims Completed</span>
              <Gamepad2 className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{totalSimulationsCompleted}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Weak Topics, Leaderboard, & Inactive Students */}
        <div className="md:col-span-1 space-y-6">
          {/* Weak Topics */}
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center">
                <AlertTriangle className="w-4 h-4 text-primary mr-2" /> Weak Topics (Avg &lt; 70%)
              </CardTitle>
              <CardDescription>Assessments where the class average is low.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {weakTopics && weakTopics.length > 0 ? (
                weakTopics.map((topic: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-red-50/50 border border-red-100 p-3 rounded-lg">
                    <div className="truncate pr-2">
                      <p className="font-semibold text-zinc-800 text-xs truncate">{topic.title}</p>
                      <p className="text-[10px] text-zinc-500">{topic.attempts} attempts recorded</p>
                    </div>
                    <Badge className="bg-primary hover:bg-primary/95 text-white font-bold text-[10px]">
                      {topic.avgPercent}% Avg
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-4">Class is performing well across all quizzes!</p>
              )}
            </CardContent>
          </Card>


          {/* Inactive Students */}
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center">
                <Frown className="w-4 h-4 text-zinc-500 mr-2" /> Inactive Students
              </CardTitle>
              <CardDescription>Students with 0 XP or progress.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {inactiveStudents && inactiveStudents.length > 0 ? (
                inactiveStudents.map((stud: any) => (
                  <div key={stud.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="truncate">
                      <p className="font-semibold text-zinc-800 text-xs truncate">{stud.name}</p>
                      <p className="text-[9px] text-zinc-400 truncate">{stud.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold">Inactive</Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-4">All registered students are active!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Complete Students Progress Table */}
        <div className="md:col-span-2">
          <Card className="border-zinc-200 shadow-md overflow-hidden">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-xl">Student Progress Directory</CardTitle>
              <CardDescription>All students currently registered in {subject.name}.</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-zinc-600">Student</TableHead>
                  <TableHead className="text-center font-semibold text-zinc-600">Quizzes</TableHead>
                  <TableHead className="text-center font-semibold text-zinc-600">Simulations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students && students.length > 0 ? (
                  students.map((student: any) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8 border border-zinc-200 bg-zinc-100">
                            <AvatarFallback className="text-zinc-600 text-xs font-bold">
                              {(student.name || "St").substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-zinc-900">{student.name || "Unknown Student"}</p>
                            <p className="text-xs text-zinc-400">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium text-zinc-700">
                        {student.quizAttempts?.length || 0}
                      </TableCell>
                      <TableCell className="text-center font-medium text-zinc-700">
                        {student.simulationProgress?.length || 0}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-zinc-500 italic">
                      No students have enrolled in this subject yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
