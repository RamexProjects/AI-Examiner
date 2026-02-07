// components/QuizConfig.tsx
'use client'

import { useState } from 'react';
import { QuizSettings, Difficulty, QuestionType } from '@/types';

interface QuizConfigProps {
  onStart: (settings: QuizSettings) => void;
  isLoading: boolean;
}

type Tab = 'Standard' | 'Survival';

export default function QuizConfig({ onStart, isLoading }: QuizConfigProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Standard');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [type, setType] = useState<QuestionType>('Multiple Choice');

  // Logic to disable button if fields are missing
  const isFormValid = () => {
    if (!topic.trim()) return false;
    
    // In Standard, we need everything. In Survival, we only need Topic & Difficulty.
    // (Since Dropdowns always have a value selected by default, we mostly check Topic)
    return true; 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    onStart({
      topic,
      difficulty,
      type: activeTab === 'Survival' ? 'Mixed' : type, // Survival uses 'Mixed' type backend logic
      mode: activeTab
    });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      
      {/* 1. Mode Toggles (Tabs) */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('Standard')}
          className={`flex-1 py-4 cursor-pointer text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'Standard' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
        >
          Standard
        </button>
        <button
          onClick={() => setActiveTab('Survival')}
          className={`flex-1 py-4 cursor-pointer text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'Survival' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
        >
          💀 Survival
        </button>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'Standard' ? 'Quiz Setup' : 'Survival Mode'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {activeTab === 'Standard' 
              ? 'Customize your quiz settings below.' 
              : 'One wrong answer and it is Game Over.'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Topic Input (Always Visible) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Topic</label>
            <input
              type="text"
              required
              placeholder={activeTab === 'Survival' ? "e.g., React basics..." : "e.g., JavaScript Basics..."}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-blue-50 transition-all text-black font-medium"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Difficulty (Always Visible) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white text-black font-medium outline-none focus:border-blue-500 cursor-pointer"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            {/* Question Type (HIDDEN IN SURVIVAL) */}
            {activeTab === 'Standard' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Question Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as QuestionType)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white text-black font-medium outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True / False</option>
                  <option value="Short Answer">Short Answer</option>
                </select>
              </div>
            )}
          </div>

          {/* Dynamic Start Button */}
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
              ? 'Generating...' 
              : activeTab === 'Survival' ? 'Start Survival Run' : 'Start Standard Quiz'
            }
          </button>
        </form>
      </div>
    </div>
  );
}