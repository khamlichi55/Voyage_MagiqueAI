import { sendMessageToLLM } from "@/services/llmService";

// function safeParseJson(text: string) {
//   try {
//     // Nettoyer les éventuels ```json ou ``` et espaces
//     const cleaned = text.replace(/```json|```/g, "").trim();
//     return JSON.parse(cleaned);
//   } catch (err) {
//     console.warn("⚠️ JSON invalide, tentative de nettoyage automatique", err);
//     throw err;
//   }
// }
function safeParseJson(raw: string) {
  // 1️⃣ Essai direct
  try {
    return JSON.parse(raw);
  } catch (_) {}

  // 2️⃣ Extraction du premier JSON trouvé
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("❌ Aucun JSON détecté dans la réponse LLM");
  }

  const candidate = raw.slice(start, end + 1);

  // 3️⃣ Dernier essai sans modification Unicode
  try {
    return JSON.parse(candidate);
  } catch (err) {
    console.error("❌ JSON final invalide:", candidate);
    throw new Error("Impossible de parser le JSON Gemini");
  }
}


// export async function generateItineraryWithLLM({ 
//   destination, 
//   budget, 
//   days, 
//   interests 
// }: {
//   destination: string;
//   budget: number;
//   days: number;
//   interests?: string[];
// }) {
//   const prompt = `
// Tu es une API backend.
// Réponds UNIQUEMENT avec un JSON strict.
// Aucun texte avant ou après.
// Pas de markdown.
// Échappe correctement les guillemets et caractères spéciaux.

// Exemple de structure attendue :
// {
//   "destination": string,
//   "budget": number,
//   "days": [
//     {
//       "day": number,
//       "title": string,
//       "activities": string[]
//     }
//   ]
// }

// Données utilisateur :
// - Destination : ${destination}
// - Budget : ${budget}
// - Durée : ${days} jours
// - Centres d'intérêt : ${interests?.join(", ") || "aucun"}
// `;

//   const rawText = await sendMessageToLLM(prompt);
//   console.log("🧾 Raw Gemini text:", rawText);

//   const itinerary = safeParseJson(rawText);
//   return itinerary;
// }
export async function generateItineraryWithLLM({ 
  destination, 
  days, 
  interests 
}: {
  destination: string;
  days: number;
  interests?: string[];
}) {
  const prompt = `
Tu es une API backend.
Réponds UNIQUEMENT avec un JSON valide.
Aucun texte hors JSON.
Pas de markdown.

Structure attendue :
{
  "destination": string,
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
- Durée : ${days} jours
- Centres d'intérêt : ${interests?.join(", ") || "aucun"}
`;

  const rawText = await sendMessageToLLM(prompt);
  console.log("🧾 Gemini raw:", rawText);

  return safeParseJson(rawText);
}

