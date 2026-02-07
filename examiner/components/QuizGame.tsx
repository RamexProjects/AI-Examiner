'use client'

import { useState, useEffect } from 'react';
import { Question, QuestionType } from '@/types';

interface QuizGameProps {
  questions: Question[];
  onFinish: (userAnswers: Record<number, string>) => void;
  isSurvival?: boolean;
  difficulty: string;
}

// --- HELPER 1: Decode HTML ---
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

// --- HELPER 2: Context-Aware Answer Checker ---
const isAnswerCorrect = (userAns: string, correctAns: string, type: QuestionType) => {
  if (!userAns || !correctAns) return false;
  
  const cleanUser = decodeHtml(userAns).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanCorrect = decodeHtml(correctAns).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // 1. For Multiple Choice / True/False: STRICT MATCH ONLY
  if (type !== 'Short Answer') {
    return cleanUser === cleanCorrect;
  }

  // 2. For Short Answer: FUZZY MATCH ALLOWED
  // Direct match
  if (cleanUser === cleanCorrect) return true;
  // Contains match (e.g. "React" inside "React.js")
  if (cleanUser.length > 2 && cleanCorrect.includes(cleanUser)) return true;
  if (cleanCorrect.length > 2 && cleanUser.includes(cleanCorrect)) return true; // Swap check for safety

  return false;
};

export default function QuizGame({ questions, onFinish, isSurvival = false, difficulty }: QuizGameProps) {
  const getBaseTime = () => {
    if (difficulty === 'Hard') return 25;
    if (difficulty === 'Medium') return 20;
    return 15; 
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(getBaseTime()); 
  const [streak, setStreak] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false); 
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [textInput, setTextInput] = useState(""); 

  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isShortAnswer = question.type === 'Short Answer';

  // Timer
  useEffect(() => {
    if (isAnswered || isShortAnswer) return;
    if (timeLeft === 0) {
      handleAnswerSubmit(""); 
      return;
    }
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isShortAnswer]); 

  // Shake Reset
  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  const handleAnswerSubmit = (answer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(answer);

    const newAnswers = { ...userAnswers, [question.id]: answer };
    setUserAnswers(newAnswers);

    // 👇 PASS QUESTION TYPE HERE
    const isCorrect = isAnswerCorrect(answer, question.correctAnswer, question.type);

    if (isCorrect) {
      setStreak((p) => p + 1);
    } else {
      setStreak(0);
      setIsShaking(true);
      if (isSurvival) {
        setTimeout(() => { onFinish(newAnswers); }, 1500);
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onFinish(userAnswers);
    } else {
      setCurrentIndex((p) => p + 1);
      setTimeLeft(getBaseTime()); 
      setIsAnswered(false);
      setSelectedOption(null);
      setTextInput("");
      setIsShaking(false);
    }
  };

  const getOptionClass = (option: string) => {
    const baseClass = "w-full p-4 md:p-6 rounded-xl border-2 text-left transition-all font-medium text-lg relative overflow-hidden text-gray-800 ";
    if (!isAnswered) return baseClass + "border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer active:scale-95";
    
    // 👇 PASS QUESTION TYPE HERE TOO
    const isThisCorrect = isAnswerCorrect(option, question.correctAnswer, question.type);
    const isSelected = option === selectedOption;
    
    if (isThisCorrect) return baseClass + "bg-green-100 border-green-500 text-green-900 shadow-md"; 
    if (isSelected && !isThisCorrect) return baseClass + "bg-red-100 border-red-500 text-red-900 opacity-80"; 
    return baseClass + "border-gray-100 text-gray-400 opacity-50 cursor-not-allowed";
  };

  // ... (JSX Return remains the same, just verifying the Result feedback area below)

  const isCurrentCorrect = isAnswerCorrect(selectedOption || "", question.correctAnswer, question.type);

  return (
    <div className={`w-full max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-transform ${isShaking ? 'animate-shake' : ''}`}>
      
      {/* ... Top Bar, Timer, Question Text (No Changes) ... */}
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
          <span className="text-2xl animate-bounce">🔥</span>
          <span className={`text-xl font-black ${streak > 2 ? 'text-orange-600' : 'text-gray-400'}`}>
            {streak}
          </span>
        </div>
        {!isShortAnswer && (
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold text-xl ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {!isShortAnswer && (
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gray-100">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${(timeLeft / getBaseTime()) * 100}%` }} 
          />
        </div>
      )}

      {/* Question */}
      <div className="mb-8 mt-2">
        <div className="flex justify-between items-center mb-2">
           <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
             Question {currentIndex + 1} / {questions.length}
           </span>
           {isSurvival && (
             <span className="text-xs font-black text-red-600 bg-red-100 px-2 py-1 rounded uppercase tracking-wider">Survival Mode</span>
           )}
           {isShortAnswer && (
             <span className="text-xs font-black text-purple-600 bg-purple-100 px-2 py-1 rounded uppercase tracking-wider">Untimed</span>
           )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
          {decodeHtml(question.question)}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {isShortAnswer ? (
          <div className="flex flex-col gap-4">
             <input
              type="text"
              disabled={isAnswered}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 text-lg transition-all text-gray-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && textInput) handleAnswerSubmit(textInput);
              }}
             />
             <button 
               onClick={() => handleAnswerSubmit(textInput)}
               disabled={!textInput || isAnswered}
               className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all"
             >
               Submit Answer
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
             {question.options?.map((option, idx) => (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswerSubmit(option)}
                className={getOptionClass(option)}
              >
                <div className="flex justify-between items-center">
                   <span>{decodeHtml(option)}</span>
                   {isAnswered && isAnswerCorrect(option, question.correctAnswer, question.type) && <span className="text-xl">✅</span>}
                   {isAnswered && option === selectedOption && !isAnswerCorrect(option, question.correctAnswer, question.type) && <span className="text-xl">❌</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feedback & Next */}
      {isAnswered && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 border-t pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-bold uppercase mb-1">Result</p>
              <div className={`text-xl font-black ${isCurrentCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCurrentCorrect ? "Correct! 🎉" : "Wrong! 😬"}
              </div>
            </div>
            
            {(!isSurvival || (isSurvival && isCurrentCorrect)) && (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-transform hover:-translate-y-1 shadow-lg flex items-center gap-2"
              >
                {isLastQuestion ? 'Finish' : 'Next'} <span className="text-xl">➜</span>
              </button>
            )}
            
            {isSurvival && !isCurrentCorrect && (
              <div className="text-red-600 font-bold animate-pulse">GAME OVER...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}