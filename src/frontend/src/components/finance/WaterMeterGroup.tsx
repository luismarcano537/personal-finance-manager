import WaterMeter from './WaterMeter'

export type WaterMeterItem = {
  label: string
  value: number
  max?: number
  tone?: 'primary' | 'gold' | 'sky'
}

type WaterMeterGroupProps = {
  items: WaterMeterItem[]
  className?: string
}

/**
 * Responsive row of water meters. On mobile it stays a comfortable two-up
 * grid (never overflowing horizontally); on wider screens the meters spread
 * out evenly.
 */
function WaterMeterGroup({ items, className = '' }: WaterMeterGroupProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 ${className}`}
    >
      {items.map((item: WaterMeterItem, index: number) => (
        <WaterMeter
          key={`${item.label}-${index}`}
          label={item.label}
          max={item.max}
          tone={item.tone}
          value={item.value}
        />
      ))}
    </div>
  )
}

export default WaterMeterGroup
