import { useMemo, useState } from 'react'
import Nav from '../components/Nav'
import { Flow, useModal } from '../components/Modal'
import { athletes, type Athlete } from '../data'

function ContactFlow({
  athlete,
  onSent,
}: {
  athlete: Athlete
  onSent: () => void
}) {
  return (
    <Flow>
      {({ complete }) => (
        <>
          <p>
            Because this is a verified coach account, you can initiate contact
            after showing recruiting interest.
          </p>
          <p>
            <strong>{athlete.school}</strong>
            <br />
            {athlete.stats}
            <br />
            Class of {athlete.year} | GPA {athlete.gpa}
          </p>
          <button
            type="button"
            className="button primary"
            onClick={() => {
              onSent()
              complete(
                `Interest sent to ${athlete.name}. They can now respond and schedule a call with your program.`,
              )
            }}
          >
            Send Interest
          </button>
        </>
      )}
    </Flow>
  )
}

export default function CoachDashboard() {
  const { showModal } = useModal()
  const [sport, setSport] = useState('all')
  const [position, setPosition] = useState('all')
  const [saved, setSaved] = useState<Athlete[]>([])
  const [contacted, setContacted] = useState<string[]>([])

  const list = useMemo(
    () =>
      athletes.filter(
        (a) =>
          (sport === 'all' || a.sport === sport) &&
          (position === 'all' || a.position === position),
      ),
    [sport, position],
  )

  const saveAthlete = (a: Athlete) =>
    setSaved((prev) =>
      prev.some((s) => s.name === a.name) ? prev : [...prev, a],
    )

  const contactAthlete = (a: Athlete) =>
    showModal(
      `Contact ${a.name}`,
      <ContactFlow
        athlete={a}
        onSent={() =>
          setContacted((prev) =>
            prev.includes(a.name) ? prev : [...prev, a.name],
          )
        }
      />,
    )

  return (
    <>
      <Nav cta={{ to: '/profile', label: 'Profile View' }} />
      <main>
        <section className="section coach">
          <div className="header">
            <div>
              <p className="eyebrow">College coach dashboard</p>
              <h2>Verified recruiting feed</h2>
            </div>
            <div className="filters">
              <select
                id="sport"
                aria-label="Filter by sport"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
              >
                <option value="all">All sports</option>
                <option>Football</option>
                <option>Basketball</option>
                <option>Soccer</option>
              </select>
              <select
                id="position"
                aria-label="Filter by position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="all">All positions</option>
                <option>Wide Receiver</option>
                <option>Point Guard</option>
                <option>Forward</option>
              </select>
            </div>
          </div>
          <div className="coachLayout">
            <div id="feed" className="feed">
              {list.length ? (
                list.map((a) => (
                  <article className="athleteCard" key={a.name}>
                    <div className="athleteContent">
                      <p className="eyebrow">
                        {a.sport} | {a.position}
                      </p>
                      <h3>{a.name}</h3>
                      <p>
                        {a.school} | Class of {a.year} | {a.state} | GPA {a.gpa}
                      </p>
                      <strong>{a.stats}</strong>
                      <div className="cardActions">
                        <button
                          className="button primary"
                          disabled={saved.some((s) => s.name === a.name)}
                          onClick={() => saveAthlete(a)}
                        >
                          {saved.some((s) => s.name === a.name)
                            ? 'Saved'
                            : 'Save Athlete'}
                        </button>
                        <button
                          className="button ghost"
                          disabled={contacted.includes(a.name)}
                          onClick={() => contactAthlete(a)}
                        >
                          {contacted.includes(a.name) ? 'Interest Sent' : 'Contact'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="panel">
                  <h3>No athletes match those filters.</h3>
                  <p>Try another sport or position.</p>
                </div>
              )}
            </div>
            <aside className="panel">
              <h3>Saved Recruits</h3>
              <div id="saved" aria-live="polite">
                {saved.length ? (
                  saved.map((a) => (
                    <div className="request" key={a.name}>
                      <strong>{a.name}</strong>
                      <span>
                        {a.sport} | {a.position} | {a.gpa} GPA
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No saved recruits yet.</p>
                )}
              </div>
              <p className="muted">
                Athletes cannot message coaches first. Coaches initiate contact
                after saving or showing interest.
              </p>
            </aside>
          </div>
        </section>
      </main>
    </>
  )
}
