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

export default function AsistenteMetodologico() {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [reviewItems, setReviewItems] = useState([])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const cargarEjemplo = () => {
    setForm(EJEMPLO_METODOLOGICO)
    setReviewed(false)
    setReviewItems([])
  }

  const analizar = async () => {
    setLoading(true)
    setReviewed(false)
    setReviewItems([])

    try {
      const response = await fetch('/.netlify/functions/asistente-metodologico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pregunta: form.pregunta,
          objetivoGeneral: form.objetivoGeneral,
          tipoEstudio: form.tipoEstudio,
          poblacion: form.poblacion,
          variablePrincipal: form.variablePrincipal
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo realizar el análisis')
      }

      if (!data.resultado?.items || !Array.isArray(data.resultado.items)) {
        throw new Error('La respuesta de la IA no tiene el formato esperado')
      }

      setReviewItems(data.resultado.items)
      setReviewed(true)

    } catch (error) {
      console.error(error)
      alert('No fue posible realizar el análisis metodológico. Inténtalo nuevamente.')
    } finally {
      setLoading(false)
    }
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
          <textarea
            rows={2}
            value={form.pregunta}
            onChange={update('pregunta')}
          />
        </label>

        <label className="field">
          <span>Objetivo general</span>
          <textarea
            rows={2}
            value={form.objetivoGeneral}
            onChange={update('objetivoGeneral')}
          />
        </label>

        <label className="field">
          <span>Tipo de estudio</span>
          <input
            type="text"
            value={form.tipoEstudio}
            onChange={update('tipoEstudio')}
          />
        </label>

        <label className="field">
          <span>Población</span>
          <input
            type="text"
            value={form.poblacion}
            onChange={update('poblacion')}
          />
        </label>

        <label className="field">
          <span>Variable principal</span>
          <input
            type="text"
            value={form.variablePrincipal}
            onChange={update('variablePrincipal')}
          />
        </label>

        <div className="form-card__actions">
          <Button variant="ghost" onClick={cargarEjemplo}>
            Cargar ejemplo
          </Button>

          <Button
            icon={FlaskConical}
            onClick={analizar}
            disabled={!canSubmit || loading}
          >
            Analizar metodología
          </Button>
        </div>
      </Card>

      {loading && <LoadingState label="Analizando metodología con IA..." />}

      {reviewed && !loading && (
        <Card tone="highlight" className="result-card">
          <h2>Revisión metodológica</h2>

          <ul className="review-list">
            {reviewItems.map((item) => (
              <li key={item.label} className="review-list__item">
                <div>
                  <strong>{item.label}</strong>

                  {item.comentario && (
                    <p className="muted" style={{ marginTop: '6px' }}>
                      {item.comentario}
                    </p>
                  )}
                </div>

                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>

          <AiNote>
            Revisión orientativa generada por inteligencia artificial. Requiere
            revisión del investigador y no constituye una calificación numérica,
            aprobación metodológica ni evaluación ética.
          </AiNote>
        </Card>
      )}
    </div>
  )
}
