'use client'

import { Question } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { decodeHtml, isAnswerCorrect, QUIZ_CONSTANTS } from '@/lib/utils';

interface ValuationPageProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  onRestart: () => void;
  isSurvival?: boolean;
}

export default function ValuationPage({ questions, userAnswers, onRestart, isSurvival }: ValuationPageProps) {
  const { lang } = useLanguage();

  const attemptedQuestions = questions.filter((q) => userAnswers[q.id] !== undefined);
  let score = 0;

  const results = attemptedQuestions.map((q) => {
    const userAnswer = userAnswers[q.id];
    const correct = isAnswerCorrect(userAnswer, q.correctAnswer, q.type);
    if (correct) score++;
    return { ...q, userAnswer, isCorrect: correct };
  });

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-2xl shadow-xl my-10">

      <div className="text-center mb-10 border-b pb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isSurvival
             ? (score === questions.length ? t('missionAccomplished', lang) : t('survivalRunEnded', lang))
             : t('quizResults', lang)
          }
        </h1>

        {isSurvival ? (
           <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-6xl font-black text-red-600">{score}</span>
              <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">{t('levelsCleared', lang)}</span>
           </div>
        ) : (
           <div className={`text-6xl font-black mb-4 ${percentage >= QUIZ_CONSTANTS.PASSING_PERCENTAGE ? 'text-green-600' : 'text-red-500'}`}>
             {percentage}%
           </div>
        )}

        <p className="text-gray-500 text-lg">
          {isSurvival
            ? `${t('madeItTo', lang)} ${attemptedQuestions.length}.`
            : `${t('scored', lang)} ${score} ${t('outOf', lang)} ${questions.length}`
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
                {item.isCorrect ? t('correctLabel', lang) : t('incorrect', lang)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div className="bg-white p-3 rounded border">
                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">{t('yourAnswer', lang)}</span>
                <span className={item.isCorrect ? 'text-green-700 font-medium' : 'text-red-600 font-medium line-through'}>
                  {decodeHtml(item.userAnswer)}
                </span>
              </div>

              {!item.isCorrect && (
                <div className="bg-white p-3 rounded border border-green-200">
                  <span className="block text-green-600 text-xs uppercase font-bold mb-1">{t('correctAnswer', lang)}</span>
                  <span className="text-gray-800 font-bold">{decodeHtml(item.correctAnswer || t('notAvailable', lang))}</span>
                </div>
              )}
            </div>

            <div className="text-gray-600 text-sm italic border-t pt-3 mt-3">
              <span className="font-semibold not-italic text-gray-500 mr-2">{t('explanation', lang)}</span>
              {decodeHtml(item.explanation || t('noExplanation', lang))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
        >
          {isSurvival ? t('tryAgain', lang) : t('startNewQuiz', lang)}
        </button>
      </div>
    </div>
  );
}
