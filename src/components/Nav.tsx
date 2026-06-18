import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ROLE_LABEL, useAuth } from './Auth'

interface NavProps {
  cta: { to: string; label: string }
}

const links = [
  { to: '/athlete', label: 'Athletes' },
  { to: '/mentor', label: 'Mentors' },
  { to: '/coach', label: 'Coaches' },
  { to: '/profile', label: 'Profiles' },
  { to: '/meal', label: 'Meal Plan' },
  { to: '/training', label: 'Training' },
]

export default function Nav({ cta }: NavProps) {
  const { role, logout } = useAuth()
  const navigate = useNavigate()

  const signOut = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="nav">
      <Link className="brand" to="/" aria-label="Strive home">
        <span className="logo" aria-hidden="true"></span>
        <span>Strive</span>
      </Link>
      <nav aria-label="Primary">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="navActions">
        <Link className="navCta" to={cta.to}>
          {cta.label}
        </Link>
        {role && (
          <button type="button" className="button ghost navLogout" onClick={signOut}>
            Sign out{' '}
            <span className="navRole">{ROLE_LABEL[role]}</span>
          </button>
        )}
      </div>
    </header>
  )
}
