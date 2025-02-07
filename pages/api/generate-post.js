import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { topic, profile, tone, purpose, extraFeatures } = req.body;

  if (!topic || !profile || !purpose) {
    return res.status(400).json({ error: "Faltan datos obligatorios para generar el post." });
  }

  // Obtén el modelo personalizado desde la variable de entorno o usa un valor por defecto.
  const model = process.env.CUSTOM_GPT_MODEL || "gpt-4o-mini";

  // Recupera la plantilla del prompt desde la variable de entorno.
  // Si no está definida, se usa la plantilla por defecto.
  const basePrompt = process.env.PROMPT_TEMPLATE || `
Utilizando la siguiente información, genera un post atractivo para LinkedIn:

Tema: "{topic}"
Perfil: {profile}
Tono: "{tone}"
Propósito: "{purpose}"
Características extras: "{extraFeatures}"

Mantén la estructura original y no omitas los prompt base que definen el orden de preguntas y comentarios.
`;

  // Reemplaza los marcadores de posición con los valores reales.
  const prompt = basePrompt
    .replace("{topic}", topic)
    .replace("{profile}", JSON.stringify(profile))
    .replace("{tone}", tone)
    .replace("{purpose}", purpose)
    .replace("{extraFeatures}", extraFeatures);

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });

    const post = completion.choices[0].message.content.trim();

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error generando el post:", error);
    res.status(500).json({ error: "Error generando el post. Intenta nuevamente más tarde." });
  }
}
