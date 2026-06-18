import { Link } from 'react-router-dom'
import MarketingNav from '../components/MarketingNav'
import Footer from '../components/Footer'
import { StatsBand } from '../components/ui/stats-band'
import { TestimonialsSection } from '../components/ui/testimonials'
import { CtaBand } from '../components/ui/cta-band'

export default function Landing() {
  return (
    <>
      <MarketingNav />
      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Recruiting platform for serious athletes</p>
            <h1>
              Get recruited with mentorship, video discovery, and performance
              tools.
            </h1>
            <p>
              Strive connects student-athletes with college mentors, puts
              verified coaches inside a sport-specific highlight feed, and gives
              athletes practical meal and training plans built for their goals.
            </p>
            <div className="actions">
              <Link className="button primary" to="/login">
                Get Started
              </Link>
              <a className="button ghost" href="#how">
                See how it works
              </a>
            </div>
          </div>
          <div className="phone">
            <img
              className="heroShot"
              src="/img/hero-athlete.jpg"
              alt="High-school guard rising for a jump shot under stadium lights"
            />
            <div className="feedText">
              <strong>Marcus Ellis</strong>
              <span>24.1 PPG | 3.8 GPA | Raleigh, NC</span>
            </div>
          </div>
        </section>

        <StatsBand />

        <section className="section soft" id="features">
          <h2>Everything a recruit needs in one platform.</h2>
          <p className="sectionLead">
            Profile, mentorship, discovery, and training — the full recruiting
            stack, built around your highlight reel.
          </p>
          <div className="featLayout">
            <article className="featLead">
              <h3>Coach Feed</h3>
              <p>
                College coaches discover you through a sport-specific feed of
                vertical highlights. Your film does the pitching — and only
                coaches can reach out first.
              </p>
              <Link className="button primary" to="/coach">
                See the feed
              </Link>
            </article>
            <ul className="featList">
              <li className="featItem">
                <span className="featIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3.2" />
                    <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
                  </svg>
                </span>
                <div>
                  <b>Recruiting Profiles</b>
                  <p>Stats, academics, achievements, and highlights in one link.</p>
                </div>
              </li>
              <li className="featItem">
                <span className="featIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5h16v10H8l-4 4z" />
                    <path d="M12 8v4M9.5 10h5" />
                  </svg>
                </span>
                <div>
                  <b>Paid Mentorship</b>
                  <p>College athletes set their own rates and manage sessions.</p>
                </div>
              </li>
              <li className="featItem">
                <span className="featIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 18V9M9.3 18V5M14.7 18v-6M20 18v-9" />
                  </svg>
                </span>
                <div>
                  <b>Performance Tools</b>
                  <p>Meal plans and training schedules built for your goals.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="section" id="how">
          <h2>Three role-specific paths, one recruiting network.</h2>
          <p className="sectionLead">
            Each side gets its own workflow — here's how athletes, mentors, and
            coaches connect.
          </p>
          <ol className="stepFlow">
            <li className="step">
              <span className="stepNum">01</span>
              <h3>High School Athlete</h3>
              <p>
                Create a profile, upload highlights, book mentors, and track
                coach interest.
              </p>
              <Link className="button primary" to="/login">
                Start as an Athlete
              </Link>
            </li>
            <li className="step">
              <span className="stepNum">02</span>
              <h3>College Mentor</h3>
              <p>
                Set prices, publish availability, review bookings, and see net
                payouts.
              </p>
              <Link className="button dark" to="/login">
                Join as a Mentor
              </Link>
            </li>
            <li className="step">
              <span className="stepNum">03</span>
              <h3>College Coach</h3>
              <p>
                Filter highlights, save recruits, and initiate contact after
                showing interest.
              </p>
              <Link className="button ghost" to="/coach">
                Open the Feed
              </Link>
            </li>
          </ol>
        </section>

        <TestimonialsSection />
        <CtaBand />
      </main>
      <Footer />
    </>
  )
}
