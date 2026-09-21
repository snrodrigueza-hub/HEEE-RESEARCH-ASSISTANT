export default function Card({ children, className = '', tone = 'default', style }) {
  const toneClass = tone !== 'default' ? ` card--${tone}` : ''
  return (
    <div className={`card${toneClass} ${className}`} style={style}>
      {children}
    </div>
  )
}
