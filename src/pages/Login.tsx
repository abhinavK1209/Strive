import { Link, useNavigate } from 'react-router-dom'
import { ROLE_HOME, useAuth, type Role } from '../components/Auth'

const roles: { role: Role; title: string; blurb: string; cta: string }[] = [
  {
    role: 'athlete',
    title: 'High School Athlete',
    blurb: 'Build your profile, book mentors, and track coach interest.',
    cta: 'Enter as Athlete',
  },
  {
    role: 'mentor',
    title: 'College Mentor',
    blurb: 'Set your rates, open availability, and manage bookings.',
    cta: 'Enter as Mentor',
  },
  {
    role: 'coach',
    title: 'College Coach',
    blurb: 'Browse the recruiting feed, save recruits, and make contact.',
    cta: 'Enter as Coach',
  },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const choose = (role: Role) => {
    login(role)
    navigate(ROLE_HOME[role])
  }

  return (
    <main className="login">
      <section className="loginCard">
        <Link className="brand" to="/" aria-label="Strive home">
          <span className="logo" aria-hidden="true"></span>
          <span>Strive</span>
        </Link>
        <p className="eyebrow">Choose your view</p>
        <h1>How do you want to use Strive?</h1>
        <p>
          Pick a role to enter the matching dashboard. Each account only sees
          its own pages — sign out to switch roles.
        </p>
        <div className="grid three">
          {roles.map((r) => (
            <article className="card" key={r.role}>
              <h3>{r.title}</h3>
              <p>{r.blurb}</p>
              <button
                type="button"
                className="button primary"
                onClick={() => choose(r.role)}
              >
                {r.cta}
              </button>
            </article>
          ))}
        </div>
        <p className="muted">
          <Link to="/">Learn more about Strive</Link>
        </p>
      </section>
    </main>
  )
}
