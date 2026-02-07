// src/types/index.ts

export type Difficulty = 'Easy' | 'Intermediate' | 'Hard';
export type QuestionType = 'True/False' | 'Multiple Choice' | 'Short Answer';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[]; // Only for Multiple Choice
  correctAnswer: string;
}

// This tells React Navigation what data to pass to each screen
export type RootStackParamList = {
  Home: undefined;
  Quiz: {
    topic: string;
    difficulty: Difficulty;
    questionType: QuestionType;
  };
  Result: {
    score: number;
    total: number;
  };
};