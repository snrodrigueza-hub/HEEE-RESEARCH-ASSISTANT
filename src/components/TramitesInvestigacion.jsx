import { useState } from 'react'
import { FolderOpen, ExternalLink, MapPin } from 'lucide-react'
import Card from './common/Card.jsx'
import Button from './common/Button.jsx'

const REQUISITOS = [
  {
    id: 'anexo1',
    title: 'Anexo 1',
    text: 'Solicitud de carta para la emisión de Carta de Interés Institucional con fines de investigación.',
  },
  {
    id: 'anexo2',
    title: 'Anexo 2',
    text: 'Protocolo del estudio propuesto. Formulario para presentación de protocolos de investigaciones observacionales y de intervención en seres humanos.',
  },
]

const UBICACION_OPCIONES = [
  {
    id: 'unico',
    title: 'Un solo establecimiento',
    text: 'Solo en el Hospital de Especialidades Eugenio Espejo u otro establecimiento dentro de ese mismo ámbito de ejecución.',
    resultado: 'La solicitud se dirige al establecimiento de salud correspondiente.',
  },
  {
    id: 'provincia',
    title: 'Misma provincia',
    text: 'Dos o más establecimientos de salud y/o oficinas técnicas del MSP de una misma provincia.',
    resultado: 'La solicitud se dirige a la Dirección Provincial.',
  },
  {
    id: 'nacional',
    title: 'Varias provincias',
    text: 'Dos o más establecimientos de salud y/o oficinas técnicas del MSP de diferentes provincias.',
    resultado: 'La solicitud se dirige a Planta Central.',
  },
]

export default function TramitesInvestigacion() {
  const [checked, setChecked] = useState({})
  const [ubicacion, setUbicacion] = useState(null)

  const toggle = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }))

  return (
    <div className="module">
      <h1>Trámites de Investigación</h1>
      <p className="section-lede">Carta de Interés Institucional</p>

      <Card className="info-card">
        <p>
          La Carta de Interés es el documento que manifiesta el interés
          institucional sobre la conveniencia de que una investigación se
          realice en el Ministerio de Salud Pública, o que plantee la
          utilización de datos que reposen en la institución.
        </p>
      </Card>

      <Card className="checklist-card">
        <h2>Documentos requeridos</h2>
        <ul className="checklist">
          {REQUISITOS.map((r) => (
            <li key={r.id}>
              <label className="checklist__item">
                <input
                  type="checkbox"
                  checked={!!checked[r.id]}
                  onChange={() => toggle(r.id)}
                />
                <span>
                  <strong>{r.title}</strong>
                  <br />
                  {r.text}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <div className="form-card__actions">
          <Button
            as="a"
            href="https://drive.google.com/drive/folders/1eEqWIWcwn1bpDuGq3cR8_5UNF_4IPQGH?usp=drive_link"
            target="_blank"
            variant="secondary"
            icon={FolderOpen}
          >
            Consultar requisitos y formatos
          </Button>
          <Button
            as="a"
            href="https://www.gob.ec/msp/tramites/emision-carta-interes-institucional-fines-investigacion"
            target="_blank"
            icon={ExternalLink}
          >
            Realizar trámite
          </Button>
        </div>
      </Card>

      <Card className="location-card">
        <h2>¿Dónde se realizará el estudio?</h2>
        <div className="location-options">
          {UBICACION_OPCIONES.map((op) => (
            <button
              key={op.id}
              className={`location-option ${ubicacion === op.id ? 'location-option--active' : ''}`}
              onClick={() => setUbicacion(op.id)}
            >
              <strong>{op.title}</strong>
              <span>{op.text}</span>
            </button>
          ))}
        </div>

        {ubicacion && (
          <div className="location-result">
            <MapPin size={17} strokeWidth={2} />
            <span>{UBICACION_OPCIONES.find((o) => o.id === ubicacion).resultado}</span>
          </div>
        )}
      </Card>
    </div>
  )
}
