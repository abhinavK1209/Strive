import { Link } from 'react-router-dom'

export function CtaBand() {
  return (
    <section className="section">
      <div className="ctaPanel">
        <h2>Start building your recruiting profile today.</h2>
        <p>
          Pick your role, set up your profile, and connect with mentors and
          coaches in minutes.
        </p>
        <div className="actions">
          <Link className="button primary" to="/login">
            Get Started
          </Link>
          <Link className="button ghost" to="/coach">
            See the Coach Feed
          </Link>
        </div>
      </div>
    </section>
  )
}
