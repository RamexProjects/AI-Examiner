'use client'

import { Question, QuestionType } from '@/types';

interface ValuationPageProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  onRestart: () => void;
  isSurvival?: boolean;
}

const decodeHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
};

// --- HELPER: Context-Aware Matcher ---
const isAnswerCorrect = (userAns: string, correctAns: string, type: QuestionType) => {
  if (!userAns || !correctAns) return false;
  
  const cleanUser = decodeHtml(userAns).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanCorrect = decodeHtml(correctAns).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  
  if (type !== 'Short Answer') {
     return cleanUser === cleanCorrect; // Strict for MC
  }

  // Fuzzy for Short Answer
  if (cleanUser === cleanCorrect) return true;
  if (cleanUser.length > 2 && cleanCorrect.includes(cleanUser)) return true;
  if (cleanCorrect.length > 2 && cleanUser.includes(cleanCorrect)) return true;
  
  return false;
};

export default function ValuationPage({ questions, userAnswers, onRestart, isSurvival }: ValuationPageProps) {
  
  const attemptedQuestions = questions.filter((q) => userAnswers[q.id] !== undefined);
  let score = 0;
  
  const results = attemptedQuestions.map((q) => {
    const userAnswer = userAnswers[q.id];
    // 👇 PASS QUESTION TYPE HERE
    const isCorrect = isAnswerCorrect(userAnswer, q.correctAnswer, q.type);
    if (isCorrect) score++;
    return { ...q, userAnswer, isCorrect };
  });

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-2xl shadow-xl my-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      <div className="text-center mb-10 border-b pb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isSurvival 
             ? (score === questions.length ? "Mission Accomplished!" : "Survival Run Ended") 
             : "Quiz Results"
          }
        </h1>
        
        {isSurvival ? (
           <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-6xl font-black text-red-600">{score}</span>
              <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Levels Cleared</span>
           </div>
        ) : (
           <div className={`text-6xl font-black mb-4 ${percentage >= 70 ? 'text-green-600' : 'text-red-500'}`}>
             {percentage}%
           </div>
        )}
        
        <p className="text-gray-500 text-lg">
          {isSurvival 
            ? `You made it to question ${attemptedQuestions.length}.`
            : `You scored ${score} out of ${questions.length}`
          }
        </p>
      </div>

      <div className="space-y-8">
        {results.map((item, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-xl border-l-8 shadow-sm ${item.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                <span className="mr-2 text-gray-500">#{index + 1}</span> 
                {decodeHtml(item.question)}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {item.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div className="bg-white p-3 rounded border">
                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Your Answer</span>
                <span className={item.isCorrect ? 'text-green-700 font-medium' : 'text-red-600 font-medium line-through'}>
                  {decodeHtml(item.userAnswer)}
                </span>
              </div>
              
              {!item.isCorrect && (
                <div className="bg-white p-3 rounded border border-green-200">
                  <span className="block text-green-600 text-xs uppercase font-bold mb-1">Correct Answer</span>
                  <span className="text-gray-800 font-bold">{decodeHtml(item.correctAnswer || "Not Available")}</span>
                </div>
              )}
            </div>

            <div className="text-gray-600 text-sm italic border-t pt-3 mt-3">
              <span className="font-semibold not-italic text-gray-500 mr-2">Explanation:</span>
              {decodeHtml(item.explanation || "No explanation provided.")}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
        >
          {isSurvival ? 'Try Again' : 'Start New Quiz'}
        </button>
      </div>
    </div>
  );
}