"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Edit, Save, Brain, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface MindMap {
  id?: string;
  subjectId: string;
  moduleId: string;
  title: string;
  imageUrl: string;
}

export default function MindMapsClientPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  const [mindmaps, setMindmaps] = useState<MindMap[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

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
      toast.error("Failed to load mind maps");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (map: MindMap) => {
    setEditingId(map.id || null);
    setModuleId(map.moduleId || "");
    setTitle(map.title || "");
    setImageUrl(map.imageUrl || "");
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setModuleId("");
    setTitle("");
    setImageUrl("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!title || !imageUrl) {
      toast.error("Title and Image URL are required");
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        id: editingId,
        subjectId,
        moduleId,
        title,
        imageUrl
      };
      const res = await fetchGAS("saveMindMap", payload);
      if (res && res.success) {
        toast.success("Mind map saved successfully");
        setShowForm(false);
        loadData();
      } else {
        toast.error("Failed to save mind map");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mind map?")) return;
    try {
      const res = await fetchGAS("deleteMindMap", { mindMapId: id });
      if (res && res.success) {
        toast.success("Mind map deleted");
        loadData();
      } else {
        toast.error("Failed to delete mind map");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading mind maps...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" /> 
            Mind Maps
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Upload and link interactive mind map images</p>
        </div>
        {!showForm && (
          <Button onClick={handleCreateNew} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Mind Map
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-purple-200 shadow-md">
          <CardHeader className="bg-purple-50/50 border-b border-purple-100">
            <CardTitle>{editingId ? "Edit Mind Map" : "Add New Mind Map"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700">Link to Module (Optional)</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm"
                  value={moduleId}
                  onChange={e => setModuleId(e.target.value)}
                >
                  <option value="">-- No Module Linked --</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>Module {m.moduleNo}: {m.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700">Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm"
                  placeholder="e.g. Overview of Quantum Mechanics"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-zinc-700 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1.5 text-zinc-500" />
                  Image URL (PNG/JPG)
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm"
                  placeholder="e.g. /mindmaps/test_mindmap.png or https://drive.google.com/..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
                <p className="text-xs text-zinc-500 mt-1">Provide a direct link to the image or a local path (e.g. <code>/mindmaps/test_mindmap.png</code>)</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white" 
                onClick={handleSave} 
                disabled={saving}
              >
                {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Mind Map</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!showForm && mindmaps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mindmaps.map(map => {
            const module = modules.find(m => m.id === map.moduleId);
            return (
              <Card key={map.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-40 w-full bg-zinc-100 border-b border-zinc-200 overflow-hidden relative">
                  {map.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={(() => {
                        let url = map.imageUrl;
                        if (url.includes('drive.google.com')) {
                          const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                          if (match && match[1]) {
                            return `https://drive.google.com/uc?export=download&id=${match[1]}`;
                          }
                        }
                        return url.startsWith('/') || url.startsWith('http') ? url : `/${url}`;
                      })()}
                      alt={map.title} 
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  {module && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-purple-700 shadow-sm">
                      Module {module.moduleNo}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-zinc-800 line-clamp-1">{map.title}</h3>
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-zinc-100">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(map)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(map.id!)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!showForm && mindmaps.length === 0 && (
        <div className="text-center py-16 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
          <Brain className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-700">No Mind Maps Found</h3>
          <p className="text-zinc-500 max-w-md mx-auto mt-2">Upload visual summaries and diagrams for students to explore interactively.</p>
          <Button onClick={handleCreateNew} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add First Mind Map
          </Button>
        </div>
      )}
    </div>
  );
}
