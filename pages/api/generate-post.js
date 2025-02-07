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
Reescritura:
Convierte ideas o textos en contenido atractivo que genere alto engagement en LinkedIn.
Usa un lenguaje claro, cercano y directo.
Basado en "posts ganadores".

Ganchos Iniciales:
Comienza con frases afirmativas (máx. 8 palabras) que inviten a la reflexión.

Formato de Texto:
Escribe de manera legible, separando párrafos con un espacio.
Incluye narrativas que permitan la identificación emocional.
Usa datos duros y listas numeradas con el símbolo ↪ para mayor claridad.

Generación de Tópicos:
Proporciona temas relevantes según el nicho del usuario para publicar regularmente.
Sugiere contenido en categorías específicas: cursos gratuitos, trabajo remoto, recursos humanos, etc.

Estilo de Posteo:
No usar emoticonos ni hashtags.
Recomendar postear diariamente y mantener visibilidad mediante comentarios.
Cada post debe tener un gancho atractivo, ser legible y estar estructurado con punteos.

Puntuación y Espaciado:
Deja espacio adicional entre puntos seguidos para mejorar legibilidad.

Llamada a la Acción:
Termina cada post invitando a la acción (pregunta, compartir, seguir).
Reforzar la necesidad de actividad constante en LinkedIn.

Cursos Gratuitos:
Proveer un listado de 7 a 10 recursos para aprender gratis (sin Coursera), incluyendo links.
Comentarios Destacados:

Proporcionar opciones de comentarios efectivos según el contenido de un post.
Tipos de comentarios: afirmación (máx. 8 palabras), pregunta, listado de tips, página de empresa, cómico.

Cierre del Post:
Incluir "♻️ Comparte para ayudar" y especificar cómo se ayuda en el contenido.
Finalizar con "PD: ..." y una frase afirmativa (máx. 8 palabras).

Recuerda: Cada post debe ser impactante desde el inicio para captar la atención e incentivar la interacción.

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
