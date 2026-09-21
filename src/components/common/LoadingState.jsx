import { Loader2 } from 'lucide-react'

export default function LoadingState({ label = 'Procesando...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Loader2 size={18} strokeWidth={2} className="loading-state__spinner" />
      <span>{label}</span>
    </div>
  )
}
