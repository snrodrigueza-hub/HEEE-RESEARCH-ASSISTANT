import { useState } from 'react'
import { ClipboardCheck, Circle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Card from './common/Card.jsx'
import Button from './common/Button.jsx'
import LoadingState from './common/LoadingState.jsx'
import PrivacyBanner from './common/PrivacyBanner.jsx'
import { EJEMPLO_PROTOCOLO_TEXTO } from '../data/examples.js'

// Revisión simulada, preparada para sustituirse por una llamada real a una
// API de revisión de protocolos.
const REVISION_ITEMS = [
  { label: 'Pregunta de investigación', tone: 'identified' },
  { label: 'Objetivos', tone: 'identified' },
  { label: 'Coherencia metodológica', tone: 'clarify' },
  { label: 'Población', tone: 'identified' },
  { label: 'Variables', tone: 'clarify' },
  { label: 'Aspectos éticos', tone: 'identified' },
  { label: 'Consentimiento informado', tone: 'identified' },
  { label: 'Documentación necesaria', tone: 'missing' },
]

const TONE_CONFIG = {
  identified: { icon: CheckCircle2, dot: '🟢', title: 'Elementos identificados' },
  clarify: { icon: AlertTriangle, dot: '🟡', title: 'Aspectos que requieren aclaración' },
  missing: { icon: Circle, dot: '🔴', title: 'Elementos aparentemente faltantes' },
}

export default function RevisionProtocolo() {
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const [reviewed, setReviewed] = useState(false)

  const cargarEjemplo = () => {
    setTexto(EJEMPLO_PROTOCOLO_TEXTO)
    setReviewed(false)
  }

  const revisar = () => {
    setLoading(true)
    setReviewed(false)
    setTimeout(() => {
      setReviewed(true)
      setLoading(false)
    }, 1000)
  }

  const grouped = ['identified', 'clarify', 'missing'].map((tone) => ({
    tone,
    ...TONE_CONFIG[tone],
    items: REVISION_ITEMS.filter((i) => i.tone === tone),
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
          <Button icon={ClipboardCheck} onClick={revisar} disabled={!texto.trim() || loading}>
            Revisar protocolo
          </Button>
        </div>
      </Card>

      {loading && <LoadingState label="Revisando protocolo..." />}

      {reviewed && !loading && (
        <Card tone="highlight" className="result-card">
          <h2>Revisión preliminar</h2>

          {grouped.map((group) => (
            <div key={group.tone} className="revision-group">
              <h3>
                <span aria-hidden="true">{group.dot}</span> {group.title}
              </h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>{item.label}</li>
                ))}
              </ul>
            </div>
          ))}

          <p className="revision-disclaimer">
            Esta revisión es orientativa y no sustituye la evaluación de la
            Coordinación de Docencia e Investigación, revisores metodológicos
            ni del CEISH.
          </p>
        </Card>
      )}
    </div>
  )
}
