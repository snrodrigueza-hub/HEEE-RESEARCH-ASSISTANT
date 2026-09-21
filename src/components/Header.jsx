import { ArrowLeft, Microscope } from 'lucide-react'

export default function Header({ onHome, showBack, onBack }) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <button className="app-header__brand" onClick={onHome} aria-label="Ir al menú principal">
          <span className="app-header__mark">
            <Microscope size={20} strokeWidth={2} />
          </span>
          <span className="app-header__text">
            <strong>HEEE Research Assistant</strong>
            <span>Coordinación de Docencia e Investigación</span>
          </span>
        </button>

        {showBack && (
          <button className="app-header__back" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={2} />
            Menú principal
          </button>
        )}
      </div>
    </header>
  )
}
