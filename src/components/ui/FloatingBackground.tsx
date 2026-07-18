import React from "react";

export default function FloatingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      {/* ==========================================
          LAYER 1: LARGE ELEMENTS IN CORNERS (Slowest drift - 60s)
          ========================================== */}
      <div className="absolute inset-0 opacity-[0.25] animate-float-around-3 blur-[0.5px]">
        {/* Top-Left: Line Chart / Dashboard Widget */}
        <div className="absolute top-[8%] left-[4%] w-48 h-32 border-2 border-[#005082] rounded-lg p-3 bg-[#005082]/5 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-center">
            <span className="w-12 h-2.5 bg-[#005082]/40 rounded" />
            <span className="w-4 h-4 rounded-full border-2 border-[#005082] bg-white" />
          </div>
          <svg className="w-full h-16 stroke-[#005082] fill-none" viewBox="0 0 100 40">
            <path d="M0,35 Q20,15 40,25 T80,5 T100,20" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M0,35 Q20,15 40,25 T80,5 T100,20 L100,40 L0,40 Z" fill="url(#grad-blue-heavy)" opacity="0.15" />
            <defs>
              <linearGradient id="grad-blue-heavy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#005082" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Top-Right: Certificate Outline Document */}
        <div className="absolute top-[6%] right-[5%] w-44 h-56 border-2 border-dashed border-[#791D55] rounded-lg p-4 bg-[#791D55]/5 flex flex-col justify-between items-center text-center shadow-xs">
          <div className="w-8 h-8 rounded-full border-2 border-[#791D55] bg-white flex items-center justify-center text-[#791D55] text-xs font-serif font-bold">★</div>
          <div className="space-y-1.5 w-full">
            <div className="h-2 bg-[#791D55]/30 rounded w-3/4 mx-auto" />
            <div className="h-1 bg-[#791D55]/30 rounded w-1/2 mx-auto" />
            <div className="h-1 bg-[#791D55]/30 rounded w-5/8 mx-auto" />
          </div>
          <div className="w-10 h-10 border-2 border-[#791D55] rounded-full bg-white flex items-center justify-center">
            <div className="w-6 h-6 border border-[#791D55] rounded-full" />
          </div>
        </div>

        {/* Bottom-Left: Learning Path Nodes Linker */}
        <div className="absolute bottom-[8%] left-[5%] w-52 h-44 border-2 border-[#005082] rounded-lg p-4 bg-[#005082]/5 flex flex-col justify-between shadow-xs">
          <div className="h-3 bg-[#005082]/30 rounded w-1/3" />
          <svg className="w-full h-28 stroke-[#005082] fill-none" viewBox="0 0 120 70">
            <circle cx="15" cy="50" r="7" strokeWidth="2.5" className="fill-white" />
            <path d="M22,50 Q45,20 60,35" strokeWidth="2.5" strokeDasharray="3 3" />
            <circle cx="60" cy="35" r="7" strokeWidth="2.5" className="fill-white" />
            <path d="M67,35 Q90,50 105,20" strokeWidth="2.5" strokeDasharray="3 3" />
            <circle cx="105" cy="20" r="7" strokeWidth="2.5" className="fill-white" />
          </svg>
        </div>

        {/* Bottom-Right: Code brackets window */}
        <div className="absolute bottom-[10%] right-[4%] w-48 h-36 border-2 border-[#791D55] rounded-lg p-3 bg-[#791D55]/5 flex flex-col justify-between font-mono text-[9px] text-[#791D55] font-bold shadow-xs">
          <div className="flex gap-1.5 border-b border-[#791D55]/20 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#791D55]" />
            <span className="w-2 h-2 rounded-full bg-[#791D55]/60" />
            <span className="w-2 h-2 rounded-full bg-[#791D55]/30" />
          </div>
          <div className="space-y-1 mt-1 flex-1 leading-normal">
            <div>{"{"}</div>
            <div className="pl-3 text-[#791D55]/80">"status": "ready",</div>
            <div className="pl-3 text-[#791D55]/80">"elements": [</div>
            <div className="pl-6 text-[#791D55]/80">"module", "timeline"</div>
            <div className="pl-3">]</div>
            <div>{"}"}</div>
          </div>
        </div>

        {/* NEW: Layout Columns Grid Guide Outline */}
        <div className="absolute top-[4%] left-[28%] w-96 h-36 opacity-[0.22] flex gap-4 pointer-events-none">
          <div className="flex-1 bg-[#005082]/10 border-x border-[#005082]" />
          <div className="flex-1 bg-[#005082]/10 border-x border-[#005082]" />
          <div className="flex-1 bg-[#005082]/10 border-x border-[#005082]" />
          <div className="flex-1 bg-[#005082]/10 border-x border-[#005082]" />
          <div className="flex-1 bg-[#005082]/10 border-x border-[#005082]" />
          <div className="flex-1 bg-[#005082]/10 border-x border-[#005082]" />
        </div>
      </div>

      {/* ==========================================
          LAYER 2: MEDIUM ELEMENTS ON EDGES (Medium drift - 45s)
          ========================================== */}
      <div className="absolute inset-0 opacity-[0.28] animate-float-around-2">
        {/* Left Edge: Graduation Cap Outline */}
        <div className="absolute top-[28%] left-[2%] w-14 h-14 text-[#791D55] drop-shadow-xs">
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12v7.5m-9-6v9" />
          </svg>
        </div>

        {/* Right Edge: Quiz Card Outline */}
        <div className="absolute top-[32%] right-[3%] w-40 h-28 border-2 border-[#005082] rounded-lg p-3 bg-[#005082]/5 flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <div className="h-2.5 bg-[#005082]/30 rounded w-1/2" />
            <div className="h-1.5 bg-[#005082]/20 rounded w-3/4" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#005082] bg-white" />
              <div className="h-1 bg-[#005082]/30 rounded w-2/3" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#005082] bg-[#005082] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <div className="h-1 bg-[#005082] rounded w-1/2" />
            </div>
          </div>
        </div>

        {/* Left Edge: Book Outline */}
        <div className="absolute top-[52%] left-[3%] w-12 h-12 text-[#005082] drop-shadow-xs">
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>

        {/* Right Edge: Achievement Star Badge */}
        <div className="absolute top-[58%] right-[2%] w-14 h-14 text-[#791D55] drop-shadow-xs">
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>

        {/* Left Edge: Search Bar Outline */}
        <div className="absolute bottom-[30%] left-[2%] w-36 h-9 border-2 border-[#005082] rounded-lg p-2 bg-[#005082]/5 flex items-center gap-2 shadow-2xs">
          <div className="w-3 h-3 rounded-full border-2 border-[#005082]" />
          <div className="h-1.5 bg-[#005082]/40 rounded w-1/2" />
        </div>

        {/* Right Edge: Simple mini bar chart */}
        <div className="absolute bottom-[28%] right-[2%] w-24 h-16 border-2 border-[#791D55] rounded-lg p-2 bg-[#791D55]/5 flex items-end gap-1.5 shadow-2xs">
          <div className="w-3 h-[40%] bg-[#791D55] rounded-t-sm" />
          <div className="w-3 h-[75%] bg-[#791D55] rounded-t-sm" />
          <div className="w-3 h-[50%] bg-[#791D55] rounded-t-sm" />
          <div className="w-3 h-[90%] bg-[#791D55] rounded-t-sm" />
        </div>

        {/* NEW: Interactive Toggle Switch Component */}
        <div className="absolute top-[44%] left-[8%] w-12 h-6 border border-[#005082] rounded-full p-0.5 bg-[#005082]/5 flex items-center justify-end shadow-2xs">
          <div className="w-4 h-4 rounded-full bg-[#005082]" />
        </div>

        {/* NEW: Figma Style Layer Panel Outlines */}
        <div className="absolute bottom-[44%] left-[4%] w-40 h-28 border border-[#791D55]/30 rounded-lg p-3 bg-[#791D55]/5 flex flex-col gap-2 shadow-2xs font-mono text-[8px] text-[#791D55] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 border border-[#791D55] rounded-xs" />
            <span>Frame: Dashboard</span>
          </div>
          <div className="flex items-center gap-1.5 pl-3 opacity-80">
            <span className="w-1.5 h-1.5 border border-[#791D55] rounded-xs" />
            <span>↳ Group: Header</span>
          </div>
          <div className="flex items-center gap-1.5 pl-6 opacity-60">
            <span className="w-1.5 h-1.5 bg-[#791D55] rounded-xs" />
            <span>↳ Text: Title</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          LAYER 3: SMALL MICRO-ELEMENTS THROUGHOUT (Fastest drift - 30s)
          ========================================== */}
      <div className="absolute inset-0 opacity-[0.3] animate-float-around-1">
        {/* Timeline Node Ring */}
        <div className="absolute top-[18%] left-[20%] w-4.5 h-4.5 rounded-full border-2 border-[#005082] bg-white shadow-2xs" />

        {/* Book Outline Micro */}
        <div className="absolute top-[22%] right-[25%] w-6 h-6 text-[#791D55]">
          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>

        {/* Code Brackets */}
        <span className="absolute top-[42%] left-[22%] text-sm font-mono font-bold text-[#005082]">{"{ }"}</span>

        {/* Database Cylinder */}
        <div className="absolute top-[48%] right-[18%] w-7 h-9 text-[#791D55] drop-shadow-2xs">
          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75m-16.5-3.75v3.75" />
          </svg>
        </div>

        {/* Play Button Outline */}
        <div className="absolute bottom-[40%] left-[18%] w-6 h-6 rounded-full border-2 border-[#005082] bg-white flex items-center justify-center pl-0.5 shadow-2xs">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-3 h-3 text-[#005082]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        </div>

        {/* Progress Circle Outline */}
        <div className="absolute bottom-[38%] right-[22%] w-7 h-7 rounded-full border-2 border-dotted border-[#791D55]" />

        {/* Network Node Link */}
        <div className="absolute bottom-[20%] left-[25%] w-7 h-7 text-[#005082] drop-shadow-2xs">
          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>

        {/* Code Brackets close */}
        <span className="absolute bottom-[22%] right-[24%] text-sm font-mono font-bold text-[#791D55]">{"</>"}</span>

        {/* NEW: Multiplayer Designer Cursor */}
        <div className="absolute top-[68%] right-[28%] flex items-start gap-1">
          <svg className="w-3.5 h-3.5 text-[#005082] fill-current" viewBox="0 0 24 24">
            <path d="M4 3l16 9-7 2.5L20 21l-3 1.5-7-5.5L4 21V3z" />
          </svg>
          <div className="bg-[#005082] text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow-2xs font-mono">
            Designer
          </div>
        </div>

        {/* NEW: Slider Control Component */}
        <div className="absolute bottom-[16%] right-[16%] w-32 h-5 border border-[#005082]/30 rounded-full px-2 bg-[#005082]/5 flex items-center relative shadow-2xs">
          <div className="h-0.5 bg-[#005082]/30 rounded-full w-full relative">
            <div className="absolute left-0 top-0 h-full bg-[#005082] rounded-full w-2/3" />
          </div>
          <div className="absolute left-[64%] w-3 h-3 rounded-full bg-white border-2 border-[#005082] shadow-xs" />
        </div>

        {/* NEW: Color Palette Swatches */}
        <div className="absolute top-[22%] left-[45%] w-28 h-7 border border-[#791D55]/30 rounded-lg p-1 bg-[#791D55]/5 flex items-center justify-between gap-1 shadow-2xs">
          <div className="w-3 h-3 rounded-full bg-[#005082]" />
          <div className="w-3 h-3 rounded-full bg-[#791D55]" />
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
        </div>
      </div>
    </div>
  );
}
