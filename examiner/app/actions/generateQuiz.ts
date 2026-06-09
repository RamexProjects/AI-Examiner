'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Question, QuizSettings } from "@/types";
import { validateQuestions } from "@/lib/utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateQuiz(settings: QuizSettings): Promise<Question[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const langInstruction = settings.language === 'am'
      ? 'Generate ALL content (questions, options, correctAnswer, explanation) in Amharic language. Every field must be in Amharic (Ethiopic script).'
      : 'Generate ALL content in English.';

    const commonRules = `
      output strictly valid JSON array of objects.
      Keys must be: "id", "question", "options", "correctAnswer", "explanation", "type".
      IMPORTANT: "correctAnswer" MUST be the EXACT string text from the "options" array. Do NOT return "A", "B", "1", or the index.
      Example: If options are ["Red", "Blue"], correctAnswer must be "Red", NOT "A".
      For "Short Answer", ensure the answer is simple (1-3 words max) to allow for easy user matching.
      ${langInstruction}
    `;

    if (settings.mode === 'Survival') {
      const prompt = `
        Generate 10 questions about "${settings.topic}".
        Difficulty: Hard (Survival Mode).
        Distribution: 7 "Multiple Choice", 3 "True/False".
        Shuffle them.
        ${commonRules}
      `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanText);
      if (!validateQuestions(parsed)) {
        throw new Error("INVALID_RESPONSE");
      }
      return parsed;
    }

    const prompt = `
      Generate 10 ${settings.difficulty} questions about "${settings.topic}".
      Type: "${settings.type}".
      If type is "Multiple Choice", provide 4 options.
      If type is "True/False", provide options ["True", "False"].
      If type is "Short Answer", options should be an empty array [].
      ${commonRules}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanText);
    if (!validateQuestions(parsed)) {
      throw new Error("INVALID_RESPONSE");
    }
    return parsed;

  } catch (error: unknown) {
    console.error("Server Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('503') || msg.includes('OVERLOADED')) throw new Error("OVERLOADED");
    if (msg.includes('INVALID_RESPONSE')) throw new Error("INVALID_RESPONSE");
    throw new Error("GENERIC_ERROR");
  }
}
