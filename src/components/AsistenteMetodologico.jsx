import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import Card from './common/Card.jsx'
import Button from './common/Button.jsx'
import LoadingState from './common/LoadingState.jsx'
import AiNote from './common/AiNote.jsx'
import StatusBadge from './common/StatusBadge.jsx'
import PrivacyBanner from './common/PrivacyBanner.jsx'
import { EJEMPLO_METODOLOGICO } from '../data/examples.js'

const EMPTY = {
  pregunta: '',
  objetivoGeneral: '',
  tipoEstudio: '',
  poblacion: '',
  variablePrincipal: '',
}

// Revisión simulada. Preparado para sustituirse por una llamada real a una
// API de análisis metodológico.
const REVIEW_ITEMS = [
  { label: 'Coherencia pregunta–objetivos', status: 'ok' },
  { label: 'Diseño metodológico', status: 'ok' },
  { label: 'Población', status: 'ok' },
  { label: 'Criterios de inclusión', status: 'review' },
  { label: 'Criterios de exclusión', status: 'missing' },
  { label: 'Variables', status: 'ok' },
  { label: 'Desenlace principal', status: 'review' },
  { label: 'Posibles sesgos', status: 'review' },
  { label: 'Estrategia general de análisis estadístico', status: 'missing' },
]

export default function AsistenteMetodologico() {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [reviewed, setReviewed] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const cargarEjemplo = () => {
    setForm(EJEMPLO_METODOLOGICO)
    setReviewed(false)
  }

  const analizar = () => {
    setLoading(true)
    setReviewed(false)
    setTimeout(() => {
      setReviewed(true)
      setLoading(false)
    }, 1000)
  }

  const canSubmit = form.pregunta.trim().length > 0

  return (
    <div className="module">
      <h1>Asistente metodológico</h1>
      <p className="section-lede">
        Revisa la coherencia general de tu propuesta antes de avanzar hacia el
        protocolo definitivo.
      </p>

      <PrivacyBanner />

      <Card className="form-card">
        <label className="field">
          <span>Pregunta de investigación</span>
          <textarea rows={2} value={form.pregunta} onChange={update('pregunta')} />
        </label>
        <label className="field">
          <span>Objetivo general</span>
          <textarea rows={2} value={form.objetivoGeneral} onChange={update('objetivoGeneral')} />
        </label>
        <label className="field">
          <span>Tipo de estudio</span>
          <input type="text" value={form.tipoEstudio} onChange={update('tipoEstudio')} />
        </label>
        <label className="field">
          <span>Población</span>
          <input type="text" value={form.poblacion} onChange={update('poblacion')} />
        </label>
        <label className="field">
          <span>Variable principal</span>
          <input type="text" value={form.variablePrincipal} onChange={update('variablePrincipal')} />
        </label>

        <div className="form-card__actions">
          <Button variant="ghost" onClick={cargarEjemplo}>
            Cargar ejemplo
          </Button>
          <Button icon={FlaskConical} onClick={analizar} disabled={!canSubmit || loading}>
            Analizar metodología
          </Button>
        </div>
      </Card>

      {loading && <LoadingState label="Analizando metodología..." />}

      {reviewed && !loading && (
        <Card tone="highlight" className="result-card">
          <h2>Revisión metodológica</h2>
          <ul className="review-list">
            {REVIEW_ITEMS.map((item) => (
              <li key={item.label} className="review-list__item">
                <span>{item.label}</span>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
          <AiNote>
            Revisión orientativa generada por IA. No constituye una calificación
            numérica ni una aprobación metodológica.
          </AiNote>
        </Card>
      )}
    </div>
  )
}
