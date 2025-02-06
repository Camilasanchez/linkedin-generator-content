import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { postContent } = req.body;

  if (!postContent) {
    return res.status(400).json({ error: "Falta el contenido del post." });
  }

  try {
    const prompt = `
      Basándote en el siguiente post de LinkedIn:

      "${postContent}"

      Genera 5 comentarios destacados para lograr más interacción:
      1. Comentario afirmación (máximo 8 palabras).
      2. Comentario pregunta que invite a reflexionar.
      3. Comentario con tips pro (usa un título llamativo).
      4. Comentario tipo página de empresa (tono profesional).
      5. Comentario cómico para generar simpatía.

      Asegúrate de que cada comentario sea breve, claro y atractivo.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const comments = completion.choices[0].message.content.split("\n").filter(comment => comment.trim() !== "");

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error en la API de OpenAI:", error);
    res.status(500).json({ error: "Error generando los comentarios. Intenta nuevamente más tarde." });
  }
}
