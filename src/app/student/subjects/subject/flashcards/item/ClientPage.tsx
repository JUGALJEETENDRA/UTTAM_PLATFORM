"use client";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { FlashcardViewer } from "@/components/student/FlashcardViewer";
import { useEffect, useState, use } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { redirect, useSearchParams } from "next/navigation";
export default function FlashcardDeckPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
  const id = searchParams.get('id') || '';
    const [deck, setDeck] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (status === "unauthenticated") redirect("/sign-in");
    if (status === "authenticated" && session?.user) {
      const loadDeck = async () => {
        try {
          const result = await fetchGAS("getFlashcardDeck", { deckId: id });
          if (result && !result.error) {
            setDeck(result);
          }
        } catch (err) {
          console.error("Failed to load flashcard deck", err);
        } finally {
          setLoading(false);
        }
      };
      loadDeck();
    }
  }, [id, status, session]);
  if (status === "loading" || loading) return <div className="p-8 text-center">Loading flashcard deck...</div>;
  if (!deck) return <div className="p-8 text-center text-red-500">Deck not found.</div>;
  const isInitiallyCompleted = false; // Mocked for now, progress removed
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`} className="text-xs font-semibold text-zinc-500 hover:text-primary flex items-center mb-2 transition-colors w-fit">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Flashcards
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mr-3">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900">{deck.title}</h1>
                <p className="text-xs text-zinc-500 font-medium">Module {deck.module?.moduleNo || "?"} • {deck.cards?.length || 0} Cards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl flex items-center justify-center">
        <FlashcardViewer 
          cards={deck.cards || []} 
          deckId={deck.id}
          moduleId={deck.moduleId}
          subtopicId={deck.subtopicId}
          subjectId={subjectId}
          isInitiallyCompleted={isInitiallyCompleted}
        />
      </div>
    </div>
  );
}