"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, Brain, Download } from "lucide-react";

export default function InfographicViewerClientPage() {
  const searchParams = useSearchParams();
  const directImageUrl = searchParams.get('imageUrl');
  const directTitle = searchParams.get('title');
  const subjectId = searchParams.get('subjectId') || '';
  const mapId = searchParams.get('id') || '';
  const router = useRouter();

  const [infographic, setInfographic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = () => {
    if (!infographic || !infographic.imageUrl) return;
    const url = infographic.imageUrl;
    let downloadUrl = url;
    const isDriveLink = url.includes('drive.google.com');
    if (isDriveLink) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        downloadUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.download = `${infographic.title || 'infographic'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const mapsData = await fetchGAS("getInfographics", { subjectId });
      const maps = Array.isArray(mapsData) ? mapsData : [];
      const found = maps.find(m => m.id === mapId);
      setInfographic(found || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (subjectId && mapId) {
      loadData();
    }
  }, [subjectId, mapId]);

  if (!mounted) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col space-y-4 bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="text-zinc-500 font-medium">Initializing Canvas...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="text-zinc-500 font-medium">Loading Interactive Canvas...</p>
      </div>
    );
  }

  if (!infographic) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">Infographic not found</h2>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950 overflow-hidden touch-none overscroll-none">
      
      {/* Top Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-white font-bold text-lg flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              {infographic.title}
            </h1>
            <p className="text-white/60 text-xs mt-0.5">Interactive Viewer</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
            className="bg-purple-600 hover:bg-purple-500 text-white border-none font-semibold text-xs px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" /> Download Copy
          </Button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        {infographic.imageUrl ? (
          (() => {
            const url = infographic.imageUrl;
            const isDriveLink = url.includes('drive.google.com');
            let driveId = null;
            if (isDriveLink) {
              const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
              if (match && match[1]) driveId = match[1];
            }

            // If it's a drive link and image failed to load, fallback to iframe
            if (isDriveLink && imageError && driveId) {
              return (
                <div className="w-full h-full bg-zinc-900 flex flex-col">
                  <div className="bg-amber-900/30 text-amber-500 text-xs text-center py-1 px-4 border-b border-amber-900/50">
                    Previewing via Google Drive Viewer (Image direct load failed or file is PDF)
                  </div>
                  <iframe 
                    src={`https://drive.google.com/file/d/${driveId}/preview`} 
                    className="w-full flex-1 border-0"
                    allow="autoplay"
                  />
                </div>
              );
            }

            return (
              <TransformWrapper
                initialScale={1}
                initialPositionX={0}
                initialPositionY={0}
                minScale={0.1}
                maxScale={8}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <div className="absolute bottom-8 right-8 z-20 flex flex-col space-y-2 bg-zinc-900/80 backdrop-blur-md p-2 rounded-xl border border-zinc-700/50 shadow-2xl">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg h-10 w-10"
                        onClick={() => zoomIn()}
                        title="Zoom In"
                      >
                        <ZoomIn className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg h-10 w-10"
                        onClick={() => zoomOut()}
                        title="Zoom Out"
                      >
                        <ZoomOut className="h-5 w-5" />
                      </Button>
                      <div className="w-full h-px bg-zinc-700/50 my-1"></div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-purple-400 hover:text-purple-300 hover:bg-zinc-800 rounded-lg h-10 w-10"
                        onClick={() => resetTransform()}
                        title="Reset View"
                      >
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <TransformComponent 
                      wrapperStyle={{ width: "100%", height: "100%" }} 
                      contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={(() => {
                          if (driveId && !imageError) {
                            // Try the download URL format which often bypasses the HTML warning for images
                            return `https://drive.google.com/uc?export=download&id=${driveId}`;
                          }
                          return url.startsWith('/') || url.startsWith('http') ? url : `/${url}`;
                        })()} 
                        alt={infographic.title}
                        className="max-w-none shadow-2xl rounded-sm object-contain"
                        style={{ maxHeight: '90vh' }}
                        onError={(e) => {
                          if (isDriveLink && !imageError) {
                            // Trigger re-render to show iframe instead
                            setImageError(true);
                          } else {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src = "https://placehold.co/800x600/18181b/e4e4e7?text=Image+Not+Found\nCheck+the+URL";
                          }
                        }}
                      />
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
            );
          })()
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            No image available for this infographic.
          </div>
        )}
      </div>
      
    </div>
  );
}
