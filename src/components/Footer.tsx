import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div>
        <Link className="brand" to="/" aria-label="Strive home">
          <span className="logo" aria-hidden="true"></span>
          <span>Strive</span>
        </Link>
        <p className="footerTag">
          The recruiting platform for serious athletes — profile, mentorship,
          discovery, and training in one place.
        </p>
      </div>

      <nav className="footerCol" aria-label="Platform">
        <h4>Platform</h4>
        <ul>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#how">How it works</a>
          </li>
          <li>
            <a href="#testimonials">Testimonials</a>
          </li>
        </ul>
      </nav>

      <nav className="footerCol" aria-label="Company">
        <h4>Company</h4>
        <ul>
          <li>
            <Link to="/login">Log in</Link>
          </li>
          <li>
            <a href="mailto:hello@strive.app">Contact</a>
          </li>
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>
            <a href="#">Terms</a>
          </li>
        </ul>
      </nav>

      <div className="footerBar">
        <span>© 2026 Strive. All rights reserved.</span>
        <span>Built for athletes, mentors, and coaches.</span>
      </div>
    </footer>
  )
}
