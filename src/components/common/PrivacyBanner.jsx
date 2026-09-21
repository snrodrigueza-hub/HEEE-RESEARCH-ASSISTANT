import { ShieldAlert } from 'lucide-react'

export default function PrivacyBanner() {
  return (
    <div className="privacy-banner">
      <ShieldAlert size={16} strokeWidth={2} />
      <p>
        Por seguridad y confidencialidad, no ingrese nombres, números de historia
        clínica, cédulas ni otros datos identificables de pacientes.
      </p>
    </div>
  )
}
