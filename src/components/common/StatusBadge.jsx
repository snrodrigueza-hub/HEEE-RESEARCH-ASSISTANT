import { Check, AlertTriangle, Circle } from 'lucide-react'

const CONFIG = {
  ok: { label: 'Adecuado', icon: Check, tone: 'success' },
  review: { label: 'Revisar', icon: AlertTriangle, tone: 'warning' },
  missing: { label: 'No identificado', icon: Circle, tone: 'neutral' },
}

export default function StatusBadge({ status, label }) {
  const cfg = CONFIG[status] || CONFIG.missing
  const Icon = cfg.icon
  return (
    <span className={`status-badge status-badge--${cfg.tone}`}>
      <Icon size={14} strokeWidth={2.5} />
      {label || cfg.label}
    </span>
  )
}
