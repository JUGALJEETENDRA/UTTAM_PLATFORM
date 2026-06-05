"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, ExternalLink, Image as ImageIcon } from "lucide-react";

interface MindMap {
  id: string;
  subjectId: string;
  moduleId: string;
  title: string;
  imageUrl: string;
}

export default function StudentMindMapsList() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  const [mindmaps, setMindmaps] = useState<MindMap[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) {
      loadData();
    }
  }, [subjectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mapsData, modsData] = await Promise.all([
        fetchGAS("getMindMaps", { subjectId }),
        fetchGAS("getModules", { subjectId })
      ]);
      setMindmaps(Array.isArray(mapsData) ? mapsData : []);
      setModules(Array.isArray(modsData) ? modsData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading mind maps...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <Link href={`/student/subjects/subject?subjectId=${subjectId}`}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" /> Interactive Mind Maps
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Explore visual topic structures</p>
        </div>
      </div>

      {mindmaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mindmaps.map(map => {
            const module = modules.find(m => m.id === map.moduleId);
            return (
              <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`}>
                <Card className="overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all group h-full">
                  <div className="h-48 w-full bg-zinc-100 border-b border-zinc-200 overflow-hidden relative">
                    {map.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={map.imageUrl} alt={map.title} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    {module && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Module {module.moduleNo}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <Button className="w-full bg-white text-purple-700 hover:bg-zinc-100">
                        Open Viewer <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-zinc-800 line-clamp-2">{map.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
          <Brain className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-700">No Mind Maps Available</h3>
          <p className="text-zinc-500 mt-1">Your faculty hasn't uploaded any interactive mind maps yet.</p>
        </div>
      )}
    </div>
  );
}
