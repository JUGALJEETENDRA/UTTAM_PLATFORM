"use client";

import { useState, useEffect } from "react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface FlashcardPlayerProps {
  questions: QuizQuestion[];
  originalFileUrl?: string;
}

export default function FlashcardPlayer({ questions, originalFileUrl }: FlashcardPlayerProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Initialize and reshuffle
  const reshuffle = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 5)); // Taking 5 at a time, similar to quiz
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  
  useEffect(() => {
    reshuffle();
  }, [questions]);

  const handleNext = () => {
    if (currentIndex < selectedQuestions.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150); // slight delay for smooth flip back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  const handleDownloadDoc = () => {
    if (originalFileUrl) {
      window.open(originalFileUrl, '_blank');
      return;
    }

    const content = selectedQuestions
      .map(
        (q, i) => `
      <h3>${i + 1}. ${q.question}</h3>
      <p><strong>Answer:</strong> ${q.options[q.correctIndex]}</p>
      <p><strong>Explanation:</strong> ${q.explanation}</p>
    `
      )
      .join("<hr/>");

    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Flashcards Document</title></head>
      <body>
        <h1>Flashcards Document</h1>
        ${content}
      </body>
    </html>`;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flashcards.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-amber-50 border border-amber-200 rounded-3xl text-center">
        <h3 className="text-xl font-bold text-amber-900 mb-2">No Flashcards Found</h3>
        <p className="text-amber-700">
          We couldn't find any questions in this topic. If you just uploaded a file, the format might not have been recognized, or you may need to delete and re-upload it now that the format parser is updated.
        </p>
      </div>
    );
  }

  if (!selectedQuestions.length) return null;

  const currentCard = selectedQuestions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Interactive Flashcards</h2>
        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 font-semibold rounded-full text-sm">
          Card {currentIndex + 1} of {selectedQuestions.length}
        </span>
      </div>

      <div className="relative w-full h-[400px] perspective-1000 group">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full h-full cursor-pointer transition-all duration-500 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front of Card */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all text-center">
            <span className="text-indigo-500 font-semibold mb-6 tracking-widest uppercase text-sm border border-indigo-100 px-4 py-1 rounded-full">Question</span>
            <h3 className="text-2xl font-bold text-gray-800 leading-relaxed max-w-2xl">
              {currentCard.question}
            </h3>
            <p className="absolute bottom-8 text-sm text-gray-400 font-medium animate-pulse">Click to flip</p>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg text-center overflow-y-auto">
            <span className="text-indigo-600 font-semibold mb-6 tracking-widest uppercase text-sm border border-indigo-200 px-4 py-1 rounded-full bg-white">Answer</span>
            <div className="space-y-4 max-w-2xl w-full">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                <p className="text-xl font-bold text-indigo-900">{currentCard.options[currentCard.correctIndex]}</p>
              </div>
              {currentCard.explanation && (
                <div className="bg-white/60 p-6 rounded-2xl border border-indigo-100 text-left">
                  <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Explanation</p>
                  <p className="text-gray-700 leading-relaxed">{currentCard.explanation}</p>
                </div>
              )}
            </div>
            <p className="mt-8 text-sm text-indigo-400 font-medium">Click to flip back</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 transition"
        >
          Previous
        </button>

        <div className="flex gap-3">
          <button onClick={reshuffle} className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-100 transition flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reshuffle
          </button>
          <button onClick={handleDownloadDoc} className="px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Original File
          </button>
        </div>

        <button 
          onClick={handleNext} 
          disabled={currentIndex === selectedQuestions.length - 1}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm hover:shadow-md"
        >
          Next
        </button>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
