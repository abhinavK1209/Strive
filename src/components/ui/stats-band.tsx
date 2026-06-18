import { useEffect, useRef, useState } from 'react'

interface StatProps {
  value: number
  suffix?: string
  label: string
}

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!run) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setN(target)
      return
    }
    let raf = 0
    let start = 0
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration])

  return n
}

function Stat({ value, suffix, label }: StatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '-80px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const n = useCountUp(value, inView)

  return (
    <div ref={ref}>
      <div className="statNum">
        <span>{compact.format(n)}</span>
        {suffix ? <span className="statAccent">{suffix}</span> : null}
      </div>
      <p className="statLabel">{label}</p>
    </div>
  )
}

const stats: StatProps[] = [
  { value: 2400, suffix: '+', label: 'Athletes recruited' },
  { value: 180, label: 'College mentors' },
  { value: 320, label: 'Verified coaches' },
  { value: 1200000, label: 'Highlight views' },
]

export function StatsBand() {
  return (
    <section className="section" id="stats">
      <div className="statsRow">
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </section>
  )
}
