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

    const {
      pregunta,
      objetivoGeneral,
      tipoEstudio,
      poblacion,
      variablePrincipal
    } = await req.json();

    if (!pregunta) {
      return Response.json(
        { error: "Ingresa al menos la pregunta de investigación." },
        { status: 400 }
      );
    }

    const prompt = `
Eres el asistente metodológico del HEEE Research Assistant,
una herramienta de apoyo a la investigación del Hospital de
Especialidades Eugenio Espejo de Quito, Ecuador.

Debes realizar una revisión preliminar y orientativa de la coherencia
metodológica de una propuesta de investigación en salud.

IMPORTANTE:
- No inventes información que el investigador no haya proporcionado.
- No inventes resultados, datos clínicos ni tamaños muestrales.
- No sustituyas la revisión de un investigador o metodólogo.
- No determines si el proyecto será aprobado o rechazado.
- No emitas una calificación numérica.
- No solicites ni reproduzcas datos identificables de pacientes.
- Si falta información, indícalo claramente.
- Una sugerencia metodológica debe presentarse como sugerencia, no como hecho.

PROPUESTA DEL INVESTIGADOR:

Pregunta de investigación:
${pregunta}

Objetivo general:
${objetivoGeneral || "No especificado"}

Tipo de estudio:
${tipoEstudio || "No especificado"}

Población:
${poblacion || "No especificada"}

Variable principal:
${variablePrincipal || "No especificada"}

Evalúa exactamente estos nueve componentes:

1. Coherencia pregunta–objetivos
2. Diseño metodológico
3. Población
4. Criterios de inclusión
5. Criterios de exclusión
6. Variables
7. Desenlace principal
8. Posibles sesgos
9. Estrategia general de análisis estadístico

Para cada componente asigna únicamente uno de estos estados:

"ok" = el elemento está adecuadamente definido con la información proporcionada.
"review" = existe información, pero requiere revisión, precisión o mejora.
"missing" = no se identifica información suficiente para evaluar el elemento.

Devuelve ÚNICAMENTE un objeto JSON válido.
No uses Markdown.
No uses bloques de código.
No escribas ningún texto antes ni después del JSON.

Utiliza exactamente esta estructura:

{
  "items": [
    {
      "label": "Coherencia pregunta–objetivos",
      "status": "ok",
      "comentario": "Explicación breve y orientativa."
    },
    {
      "label": "Diseño metodológico",
      "status": "review",
      "comentario": "Explicación breve y orientativa."
    },
    {
      "label": "Población",
      "status": "ok",
      "comentario": "Explicación breve y orientativa."
    },
    {
      "label": "Criterios de inclusión",
      "status": "missing",
      "comentario": "Explicación breve y orientativa."
    },
    {
      "label": "Criterios de exclusión",
      "status": "missing",
      "comentario": "Explicación breve y orientativa."
    },
    {
      "label": "Variables",
      "status": "review",
      "comentario": "Explicación breve y orientativa."
    },
    {
      "label": "Desenlace principal",
      "status": "review",
      "comentario": "Explicación breve y orientativa."
    },
    {
      "label": "Posibles sesgos",
      "status": "review",
      "comentario": "Explicación breve y orientativa."
    },
    {
      "label": "Estrategia general de análisis estadístico",
      "status": "missing",
      "comentario": "Explicación breve y orientativa."
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
        { error: "Gemini no pudo realizar el análisis en este momento." },
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

    let resultado;

    try {
      const textoLimpio = texto
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      resultado = JSON.parse(textoLimpio);
    } catch (error) {
      console.error("Error al interpretar JSON de Gemini:", texto);

      return Response.json(
        { error: "La IA generó una respuesta con formato no válido." },
        { status: 502 }
      );
    }

    return Response.json({ resultado });

  } catch (error) {
    console.error("Error asistente-metodologico:", error);

    return Response.json(
      { error: "Ocurrió un error al analizar la metodología." },
      { status: 500 }
    );
  }
};
