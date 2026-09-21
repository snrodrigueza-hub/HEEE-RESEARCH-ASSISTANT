import { Lightbulb, FlaskConical, FileText, Scale, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react'
import Card from './common/Card.jsx'
import PrivacyBanner from './common/PrivacyBanner.jsx'

const MODULES = [
  {
    id: 'proyecto',
    icon: Lightbulb,
    title: 'Crear mi proyecto',
    description: 'Estructura tu idea inicial en un borrador de protocolo con ayuda de IA.',
  },
  {
    id: 'metodologico',
    icon: FlaskConical,
    title: 'Asistente metodológico',
    description: 'Revisa la coherencia de tu pregunta, objetivos y diseño de estudio.',
  },
  {
    id: 'tramites',
    icon: FileText,
    title: 'Trámites de Investigación',
    description: 'Conoce el proceso de Carta de Interés y a dónde dirigir tu solicitud.',
  },
  {
    id: 'ceish',
    icon: Scale,
    title: 'CEISH',
    description: 'Orientación sobre el proceso de evaluación ética institucional.',
  },
]

export default function HomeScreen({ navigate }) {
  return (
    <div className="home">
      <section className="home__hero">
        <p className="home__eyebrow">Hospital de Especialidades Eugenio Espejo</p>
        <h1>HEEE Research Assistant</h1>
        <p className="home__subtitle">Asistente Inteligente de Investigación</p>
        <p className="home__lede">
          Un acompañante para tu investigación, desde la primera idea hasta la
          preparación metodológica y la orientación sobre los trámites
          institucionales de Investigación y CEISH.
        </p>

        <button className="home__cta" onClick={() => navigate('guiame')}>
          <Sparkles size={19} strokeWidth={2} />
          Guíame con mi investigación
          <ArrowRight size={18} strokeWidth={2} />
        </button>
      </section>

      <PrivacyBanner />

      <section className="home__modules">
        {MODULES.map((m) => (
          <Card key={m.id} className="module-card" style={{ cursor: 'pointer' }}>
            <button className="module-card__button" onClick={() => navigate(m.id)}>
              <span className="module-card__icon">
                <m.icon size={22} strokeWidth={1.8} />
              </span>
              <span className="module-card__body">
                <strong>{m.title}</strong>
                <span>{m.description}</span>
              </span>
              <ArrowRight size={18} strokeWidth={2} className="module-card__arrow" />
            </button>
          </Card>
        ))}
      </section>

      <Card className="revision-entry">
        <button className="revision-entry__button" onClick={() => navigate('revision')}>
          <span className="revision-entry__icon">
            <ShieldCheck size={20} strokeWidth={1.8} />
          </span>
          <span className="module-card__body">
            <strong>Revisión preliminar de protocolo con IA</strong>
            <span>Pega el texto de tu protocolo y recibe una revisión orientativa.</span>
          </span>
          <ArrowRight size={18} strokeWidth={2} className="module-card__arrow" />
        </button>
      </Card>
    </div>
  )
}
