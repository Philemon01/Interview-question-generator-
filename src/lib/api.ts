import { GoogleGenAI } from "@google/genai";

/**
 * Initialize the Gemini AI client using the modern @google/genai SDK.
 * The API key is injected by the platform from environment variables.
 */
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

/**
 * Calls Gemini to generate 3 thoughtful interview questions.
 * @param jobTitle - The sanitized job title input.
 * @returns {Promise<string[]>} - An array of 3 questions.
 */
export async function getInterviewQuestions(jobTitle: string): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing API Key. Please check the Secrets panel in Settings.");
  }

  // Model selection (gemini-3-flash-preview is the recommended default for basic text tasks)
  const modelName = "gemini-3-flash-preview";

  const prompt = `You are an expert HR Manager. Generate 3 highly specific, behavioral interview questions for the job title: "${jobTitle}". Return only the questions in a numbered list.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI service returned an empty response. Please try again.");
    }

    // Parse the output: Extract text following "1. ", "2. ", etc.
    const questions = text
      .split(/\n/)
      .map(q => q.trim())
      .filter(q => q.length > 0 && /^\d+[\.\)]/.test(q))
      .map(q => q.replace(/^\d+[\.\)]\s*/, "").trim())
      .slice(0, 3);

    if (questions.length < 3) {
      // Fallback: If parsing failed but we have text, just return first 3 lines
      const fallback = text
        .split(/\n/)
        .map(q => q.trim())
        .filter(q => q.length > 0)
        .slice(0, 3);
        
      if (fallback.length === 0) {
        throw new Error("Received an unformatted response from AI.");
      }
      return fallback;
    }

    return questions;
  } catch (error: any) {
    console.error("Gemini API error:", error);
    
    // Specific guidance for API key issues as per skill
    if (error.message?.includes("PERMISSION_DENIED") || error.status === 403) {
      throw new Error("API Key Permission Denied. Please ensure your Gemini API key is valid in Settings > Secrets.");
    }
    
    if (error.message?.includes("API_KEY_INVALID") || error.status === 400) {
      throw new Error("Invalid API Key found. Please check your Gemini API key in Settings > Secrets.");
    }

    throw new Error("The AI service encountered an error. Please try again in a few moments.");
  }
}
