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

    const { texto } = await req.json();

    if (!texto || !texto.trim()) {
      return Response.json(
        { error: "Ingresa el texto del protocolo antes de realizar la revisión." },
        { status: 400 }
      );
    }

    const prompt = `
Eres el asistente de revisión preliminar del HEEE Research Assistant,
una herramienta de apoyo a la investigación del Hospital de
Especialidades Eugenio Espejo de Quito, Ecuador.

Debes realizar una revisión preliminar, orientativa y no vinculante
del texto de un protocolo de investigación en salud.

IMPORTANTE:
- Analiza únicamente la información presente en el texto.
- No inventes información faltante.
- No inventes resultados, datos clínicos ni características de pacientes.
- No determines si el protocolo será aprobado o rechazado.
- No otorgues una puntuación o calificación.
- No sustituyas la revisión de la Coordinación de Docencia e Investigación,
  revisores metodológicos ni del CEISH.
- No solicites ni reproduzcas datos identificables de pacientes.
- No hagas una evaluación ética definitiva.
- Si algo no está claramente descrito, clasifícalo como "clarify" o "missing".
- Mantén los comentarios breves, claros, académicos y orientativos.

PROTOCOLO A REVISAR:

${texto}

Evalúa exactamente estos ocho componentes:

1. Pregunta de investigación
2. Objetivos
3. Coherencia metodológica
4. Población
5. Variables
6. Aspectos éticos
7. Consentimiento informado
8. Documentación necesaria

Para cada componente utiliza únicamente uno de estos valores:

"identified" = el elemento se identifica claramente en el texto.
"clarify" = existe información relacionada, pero requiere aclaración,
precisión o mayor desarrollo.
"missing" = el elemento no se identifica en el texto proporcionado.

IMPORTANTE:
La clasificación "identified" NO significa aprobación metodológica,
institucional o ética. Solo significa que el elemento fue localizado
en el texto.

Devuelve ÚNICAMENTE un objeto JSON válido.
No uses Markdown.
No uses bloques de código.
No escribas ningún texto antes ni después del JSON.

Utiliza exactamente esta estructura:

{
  "items": [
    {
      "label": "Pregunta de investigación",
      "tone": "identified",
      "comentario": "Explicación breve."
    },
    {
      "label": "Objetivos",
      "tone": "identified",
      "comentario": "Explicación breve."
    },
    {
      "label": "Coherencia metodológica",
      "tone": "clarify",
      "comentario": "Explicación breve."
    },
    {
      "label": "Población",
      "tone": "identified",
      "comentario": "Explicación breve."
    },
    {
      "label": "Variables",
      "tone": "clarify",
      "comentario": "Explicación breve."
    },
    {
      "label": "Aspectos éticos",
      "tone": "clarify",
      "comentario": "Explicación breve."
    },
    {
      "label": "Consentimiento informado",
      "tone": "missing",
      "comentario": "Explicación breve."
    },
    {
      "label": "Documentación necesaria",
      "tone": "missing",
      "comentario": "Explicación breve."
    }
  ]
}
`;

    const modelos = [
      "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.1-flash-lite"
    ];

    let data = null;
    let respuestaCorrecta = false;

    for (const modelo of modelos) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
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
              maxOutputTokens: 1800
            }
          })
        }
      );

      data = await response.json();

      if (response.ok) {
        respuestaCorrecta = true;
        break;
      }

      console.error(`Gemini API error con ${modelo}:`, data);
    }

    if (!respuestaCorrecta) {
      return Response.json(
        { error: "Gemini no pudo realizar la revisión en este momento." },
        { status: 502 }
      );
    }

    const textoRespuesta =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("") || "";

    if (!textoRespuesta) {
      return Response.json(
        { error: "Gemini devolvió una respuesta vacía." },
        { status: 502 }
      );
    }

    let resultado;

    try {
      const textoLimpio = textoRespuesta
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      resultado = JSON.parse(textoLimpio);
    } catch (error) {
      console.error(
        "Error al interpretar JSON de Gemini:",
        textoRespuesta
      );

      return Response.json(
        { error: "La IA generó una respuesta con formato no válido." },
        { status: 502 }
      );
    }

    if (!resultado?.items || !Array.isArray(resultado.items)) {
      return Response.json(
        { error: "La respuesta de la IA no tiene el formato esperado." },
        { status: 502 }
      );
    }

    return Response.json({ resultado });

  } catch (error) {
    console.error("Error revision-protocolo:", error);

    return Response.json(
      { error: "Ocurrió un error al revisar el protocolo." },
      { status: 500 }
    );
  }
};
