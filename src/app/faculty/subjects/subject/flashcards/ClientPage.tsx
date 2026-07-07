"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Plus, Trash2, HelpCircle, FileUp, Pencil } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { fetchGAS } from "@/lib/apiClient";
import { DeleteConfirmDialog } from "@/components/faculty/DeleteConfirmDialog";
interface FlashcardForm {
  question: string;
  answer: string;
}
export default function ManageFlashcardsPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
  const [modules, setModules] = useState<any[]>([]);
  const [decks, setDecks] = useState<any[]>([]);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDeck, setDeletingDeck] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Form states
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");
  const [showAllDecks, setShowAllDecks] = useState(false);
  const [title, setTitle] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [cards, setCards] = useState<FlashcardForm[]>([
    { question: "", answer: "" }
  ]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchModules();
    fetchDecks();
  }, []);
  const fetchModules = async () => {
    try {
      const data = await fetchGAS("getModules", { subjectId });
      if (data && !data.error) {
        setModules(data);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };
  const fetchDecks = async () => {
    try {
      const data = await fetchGAS("getFlashcardDecks", { subjectId });
      if (data && !data.error) {
        setDecks(data);
      }
    } catch (err) {
      console.error("Error fetching flashcards:", err);
    }
  };
  const getSubtopicsForSelectedModule = () => {
    const mod = modules.find(m => m.id === selectedModuleId);
    return mod ? mod.subtopics || [] : [];
  };
  const handleAddCardField = () => {
    setCards([...cards, { question: "", answer: "" }]);
  };
  const handleRemoveCardField = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };
  const handleCardChange = (index: number, field: keyof FlashcardForm, value: string) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      if (file.name.toLowerCase().endsWith(".csv")) {
        const text = await file.text();
        parseCsvAndSetCards(text);
      } else {
        // 1. Read locally using mammoth
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        parseTextAndSetCards(text);
      }
      // Google Drive API upload removed as per request.
      setDocumentUrl("local-parsed-only");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during file processing.");
    } finally {
      setLoading(false);
      if (e.target) e.target.value = ""; // reset file input
    }
  };

  const parseCsvAndSetCards = (text: string) => {
    if (!text.trim()) return;
    const newCards: FlashcardForm[] = [];
    
    // Simple CSV parser
    let inQuote = false;
    let currentVal = '';
    const rows: string[][] = [];
    let currentRow: string[] = [];
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (inQuote && text[i+1] === '"') {
          currentVal += '"';
          i++; // skip next quote
        } else {
          inQuote = !inQuote;
        }
      } else if (char === ',' && !inQuote) {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\n' || char === '\r') && !inQuote) {
        if (char === '\r' && text[i+1] === '\n') {
          i++; // skip \n
        }
        currentRow.push(currentVal.trim());
        if (currentRow.length > 1 || currentRow[0].length > 0) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    if (currentVal.length > 0 || currentRow.length > 0) {
      currentRow.push(currentVal.trim());
      rows.push(currentRow);
    }
    
    // Skip header row if it's Front,Back or similar
    let startIdx = 0;
    if (rows.length > 0 && rows[0].length >= 2 && rows[0][0].toLowerCase().includes("front")) {
      startIdx = 1;
    }
    
    for (let i = startIdx; i < rows.length; i++) {
      if (rows[i].length >= 2 && (rows[i][0] || rows[i][1])) {
        newCards.push({ question: rows[i][0], answer: rows[i][1] });
      }
    }
    
    if (newCards.length > 0) {
      setCards([...cards.filter(c => c.question.trim() !== ""), ...newCards]);
      toast.success(`Successfully parsed ${newCards.length} flashcards from CSV!`);
    } else {
      toast.error("Failed to parse flashcards. Please check the format in the CSV file.");
    }
  };
  const parseTextAndSetCards = (text: string) => {
    if (!text.trim()) return;
    const newCards: FlashcardForm[] = [];
    // Match anything up to "Answer:" as the question, and the rest as the answer.
    const blocks = text.split(/\n(?=\d+\.\s)/).filter(b => b.trim());
    blocks.forEach(block => {
      // Allow optional spaces/newlines before Answer:
      const qMatch = block.match(/^(?:\d+\.\s+)?([\s\S]*?)(?=\s*Answer:)/i);
      if (!qMatch) return;
      const question = qMatch[1].trim();
      const answerMatch = block.match(/Answer:\s*([\s\S]*)/i);
      const answer = answerMatch ? answerMatch[1].trim() : "";
      if (question && answer) {
        newCards.push({ question, answer });
      }
    });
    if (newCards.length > 0) {
      setCards([...cards.filter(c => c.question.trim() !== ""), ...newCards]);
      toast.success(`Successfully parsed ${newCards.length} flashcards from DOCX!`);
    } else {
      toast.error("Failed to parse flashcards. Please check the format in the DOCX file.");
    }
  };
  const handleEdit = (deck: any) => {
    setEditingDeckId(deck.id);
    setSelectedModuleId(deck.moduleId);
    
    // Find matching subtopic to convert legacy UUID to subtopicNo
    const mod = modules.find(m => m.id === deck.moduleId);
    const matchingSt = mod?.subtopics?.find((s: any) => s.id === deck.subtopicId);
    setSelectedSubtopicId(matchingSt ? matchingSt.subtopicNo : deck.subtopicId || "");
    
    setTitle(deck.title);
    setDocumentUrl(deck.documentUrl || null);
    if (deck.cards && deck.cards.length > 0) {
      setCards(deck.cards.map((c: any) => ({
        question: c.question,
        answer: c.answer,
      })));
    } else {
      setCards([{ question: "", answer: "" }]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleDeleteClick = (deck: any) => {
    setDeletingDeck({ id: deck.id, title: deck.title || "Deck" });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteDeck = async () => {
    if (!deletingDeck) return;
    setIsDeleting(true);
    try {
      const data = await fetchGAS("deleteFlashcardDeck", { id: deletingDeck.id });
      if (data && data.success) {
        toast.success("Deck deleted successfully");
        setDeleteDialogOpen(false);
        setDeletingDeck(null);
        fetchDecks();
        if (editingDeckId === deletingDeck.id) handleCancelEdit();
      } else {
        toast.error("Failed to delete deck");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleCancelEdit = () => {
    setEditingDeckId(null);
    setTitle("");
    setDocumentUrl(null);
    setSelectedSubtopicId("");
    setCards([{ question: "", answer: "" }]);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedModuleId || !title) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    const validCards = cards.filter(c => c.question.trim() !== "" && c.answer.trim() !== "");
    if (validCards.length === 0) {
      toast.error("At least one valid flashcard is required.");
      setLoading(false);
      return;
    }
    try {
      const data = await fetchGAS("saveFlashcardDeck", {
        id: editingDeckId,
        subjectId,
        moduleId: selectedModuleId,
        subtopicId: selectedSubtopicId || null,
        title,
        documentUrl,
        cards: validCards
      });
      if (data && data.success) {
        toast.success(editingDeckId ? "Deck updated successfully!" : "Deck created successfully!");
        handleCancelEdit();
        fetchDecks();
      } else {
        toast.error(data.error || "Failed to save deck");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <Layers className="w-8 h-8 mr-3 text-primary" />
          Manage Flashcards
        </h1>
        <p className="text-zinc-500 mt-1">Create interactive flashcard decks manually or upload document materials.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-xl text-zinc-900">
                {editingDeckId ? "Edit Flashcard Deck" : "Flashcard Deck Builder"}
              </CardTitle>
              <CardDescription>
                {editingDeckId ? "Modify details and cards for this deck." : "Enter details and write individual flashcards."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Target Module *</label>
                    <select
                      required
                      value={selectedModuleId}
                      onChange={(e) => {
                        setSelectedModuleId(e.target.value);
                        setSelectedSubtopicId("");
                      }}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:border-primary"
                    >
                      <option value="">Select a Module</option>
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          M{m.moduleNo} - {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Target Subtopic (Optional)</label>
                    <select
                      disabled={!selectedModuleId}
                      value={selectedSubtopicId}
                      onChange={(e) => setSelectedSubtopicId(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white text-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-400 focus:outline-none focus:border-primary"
                    >
                      <option value="">Map to entire module</option>
                      {getSubtopicsForSelectedModule().map((st: any) => (
                        <option key={st.id} value={st.subtopicNo}>
                          {st.subtopicNo} - {st.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Deck Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design Patterns Terminology"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="border-t border-zinc-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-zinc-900">Flashcards</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCardField}
                      className="border-primary text-primary hover:bg-primary/5 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" /> <span>Add Card</span>
                    </Button>
                  </div>
                  <div className="mb-6 p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 relative group">
                    <h4 className="font-bold text-sm text-zinc-800 flex items-center">
                      <FileUp className="w-4 h-4 mr-2 text-primary" /> Import Cards from DOCX or CSV
                    </h4>
                    {documentUrl && (
                      <p className="text-xs text-green-600 font-semibold mb-2">
                        Document uploaded and attached successfully.
                      </p>
                    )}
                    <p className="text-xs text-zinc-500">Upload a Word Document or CSV file to extract cards.<br/>DOCX Format: Question Text\nAnswer: Answer text<br/>CSV Format: Front,Back columns</p>
                    
                    <div className="border-2 border-dashed border-zinc-300 rounded-lg p-4 flex flex-col items-center justify-center bg-white hover:bg-zinc-50 transition-colors relative cursor-pointer">
                      <input
                        type="file"
                        accept=".docx,.csv"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={loading}
                      />
                      <FileUp className="w-8 h-8 text-zinc-400 group-hover:text-primary transition-colors mb-2" />
                      <span className="font-semibold text-zinc-700 text-xs">
                        Click or Drag .docx or .csv File here to Upload
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {cards.map((c, index) => (
                      <div key={index} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl relative space-y-4">
                        {cards.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCardField(index)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-primary transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        <div className="flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4 text-primary" />
                          <h4 className="font-bold text-zinc-800 text-sm">Card #{index + 1}</h4>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Question (Front) *</label>
                          <textarea
                            required
                            rows={2}
                            placeholder="e.g. What is Fitts' Law?"
                            value={c.question}
                            onChange={(e) => handleCardChange(index, "question", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Answer (Back) *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="e.g. Fitts' Law predicts that the time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target."
                            value={c.answer}
                            onChange={(e) => handleCardChange(index, "answer", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  {editingDeckId && (
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      variant="outline"
                      className="w-full border-zinc-300 text-zinc-700 font-bold h-11"
                    >
                      Cancel Edit
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 shadow-md transition-colors"
                  >
                    {loading ? (editingDeckId ? "Updating..." : "Creating...") : (editingDeckId ? "Update Deck" : "Create Deck")}
                  </Button>
                </div>
                <p className="text-xs text-zinc-500 text-center mt-3">
                  Note: The changes will not be visible on the student dashboard until the "Publish to Student Dashboard" button is clicked.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-zinc-900">Current Decks</h3>
          </div>
          <div className="space-y-3">
            {decks.length > 0 ? (
              <>
                {(showAllDecks ? decks : decks.slice(0, 5)).map((deck) => (
                <Card key={deck.id} className="border-zinc-200 shadow-sm p-0 gap-0 overflow-hidden">
                  <CardHeader className="p-4 bg-zinc-50 border-b border-zinc-100 flex flex-col space-y-1">
                    <CardTitle className="text-sm font-bold text-zinc-900 mt-1">{deck.title}</CardTitle>
                    <p className="text-[10px] text-zinc-500">Module: {deck.module?.title}</p>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-xs text-zinc-600">
                    <div className="flex justify-between items-center text-zinc-500 font-medium">
                      <span>Cards: {deck.cards?.length || 0}</span>
                    </div>
                  </CardContent>
                  <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(deck)} className="h-8 text-xs">
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteClick(deck)} className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
              {decks.length > 5 && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => setShowAllDecks(!showAllDecks)}
                >
                  {showAllDecks ? "Show Less" : `View All ${decks.length} Decks`}
                </Button>
              )}
            </>
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-6">No flashcard decks created yet.</p>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDeleteDeck}
        title={deletingDeck ? `Delete ${deletingDeck.title}?` : "Delete Deck?"}
        message="This action will permanently delete this item and cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}