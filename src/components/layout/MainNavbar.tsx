"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gamepad2, LayoutDashboard, Target, Trophy, LogOut, GraduationCap, Shield, User } from "lucide-react";
import { useSession } from "@/components/AuthProvider";

export function MainNavbar() {
  const { isAuthenticated, status, logout } = useSession();
  const isLoaded = status !== "loading";

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center group-hover:bg-primary/90 transition-all shadow-md">
            <GraduationCap className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-zinc-900 leading-none tracking-tight">Gamified Learning Platform</span>
            <span className="text-xs font-semibold text-primary mt-1">Somaiya EdTech Portal</span>
          </div>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {isLoaded && !isAuthenticated && (
            <Link href="/faculty/login">
              <Button variant="ghost" className="text-zinc-500 hover:text-primary font-medium">
                Faculty Login
              </Button>
            </Link>
          )}
          
          {isLoaded && isAuthenticated && (
            <>
              <Link href="/faculty/dashboard">
                <Button variant="ghost" className="text-zinc-700 hover:text-primary font-medium flex items-center space-x-2">
                  <Shield className="w-4 h-4" /> <span>Faculty Dashboard</span>
                </Button>
              </Link>
              <Button onClick={() => logout()} variant="outline" className="border-zinc-200 text-zinc-700 hover:text-primary hover:bg-zinc-50 flex items-center space-x-2">
                <LogOut className="w-4 h-4" /> <span>Sign Out</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
