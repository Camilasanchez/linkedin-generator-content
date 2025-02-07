import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  // Estados para el perfil, formulario, post y comentarios
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    profession: "",
    company: "",
    purpose: "",
    extraFeatures: ""
  });
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Profesional");
  const [generatedPost, setGeneratedPost] = useState("");
  const [generatedComments, setGeneratedComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Al iniciar, carga el perfil guardado en localStorage (si existe)
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Maneja el cambio en cualquiera de los inputs del formulario
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guarda el perfil en localStorage y lo establece en el estado
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(formData));
    setProfile(formData);
  };

  // Función para generar el post usando los datos del perfil y del tema
  const handleGeneratePost = async () => {
    if (!topic) {
      alert("Por favor ingresa un tema para el post.");
      return;
    }
    setLoadingPost(true);
    setGeneratedPost("");
    setGeneratedComments([]);

    try {
      const response = await axios.post("/api/generate-post", {
        topic,
        profile,
        tone,
        purpose: formData.purpose,
        extraFeatures: formData.extraFeatures
      });
      setGeneratedPost(response.data.post);
    } catch (error) {
      console.error("Error generando el post:", error);
      alert(
        `Error al generar el post: ${
          error.response?.data?.error || error.message || "Error desconocido"
        }`
      );
    } finally {
      setLoadingPost(false);
    }
  };

  // Función para generar los comentarios basados en el post generado
  const handleGenerateComment = async () => {
    if (!generatedPost) return;
    setLoadingComments(true);

    try {
      const response = await axios.post("/api/generate-comment", {
        postContent: generatedPost
      });
      setGeneratedComments(response.data.comments || []);
    } catch (error) {
      console.error("Error generando comentarios:", error);
      alert(
        `Error al generar comentarios: ${
          error.response?.data?.error || error.message || "Error desconocido"
        }`
      );
    } finally {
      setLoadingComments(false);
    }
  };

  // Función para copiar el post generado al portapapeles
  const handleCopyPost = () => {
    navigator.clipboard.writeText(generatedPost);
    alert("¡Post copiado al portapapeles!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      {/* Encabezado */}
      <header className="w-full max-w-2xl text-center py-4">
        <h1 className="text-3xl font-bold text-blue-700">
          Generador de Posts para LinkedIn
        </h1>
        <p className="text-gray-600">
          Crea publicaciones atractivas en segundos
        </p>
      </header>

      {/* Si no existe perfil, muestra el formulario de creación de perfil */}
      {!profile ? (
        <main className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Crea tu perfil</h2>
          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={handleProfileChange}
              required
            />

            <select
              name="gender"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={handleProfileChange}
              required
            >
              <option value="">Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No Binario">No Binario</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              <option value="Otro">Otro</option>
            </select>

            <input
              type="text"
              name="profession"
              placeholder="Profesión (opcional)"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={handleProfileChange}
            />

            <input
              type="text"
              name="company"
              placeholder="Empresa (opcional)"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={handleProfileChange}
            />

            <textarea
              name="purpose"
              placeholder="¿Cuál es tu propósito en la vida?"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={handleProfileChange}
              required
            ></textarea>
            <p className="text-gray-500 text-xs">
              Comparte qué te inspira y cuál es el impacto que deseas generar
              con tu trabajo. Ejemplo: Impulsar la equidad de género en la
              tecnología, promover el trabajo remoto, mejorar la educación en
              ciencia y tecnología.
            </p>

           <textarea
                name="extraFeatures"
                placeholder="Características extras (opcional)"
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={handleProfileChange}
              ></textarea>
      <p className="text-gray-500 text-xs">
        Describe frases o palabras que sean parte de tu estilo y te gustaría incluir en tus publicaciones. Ejemplo: &quot;Vamos con todo&quot;, &quot;Innovación sin límites&quot;, &quot;Aprender cada día&quot;.
            </p>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Guardar Perfil
            </button>
          </form>
        </main>
      ) : (
        // Si el perfil está creado, muestra la interfaz para generar el post y los comentarios
        <main className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Escribe tu post</h2>
          <input
            type="text"
            placeholder="Tema"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="flex justify-between items-center mb-4">
            <label className="text-gray-700">Tono de voz:</label>
            <select
              className="border border-gray-300 p-2 rounded-lg"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>Profesional</option>
              <option>Casual</option>
              <option>Inspirador</option>
            </select>
          </div>

          <button
            onClick={handleGeneratePost}
            disabled={loadingPost}
            className="w-full py-2 rounded-lg transition bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loadingPost ? "Generando..." : "Generar Post"}
          </button>

          {generatedPost && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold">Post Generado</h2>
              <textarea
                readOnly
                className="w-full h-40 p-2 border border-gray-300 rounded-lg mt-2"
                value={generatedPost}
              ></textarea>
              <button
                onClick={handleCopyPost}
                className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Copiar Post
              </button>

              {/* Sección informativa sobre la importancia de los comentarios */}
              <div className="bg-gray-100 p-4 mt-4 rounded-md text-center">
                <h3 className="font-semibold text-lg">
                  💡 Un Comentario Puede Impulsar Tu Post 🚀
                </h3>
                <p className="text-gray-700 mt-2">
                  Comentar en tu propio post inmediatamente después de
                  publicarlo <strong>aumenta su alcance y visibilidad.</strong>{" "}
          
                </p>
              </div>

              {/* Botón para generar comentarios */}
              <button
                onClick={handleGenerateComment}
                disabled={loadingComments}
                className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition mt-4"
              >
                {loadingComments
                  ? "Generando comentarios..."
                  : "Genera un comentario ahora y maximiza tu impacto."}
              </button>

              {generatedComments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Comentarios Generados</h3>
                  <ul className="list-disc list-inside">
                    {generatedComments.map((comment, index) => (
                      <li key={index} className="mt-2 text-gray-800">
                        {comment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </main>
      )}
    </div>
  );
}
