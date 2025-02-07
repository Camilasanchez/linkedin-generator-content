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
      📢 **Genera 5 comentarios estratégicos para maximizar la interacción en este post de LinkedIn:**
      
      "${postContent}"

      🎯 **Reglas:**
      1️⃣ **Comentario de afirmación** (máximo 8 palabras, refuerza el mensaje del post).
      2️⃣ **Comentario con pregunta** (fomenta la reflexión y el debate).
      3️⃣ **Comentario con un tip extra** (agrega valor con un título llamativo).
      4️⃣ **Comentario en tono profesional** (como si fuera una página de empresa).
      5️⃣ **Comentario con humor** (para generar simpatía y engagement).

      📌 **Formato de salida:**  
      Devuelve los comentarios como un array en formato JSON.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let comments = completion.choices[0].message.content
      .split("\n")
      .filter(comment => comment.trim() !== "");

    // Limpia los delimitadores de bloque y la palabra "json"
    comments = comments.map(comment =>
      comment.replace(/```json\s*/g, "").replace(/```/g, "")
    );

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error en la API de OpenAI:", error);
    res.status(500).json({ error: "Error generando los comentarios. Intenta nuevamente más tarde." });
  }
}
