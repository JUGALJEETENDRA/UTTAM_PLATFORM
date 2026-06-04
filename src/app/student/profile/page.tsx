"use client";

import { useSession } from "@/components/AuthProvider";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, BookOpen, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchGAS } from "@/lib/apiClient";

export default function StudentProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/sign-in");
    }

    if (status === "authenticated" && session?.user) {
      const loadProfile = async () => {
        try {
          const result = await fetchGAS("getStudentProfile", { userId: session.user.id });
          setProfileData(result);
        } catch (err) {
          console.error("Failed to load profile", err);
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }
  }, [status, session]);

  if (status === "loading" || loading) {
    return <div className="p-8 text-center">Loading your profile...</div>;
  }

  const user = session?.user;
  const { quizAttempts = [], simulationAttempts = [] } = profileData || {};

  const formattedJoinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "Recently";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header Card */}
      <Card className="border-zinc-200 shadow-md mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-[#7a0000]" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-4 sm:space-x-6 text-center sm:text-left">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg bg-zinc-100">
              <AvatarFallback className="bg-primary text-white text-4xl font-extrabold">
                {(user?.name || "Student").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="pt-4 sm:pt-0 pb-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-3xl font-extrabold text-zinc-900 leading-tight">{user?.name || "Student"}</h1>
                  <p className="text-zinc-500 text-sm font-medium">{user?.email}</p>
                </div>
                <Badge className="bg-primary text-white hover:bg-primary border-none self-center sm:self-auto capitalize px-3 py-1 text-sm font-bold">
                  {user?.role}
                </Badge>
              </div>
              <div className="flex items-center justify-center sm:justify-start text-xs text-zinc-400 mt-2 font-medium">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                <span>Joined {formattedJoinDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8">
        {/* Right Side: Activity/Attempts */}
        <div className="space-y-6">
          {/* Quiz Attempts */}
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" /> Quiz History ({quizAttempts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quizAttempts.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {quizAttempts.map((attempt: any) => (
                    <div key={attempt.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                      <div>
                        <h4 className="font-semibold text-zinc-800">{attempt.quiz?.title}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">Module {attempt.quiz?.module?.moduleNo} • {new Date(attempt.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${attempt.score / attempt.totalMarks >= 0.7 ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'} border-none font-bold`}>
                          Score: {attempt.score}/{attempt.totalMarks}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 py-6 text-center">No quizzes attempted yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Simulation Attempts */}
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" /> Simulation History ({simulationAttempts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {simulationAttempts.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {simulationAttempts.map((attempt: any) => (
                    <div key={attempt.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                      <div>
                        <h4 className="font-semibold text-zinc-800">{attempt.simulation?.title}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">Module {attempt.simulation?.module?.moduleNo} • {new Date(attempt.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 py-6 text-center">No simulations completed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
