
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use direct process.env.API_KEY for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSummary = async (complexName: string, reviews: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza estas reseñas para el complejo de padel "${complexName}" y dame un resumen ejecutivo muy breve (máximo 2 párrafos) de lo que la gente más valora y lo que debería mejorar. En español rioplatense (argentino). Reseñas: ${reviews.join(' | ')}`,
      config: {
        temperature: 0.7,
        topP: 0.8
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "No se pudo generar el resumen inteligente en este momento.";
  }
};

export const getAIAvailabilitySuggestion = async (userPreferences: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `El usuario dice: "${userPreferences}". Sugiere el mejor momento para jugar al padel en Santiago del Estero considerando que hace mucho calor en verano (siesta prohibida). Responde en formato JSON amigable.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reason: { type: Type.STRING },
            suggestedTime: { type: Type.STRING },
            tip: { type: Type.STRING }
          },
          required: ["reason", "suggestedTime", "tip"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return null;
  }
};
