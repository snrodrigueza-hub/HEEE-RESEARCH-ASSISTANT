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
inicial de investigación.

REGLAS:
- No inventes resultados, tamaños muestrales ni conclusiones.
- No inventes antecedentes clínicos, características de pacientes ni datos que no hayan sido proporcionados.
- Puedes sugerir decisiones metodológicas razonables, pero debes presentarlas como sugerencias y no como hechos.
- Si falta información necesaria para definir un elemento, indícalo como "Por definir por el investigador".
- No determines si el proyecto será aprobado por un comité de ética.
- No incluyas datos identificables de pacientes.
- Mantén un lenguaje académico, claro y conciso.

Devuelve ÚNICAMENTE un objeto JSON válido.
No uses Markdown.
No uses bloques de código.
No escribas ningún texto antes ni después del JSON.

Utiliza exactamente esta estructura:

{
  "titulo": "Título tentativo",
  "pregunta": "Pregunta de investigación",
  "objetivoGeneral": "Objetivo general",
  "objetivosEspecificos": [
    "Objetivo específico 1",
    "Objetivo específico 2",
    "Objetivo específico 3"
  ],
  "diseno": "Diseño de estudio sugerido y breve justificación",
  "poblacion": "Población de estudio",
  "variables": [
    "Variable principal 1",
    "Variable principal 2"
  ],
  "proximosPasos": [
    "Próximo paso 1",
    "Próximo paso 2",
    "Próximo paso 3"
  ]
}

Los objetivos específicos deben ser entre 3 y 5.
Las variables deben distinguir claramente, cuando corresponda, variable de exposición o intervención, variable de resultado y posibles covariables.

El contenido es una orientación inicial generada con inteligencia artificial y requiere revisión del investigador.
`;

    const modelos = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.1-flash-lite"];

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
    { error: "Gemini no pudo generar la respuesta en este momento." },
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
    { error: "La IA generó una respuesta con formato no válido. Inténtalo nuevamente." },
    { status: 502 }
  );
}

return Response.json({ resultado });

  } catch (error) {
    console.error("Error generar-proyecto:", error);

    return Response.json(
      { error: "Ocurrió un error al generar el proyecto." },
      { status: 500 }
    );
  }
};
