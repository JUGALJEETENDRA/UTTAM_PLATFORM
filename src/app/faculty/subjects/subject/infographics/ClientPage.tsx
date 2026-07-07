"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Edit, Save, Brain, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { DeleteConfirmDialog } from "@/components/faculty/DeleteConfirmDialog";

interface Infographic {
  id?: string;
  subjectId: string;
  moduleId: string;
  title: string;
  imageUrl: string;
}

export default function InfographicsClientPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingInfo, setDeletingInfo] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [infographics, setInfographics] = useState<Infographic[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[id: string]: boolean}>({});

  useEffect(() => {
    if (subjectId) {
      loadData();
    }
  }, [subjectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mapsData, modsData] = await Promise.all([
        fetchGAS("getInfographics", { subjectId }),
        fetchGAS("getModules", { subjectId })
      ]);
      setInfographics(Array.isArray(mapsData) ? mapsData : []);
      setModules(Array.isArray(modsData) ? modsData : []);
    } catch (err) {
      toast.error("Failed to load infographics");
    } finally {
      setLoading(false);
    }
  };

  const [targetType, setTargetType] = useState<"module" | "subtopic">("module");
  const [subtopicId, setSubtopicId] = useState("");

  const handleEdit = (map: Infographic) => {
    setEditingId(map.id || null);
    setModuleId(map.moduleId || "");
    
    // Auto-detect target type based on title
    const mod = modules.find(m => m.id === map.moduleId);
    let foundSubtopic = "";
    let type: "module" | "subtopic" = "module";
    
    if (mod) {
      const sub = mod.subtopics?.find((s: any) => s.title === map.title);
      if (sub && map.title !== mod.title) {
        foundSubtopic = sub.id;
        type = "subtopic";
      }
    }
    
    setTargetType(type);
    setSubtopicId(foundSubtopic);
    setImageUrl(map.imageUrl || "");
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setModuleId("");
    setSubtopicId("");
    setTargetType("module");
    setImageUrl("");
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handleSave = async () => {
    if (!moduleId) {
      toast.error("Please select a module");
      return;
    }

    let finalTitle = "";
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;

    if (targetType === "module") {
      finalTitle = mod.title;
    } else {
      if (!subtopicId) {
        toast.error("Please select a subtopic");
        return;
      }
      const sub = mod.subtopics?.find((s: any) => s.id === subtopicId);
      if (!sub) {
        toast.error("Subtopic not found");
        return;
      }
      finalTitle = sub.title;
    }

    if (!imageUrl) {
      toast.error("Image URL is required");
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        id: editingId,
        subjectId,
        moduleId,
        subtopicId: targetType === "subtopic" ? subtopicId : "",
        title: finalTitle,
        imageUrl
      };
      const res = await fetchGAS("saveInfographic", payload);
      if (res && res.success) {
        toast.success("Infographic saved successfully");
        setShowForm(false);
        loadData();
      } else {
        toast.error("Failed to save infographic");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (info: Infographic) => {
    setDeletingInfo({ id: info.id!, title: info.title || "Infographic" });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteInfo = async () => {
    if (!deletingInfo) return;
    setIsDeleting(true);
    try {
      const res = await fetchGAS("deleteInfographic", { infographicId: deletingInfo.id });
      if (res && res.success) {
        toast.success("Infographic deleted");
        setDeleteDialogOpen(false);
        setDeletingInfo(null);
        loadData();
      } else {
        toast.error("Failed to delete infographic");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading infographics...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" /> 
            Infographics
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Upload and link interactive infographic images</p>
        </div>
        {!showForm && (
          <Button onClick={handleCreateNew} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Infographic
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-purple-200 shadow-md">
          <CardHeader className="bg-purple-50/50 border-b border-purple-100">
            <CardTitle>{editingId ? "Edit Infographic" : "Add New Infographic"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700">Link Target To</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm"
                  value={targetType}
                  onChange={e => {
                    setTargetType(e.target.value as any);
                    setSubtopicId("");
                  }}
                >
                  <option value="module">Whole Module</option>
                  <option value="subtopic">Specific Subtopic</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700">Select Module</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm"
                  value={moduleId}
                  onChange={e => {
                    setModuleId(e.target.value);
                    setSubtopicId("");
                  }}
                >
                  <option value="">-- Select Module --</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>Module {m.moduleNo}: {m.title}</option>
                  ))}
                </select>
              </div>

              {targetType === "subtopic" && moduleId && (
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-zinc-700">Select Subtopic</label>
                  <select 
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm"
                    value={subtopicId}
                    onChange={e => setSubtopicId(e.target.value)}
                  >
                    <option value="">-- Select Subtopic --</option>
                    {modules.find(m => m.id === moduleId)?.subtopics?.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-zinc-700 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1.5 text-zinc-500" />
                  Image URL (PNG/JPG)
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm"
                  placeholder="e.g. /infographics/test_infographic.png or https://drive.google.com/..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
                <p className="text-xs text-zinc-500 mt-1">Provide a direct link to the image or a local path (e.g. <code>/infographics/test_infographic.png</code>)</p>
              </div>
            </div>
            <div className="flex flex-col items-end pt-4">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white" 
                  onClick={handleSave} 
                  disabled={saving}
                >
                  {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Infographic</>}
                </Button>
              </div>
              <p className="text-xs text-zinc-500 mt-3 text-right">
                Note: The changes will not be visible on the student dashboard until the "Publish to Student Dashboard" button is clicked.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!showForm && infographics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infographics.map(map => {
            const module = modules.find(m => m.id === map.moduleId);
            return (
              <Card key={map.id} className="overflow-hidden hover:shadow-lg transition-all group p-0 gap-0">
                <div className="h-40 w-full bg-zinc-100 border-b border-zinc-200 overflow-hidden relative">
                  {map.imageUrl && !imageErrors[map.id!] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={(() => {
                        let url = map.imageUrl || "";
                        if (url.includes('drive.google.com')) {
                          const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                          if (match && match[1]) {
                            // Use Google Drive thumbnail API to bypass virus scan redirect that breaks images
                            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800-h400`;
                          }
                        }
                        return url.startsWith('/') || url.startsWith('http') ? url : `/${url}`;
                      })()}
                      alt={map.title} 
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" 
                      onError={() => setImageErrors(prev => ({ ...prev, [map.id!]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50">
                      <Brain className="w-16 h-16 text-purple-200 mb-2" strokeWidth={1.5} />
                      <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Infographic</span>
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
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteClick(map)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!showForm && infographics.length === 0 && (
        <div className="text-center py-16 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
          <Brain className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-700">No Infographics Found</h3>
          <p className="text-zinc-500 max-w-md mx-auto mt-2">Upload visual summaries and diagrams for students to explore interactively.</p>
          <Button onClick={handleCreateNew} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add First Infographic
          </Button>
        </div>
      )}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDeleteInfo}
        title={deletingInfo ? `Delete ${deletingInfo.title}?` : "Delete Infographic?"}
        message="This action will permanently delete this item and cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}
