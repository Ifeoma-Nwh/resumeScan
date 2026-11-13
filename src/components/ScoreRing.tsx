import { useLayoutEffect, useRef } from 'react'
import { scoreBand, type ScoreBand } from '../lib/scoring'

interface ScoreRingProps {
  score: number
}

const RING_RADIUS = 68
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const BAND_STROKE: Record<ScoreBand, string> = {
  'needs-work': 'stroke-rose-500',
  tailoring: 'stroke-amber-500',
  strong: 'stroke-emerald-500',
}

export function ScoreRing({ score }: ScoreRingProps) {
  const progressRef = useRef<SVGCircleElement>(null)
  const clampedScore = Math.min(100, Math.max(0, score))
  const dashOffset = RING_CIRCUMFERENCE * (1 - clampedScore / 100)

  useLayoutEffect(() => {
    const progress = progressRef.current
    if (progress === null) return
    const animation = progress.animate(
      [
        { strokeDashoffset: RING_CIRCUMFERENCE },
        { strokeDashoffset: dashOffset },
      ],
      { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
    )
    return () => animation.cancel()
  }, [dashOffset])

  return (
    <div className="relative h-40 w-40">
      <svg
        viewBox="0 0 160 160"
        role="img"
        aria-label={`Match score ${clampedScore} out of 100`}
        className="h-full w-full"
      >
        <circle
          cx={80}
          cy={80}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={12}
          className="stroke-slate-200"
        />
        <circle
          ref={progressRef}
          cx={80}
          cy={80}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 80 80)"
          className={BAND_STROKE[scoreBand(clampedScore)]}
        />
      </svg>
      <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular-nums tracking-tight text-slate-900">
          {clampedScore}
        </span>
        <span className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          match
        </span>
      </div>
    </div>
  )
}
