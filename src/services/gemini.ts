import { GoogleGenAI } from "@google/genai";

/**
 * Initialize the Gemini AI client.
 * The API key is injected by the platform from environment variables.
 */
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export interface InterviewQuestion {
  id: number;
  text: string;
}

/**
 * Generates 3 behavioral interview questions based on a job title.
 * @param jobTitle The title of the job to generate questions for.
 * @returns A promise that resolves to an array of questions.
 */
export async function generateInterviewQuestions(jobTitle: string): Promise<string[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const prompt = `You are an expert HR Manager. Generate 3 highly specific, behavioral interview questions for the job title: ${jobTitle}. Return only the questions in a numbered list.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI.");
    }

    // Parse the numbered list (1. ..., 2. ..., 3. ...)
    // Split by newlines and clean up
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && /^\d+\./.test(line))
      .map(line => line.replace(/^\d+\.\s*/, ""));

    if (lines.length === 0) {
      // Fallback if parsing fails - just split by newline if we don't see numbers
      const fallback = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, 3);
      return fallback;
    }

    return lines.slice(0, 3);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate questions. Please try again.");
  }
}
