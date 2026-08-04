type WaterMeterTone = 'primary' | 'gold' | 'sky'

type WaterMeterProps = {
  label?: string
  value: number
  max?: number
  tone?: WaterMeterTone
  helper?: string
  className?: string
}

// Base fill colors resolve from brand tokens so the fill adapts to
// light/dark mode automatically.
const toneBaseColor: Record<WaterMeterTone, string> = {
  primary: 'var(--color-brand-primary)',
  gold: 'var(--color-brand-gold)',
  sky: 'var(--color-brand-sky)',
}

/**
 * Proprietary "filling water" meter used to express pressure, usage or
 * health. The fill reads like calm water: a soft vertical gradient with a
 * subtle highlight at the surface. Percentage is computed safely and clamped
 * between 0 and 100.
 */
function WaterMeter({
  label,
  value,
  max = 100,
  tone = 'primary',
  helper,
  className = '',
}: WaterMeterProps) {
  // Guard against a non-positive max (would divide by zero) before clamping.
  const rawPercent = max > 0 ? (value / max) * 100 : 0
  const percent = Math.min(100, Math.max(0, rawPercent))
  const baseColor = toneBaseColor[tone]

  return (
    <div className={`flex flex-col ${className}`}>
      {label || helper ? (
        <div className="mb-2 flex items-baseline justify-between gap-2">
          {label ? (
            <span className="truncate text-sm font-semibold text-brand-text-strong">
              {label}
            </span>
          ) : (
            <span />
          )}
          <span className="shrink-0 text-xs font-bold text-brand-text-muted">
            {Math.round(percent)}%
          </span>
        </div>
      ) : null}

      <div className="relative h-28 w-full overflow-hidden rounded-[18px_18px_14px_14px] border border-brand-border bg-brand-surface-muted">
        <div
          className="absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out"
          style={{
            height: `${percent}%`,
            background: `linear-gradient(180deg, color-mix(in srgb, ${baseColor} 60%, white) 0%, ${baseColor} 100%)`,
          }}
        >
          {/* Soft surface highlight to sell the "water" feel without looking childish. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-2 top-0 h-4 rounded-full opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.65), transparent 70%)',
            }}
          />
        </div>
      </div>

      {helper ? (
        <p className="mt-2 text-xs font-medium text-brand-text-muted">{helper}</p>
      ) : null}
    </div>
  )
}

export default WaterMeter
