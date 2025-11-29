import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ClassificationType } from "../types";

export const analyzeContent = async (
  text: string,
  url: string,
  files: File[]
): Promise<AnalysisResult> => {
  // Use the provided key if process.env.API_KEY is not set
  const apiKey = process.env.API_KEY || "AIzaSyCJFBtXOMJN1iuVc4v5RVNvyAysfVmqIkM";
  
  if (!apiKey) {
    throw new Error("Configuration Error: API Key is missing. Please set it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare content parts
  const parts: any[] = [];

  // We manually define the schema in the prompt since we cannot use 'responseSchema' with 'googleSearch' tool.
  const jsonStructure = JSON.stringify({
    classification: "REAL | FAKE | SATIRE | MISLEADING | UNVERIFIABLE",
    confidenceScore: "number (0-100)",
    summary: "string (executive summary)",
    keyRiskFactors: ["string", "string"],
    sentiment: "Neutral | Alarmist | Biased | Objective"
  }, null, 2);

  let promptText = `
    You are Veritas, an advanced Fake News Detection System. 
    Your goal is to analyze the provided content (Text, URL, or Images) and determine its authenticity.
    
    1. Check for factual accuracy against known sources (using Google Search).
    2. Analyze the tone for sensationalism, clickbait, or emotional manipulation.
    3. If images are provided, look for signs of AI generation or editing anomalies (though you are a text/multimodal model, use your visual capabilities).
    4. If a URL is provided, treat it as a source to verify.
    
    CRITICAL OUTPUT INSTRUCTION:
    You must return a valid JSON object. Do not include any other text, preamble, or markdown formatting. 
    The JSON must follow this structure:
    ${jsonStructure}
  `;

  if (text) {
    promptText += `\n\nAnalyze this text context: "${text}"`;
  }

  if (url) {
    promptText += `\n\nVerify facts related to this URL: ${url}`;
  }

  parts.push({ text: promptText });

  // Process files (Images)
  for (const file of files) {
    const base64Data = await fileToBase64(file);
    parts.push({
      inlineData: {
        mimeType: file.type,
        data: base64Data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        // responseMimeType and responseSchema are NOT allowed when using googleSearch tool
        tools: [{ googleSearch: {} }] 
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty Response: The AI model returned no content.");
    }

    let parsedResult;
    try {
      // Clean the response text: remove markdown code blocks if present
      const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, resultText);
      throw new Error("Data Error: The AI response could not be parsed. The model might have been interrupted.");
    }

    // Extract grounding metadata to find sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web?.uri ? { title: chunk.web.title || 'Source', url: chunk.web.uri } : null)
      .filter((s: any) => s !== null);

    // Dedup sources
    const uniqueSources = Array.from(new Set(sources.map((s: any) => s.url)))
      .map(url => sources.find((s: any) => s.url === url));

    return {
      classification: (parsedResult.classification || "UNVERIFIABLE") as ClassificationType,
      confidenceScore: typeof parsedResult.confidenceScore === 'number' ? parsedResult.confidenceScore : 0,
      summary: parsedResult.summary || "No summary provided.",
      keyRiskFactors: Array.isArray(parsedResult.keyRiskFactors) ? parsedResult.keyRiskFactors : [],
      sentiment: parsedResult.sentiment || "Neutral",
      verificationSources: uniqueSources,
    };

  } catch (error: any) {
    console.error("Gemini Analysis Failed:", error);

    // Differentiate between error types for better user feedback
    if (error.message.includes("API key") || error.status === 403) {
      throw new Error("Authentication Failed: The provided API key is invalid or expired.");
    } 
    
    if (error.status === 429 || error.message.includes("429")) {
      throw new Error("Rate Limit Exceeded: The system is receiving too many requests. Please try again in a minute.");
    }
    
    if (error.message.includes("fetch failed") || error.name === "TypeError") {
      throw new Error("Network Error: Unable to connect to the AI service. Please check your internet connection.");
    }

    if (error.message.includes("SAFETY")) {
      throw new Error("Safety Block: The content was flagged by safety filters and could not be analyzed.");
    }

    // Re-throw our custom errors or the original one if it's already descriptive
    throw error;
  }
};

// Helper to convert File to Base64 (stripping the header)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};