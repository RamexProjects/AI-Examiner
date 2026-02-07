// app/actions/generateQuiz.ts
'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Question, QuizSettings } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateQuiz(settings: QuizSettings): Promise<Question[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    let prompt = "";

    const commonRules = `
      output strictly valid JSON array of objects.
      Keys must be: "id", "question", "options", "correctAnswer", "explanation", "type".
      IMPORTANT: "correctAnswer" MUST be the EXACT string text from the "options" array. Do NOT return "A", "B", "1", or the index.
      Example: If options are ["Red", "Blue"], correctAnswer must be "Red", NOT "A".
      For "Short Answer", ensure the answer is simple (1-3 words max) to allow for easy user matching.
    `;

    if (settings.mode === 'Survival') {
      prompt = `
        Generate 10 questions about "${settings.topic}".
        Difficulty: Hard (Survival Mode).
        Distribution: 7 "Multiple Choice", 3 "True/False".
        Shuffle them.
        ${commonRules}
      `;
    } else {
      prompt = `
        Generate 10 ${settings.difficulty} questions about "${settings.topic}".
        Type: "${settings.type}".
        If type is "Multiple Choice", provide 4 options.
        If type is "True/False", provide options ["True", "False"].
        If type is "Short Answer", options should be an empty array [].
        ${commonRules}
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean markdown if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanText);

  } catch (error: any) {
    console.error("Server Error:", error);
    if (error.message?.includes('503')) throw new Error("OVERLOADED");
    throw new Error("GENERIC_ERROR");
  }
}