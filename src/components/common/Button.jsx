export default function Button({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  type = 'button',
  disabled = false,
  as,
  href,
  target,
  rel,
  className = '',
}) {
  const Tag = as === 'a' ? 'a' : 'button'
  const props =
    Tag === 'a'
      ? { href, target, rel: target === '_blank' ? rel || 'noopener noreferrer' : rel }
      : { type, disabled }

  return (
    <Tag
      className={`btn btn--${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={17} strokeWidth={2} />}
      <span>{children}</span>
    </Tag>
  )
}
