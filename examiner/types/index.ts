// types/index.ts
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'True/False' | 'Multiple Choice' | 'Short Answer' | 'Mixed';

export interface Question {
  id: number;
  question: string;
  options?: string[]; // Array of strings for MC/TF
  correctAnswer: string; // The EXACT string match
  explanation: string;
  type: QuestionType;
}

export interface QuizSettings {
  topic: string;
  difficulty: Difficulty;
  type: QuestionType;
  mode: 'Standard' | 'Survival';
  language: 'en' | 'am';
}