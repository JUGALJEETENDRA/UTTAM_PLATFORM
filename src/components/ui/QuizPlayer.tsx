"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizPlayerProps {
  questions: QuizQuestion[];
  originalFileUrl?: string;
}

export default function QuizPlayer({ questions, originalFileUrl }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([]);

  // Initialize and reshuffle 5 questions
  const reshuffle = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 5));
    setAnswers({});
    setSubmitted(false);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      reshuffle();
    }, 0);
    return () => clearTimeout(timer);
  }, [questions]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    // Only submit if all selected questions are answered
    if (Object.keys(answers).length < selectedQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
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
      <ul>
        ${q.options.map((opt, j) => `<li>${opt} ${j === q.correctIndex ? '(Correct Answer)' : ''}</li>`).join('')}
      </ul>
      <p><strong>Explanation:</strong> ${q.explanation}</p>
    `
      )
      .join("<hr/>");

    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Quiz Document</title></head>
      <body>
        <h1>Quiz Document</h1>
        ${content}
      </body>
    </html>`;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const score = selectedQuestions.reduce((acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0), 0);
  const total = selectedQuestions.length;

  if (selectedQuestions.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 mb-6">
        <h3 className="font-semibold mb-1">Knowledge Check</h3>
        <p className="text-sm">Answer the following questions to complete this topic.</p>
      </div>

      {selectedQuestions.map((q, idx) => {
        const isCorrect = answers[q.id] === q.correctIndex;
        const hasAnswered = answers[q.id] !== undefined;

        return (
          <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <p className="font-semibold text-gray-900 mb-4">
              <span className="text-gray-400 mr-2">{idx + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[q.id] === optIdx;
                let optionStyle = "border-gray-200 hover:border-red-300 hover:bg-white";
                
                if (submitted) {
                  if (optIdx === q.correctIndex) {
                    optionStyle = "border-green-400 bg-green-50";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-red-400 bg-red-50";
                  } else {
                    optionStyle = "border-gray-200 opacity-50";
                  }
                } else if (isSelected) {
                  optionStyle = "border-red-500 bg-red-50";
                }

                return (
                  <label
                    key={optIdx}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${optionStyle}`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={optIdx}
                      checked={isSelected}
                      onChange={() => handleSelect(q.id, optIdx)}
                      disabled={submitted}
                      className="accent-red-600 w-4 h-4"
                    />
                    <span className="text-gray-700 text-sm">{opt}</span>
                    {submitted && optIdx === q.correctIndex && (
                      <span className="ml-auto text-green-600 text-sm font-semibold">✓ Correct</span>
                    )}
                    {submitted && isSelected && !isCorrect && (
                      <span className="ml-auto text-red-600 text-sm font-semibold">✗ Incorrect</span>
                    )}
                  </label>
                );
              })}
            </div>
            
            {submitted && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
                <strong>Explanation: </strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-sm"
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <p className="text-lg text-gray-600 mb-6">
            You scored <span className="font-bold text-red-600">{score}</span> out of {total}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={reshuffle}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition flex items-center gap-2"
            >
              ↻ Reshuffle & Retake
            </button>
            <button
              onClick={handleDownloadDoc}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-sm"
            >
              Download Word Doc
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
