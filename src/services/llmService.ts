// services/llmService.ts
export async function sendMessageToLLM(prompt: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const modelName = 'gemini-2.5-flash';

  if (!apiKey) {
    throw new Error("❌ GEMINI API KEY manquante");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: prompt }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      }),
    }
  );

  const data = await response.json();
  console.log("🧠 Gemini response:", data);

  if (data.error) {
    throw new Error(`❌ Erreur API Gemini (${data.error.code}): ${data.error.message}`);
  }

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("⚠️ Gemini n’a retourné aucun contenu.");
  }

  return rawText;
}
