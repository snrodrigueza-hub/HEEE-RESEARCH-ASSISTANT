# HEEE Research Assistant

Asistente Inteligente de Investigación — Hospital de Especialidades Eugenio
Espejo, Coordinación de Docencia e Investigación (Quito, Ecuador).

Este es un **MVP funcional sin backend** que acompaña a médicos,
investigadores y residentes desde la idea inicial hasta la preparación
metodológica y la orientación sobre los trámites institucionales de
Investigación y CEISH.

> La aplicación **no** toma decisiones éticas, no aprueba protocolos y no
> sustituye a los revisores institucionales. No almacena datos de pacientes.

## Tecnología

- React 18 + Vite
- JavaScript (JSX)
- CSS plano con variables de diseño (sin frameworks de UI)
- [lucide-react](https://lucide.dev/) para iconografía lineal
- Sin backend: todas las respuestas de "IA" son simuladas por ahora

## Cómo ejecutar el proyecto

```bash
npm install
npm run dev       # entorno de desarrollo
npm run build     # genera la carpeta dist/ para producción
npm run preview   # sirve la build de producción localmente
```

## Estructura del proyecto

```
src/
  App.jsx                  Enrutamiento entre pantallas (estado local)
  App.css                  Estilos de componentes
  index.css                Tokens de diseño (color, tipografía, layout)
  data/examples.js         Ejemplos ficticios usados por los botones "Cargar ejemplo"
  components/
    Header.jsx, Footer.jsx
    HomeScreen.jsx          Pantalla principal con los 4 módulos
    GuiaWizard.jsx          Módulo 1 — Guíame con mi investigación
    CrearProyecto.jsx       Módulo 2 — Crear mi proyecto
    AsistenteMetodologico.jsx  Módulo 3 — Asistente metodológico
    TramitesInvestigacion.jsx  Módulo 4 — Carta de Interés
    Ceish.jsx               Módulo 5 — Asistente CEISH
    RevisionProtocolo.jsx   Módulo 6 — Revisión preliminar con IA
    common/                 Componentes reutilizables (Card, Button, etc.)
```

## Conectar una API de IA real

Todas las funciones de IA están simuladas con `setTimeout` y datos de
ejemplo en `src/data/examples.js`, para poder demostrar la aplicación sin
conexión a un modelo. Los puntos de integración están aislados en cada
componente de módulo:

- `CrearProyecto.jsx` → función `estructurar()`
- `AsistenteMetodologico.jsx` → función `analizar()`
- `RevisionProtocolo.jsx` → función `revisar()`

Para conectar una API real, sustituye el `setTimeout` de cada función por
una llamada `fetch` (o al SDK correspondiente) que envíe el contenido del
formulario y reciba una respuesta con la misma forma que los objetos de
ejemplo (`RESULTADO_ESTRUCTURACION`, etc.). No se recolecta ni se envía
información identificable de pacientes en ningún formulario.

## Despliegue en Netlify

1. Sube este proyecto a un repositorio Git (GitHub, GitLab, etc.).
2. En Netlify, crea un nuevo sitio a partir del repositorio.
3. Configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Netlify instalará dependencias y desplegará automáticamente.

También puedes desplegar arrastrando la carpeta `dist/` (generada con
`npm run build`) directamente en Netlify Drop.
