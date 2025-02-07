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
      Devuelve los comentarios en **texto plano**, sin JSON, sin etiquetas de código.
      Separa cada comentario con un salto de línea.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    // Divide la respuesta en líneas y filtra vacíos
    let comments = completion.choices[0].message.content
      .trim()
      .split("\n")
      .map(comment => comment.replace(/^[-\d.]+\s*/, "")) // Elimina números o viñetas al inicio
      .filter(comment => comment.trim() !== "");

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error en la API de OpenAI:", error);
    res.status(500).json({ error: "Error generando los comentarios. Intenta nuevamente más tarde." });
  }
}
