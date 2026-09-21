export default async (req) => {
  if (req.method !== "POST") {
    return Response.json(
      { error: "Método no permitido" },
      { status: 405 }
    );
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "La API de Gemini no está configurada." },
        { status: 500 }
      );
    }

    const { idea, area, poblacion, problema } = await req.json();

    if (!idea || !area || !poblacion || !problema) {
      return Response.json(
        { error: "Completa todos los campos antes de generar el proyecto." },
        { status: 400 }
      );
    }

    const prompt = `
Eres el asistente metodológico del HEEE Research Assistant,
una herramienta de apoyo a la investigación del Hospital de
Especialidades Eugenio Espejo de Quito, Ecuador.

Tu función es orientar a profesionales de salud en la estructuración
inicial de proyectos de investigación.

IMPORTANTE:
- No inventes datos clínicos ni resultados.
- No sustituyas la revisión de un investigador, metodólogo o comité de ética.
- No determines si un protocolo será aprobado o rechazado.
- No solicites ni reproduzcas datos identificables de pacientes.
- Usa lenguaje académico, claro y profesional.
- Adapta las recomendaciones al ámbito sanitario.
- Si la información proporcionada es insuficiente, indícalo claramente.

Información proporcionada por el investigador:

IDEA:
${idea}

ÁREA O ESPECIALIDAD:
${area}

POBLACIÓN:
${poblacion}

PROBLEMA DE INVESTIGACIÓN:
${problema}

A partir exclusivamente de esta información, estructura una propuesta
inicial que contenga:

1. Título tentativo
2. Pregunta de investigación
3. Objetivo general
4. Entre 3 y 5 objetivos específicos
5. Diseño de estudio sugerido y breve justificación
6. Población de estudio
7. Variables principales sugeridas
8. Próximos pasos recomendados

No inventes resultados, tamaños muestrales ni conclusiones.

Termina con esta advertencia:
"Contenido generado con inteligencia artificial. Requiere revisión del investigador y no sustituye la evaluación metodológica, institucional ni ética correspondiente."
`;

    const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1800
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return Response.json(
        { error: "Gemini no pudo generar la respuesta." },
        { status: 502 }
      );
    }

    const texto =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("") || "";

    if (!texto) {
      return Response.json(
        { error: "Gemini devolvió una respuesta vacía." },
        { status: 502 }
      );
    }

    return Response.json({ resultado: texto });

  } catch (error) {
    console.error("Error generar-proyecto:", error);

    return Response.json(
      { error: "Ocurrió un error al generar el proyecto." },
      { status: 500 }
    );
  }
};
