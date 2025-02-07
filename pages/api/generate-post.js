// pages/api/generate-post.js
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
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para generar el post." });
  }

  try {
    const prompt = `
      Utilizando la siguiente información, genera un post atractivo para LinkedIn:

      Tema: "${topic}"
      Perfil: ${JSON.stringify(profile)}
      Tono: "${tone}"
      Propósito: "${purpose}"
      Características extras: "${extraFeatures}"

      Mantén la estructura original y no omitas los prompt base que definen el orden de preguntas y comentarios.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Asegúrate de que el modelo esté disponible
      messages: [{ role: "user", content: prompt }],
    });

    const post = completion.choices[0].message.content.trim();

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error generando el post:", error);
    res
      .status(500)
      .json({ error: "Error generando el post. Intenta nuevamente más tarde." });
  }
}
