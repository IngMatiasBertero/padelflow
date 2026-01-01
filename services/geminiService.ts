
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSmartInsights(data: any) {
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
