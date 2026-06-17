import { Link } from 'react-router-dom'

interface NavProps {
  cta: { to: string; label: string }
}

export default function Nav({ cta }: NavProps) {
  return (
    <header className="nav">
      <Link className="brand" to="/">
        <span className="logo"></span>
        <span>Strive</span>
      </Link>
      <nav>
        <Link to="/athlete">Athletes</Link>
        <Link to="/mentor">Mentors</Link>
        <Link to="/coach">Coaches</Link>
        <Link to="/profile">Profiles</Link>
        <Link to="/meal">Meal Plan</Link>
        <Link to="/training">Training</Link>
      </nav>
      <Link className="navCta" to={cta.to}>
        {cta.label}
      </Link>
    </header>
  )
}
