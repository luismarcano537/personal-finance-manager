import { useId } from 'react'

export type LineChartPoint = {
  label: string
  income: number
  expenses: number
}

type StewardlyLineChartProps = {
  data: LineChartPoint[]
  height?: number
  showLegend?: boolean
  className?: string
}

type Point = {
  x: number
  y: number
}

// Fixed internal coordinate space; the SVG scales responsively to its container.
const VIEW_WIDTH = 560
const VIEW_HEIGHT = 220
const PADDING_X = 16
const PADDING_TOP = 18
const PADDING_BOTTOM = 26

/**
 * Income vs expenses flow, drawn as pure SVG (no chart library).
 *
 * Values are normalized against the combined min/max of both series so the
 * two lines share a scale. Division by zero is guarded on every axis:
 *  - a single data point is centered horizontally;
 *  - a flat series (max === min) is drawn at the vertical middle.
 * Colors come from brand CSS variables, so the chart follows light/dark mode.
 */
function StewardlyLineChart({
  data,
  height = 220,
  showLegend = true,
  className = '',
}: StewardlyLineChartProps) {
  const gradientId = useId()
  const incomeAreaId = `${gradientId}-income-area`
  const incomeLineId = `${gradientId}-income-line`

  if (data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-3xl border border-dashed border-brand-border bg-brand-surface-muted/60 text-sm font-medium text-brand-text-muted ${className}`}
        style={{ height }}
      >
        Sem dados para exibir ainda
      </div>
    )
  }

  const values = data.flatMap((point: LineChartPoint) => [
    point.income,
    point.expenses,
  ])
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const range = maxValue - minValue

  const plotTop = PADDING_TOP
  const plotBottom = VIEW_HEIGHT - PADDING_BOTTOM
  const plotHeight = plotBottom - plotTop
  const plotLeft = PADDING_X
  const plotRight = VIEW_WIDTH - PADDING_X
  const plotWidth = plotRight - plotLeft

  const xFor = (index: number): number => {
    if (data.length === 1) {
      return VIEW_WIDTH / 2
    }
    return plotLeft + (plotWidth * index) / (data.length - 1)
  }

  const yFor = (value: number): number => {
    // range === 0 keeps the ratio at the vertical middle instead of dividing by zero.
    const ratio = range === 0 ? 0.5 : (value - minValue) / range
    return plotTop + (1 - ratio) * plotHeight
  }

  const incomePoints: Point[] = data.map((point: LineChartPoint, index: number) => ({
    x: xFor(index),
    y: yFor(point.income),
  }))
  const expensePoints: Point[] = data.map((point: LineChartPoint, index: number) => ({
    x: xFor(index),
    y: yFor(point.expenses),
  }))

  const toLine = (points: Point[]): string =>
    points
      .map((point: Point, index: number) =>
        `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
      )
      .join(' ')

  const incomeLinePath = toLine(incomePoints)
  const expenseLinePath = toLine(expensePoints)

  const firstX = incomePoints[0].x
  const lastX = incomePoints[incomePoints.length - 1].x
  const incomeAreaPath = `M ${firstX.toFixed(2)} ${plotBottom.toFixed(2)} ${incomePoints
    .map((point: Point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ')} L ${lastX.toFixed(2)} ${plotBottom.toFixed(2)} Z`

  return (
    <div className={className}>
      <svg
        aria-hidden="true"
        className="h-auto w-full"
        preserveAspectRatio="none"
        role="presentation"
        style={{ height }}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      >
        <defs>
          <linearGradient id={incomeAreaId} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              style={{ stopColor: 'var(--color-brand-primary)', stopOpacity: 0.28 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: 'var(--color-brand-primary)', stopOpacity: 0 }}
            />
          </linearGradient>
          <linearGradient id={incomeLineId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" style={{ stopColor: 'var(--color-brand-sky)' }} />
            <stop offset="55%" style={{ stopColor: 'var(--color-brand-primary)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-brand-gold)' }} />
          </linearGradient>
        </defs>

        <path d={incomeAreaPath} fill={`url(#${incomeAreaId})`} />

        <path
          d={expenseLinePath}
          fill="none"
          stroke="var(--color-brand-gold)"
          strokeDasharray="2 7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4}
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={incomeLinePath}
          fill="none"
          stroke={`url(#${incomeLineId})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={6}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {showLegend ? (
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-text-muted">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-brand-primary"
            />
            Income
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-text-muted">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-brand-gold"
            />
            Expenses
          </span>
        </div>
      ) : null}
    </div>
  )
}

export default StewardlyLineChart
