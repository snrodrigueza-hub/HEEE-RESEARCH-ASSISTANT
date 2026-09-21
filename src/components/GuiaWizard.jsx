import { useMemo, useState } from 'react'
import { ArrowRight, ArrowLeft, Check, RotateCcw } from 'lucide-react'
import Card from './common/Card.jsx'
import Button from './common/Button.jsx'

const QUESTIONS = [
  {
    key: 'ideaDefinida',
    text: '¿Ya tienes una idea de investigación definida?',
  },
  {
    key: 'tieneProtocolo',
    text: '¿Ya cuentas con un protocolo?',
  },
  {
    key: 'usaRecursosInstitucionales',
    text: '¿La investigación utilizará datos o recursos institucionales?',
  },
  {
    key: 'multiplesEstablecimientos',
    text: '¿Se realizará en más de un establecimiento de salud?',
  },
  {
    key: 'sujetosHumanos',
    text: '¿Involucra investigación en seres humanos?',
  },
  {
    key: 'tieneCartaInteres',
    text: '¿Ya cuentas con Carta de Interés?',
    dependsOn: (a) => a.usaRecursosInstitucionales === true,
  },
  {
    key: 'tieneAprobacionEtica',
    text: '¿Ya cuentas con aprobación ética (CEISH)?',
    dependsOn: (a) => a.sujetosHumanos === true,
  },
]

function computeRoute(answers) {
  const steps = [
    { id: 'idea', label: 'Idea' },
    { id: 'protocolo', label: 'Protocolo' },
  ]
  if (answers.usaRecursosInstitucionales) {
    steps.push({ id: 'carta', label: 'Carta de Interés' })
  }
  if (answers.sujetosHumanos) {
    steps.push({ id: 'ceish', label: 'CEISH' })
  }
  steps.push({ id: 'inicio', label: 'Inicio de investigación' })

  let currentId = 'inicio'
  if (!answers.ideaDefinida) {
    currentId = 'idea'
  } else if (!answers.tieneProtocolo) {
    currentId = 'protocolo'
  } else if (answers.usaRecursosInstitucionales && !answers.tieneCartaInteres) {
    currentId = 'carta'
  } else if (answers.sujetosHumanos && !answers.tieneAprobacionEtica) {
    currentId = 'ceish'
  }

  const currentIndex = steps.findIndex((s) => s.id === currentId)

  return steps.map((s, i) => ({
    ...s,
    status: i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'pending',
  }))
}

const NEXT_STEP_GUIDANCE = {
  idea: {
    title: 'Define tu idea de investigación',
    text: 'Usa el módulo "Crear mi proyecto" para estructurar tu idea inicial con ayuda de IA.',
    moduleId: 'proyecto',
    moduleLabel: 'Ir a Crear mi proyecto',
  },
  protocolo: {
    title: 'Elabora tu protocolo',
    text: 'Usa el "Asistente metodológico" para revisar la coherencia de tu protocolo antes de continuar.',
    moduleId: 'metodologico',
    moduleLabel: 'Ir al Asistente metodológico',
  },
  carta: {
    title: 'Gestiona tu Carta de Interés',
    text: 'Revisa los documentos requeridos y el trámite correspondiente en "Trámites de Investigación".',
    moduleId: 'tramites',
    moduleLabel: 'Ir a Trámites de Investigación',
  },
  ceish: {
    title: 'Prepara tu evaluación ética',
    text: 'Consulta los requisitos y el proceso guiado en el módulo "CEISH".',
    moduleId: 'ceish',
    moduleLabel: 'Ir a CEISH',
  },
  inicio: {
    title: 'Puedes iniciar tu investigación',
    text: 'Según tus respuestas, ya cuentas con los elementos previos necesarios para comenzar. Verifica siempre con la Coordinación de Docencia e Investigación.',
    moduleId: null,
    moduleLabel: null,
  },
}

export default function GuiaWizard({ navigate }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  const visibleQuestions = useMemo(
    () => QUESTIONS.filter((q) => !q.dependsOn || q.dependsOn(answers)),
    [answers],
  )

  const question = visibleQuestions[stepIndex]

  const answer = (value) => {
    const next = { ...answers, [question.key]: value }
    setAnswers(next)
    const nextVisible = QUESTIONS.filter((q) => !q.dependsOn || q.dependsOn(next))
    if (stepIndex + 1 < nextVisible.length) {
      setStepIndex(stepIndex + 1)
    } else {
      setFinished(true)
    }
  }

  const goBack = () => {
    if (stepIndex === 0) return
    setStepIndex(stepIndex - 1)
  }

  const restart = () => {
    setAnswers({})
    setStepIndex(0)
    setFinished(false)
  }

  if (finished) {
    const route = computeRoute(answers)
    const currentStep = route.find((s) => s.status === 'current') || route[route.length - 1]
    const guidance = NEXT_STEP_GUIDANCE[currentStep.id]

    return (
      <div className="wizard-result">
        <h1>Tu ruta de investigación</h1>
        <p className="section-lede">
          Esta ruta se generó a partir de tus respuestas y muestra el siguiente
          paso sugerido.
        </p>

        <Card className="route-flow">
          {route.map((step, i) => (
            <div key={step.id} className="route-flow__row">
              <div className={`route-flow__node route-flow__node--${step.status}`}>
                {step.status === 'done' ? <Check size={15} strokeWidth={2.5} /> : <span className="route-flow__dot" />}
                <span>{step.label}</span>
              </div>
              {i < route.length - 1 && <div className="route-flow__connector" />}
            </div>
          ))}
        </Card>

        <Card tone="highlight" className="next-step-card">
          <p className="next-step-card__eyebrow">Siguiente paso</p>
          <h2>{guidance.title}</h2>
          <p>{guidance.text}</p>
          {guidance.moduleId && (
            <Button onClick={() => navigate(guidance.moduleId)} icon={ArrowRight}>
              {guidance.moduleLabel}
            </Button>
          )}
        </Card>

        <button className="wizard-restart" onClick={restart}>
          <RotateCcw size={15} strokeWidth={2} />
          Volver a responder
        </button>
      </div>
    )
  }

  return (
    <div className="wizard">
      <h1>Guíame con mi investigación</h1>
      <p className="section-lede">
        Responde estas preguntas para construir tu ruta de investigación.
      </p>

      <div className="wizard__progress">
        <div
          className="wizard__progress-bar"
          style={{ width: `${((stepIndex + 1) / visibleQuestions.length) * 100}%` }}
        />
      </div>
      <p className="wizard__step-count">
        Pregunta {stepIndex + 1} de {visibleQuestions.length}
      </p>

      <Card className="wizard__question-card">
        <h2>{question.text}</h2>
        <div className="wizard__answers">
          <Button variant="secondary" onClick={() => answer(true)}>
            Sí
          </Button>
          <Button variant="secondary" onClick={() => answer(false)}>
            No
          </Button>
        </div>
      </Card>

      {stepIndex > 0 && (
        <button className="wizard-restart" onClick={goBack}>
          <ArrowLeft size={15} strokeWidth={2} />
          Pregunta anterior
        </button>
      )}
    </div>
  )
}
