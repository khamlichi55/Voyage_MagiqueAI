import { sendMessageToLLM } from "@/services/llmService";

/**
 * Extraire le JSON pur du texte Gemini
 */
function extractJson(text: string): string {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Aucun JSON détecté dans la réponse Gemini");
  }

  return text.substring(firstBrace, lastBrace + 1);
}

/**
 * Génère l'itinéraire avec Gemini et retourne un JSON utilisable
 */
export async function generateItineraryWithLLM({ destination, budget, days }: {
  destination: string;
  budget: number;
  days: number;
}) {
  const prompt = `
Tu es une API backend.
Réponds UNIQUEMENT avec un JSON strict.
Aucun texte avant ou après.
Pas de markdown.
Échappe correctement les guillemets et caractères spéciaux.

Exemple de structure attendue :
{
  "destination": string,
  "budget": number,
  "days": [
    {
      "day": number,
      "title": string,
      "activities": string[]
    }
  ]
}

Données utilisateur :
- Destination : ${destination}
- Budget : ${budget}
- Durée : ${days} jours
`;

  try {
    const rawText = await sendMessageToLLM(prompt);
    console.log("🧾 Raw Gemini text:", rawText);

    const jsonText = extractJson(rawText);
    const itinerary = JSON.parse(jsonText);

    return itinerary;

  } catch (err) {
    console.error("Erreur de génération ou de parsing de l'itinéraire JSON. Réponse brute:", err);
    throw new Error("❌ Impossible de générer l'itinéraire avec l'IA. Veuillez vérifier vos entrées ou le statut de l'API.");
  }
}
