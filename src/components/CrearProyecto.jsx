import { useState } from 'react'
import { Wand2, FileDown } from 'lucide-react'
import Card from './common/Card.jsx'
import Button from './common/Button.jsx'
import LoadingState from './common/LoadingState.jsx'
import AiNote from './common/AiNote.jsx'
import PrivacyBanner from './common/PrivacyBanner.jsx'
import { EJEMPLO_PROYECTO, RESULTADO_ESTRUCTURACION } from '../data/examples.js'

const EMPTY = { idea: '', especialidad: '', poblacion: '', problema: '' }

export default function CrearProyecto() {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const cargarEjemplo = () => {
    setForm(EJEMPLO_PROYECTO)
    setResult(null)
  }

  const estructurar = async () => {
  setLoading(true)
  setResult(null)

  try {
    const response = await fetch('/.netlify/functions/generar-proyecto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idea: form.idea,
        area: form.especialidad,
        poblacion: form.poblacion,
        problema: form.problema
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo generar el proyecto')
    }

    setResult({
      titulo: 'Propuesta generada con IA',
      pregunta: data.resultado,
      objetivoGeneral: 'Ver propuesta generada arriba.',
      objetivosEspecificos: [],
      diseno: 'Incluido en la propuesta generada por IA.',
      poblacion: form.poblacion,
      variables: [],
      proximosPasos: []
    })

  } catch (error) {
    console.error(error)
    alert('No fue posible conectar con el asistente de IA. Inténtalo nuevamente.')
  } finally {
    setLoading(false)
  }
}

  const canSubmit = form.idea.trim().length > 0

  return (
    <div className="module">
      <h1>Crear mi proyecto</h1>
      <p className="section-lede">
        Describe tu idea inicial y obtén un borrador estructurado como punto
        de partida para tu protocolo.
      </p>

      <PrivacyBanner />

      <Card className="form-card">
        <label className="field">
          <span>Describe tu idea de investigación</span>
          <textarea
            rows={4}
            value={form.idea}
            onChange={update('idea')}
            placeholder="Ej. Quiero estudiar si..."
          />
        </label>

        <label className="field">
          <span>Especialidad o área</span>
          <input type="text" value={form.especialidad} onChange={update('especialidad')} />
        </label>

        <label className="field">
          <span>Población de interés</span>
          <input type="text" value={form.poblacion} onChange={update('poblacion')} />
        </label>

        <label className="field">
          <span>Problema que deseas estudiar</span>
          <textarea rows={3} value={form.problema} onChange={update('problema')} />
        </label>

        <div className="form-card__actions">
          <Button variant="ghost" onClick={cargarEjemplo}>
            Cargar ejemplo
          </Button>
          <Button icon={Wand2} onClick={estructurar} disabled={!canSubmit || loading}>
            Estructurar con IA
          </Button>
        </div>
      </Card>

      {loading && <LoadingState label="Estructurando tu proyecto..." />}

      {result && !loading && (
        <Card tone="highlight" className="result-card">
          <div className="result-card__header">
            <FileDown size={18} strokeWidth={1.8} />
            <h2>Borrador estructurado</h2>
          </div>

          <div className="result-block">
            <h3>Título tentativo</h3>
            <p>{result.titulo}</p>
          </div>
          <div className="result-block">
            <h3>Pregunta de investigación</h3>
            <p>{result.pregunta}</p>
          </div>
          <div className="result-block">
            <h3>Objetivo general</h3>
            <p>{result.objetivoGeneral}</p>
          </div>
          <div className="result-block">
            <h3>Objetivos específicos</h3>
            <ul>
              {result.objetivosEspecificos.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
          <div className="result-block">
            <h3>Diseño de estudio sugerido</h3>
            <p>{result.diseno}</p>
          </div>
          <div className="result-block">
            <h3>Población</h3>
            <p>{result.poblacion}</p>
          </div>
          <div className="result-block">
            <h3>Variables principales</h3>
            <ul>
              {result.variables.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
          <div className="result-block">
            <h3>Próximos pasos</h3>
            <ul>
              {result.proximosPasos.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <AiNote>Sugerencia generada por IA. Requiere revisión del investigador.</AiNote>
        </Card>
      )}
    </div>
  )
}
