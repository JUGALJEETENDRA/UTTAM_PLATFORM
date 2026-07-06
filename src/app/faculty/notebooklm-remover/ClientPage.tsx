"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Video, FileText, Presentation, Loader2, Download, Eraser } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function NotebookLMRemoverClient() {
  const [activeTab, setActiveTab] = useState("video");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [trimVideo, setTrimVideo] = useState(true);
  const [cropVideo, setCropVideo] = useState(true);
  const [activeThreads, setActiveThreads] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Need to load ffmpeg lazily to avoid SSR errors
  const ffmpegRef = useRef<any>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setError(null);
    setActiveThreads(null);

    try {
      if (activeTab === "pdf") {
        await processPDF(file);
      } else if (activeTab === "pptx") {
        await processPPTX(file);
      } else if (activeTab === "video") {
        await processVideo(file);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during processing.");
    } finally {
      setProcessing(false);
      // reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const processPDF = async (file: File) => {
    setProgress(10);
    const arrayBuffer = await file.arrayBuffer();
    setProgress(30);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      // User preferred cropping despite minor cut off. 
      // Crop 50 points from the bottom to ensure the logo is gone.
      page.setCropBox(0, 50, width, height - 50);
    }
    
    setProgress(80);
    const modifiedPdfBytes = await pdfDoc.save();
    setProgress(100);
    
    downloadBlob(new Blob([modifiedPdfBytes], { type: "application/pdf" }), `clean_${file.name}`);
  };

  const processPPTX = async (file: File) => {
    setProgress(10);
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    const files = Object.keys(zip.files);
    // Support png, jpeg, jpg
    const imageFiles = files.filter(f => f.startsWith("ppt/media/image") && (f.endsWith(".png") || f.endsWith(".jpeg") || f.endsWith(".jpg")));
    
    let processedImages = 0;
    
    for (const imgPath of imageFiles) {
      const imgData = await zip.file(imgPath)?.async("base64");
      if (!imgData) continue;
      
      const mimeType = imgPath.endsWith(".png") ? "image/png" : "image/jpeg";
      const newImgData = await removeWatermarkFromImageBase64(imgData, mimeType);
      zip.file(imgPath, newImgData, { base64: true });
      
      processedImages++;
      setProgress(10 + Math.floor((processedImages / imageFiles.length) * 70));
    }
    
    setProgress(85);
    const content = await zip.generateAsync({ type: "blob" });
    setProgress(100);
    downloadBlob(content, `clean_${file.name}`);
  };

  const removeWatermarkFromImageBase64 = (base64Str: string, mimeType: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(base64Str);
        
        ctx.drawImage(img, 0, 0);
        
        // Clone stamp a patch of the background from just left of the logo
        // This preserves grid lines (horizontal lines will perfectly align)
        // Logo is typically in the bottom right and small
        const patchWidth = Math.floor(img.width * 0.15); // ~15% width (e.g., 288px)
        const patchHeight = Math.floor(img.height * 0.05); // ~5% height (e.g., 54px)
        
        // Source coordinates (take the grid pattern from the left of the logo)
        const srcX = img.width - (patchWidth * 2);
        const srcY = img.height - patchHeight;
        
        // Destination coordinates (draw over the logo on the bottom right)
        const destX = img.width - patchWidth;
        const destY = img.height - patchHeight;
        
        // Copy the patch over the watermark
        ctx.drawImage(img, srcX, srcY, patchWidth, patchHeight, destX, destY, patchWidth, patchHeight);
        
        const newBase64 = canvas.toDataURL(mimeType).split(",")[1];
        resolve(newBase64);
      };
      img.onerror = reject;
      img.src = `data:${mimeType};base64,` + base64Str;
    });
  };

  const processVideo = async (file: File) => {
    setProgress(5);
    
    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg();
    }
    const ffmpeg = ffmpegRef.current;
    
    // Load ffmpeg if not loaded
    if (!ffmpeg.loaded) {
      // If the service worker fails to inject headers (common in local dev), SharedArrayBuffer will be undefined.
      // We seamlessly fallback to the single-threaded core to prevent the app from crashing.
      const isMtSupported = typeof globalThis !== 'undefined' && 'SharedArrayBuffer' in globalThis;
      const coreType = isMtSupported ? 'core-mt' : 'core';
      const baseURL = `https://unpkg.com/@ffmpeg/${coreType}@0.12.6/dist/umd`;
      
      const loadOptions: any = {
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      };
      
      if (isMtSupported) {
        loadOptions.workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');
      }
      
      await ffmpeg.load(loadOptions);
    }
    
    ffmpeg.on("progress", ({ progress: p }) => {
      // FFmpeg can sometimes report negative/anomalous progress with complex filters
      // We clamp it between 10 and 95 to prevent the progress bar from breaking the UI
      const calculated = 10 + Math.floor(p * 85);
      setProgress(Math.min(95, Math.max(10, calculated)));
    });
    
    ffmpeg.on("log", ({ message }) => {
      console.log("[FFmpeg Log]:", message);
    });
    
    setProgress(10);
    const inputName = "input.mp4";
    const outputName = "output.mp4";
    
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    
    // Determine duration and dimensions
    let duration = 0;
    let vWidth = 1280;
    let vHeight = 720;
    
    await new Promise<void>((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        duration = video.duration;
        vWidth = video.videoWidth || 1280;
        vHeight = video.videoHeight || 720;
        resolve();
      };
      video.src = URL.createObjectURL(file);
    });

    const command = ["-i", inputName];
    
    if (trimVideo && duration > 3) {
      command.push("-t", (duration - 3).toString());
    }
    
    if (cropVideo) {
      const w = Math.floor(vWidth * 0.28);
      const h = Math.floor(vHeight * 0.14);
      // FFmpeg's delogo filter interpolates surrounding pixels. It crashes if the box is perfectly
      // flush against the edge because it attempts to read out-of-bounds pixels (W+1, H+1).
      // We must leave a tiny 2-pixel margin to give the algorithm space to interpolate.
      const x = vWidth - w - 2;
      const y = vHeight - h - 2;
      
      command.push("-vf", `delogo=x=${x}:y=${y}:w=${w}:h=${h}`);
      // Use ultrafast preset to drastically speed up video re-encoding in the browser
      command.push("-preset", "ultrafast");
    } else {
      // If we are only trimming, we don't need to re-encode the video at all!
      // Stream copying is virtually instantaneous.
      command.push("-c:v", "copy");
    }
    
    // Utilize multi-threading based on the user's hardware (only if supported)
    if (typeof globalThis !== 'undefined' && 'SharedArrayBuffer' in globalThis) {
      // We cap it at 4 because spawning more than 4 threads in WebAssembly 
      // exceeds the browser's strict 2-4GB memory limit for x264 encoding, causing silent freezes.
      const hwThreads = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;
      const threadCount = Math.min(4, hwThreads);
      command.push("-threads", threadCount.toString());
      setActiveThreads(threadCount);
    } else {
      setActiveThreads(1);
    }
    
    // Always stream copy the audio to save time
    command.push("-c:a", "copy", outputName);
    
    await ffmpeg.exec(command);
    
    setProgress(95);
    const data = await ffmpeg.readFile(outputName);
    setProgress(100);
    
    downloadBlob(new Blob([(data as Uint8Array).buffer], { type: "video/mp4" }), `clean_${file.name}`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center justify-center gap-3">
          <Eraser className="w-8 h-8 text-primary" />
          NotebookLM Watermark Remover
        </h1>
      </div>

      <Card className="w-full bg-white shadow-sm border-zinc-200">
        <Tabs defaultValue="video" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="pb-2 border-b">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-100">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" /> Video
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> PDF Slides
              </TabsTrigger>
              <TabsTrigger value="pptx" className="flex items-center gap-2">
                <Presentation className="w-4 h-4" /> PPTX
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              
              <div 
                className="w-full max-w-lg border-2 border-dashed border-zinc-300 rounded-xl p-12 text-center hover:bg-zinc-50 transition-colors cursor-pointer relative"
                onClick={() => !processing && fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept={
                    activeTab === "video" ? ".mp4" :
                    activeTab === "pdf" ? ".pdf" :
                    ".pptx"
                  }
                  disabled={processing}
                />
                
                {processing ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <div className="text-lg font-medium text-zinc-700">
                      Processing locally...
                      {activeThreads !== null && (
                        <span className="text-sm text-zinc-500 block text-center mt-1">
                          (Using {activeThreads} {activeThreads === 1 ? 'thread' : 'threads'})
                        </span>
                      )}
                    </div>
                    <div className="w-full max-w-xs bg-zinc-200 rounded-full h-2.5 mt-2">
                      <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-800">
                        Upload your {activeTab.toUpperCase()}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-2">
                        {activeTab === "video" && "Support .mp4 from NotebookLM"}
                        {activeTab === "pdf" && "Automatically removes the bottom logo"}
                        {activeTab === "pptx" && "Cleans up the slide branding"}
                      </p>
                    </div>
                    <Button variant="outline" className="mt-4 pointer-events-none">
                      Select File
                    </Button>
                  </div>
                )}
              </div>

              {activeTab === "video" && !processing && (
                <div className="flex gap-6 mt-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50/50">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cropVideo} 
                      onChange={(e) => setCropVideo(e.target.checked)} 
                      className="rounded border-zinc-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-zinc-700">Crop Bottom Logo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={trimVideo} 
                      onChange={(e) => setTrimVideo(e.target.checked)} 
                      className="rounded border-zinc-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-zinc-700">Trim Last 3 Seconds (Outro)</span>
                  </label>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-md border border-red-200">
                  {error}
                </div>
              )}

            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
