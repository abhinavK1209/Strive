import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ROLE_HOME, ROLE_LABEL, ROLE_NAV, useAuth } from './Auth'

export default function Nav() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()

  const signOut = () => {
    logout()
    navigate('/login')
  }

  const links = role ? ROLE_NAV[role] : []

  return (
    <header className="nav">
      <Link className="brand" to={role ? ROLE_HOME[role] : '/'} aria-label="Strive home">
        <span className="logo" aria-hidden="true"></span>
        <span>Strive</span>
      </Link>
      <nav aria-label="Primary">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="navActions">
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
