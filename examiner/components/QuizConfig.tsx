'use client'

import { useState } from 'react';
import { QuizSettings, Difficulty, QuestionType } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

interface QuizConfigProps {
  onStart: (settings: QuizSettings) => void;
  isLoading: boolean;
}

type Tab = 'Standard' | 'Survival';

export default function QuizConfig({ onStart, isLoading }: QuizConfigProps) {
  const { lang, setLang } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('Standard');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [type, setType] = useState<QuestionType>('Multiple Choice');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    onStart({
      topic,
      difficulty,
      type: activeTab === 'Survival' ? 'Mixed' : type,
      mode: activeTab,
      language: lang,
    });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('Standard')}
          className={`flex-1 py-4 cursor-pointer text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'Standard'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
        >
          {t('standard', lang)}
        </button>
        <button
          onClick={() => setActiveTab('Survival')}
          className={`flex-1 py-4 cursor-pointer text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'Survival'
              ? 'bg-red-600 text-white'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
        >
          {t('survival', lang)}
        </button>
      </div>

      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'Standard' ? t('quizSetup', lang) : t('survivalModeTitle', lang)}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {activeTab === 'Standard'
              ? t('customizeSettings', lang)
              : t('survivalDescription', lang)
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">{t('topicLabel', lang)}</label>
            <input
              type="text"
              required
              placeholder={activeTab === 'Survival' ? t('placeholderSurvival', lang) : t('placeholderStandard', lang)}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-blue-50 transition-all text-black font-medium"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">{t('difficultyLabel', lang)}</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white text-black font-medium outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Easy">{t('easy', lang)}</option>
                <option value="Medium">{t('medium', lang)}</option>
                <option value="Hard">{t('hard', lang)}</option>
              </select>
            </div>

            {activeTab === 'Standard' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">{t('questionTypeLabel', lang)}</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as QuestionType)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white text-black font-medium outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Multiple Choice">{t('multipleChoice', lang)}</option>
                  <option value="True/False">{t('trueFalse', lang)}</option>
                  <option value="Short Answer">{t('shortAnswer', lang)}</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">{t('languageLabel', lang)}</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as 'en' | 'am')}
                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white text-black font-medium outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="en">{t('english', lang)}</option>
                <option value="am">{t('amharic', lang)}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed mt-4 ${
              activeTab === 'Survival'
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
            }`}
          >
            {isLoading
              ? t('generating', lang)
              : activeTab === 'Survival' ? t('startSurvival', lang) : t('startStandard', lang)
            }
          </button>
        </form>
      </div>
    </div>
  );
}
