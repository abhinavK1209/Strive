import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <Link className="brand" to="/">
        <span className="logo"></span>
        <span>Strive</span>
      </Link>
      <div>
        <Link to="/athlete">Athlete Dashboard</Link>
        <Link to="/mentor">Mentor Dashboard</Link>
        <Link to="/coach">Coach Feed</Link>
      </div>
    </footer>
  )
}
