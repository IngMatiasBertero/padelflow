
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

// Solo inicializar si hay API key
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.warn("Gemini AI no disponible:", error);
  }
}

export async function getSmartInsights(data: any) {
  // Si no hay cliente de Gemini, devolver mensaje por defecto
  if (!ai) {
    return "Insights de IA no disponibles. Configure VITE_GEMINI_API_KEY para habilitar esta función.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza los siguientes datos de reservas de un complejo deportivo en Santiago del Estero y proporciona 3 recomendaciones estratégicas cortas para el dueño. Considera factores como horarios pico, tipos de canchas y posibles promociones.

      Datos: ${JSON.stringify(data)}`,
      config: {
        temperature: 0.7,
        topP: 0.9
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return "No se pudieron obtener insights en este momento.";
  }
}
