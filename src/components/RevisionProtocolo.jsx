import { useState } from 'react'
import { ClipboardCheck, Circle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Card from './common/Card.jsx'
import Button from './common/Button.jsx'
import LoadingState from './common/LoadingState.jsx'
import PrivacyBanner from './common/PrivacyBanner.jsx'
import { EJEMPLO_PROTOCOLO_TEXTO } from '../data/examples.js'

const TONE_CONFIG = {
  identified: {
    icon: CheckCircle2,
    dot: '🟢',
    title: 'Elementos identificados'
  },
  clarify: {
    icon: AlertTriangle,
    dot: '🟡',
    title: 'Aspectos que requieren aclaración'
  },
  missing: {
    icon: Circle,
    dot: '🔴',
    title: 'Elementos aparentemente faltantes'
  },
}

export default function RevisionProtocolo() {
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [revisionItems, setRevisionItems] = useState([])

  const cargarEjemplo = () => {
    setTexto(EJEMPLO_PROTOCOLO_TEXTO)
    setReviewed(false)
    setRevisionItems([])
  }

  const revisar = async () => {
    setLoading(true)
    setReviewed(false)
    setRevisionItems([])

    try {
      const response = await fetch('/.netlify/functions/revision-protocolo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          texto: texto
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'No se pudo realizar la revisión del protocolo'
        )
      }

      if (!data.resultado?.items || !Array.isArray(data.resultado.items)) {
        throw new Error('La respuesta de la IA no tiene el formato esperado')
      }

      setRevisionItems(data.resultado.items)
      setReviewed(true)

    } catch (error) {
      console.error(error)
      alert(
        'No fue posible realizar la revisión del protocolo. Inténtalo nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const grouped = ['identified', 'clarify', 'missing'].map((tone) => ({
    tone,
    ...TONE_CONFIG[tone],
    items: revisionItems.filter((item) => item.tone === tone),
  }))

  return (
    <div className="module">
      <h1>Revisión preliminar de protocolo con IA</h1>

      <p className="section-lede">
        Pega el texto de tu protocolo para recibir una revisión orientativa
        antes de enviarlo a la Coordinación de Docencia e Investigación.
      </p>

      <PrivacyBanner />

      <Card className="form-card">
        <label className="field">
          <span>Texto del protocolo</span>

          <textarea
            rows={10}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Pega aquí el texto de tu protocolo, sin datos identificables de pacientes."
          />
        </label>

        <div className="form-card__actions">
          <Button variant="ghost" onClick={cargarEjemplo}>
            Cargar ejemplo
          </Button>

          <Button
            icon={ClipboardCheck}
            onClick={revisar}
            disabled={!texto.trim() || loading}
          >
            Revisar protocolo
          </Button>
        </div>
      </Card>

      {loading && (
        <LoadingState label="Revisando protocolo con IA..." />
      )}

      {reviewed && !loading && (
        <Card tone="highlight" className="result-card">
          <h2>Revisión preliminar</h2>

          {grouped.map((group) => (
            <div key={group.tone} className="revision-group">
              <h3>
                <span aria-hidden="true">{group.dot}</span>{' '}
                {group.title}
              </h3>

              {group.items.length > 0 ? (
                <ul>
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}</strong>

                      {item.comentario && (
                        <p
                          className="muted"
                          style={{ marginTop: '4px', marginBottom: '10px' }}
                        >
                          {item.comentario}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">
                  No se identificaron elementos en esta categoría.
                </p>
              )}
            </div>
          ))}

          <p className="revision-disclaimer">
            Esta revisión es orientativa y generada con inteligencia
            artificial. La clasificación de un elemento como identificado no
            implica aprobación. No sustituye la evaluación de la Coordinación
            de Docencia e Investigación, revisores metodológicos ni del CEISH.
          </p>
        </Card>
      )}
    </div>
  )
}
