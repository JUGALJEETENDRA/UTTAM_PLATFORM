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
      <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary text-white rounded-lg flex items-center justify-center group-hover:bg-primary/90 transition-all shadow-md shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-base font-extrabold text-zinc-900 leading-none tracking-tight truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">UTTAM</span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-primary mt-0.5 hidden xs:inline truncate">Somaiya EdTech Portal</span>
          </div>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-1.5 sm:space-x-4 shrink-0">
          {isLoaded && !isAuthenticated && (
            <Link href="/faculty/login">
              <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-primary font-medium text-xs px-2 sm:px-3">
                Faculty Login
              </Button>
            </Link>
          )}
          
          {isLoaded && isAuthenticated && (
            <>
              <Link href="/faculty/dashboard">
                <Button variant="ghost" size="sm" className="text-zinc-700 hover:text-primary font-medium flex items-center space-x-1.5 text-xs px-2 sm:px-3">
                  <Shield className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Faculty Dashboard</span><span className="xs:hidden">Dashboard</span>
                </Button>
              </Link>
              <Button onClick={() => logout()} variant="outline" size="sm" className="border-zinc-200 text-zinc-700 hover:text-primary hover:bg-zinc-50 flex items-center space-x-1.5 text-xs px-2 sm:px-3">
                <LogOut className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Sign Out</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
