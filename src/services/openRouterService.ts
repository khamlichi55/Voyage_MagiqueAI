// src/services/openRouterService.ts

export async function sendMessageToOpenRouter(
  messages: { role: string; content: string }[]
) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // changeable
        messages,
      }),
    });

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content ||
      "Désolé, je n'ai pas compris la réponse."
    );
  } catch (error) {
    console.error("❌ OpenRouter error:", error);
    return "⚠️ Impossible de contacter l'assistant IA.";
  }
}
