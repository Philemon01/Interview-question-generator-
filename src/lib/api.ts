import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
// The key is fetched from process.env.GEMINI_API_KEY
// In this environment, GEMINI_API_KEY is injected at runtime.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Calls Gemini to generate 3 thoughtful interview questions.
 * @param jobTitle - The sanitized job title input.
 * @returns {Promise<string[]>} - An array of 3 questions.
 */
export async function getInterviewQuestions(jobTitle: string): Promise<string[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing API Key. Please configure GEMINI_API_KEY in your environment.");
  }

  // Model selection (Gemini 1.5 Flash is ideal for fast, cost-effective text tasks)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // System instructions + Prompt
  const prompt = `
    You are an expert HR Manager. 
    Generate 3 highly specific, behavioral interview questions for the job title: "${jobTitle}". 
    
    Constraints:
    - Return exactly 3 questions.
    - Format as a numbered list (1.. 2.. 3..).
    - Do not include any other text or PII.
  `.trim();

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse the output: Extract text following "1. ", "2. ", etc.
    const questions = text
      .split(/\n/)
      .map(q => q.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter(q => q.length > 0)
      .slice(0, 3);

    if (questions.length < 3) {
      throw new Error("Received incomplete response from AI.");
    }

    return questions;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("The AI service is currently unavailable or returned an error. Please try again.");
  }
}
