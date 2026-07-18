"use client";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { FlashcardViewer } from "@/components/student/FlashcardViewer";
import ResourceHeader from "@/components/ui/ResourceHeader";
import { useEffect, useState } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { useSearchParams } from "next/navigation";

const getFlashcardDisplayTitle = (deck: any, modules: any[] = []) => {
  if (!deck) return "";
  const titleStr = String(deck.title || "").trim();
  const isNumeric = /^\d+(\.\d+)?$/.test(titleStr);
  
  if (isNumeric) {
    const module = deck.module || (Array.isArray(modules) && modules.find((m: any) => m.id === deck.moduleId || m.moduleNo === parseInt(titleStr.split(".")[0], 10)));
    if (module) {
      const parts = titleStr.split(".");
      const subNo = parts.length === 2 ? parseInt(parts[1], 10) : (deck.subtopicId || 1);
      const subtopic = (module.subtopics || []).find((st: any) => st.subtopicNo === subNo || st.order === subNo);
      if (subtopic && subtopic.title) {
        return subtopic.title;
      }
    }
  }
  return deck.title;
};

export default function FlashcardDeckPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
  const id = searchParams.get('id') || '';
  const moduleId = searchParams.get('moduleId') || '';
  const subtopicId = searchParams.get('subtopicId') || '';

  const [deck, setDeck] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const [result, mods] = await Promise.all([
          fetchGAS("getFlashcardDeck", { deckId: id }),
          fetchGAS("getModules", { subjectId })
        ]);
        if (result && !result.error) {
          setDeck(result);
        }
        if (Array.isArray(mods)) {
          setModules(mods);
        }
      } catch (err) {
        console.error("Failed to load flashcard deck", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadDeck();
  }, [id, subjectId]);

  if (loading) return <div className="p-8 text-center">Loading flashcard deck...</div>;
  if (!deck) return <div className="p-8 text-center text-red-500">Deck not found.</div>;

  const backHref = (subjectId && moduleId)
    ? `/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${moduleId}${subtopicId ? `#subtopic-${subtopicId}` : ''}`
    : `/student/subjects/subject/flashcards?subjectId=${subjectId}`;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href={backHref} className="text-xs font-semibold text-zinc-500 hover:text-primary flex items-center mb-2 transition-colors w-fit">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {moduleId ? "Back to Subtopic" : "Back to Flashcards"}
          </Link>
          <div className="flex items-center justify-between mt-2">
            <ResourceHeader 
              type="flashcards" 
              title={getFlashcardDisplayTitle(deck, modules)} 
              subtitle={`Module ${deck.module?.moduleNo || "?"} • ${deck.cards?.length || 0} Cards`} 
            />
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl flex items-center justify-center">
        <FlashcardViewer cards={deck.cards || []} />
      </div>
    </div>
  );
}