type BrandLogoProps = {
  className?: string
  compact?: boolean
  showTagline?: boolean
  showText?: boolean
}

function BrandLogo({
  className = '',
  compact = false,
  showTagline = false,
  showText = true,
}: BrandLogoProps) {
  const markClassName = compact
    ? 'grid h-9 w-9 shrink-0 grid-cols-3 items-end gap-0.5 rounded-lg bg-brand-primary p-2 shadow-[0_8px_20px_rgba(59,170,114,0.24)]'
    : 'grid h-11 w-11 shrink-0 grid-cols-3 items-end gap-0.5 rounded-xl bg-brand-primary p-2.5 shadow-[0_10px_24px_rgba(59,170,114,0.24)]'
  const firstBarClassName = compact ? 'h-1.5' : 'h-2'
  const secondBarClassName = compact ? 'h-3' : 'h-4'
  const thirdBarClassName = compact ? 'h-5' : 'h-6'

  return (
    <span
      aria-label={showText ? undefined : 'Stewardly'}
      className={`inline-flex min-w-0 items-center ${compact ? 'gap-2.5' : 'gap-3'} ${className}`}
      role={showText ? undefined : 'img'}
    >
      <span aria-hidden="true" className={markClassName}>
        <span className={`${firstBarClassName} rounded-sm bg-white/80`} />
        <span className={`${secondBarClassName} rounded-sm bg-white/90`} />
        <span className={`${thirdBarClassName} rounded-sm bg-white`} />
      </span>

      {showText ? (
        <span className="brand-logo-copy flex min-w-0 flex-col">
          <span
            className={`${compact ? 'text-lg' : 'text-xl'} truncate font-bold leading-tight text-brand-text-strong`}
          >
            Stewardly
          </span>
          {showTagline ? (
            <span className="brand-logo-tagline truncate text-xs leading-5 text-brand-text-muted">
              Manage the little. Prepare for more.
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  )
}

export default BrandLogo
