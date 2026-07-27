"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight, Shield, LogOut } from "lucide-react";
import { useSession } from "@/components/AuthProvider";
import { usePathname } from "next/navigation";

export function MainNavbar() {
  const { isAuthenticated, status, logout } = useSession();
  const isLoaded = status !== "loading";
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group select-none">
          <div className="w-10 h-10 bg-[#ef4444] text-white border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-black uppercase tracking-wider text-black font-sans leading-none">
            UTTAM
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-3 shrink-0">
          {isLoaded && !isAuthenticated && (
            <Link href="/faculty/login">
              <button
                className="border-2 border-black bg-[#ef4444] text-white font-extrabold px-3 py-2 sm:px-4 sm:py-2 text-[10px] sm:text-xs uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer rounded-none"
              >
                <span>Faculty Login</span>
                <span className="w-4 h-4 hidden sm:flex items-center justify-center border border-black bg-[#a81a1a] rounded-none">
                  <ArrowRight className="w-2.5 h-2.5 text-white" />
                </span>
              </button>
            </Link>
          )}
          
          {isLoaded && isAuthenticated && (
            <>
              <Link href="/faculty/dashboard">
                <button className="border-2 border-black bg-[#ef4444] text-white font-extrabold px-3 py-2 text-[10px] sm:text-xs uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer rounded-none">
                  <Shield className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Faculty Dashboard</span><span className="xs:hidden">Dashboard</span>
                </button>
              </Link>
              <button onClick={() => logout()} className="border-2 border-black bg-white text-black font-extrabold px-3 py-2 text-[10px] sm:text-xs uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer rounded-none">
                <LogOut className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
