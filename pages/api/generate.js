import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { topic, profile, tone } = req.body;

  if (!topic || !profile || !tone) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const prompt = `Genera un post para LinkedIn sobre "${topic}" con un tono ${tone}. El autor es ${profile.name}, un/a ${profile.profession} en ${profile.company}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({ post: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error en la API de OpenAI:", error);
    res.status(500).json({error: "Error generando el post. Intenta nuevamente más tarde.",
    });
  }
}
