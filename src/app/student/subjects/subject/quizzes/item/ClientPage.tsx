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
    if (id in module1Quizzes) {
      setLoading(false);
      return;
    }
    if (id in module2Quizzes) {
      setLoading(false);
      return;
    }

    const loadQuiz = async () => {
      try {
        const result = await fetchGAS("getQuiz", { quizId: id });
        if (result && !result.error) {
          setQuiz(result);
        } else {
          throw new Error("Quiz not found or returned error");
        }
      } catch (err) {
        console.warn("Failed to load quiz from GAS, using fallback mock quiz", err);
        // Fallback for generated quizzes if GAS backend getQuiz is missing/failing
        setQuiz({
          id: id,
          title: "Auto-generated Quiz",
          timeLimit: 10,
          difficulty: "medium",
          xpReward: 50,
          questions: [
            { id: 1, questionText: "This is a placeholder question for your generated module.", options: ["Option A", "Option B", "Option C", "Option D"], marks: 10, correctAnswer: "A", explanation: "GAS backend is currently failing to return this quiz." },
            { id: 2, questionText: "Did the backend successfully return the quiz?", options: ["Yes", "No", "Maybe", "I don't know"], marks: 10, correctAnswer: "B", explanation: "It threw an HTML error, so we fell back to this mock." }
          ],
          module: { moduleNo: 1 }
        });
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
    moduleId: quiz.moduleId || "unknown",
    title: quiz.title,
    difficulty: quiz.difficulty || 'medium',
    timeLimit: quiz.timeLimit || 15,
    xpReward: quiz.xpReward || 50,
    questions: displayQuestions.map((q: any, index: number) => {
      // Map optionA, optionB, etc from GAS payload if the 'options' array is missing
      const optionsArray = q.options && q.options.length > 0 
        ? q.options 
        : [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean);
        
      return {
        id: q.id || `q_${index}`,
        questionText: q.questionText,
        options: optionsArray,
        marks: q.marks || 10,
        correctAnswer: q.correctAnswer || "A", // Default if missing
        explanation: q.explanation || "No explanation provided.",
      };
    }),
    module: {
      moduleNo: quiz.module?.moduleNo || 1,
    }
  };

  return <QuizContainer quiz={typedQuiz} />;
}