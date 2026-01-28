
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function suggestFooterServices(businessType: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Propose une courte liste de services (3 à 5 mots clés séparés par des tirets) pour une signature d'e-mail pour un professionnel travaillant dans le secteur suivant : ${businessType}. Réponds uniquement avec la liste de mots clés, sans phrase autour. Exemple: Vente - Location - Gestion - Syndic`,
    });
    return response.text?.trim() || "Vente - Location - Gestion - Syndic";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Vente - Location - Gestion - Syndic";
  }
}
