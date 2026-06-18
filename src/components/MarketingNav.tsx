import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ROLE_HOME, useAuth } from './Auth'

const SECTIONS = [
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How it works' },
  { id: 'testimonials', label: 'Testimonials' },
]

export default function MarketingNav() {
  const { role } = useAuth()
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <header className="nav">
      <Link className="brand" to="/" aria-label="Strive home">
        <span className="logo" aria-hidden="true"></span>
        <span>Strive</span>
      </Link>
      <nav aria-label="Sections">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? 'active' : undefined}
            aria-current={active === s.id ? 'true' : undefined}
          >
            {s.label}
          </a>
        ))}
      </nav>
      <div className="navActions">
        {role ? (
          <Link className="navCta" to={ROLE_HOME[role]}>
            Go to Dashboard
          </Link>
        ) : (
          <Link className="navCta" to="/login">
            Log In
          </Link>
        )}
      </div>
    </header>
  )
}
