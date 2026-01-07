
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateWordList(categoryName: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a list of 50 fun, recognizable, and distinct nouns related to the category: "${categoryName}". They should be suitable for a fast-paced guessing game where players act out or describe the word.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            words: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["words"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"words": []}');
    return data.words || [];
  } catch (error) {
    console.error("Error generating words:", error);
    // Fallback word list if API fails
    return ["Error Loading", "Retry Later", "Check Internet", "Banana", "Apple", "Dog", "Cat"];
  }
}
