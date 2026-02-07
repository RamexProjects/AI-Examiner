'use client'

import { useState } from 'react';
import { generateQuiz } from './actions/generateQuiz'; 
import QuizConfig from '@/components/QuizConfig';
import QuizGame from '@/components/QuizGame';
import ValuationPage from '@/components/ValuationPage';
import QuizSkeleton from '@/components/QuizSkeleton';
import ResultSkeleton from '@/components/ResultSkeleton';
import { Question, QuizSettings } from '@/types';

type ErrorType = 'OVERLOADED' | 'GENERIC' | null;
type GameMode = 'Standard' | 'Survival';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gameFinished, setGameFinished] = useState(false); 
  const [errorType, setErrorType] = useState<ErrorType>(null);
  
  const [mode, setMode] = useState<GameMode>('Standard'); 
  const [difficulty, setDifficulty] = useState<string>('Easy');

  const handleStartQuiz = async (settings: QuizSettings) => {
    setIsGenerating(true);
    setErrorType(null);
    setMode(settings.mode); 
    setDifficulty(settings.difficulty); 

    try {
      const generatedQuestions = await generateQuiz(settings);
      setQuestions(generatedQuestions);
      setGameFinished(false);
      setUserAnswers({});
    } catch (err: any) {
      console.error("Quiz Generation Failed:", err);
      if (err.message.includes('OVERLOADED') || err.message.includes('503')) {
        setErrorType('OVERLOADED');
      } else {
        setErrorType('GENERIC');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinishQuiz = (answers: Record<number, string>) => {
    setUserAnswers(answers);
    setIsGrading(true); 
    setTimeout(() => {
      setIsGrading(false);
      setGameFinished(true); 
    }, 2000);
  };

  const handleRestart = () => {
    setQuestions([]);
    setUserAnswers({});
    setGameFinished(false);
    setErrorType(null);
    setMode('Standard');
    setDifficulty('Easy');
  };

  if (errorType) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center border border-red-100">
          {errorType === 'OVERLOADED' ? (
            <>
              <div className="text-6xl mb-4">🐢</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">AI is Overloaded</h2>
              <p className="text-gray-600 mb-6">Too many people are generating quizzes right now.</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
              <p className="text-gray-600 mb-6">We couldn't generate the quiz.</p>
            </>
          )}
          <button 
             onClick={() => setErrorType(null)} 
             className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            Back
          </button>
        </div>
      </main>
    );
  }

  if (isGenerating) return <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><QuizSkeleton /></main>;
  if (isGrading) return <main className="min-h-screen bg-gray-50 flex justify-center p-4"><ResultSkeleton /></main>;
  if (gameFinished) return <main className="min-h-screen bg-gray-50 flex justify-center p-4"><ValuationPage questions={questions} userAnswers={userAnswers} onRestart={handleRestart} isSurvival={mode === 'Survival'} /></main>;
  if (questions.length > 0) return <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><QuizGame questions={questions} onFinish={handleFinishQuiz} isSurvival={mode === 'Survival'} difficulty={difficulty} /></main>;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <QuizConfig onStart={handleStartQuiz} isLoading={isGenerating} />
    </main>
  );
}