import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { topic, profile, tone, purpose, extraFeatures } = req.body;

  if (!topic || !profile || !tone) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const prompt = `
      Reescribe y crea un contenido viral para LinkedIn.
      Tema: "${topic}".
      Tono: ${tone}.
      Autor: ${profile.name}, identificado/a como ${profile.gender}.
      Profesión: ${profile.profession || "No especificado"}.
      Empresa: ${profile.company || "No especificado"}.
      Propósito de vida: ${purpose || "No especificado"}.
      Características extras: ${extraFeatures || "No especificadas"}.

      Reglas para el post:
      - Cuando partas con gancho, debe  ser con frases afirmativas (ideal 8 palabras máximo), que hagan cuestionarse a las personas..
      - Texto legible, saltando una línea por cada punto
      - Utiliza un lenguaje cercano, claro y directo. Todo esto basado en "posts ganadores" previamente probados en LinkedIn 
      - Incluye datos numéricos concretos si es posible.
      - Usa punteos con ↪ para listas.
      - Si el item características extras del formulario está completo, usa la información para cerrar el post.
      - Termina con "♻️ Comparte para ayudar" y un PD final con un llamado a la acción de máximo 8 palabras afirmativas.

      El objetivo es generar el máximo de engagement en LinkedIn.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({ post: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error en la API de OpenAI:", error);
    res.status(500).json({
      error: "Error generando el post. Intenta nuevamente más tarde.",
    });
  }
}
