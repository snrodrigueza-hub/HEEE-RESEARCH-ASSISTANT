import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import GuiaWizard from './components/GuiaWizard.jsx'
import CrearProyecto from './components/CrearProyecto.jsx'
import AsistenteMetodologico from './components/AsistenteMetodologico.jsx'
import TramitesInvestigacion from './components/TramitesInvestigacion.jsx'
import Ceish from './components/Ceish.jsx'
import RevisionProtocolo from './components/RevisionProtocolo.jsx'

const VIEWS = {
  home: HomeScreen,
  guiame: GuiaWizard,
  proyecto: CrearProyecto,
  metodologico: AsistenteMetodologico,
  tramites: TramitesInvestigacion,
  ceish: Ceish,
  revision: RevisionProtocolo,
}

export default function App() {
  const [view, setView] = useState('home')

  const goHome = () => setView('home')
  const ActiveView = VIEWS[view] || HomeScreen

  return (
    <div className="app-shell">
      <Header onHome={goHome} showBack={view !== 'home'} onBack={goHome} />
      <main className="app-main">
        <ActiveView navigate={setView} goHome={goHome} />
      </main>
      <Footer />
    </div>
  )
}
