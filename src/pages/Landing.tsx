import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <>
      <Nav cta={{ to: '/athlete', label: 'Launch App' }} />
      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Recruiting platform for serious athletes</p>
            <h1>
              Help high school athletes get recruited with mentorship, video
              discovery, and AI performance tools.
            </h1>
            <p>
              Strive connects student-athletes with college mentors, puts
              verified coaches inside a sport-specific highlight feed, and gives
              athletes practical meal and training plans built for their goals.
            </p>
            <div className="actions">
              <Link className="button primary" to="/athlete">
                Start as an Athlete
              </Link>
              <Link className="button dark" to="/mentor">
                Join as a College Mentor
              </Link>
              <Link className="button ghost" to="/coach">
                Coach Login
              </Link>
            </div>
          </div>
          <div className="phone">
            <div className="player"></div>
            <div className="feedText">
              <strong>Maya Collins</strong>
              <span>24.1 PPG | 3.8 GPA | Raleigh, NC</span>
            </div>
          </div>
        </section>
        <section className="section soft">
          <p className="eyebrow">MVP feature set</p>
          <h2>Everything a recruiting prototype needs to feel real.</h2>
          <div className="grid four">
            <article className="card">
              <b>Recruiting Profiles</b>
              <p>Stats, academics, achievements, and highlights.</p>
            </article>
            <article className="card">
              <b>Paid Mentorship</b>
              <p>College athletes set rates and manage sessions.</p>
            </article>
            <article className="card">
              <b>Coach Feed</b>
              <p>Coaches discover athletes through vertical highlights.</p>
            </article>
            <article className="card">
              <b>AI Tools</b>
              <p>Meal plans and training schedules for athlete goals.</p>
            </article>
          </div>
        </section>
        <section className="section">
          <p className="eyebrow">How it works</p>
          <h2>Three role-specific paths, one recruiting network.</h2>
          <div className="grid three">
            <article className="card">
              <h3>High School Athlete</h3>
              <p>
                Create a profile, upload highlights, book mentors, and track
                coach interest.
              </p>
              <Link className="button primary" to="/athlete">
                Open Dashboard
              </Link>
            </article>
            <article className="card">
              <h3>College Mentor</h3>
              <p>
                Set prices, publish availability, review bookings, and see net
                payouts.
              </p>
              <Link className="button dark" to="/mentor">
                Open Dashboard
              </Link>
            </article>
            <article className="card">
              <h3>College Coach</h3>
              <p>
                Filter highlights, save recruits, and initiate contact after
                showing interest.
              </p>
              <Link className="button ghost" to="/coach">
                Open Feed
              </Link>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
