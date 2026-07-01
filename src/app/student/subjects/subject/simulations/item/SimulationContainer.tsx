"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Play, AlertCircle, Trophy, CheckCircle2, Eye, ShieldAlert, Sparkles, RefreshCcw, Maximize2, Minimize2, LogOut } from "lucide-react";

interface SimulationContainerProps {
  simulation: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    estimatedTime: string | null;
    learningOutcome: string | null;
    frontendUrl?: string | null;
  };
  category: string;
}

export function SimulationContainer({ simulation, category }: SimulationContainerProps) {
  const [started, setStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  // State for Sim 1 (Usability Audit Simulator)
  const [foundFlaws, setFoundFlaws] = useState<string[]>([]);
  const flawsList = [
    { id: "flaw1", name: "Low Contrast Placeholder", desc: "Gray text on white background makes input placeholder illegible." },
    { id: "flaw2", name: "Confusing Error Message", desc: "Error says 'Invalid Input' without specifying which field failed." },
    { id: "flaw3", name: "No Visual Step Indicators", desc: "No indication of what step of checkout the user is currently on." },
    { id: "flaw4", name: "Microscopic Checkout Button", desc: "The main call to action is too small and hard to tap on mobile." },
    { id: "flaw5", name: "Missing Labels", desc: "Input fields rely solely on placeholders, which disappear when typing." }
  ];

  const handleFlawClick = (id: string) => {
    if (foundFlaws.includes(id)) {
      setFoundFlaws(prev => prev.filter(f => f !== id));
    } else {
      setFoundFlaws(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    if (simulation.id === "sim1" && foundFlaws.length === flawsList.length && flawsList.length > 0) {
      const timer = setTimeout(() => setCompleted(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [foundFlaws, simulation.id, flawsList.length]);

  const handleRetrySimulation = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setFoundFlaws([]);

    // Trigger visual reset and increment retry count
    setIsResetting(true);
    setRetryCount(prev => prev + 1);
    setTimeout(() => setIsResetting(false), 100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error requesting fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
      setIsFullscreen(false);
    }
  };

  const handleLaunchSandbox = () => {
    setStarted(true);
    setIsFullscreen(true);
    document.documentElement.requestFullscreen().catch(() => {
      // Browser full screen fallback
    });
  };

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <Card className="border-zinc-200 shadow-xl overflow-hidden">
          <div className="h-2 bg-green-600" />
          <CardHeader className="pt-8 pb-4">
            <div className="mx-auto mb-4 bg-green-100 p-4 rounded-full text-green-600 w-24 h-24 flex items-center justify-center animate-bounce">
              <Trophy className="w-12 h-12" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-zinc-900">Simulation Completed!</CardTitle>
            <p className="text-zinc-500 mt-2">
              Outstanding work! You successfully finished the <strong>{simulation.title}</strong> sandbox.
            </p>
          </CardHeader>
          <CardContent className="px-8 py-4 space-y-4">
            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex items-center justify-center space-x-4">
              <div className="text-center">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Simulation Finished</span>
                <span className="text-3xl font-bold text-green-600">Great Job!</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-50 border-t border-zinc-100 p-6">
            <Link href={subjectId ? `/student/subjects/subject/simulations?subjectId=${subjectId}` : "/student/dashboard"} className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                Back to simulations
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (started) {
    return (
      <div className={isFullscreen ? "fixed inset-0 z-50 bg-zinc-950 text-zinc-100 flex flex-col h-screen w-screen overflow-hidden animate-in fade-in duration-200 touch-none" : "container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[1600px] flex flex-col h-[calc(100vh-6rem)]"}>
        {/* Fullscreen Sandbox Action Header - Optimized for Mobile & Desktop */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shrink-0 shadow-md">
          <div className="flex items-center space-x-2 sm:space-x-3 truncate max-w-[60%] sm:max-w-md">
            <Badge className="bg-primary/20 text-primary-300 border border-primary/40 text-[10px] sm:text-xs font-mono uppercase px-2 py-0.5 hidden sm:inline-flex shrink-0">
              Live Sandbox
            </Badge>
            <div className="truncate">
              <h1 className="text-sm sm:text-lg font-bold text-zinc-100 leading-tight truncate">{simulation.title}</h1>
              <p className="text-zinc-400 text-[11px] sm:text-xs truncate">{category}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetrySimulation}
              className="border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 hover:text-white text-[11px] sm:text-xs font-semibold h-7 sm:h-8 px-2 sm:px-3"
            >
              <RefreshCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 hover:text-white text-[11px] sm:text-xs font-semibold h-7 sm:h-8 px-2 sm:px-3"
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> : <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />}
              <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(() => { });
                }
                setStarted(false);
              }}
              className="bg-red-600/90 hover:bg-red-600 text-white text-[11px] sm:text-xs font-semibold px-2.5 sm:px-4 h-7 sm:h-8"
            >
              <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> <span className="hidden sm:inline">Exit Sandbox</span>
            </Button>
          </div>
        </div>

        {/* Sandbox Content Body */}
        {simulation.frontendUrl ? (
          /* Deployed Frontend HTML Simulation Embedded in IFrame - Mobile Touch Compatible */
          <div className="flex-1 w-full h-full p-1.5 sm:p-4 bg-zinc-950 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col w-full h-full border border-zinc-800 rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-2xl relative">
              <div className="bg-zinc-900 text-zinc-400 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono flex items-center justify-between border-b border-zinc-800 shrink-0">
                <span className="truncate text-zinc-300 max-w-[200px] sm:max-w-xl">{simulation.frontendUrl}</span>
                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                  <span className="text-[10px] sm:text-[11px] text-zinc-500 hidden xs:inline">Mobile & Desktop Sandbox</span>
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80 block"></span>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80 block"></span>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80 block"></span>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative w-full h-full bg-white overflow-auto touch-auto">
                {isResetting ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <iframe
                    key={retryCount}
                    src={(() => {
                      let urlStr = simulation.frontendUrl || '';
                      if (!urlStr) return '';
                      if (retryCount > 0) {
                        try {
                          const url = new URL(urlStr);
                          url.searchParams.set('level', '1');
                          url.searchParams.set('reset', 'true');
                          url.searchParams.set('retry', retryCount.toString());
                          url.searchParams.set('t', Date.now().toString());

                          // Force hash to 1 for games like Flexbox Froggy or CSS Diner
                          if (url.hash && url.hash.includes('level')) {
                            url.hash = 'level1';
                          } else {
                            url.hash = '1';
                          }
                          return url.toString();
                        } catch (e) {
                          // Fallback for invalid URLs or relative paths
                          if (urlStr.includes('#')) {
                            // Replace any number after # with 1
                            urlStr = urlStr.replace(/#\d+/, '#1');
                            urlStr = urlStr.replace(/#level\d+/, '#level1');
                          } else {
                            urlStr += '#1';
                          }

                          if (urlStr.includes('?')) {
                            if (urlStr.includes('level=')) {
                              urlStr = urlStr.replace(/level=\d+/, 'level=1');
                            } else {
                              urlStr = urlStr.replace('#', '&level=1&reset=true#');
                            }
                          } else {
                            urlStr = urlStr.replace('#', '?level=1&reset=true#');
                          }
                          return urlStr;
                        }
                      }
                      return urlStr;
                    })()}
                    className="absolute inset-0 w-full h-full border-none"
                    title={simulation.title}
                    sandbox="allow-scripts allow-forms allow-popups allow-same-origin allow-modals"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        ) : simulation.id === "sim1" ? (
          <div key={retryCount} className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-6 overflow-y-auto lg:overflow-hidden bg-zinc-950 h-full">
            {/* The E-Commerce Mockup Sandbox */}
            <div className="lg:col-span-2 flex flex-col min-h-[420px] lg:h-full overflow-hidden">
              <Card className="border-zinc-800 shadow-xl overflow-hidden flex flex-col h-full bg-white">
                <div className="bg-zinc-900 text-zinc-300 px-4 py-2.5 text-xs font-mono flex items-center justify-between shrink-0">
                  <span className="text-zinc-400">http://mock-checkout.edu/cart</span>
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 block"></span>
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6 bg-white select-none overflow-y-auto flex-1">
                  {/* Flaw 3: No step indicator */}
                  <div
                    onClick={() => handleFlawClick("flaw3")}
                    className={`p-3 rounded-lg border-2 mb-6 cursor-pointer transition-all ${foundFlaws.includes("flaw3")
                      ? "border-green-500 bg-green-50/50"
                      : "border-zinc-200 hover:border-primary/50"
                      }`}
                  >
                    <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-2">
                      <span>Checkout Flow Step</span>
                      {foundFlaws.includes("flaw3") && <Badge className="bg-green-600 text-white border-none">Step Flaw Spotted!</Badge>}
                    </div>
                    <div className="h-2 bg-zinc-200 rounded" />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-zinc-800">Secure Checkout</h3>

                  {/* Flaw 5: Missing Labels */}
                  <div
                    onClick={() => handleFlawClick("flaw5")}
                    className={`p-3 rounded-lg border-2 mb-4 cursor-pointer transition-all ${foundFlaws.includes("flaw5")
                      ? "border-green-500 bg-green-50/50"
                      : "border-zinc-200 hover:border-primary/50"
                      }`}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-1">
                      <span>Customer Details</span>
                      {foundFlaws.includes("flaw5") && <Badge className="bg-green-600 text-white border-none">Missing Labels Spotted!</Badge>}
                    </div>
                    <div className="space-y-3">
                      {/* Flaw 1: Low contrast placeholders */}
                      <div
                        onClick={(e) => { e.stopPropagation(); handleFlawClick("flaw1"); }}
                        className={`p-2 rounded border-2 transition-all ${foundFlaws.includes("flaw1")
                          ? "border-green-500 bg-green-50/50"
                          : "border-transparent hover:border-primary/50"
                          }`}
                      >
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-0.5">
                          <span>Full Name</span>
                          {foundFlaws.includes("flaw1") && <span className="text-green-600 font-bold">Contrast Flaw Spotted!</span>}
                        </div>
                        <input
                          type="text"
                          placeholder="John Doe"
                          disabled
                          className="w-full border border-zinc-200 rounded px-3 py-1.5 text-xs placeholder-zinc-100 bg-zinc-50"
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        disabled
                        className="w-full border border-zinc-200 rounded px-3 py-1.5 text-xs placeholder-zinc-400 bg-zinc-50"
                      />
                    </div>
                  </div>

                  {/* Flaw 2: Confusing Error Message */}
                  <div
                    onClick={() => handleFlawClick("flaw2")}
                    className={`p-3 rounded-lg border-2 mb-6 cursor-pointer transition-all ${foundFlaws.includes("flaw2")
                      ? "border-green-500 bg-green-50/50"
                      : "border-zinc-200 hover:border-primary/50"
                      }`}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-1">
                      <span>Payment Info</span>
                      {foundFlaws.includes("flaw2") && <Badge className="bg-green-600 text-white border-none">Error Flaw Spotted!</Badge>}
                    </div>
                    <div className="bg-red-50 text-red-600 border border-red-200 rounded p-2.5 text-xs font-semibold flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Error: Invalid Input. Please resolve errors.</span>
                    </div>
                  </div>

                  {/* Flaw 4: Microscopic Checkout Button */}
                  <div
                    onClick={() => handleFlawClick("flaw4")}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex justify-center ${foundFlaws.includes("flaw4")
                      ? "border-green-500 bg-green-50/50"
                      : "border-zinc-200 hover:border-primary/50"
                      }`}
                  >
                    <div className="text-center w-full">
                      {foundFlaws.includes("flaw4") && (
                        <div className="text-xs font-bold text-green-600 mb-1">Button Size Flaw Spotted!</div>
                      )}
                      <button disabled className="bg-zinc-800 text-white text-[8px] px-2 py-0.5 rounded shadow-sm mx-auto block font-mono">
                        checkout
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checklist Panel */}
            <div className="flex flex-col min-h-[350px] lg:h-full overflow-hidden">
              <Card className="border-zinc-800 shadow-xl flex flex-col h-full bg-zinc-900 text-zinc-100">
                <CardHeader className="border-b border-zinc-800 pb-4 shrink-0">
                  <CardTitle className="text-lg font-bold flex items-center text-zinc-100">
                    <Eye className="w-5 h-5 mr-2 text-primary" /> Audit Checklist
                  </CardTitle>
                  <p className="text-zinc-400 text-xs">Click elements on the mockup page to identify all 5 usability errors.</p>
                </CardHeader>
                <CardContent className="space-y-3 p-4 overflow-y-auto flex-1">
                  {flawsList.map((flaw) => {
                    const found = foundFlaws.includes(flaw.id);
                    return (
                      <div
                        key={flaw.id}
                        className={`p-3 rounded-lg border transition-all text-sm ${found
                          ? "bg-green-950/40 border-green-700/50 text-green-300"
                          : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400"
                          }`}
                      >
                        <div className="flex items-center space-x-2 font-bold mb-1">
                          <CheckCircle2 className={`w-4 h-4 ${found ? "text-green-400 fill-green-950" : "text-zinc-600"}`} />
                          <span className={found ? "text-green-200" : "text-zinc-300"}>{flaw.name}</span>
                        </div>
                        {found && <p className="text-xs text-green-300/90 leading-relaxed pl-6">{flaw.desc}</p>}
                      </div>
                    );
                  })}
                </CardContent>
                <CardFooter className="pt-3 border-t border-zinc-800 shrink-0 p-4 bg-zinc-900/90">
                  <Button
                    type="button"
                    onClick={handleRetrySimulation}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" /> Reset Checklist
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          /* Generic Simulation Simulator */
          <div className="flex-1 flex items-center justify-center p-6 bg-zinc-950 overflow-y-auto">
            <Card key={retryCount} className="border-zinc-800 max-w-2xl w-full shadow-2xl bg-zinc-900 text-zinc-100">
              <CardHeader className="bg-zinc-900/80 border-b border-zinc-800 text-center py-8">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                <CardTitle className="text-2xl font-bold text-zinc-100">{simulation.title} Sandbox</CardTitle>
                <p className="text-zinc-400 mt-2 max-w-md mx-auto">{simulation.description}</p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-lg p-6">
                  <h4 className="font-bold text-zinc-200 mb-3 text-sm uppercase tracking-wider">Sandbox Checklist</h4>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Review information architecture guidelines.</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Arrange and map nodes inside UI canvas.</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Perform layout balance validation checks.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-950/40 border border-blue-800/50 rounded-lg p-4 flex items-start space-x-3 text-blue-300">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-400" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1 text-blue-200">Interactive Sandbox Environment</p>
                    <p>In this sandbox, you are tasked with aligning page components to ensure ideal scanning. When ready, submit the final build to complete the simulation.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-zinc-900/90 border-t border-zinc-800 p-6 flex justify-end">
                <Button
                  type="button"
                  onClick={handleRetrySimulation}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" /> Retry Simulation
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={subjectId ? `/student/subjects/subject/simulations?subjectId=${subjectId}` : "/student/dashboard"} className="flex items-center text-sm font-medium text-zinc-500 hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Simulations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 rounded-xl aspect-video flex flex-col items-center justify-center border border-zinc-200 overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="z-10 text-center p-8 bg-zinc-900/80 rounded-2xl backdrop-blur-sm border border-zinc-800">
              <Play className="w-16 h-16 text-primary mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold text-white mb-2">{simulation.title}</h2>
              <p className="text-zinc-400 mb-6 max-w-md mx-auto">{simulation.description}</p>
              <Button size="lg" onClick={handleLaunchSandbox} className="bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-lg">
                Launch Fullscreen Sandbox
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Simulation Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Related Module</div>
                  <Badge variant="outline" className="text-zinc-700 bg-zinc-50">{category}</Badge>
                </div>
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Difficulty Level</div>
                  <Badge className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200">{simulation.difficulty}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm bg-blue-50 border-blue-100">
            <CardContent className="p-6 flex items-start space-x-3 text-blue-800">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Instructions</p>
                <p>Ensure you have completed the reading material for {category} before attempting this simulation to maximize your score.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

