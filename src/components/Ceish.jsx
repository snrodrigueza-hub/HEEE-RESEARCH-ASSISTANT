import { useState } from 'react'
import { FolderOpen, Mail, MapPinned, Clock } from 'lucide-react'
import Card from './common/Card.jsx'
import Button from './common/Button.jsx'

const TRAMITES = ['Nueva investigación', 'Solicitud de enmienda', 'Renovación']

const TIPOS_ESTUDIO = [
  {
    id: 'observacional',
    label: 'Observacional o de intervención',
    documentos: [
      'Anexos 6, 2, 22, 26 y 5',
      'Protocolo de investigación',
      'Carta de interés',
      'Consentimiento informado',
      'Instrumentos utilizados',
    ],
  },
  {
    id: 'reporte',
    label: 'Reporte de caso',
    documentos: [
      'Anexo 34',
      'Protocolo de investigación',
      'Carta de intención',
      'Consentimiento informado',
      'Instrumentos utilizados',
    ],
  },
]

const FLUJO = ['Envío', 'Código CEISH', 'Estratificación', 'Revisores', 'Decisión']

const TIEMPOS = [
  { nivel: 'Sin riesgo', plazo: 'Hasta 15 días' },
  { nivel: 'Riesgo mínimo', plazo: 'Hasta 30 días' },
  { nivel: 'Riesgo mayor al mínimo', plazo: 'Hasta 45 días' },
]

export default function Ceish() {
  const [tramite, setTramite] = useState(null)
  const [tipoEstudio, setTipoEstudio] = useState(null)

  const tipoSeleccionado = TIPOS_ESTUDIO.find((t) => t.id === tipoEstudio)

  return (
    <div className="module">
      <h1>Comité de Ética de Investigación en Seres Humanos</h1>
      <p className="section-lede">Hospital de Especialidades Eugenio Espejo</p>

      <Card className="info-card">
        <p>
          El CEISH es un comité multidisciplinario, independiente y autónomo
          encargado de evaluar los aspectos éticos de las investigaciones en
          seres humanos, velando por la protección de sus derechos, seguridad
          y bienestar.
        </p>
      </Card>

      <Card className="step-card">
        <p className="step-card__label">Paso 1</p>
        <h2>¿Qué trámite quieres realizar?</h2>
        <div className="pill-options">
          {TRAMITES.map((t) => (
            <button
              key={t}
              className={`pill-option ${tramite === t ? 'pill-option--active' : ''}`}
              onClick={() => setTramite(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      {tramite && (
        <Card className="step-card">
          <p className="step-card__label">Paso 2</p>
          <h2>Identifica el tipo de estudio</h2>
          <div className="pill-options">
            {TIPOS_ESTUDIO.map((t) => (
              <button
                key={t.id}
                className={`pill-option ${tipoEstudio === t.id ? 'pill-option--active' : ''}`}
                onClick={() => setTipoEstudio(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tipoSeleccionado && (
            <div className="checklist checklist--plain">
              <h3>Documentos requeridos</h3>
              <ul>
                {tipoSeleccionado.documentos.map((d) => (
                  <li key={d}>☐ {d}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      <Card className="step-card">
        <p className="step-card__label">Paso 3</p>
        <h2>Envío de documentación</h2>
        <p className="ceish-email">
          <Mail size={16} strokeWidth={2} />
          comite.etica@hee.gob.ec
        </p>
        <p>
          Los documentos físicos deben entregarse además en la oficina del
          CEISH.
        </p>
      </Card>

      <Card className="step-card">
        <p className="step-card__label">Paso 4</p>
        <h2>Asignación de código CEISH</h2>
        <p>
          Se revisa la documentación y se asigna un código CEISH al proyecto
          para continuar con el proceso de evaluación.
        </p>
      </Card>

      <Card className="step-card">
        <p className="step-card__label">Paso 5</p>
        <h2>Estratificación y asignación de revisores</h2>
      </Card>

      <Card className="step-card">
        <p className="step-card__label">Paso 6</p>
        <h2>Decisión del CEISH</h2>
        <div className="pill-options pill-options--static">
          <span className="pill-option pill-option--static">Aprobado</span>
          <span className="pill-option pill-option--static">Aprobado con condiciones</span>
          <span className="pill-option pill-option--static">Rechazado</span>
        </div>
      </Card>

      <Card className="flow-card">
        <h2>Flujo del proceso</h2>
        <div className="simple-flow">
          {FLUJO.map((f, i) => (
            <div key={f} className="simple-flow__row">
              <span className="simple-flow__step">{f}</span>
              {i < FLUJO.length - 1 && <span className="simple-flow__arrow">→</span>}
            </div>
          ))}
        </div>
      </Card>

      <Card className="timing-card">
        <h2>
          <Clock size={17} strokeWidth={1.8} /> Tiempos de respuesta
        </h2>
        <p className="section-lede">Desde que se estratifica la investigación</p>
        <ul className="timing-list">
          {TIEMPOS.map((t) => (
            <li key={t.nivel}>
              <span>{t.nivel}</span>
              <strong>{t.plazo}</strong>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="contact-card">
        <h2>
          <MapPinned size={17} strokeWidth={1.8} /> Información CEISH
        </h2>
        <p>
          Edificio Patrimonial, segundo piso
          <br />
          Hospital de Especialidades Eugenio Espejo — Quito, Ecuador
        </p>
        <p>Horario: lunes, miércoles y viernes, 09:00 a 11:00</p>
        <p>Correo: comite.etica@hee.gob.ec</p>

        <Button
          as="a"
          href="https://drive.google.com/drive/folders/1IWTiMEljtdXQcuRMCHKI40_9RlqQh5lQ?usp=drive_link"
          target="_blank"
          variant="secondary"
          icon={FolderOpen}
        >
          Documentos y formatos CEISH
        </Button>
      </Card>
    </div>
  )
}
