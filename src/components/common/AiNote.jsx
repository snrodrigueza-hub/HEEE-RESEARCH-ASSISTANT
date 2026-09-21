import { Sparkles } from 'lucide-react'

export default function AiNote({ children }) {
  return (
    <p className="ai-note">
      <Sparkles size={14} strokeWidth={2} />
      {children}
    </p>
  )
}
