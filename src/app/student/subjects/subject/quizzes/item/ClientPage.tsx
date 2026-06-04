"use client";
import { useEffect, useState, use } from "react";
import { fetchGAS } from "@/lib/apiClient";
import { QuizContainer } from "./QuizContainer";
import { module1Quizzes } from "@/data/module1QuizData";
import { module2Quizzes } from "@/data/module2QuizData";
import { LocalQuizWrapper } from "./LocalQuizWrapper";
import { useSearchParams } from "next/navigation";
export default function QuizDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Intercept local quizzes first
    if (id in module1Quizzes || id in module2Quizzes) {
      setLoading(false);
      return;
    }
    const loadQuiz = async () => {
      try {
        const result = await fetchGAS("getQuiz", { quizId: id });
        if (result && !result.error) {
          setQuiz(result);
        }
      } catch (err) {
        console.error("Failed to load quiz", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [id]);
  if (id in module1Quizzes) {
    return <LocalQuizWrapper quiz={module1Quizzes[id as keyof typeof module1Quizzes]} />;
  }
  if (id in module2Quizzes) {
    return <LocalQuizWrapper quiz={module2Quizzes[id as keyof typeof module2Quizzes]} />;
  }
  if (loading) return <div className="p-8 text-center">Loading quiz...</div>;
  if (!quiz) return <div className="p-8 text-center text-red-500">Quiz not found.</div>;
  // Shuffle questions randomly
  const rawQuestions = quiz.questions || [];
  const shuffledQuestions = [...rawQuestions].sort(() => Math.random() - 0.5);
  
  // Slice to totalQuestionsToAsk if defined
  const displayQuestions = quiz.totalQuestionsToAsk 
    ? shuffledQuestions.slice(0, quiz.totalQuestionsToAsk)
    : shuffledQuestions;
  // Cast type to match QuizContainer expectations
  const typedQuiz = {
    id: quiz.id,
    moduleId: quiz.moduleId,
    title: quiz.title,
    difficulty: quiz.difficulty || 'medium',
    timeLimit: quiz.timeLimit || 15,
    xpReward: quiz.xpReward || 0,
    questions: displayQuestions.map((q: any) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks,
    })),
    module: {
      moduleNo: quiz.module?.moduleNo || "?",
    }
  };
  return <QuizContainer quiz={typedQuiz} />;
}