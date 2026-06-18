import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import { Flow, useModal } from '../components/Modal'
import Scheduler, { type Slot } from '../components/Scheduler'
import { mentors, money, type Mentor } from '../data'

const ATHLETE_SPORT = 'Football'

function BookingFlow({
  mentor,
  onConfirmed,
}: {
  mentor: Mentor
  onConfirmed: (slot: Slot) => void
}) {
  return (
    <Flow>
      {({ complete }) => (
        <>
          <p>
            {mentor.name} offers film review, recruiting advice, training advice,
            nutrition advice, and college life Q&amp;A.
          </p>
          <div className="earn">
            <span>Session price</span>
            <strong>{money(mentor.price)}</strong>
          </div>
          <Scheduler
            confirmLabel="Request Session"
            onConfirm={(slot) => {
              onConfirmed(slot)
              complete(
                `Session with ${mentor.name} requested for ${slot.date} at ${slot.time}. You will be notified once the mentor confirms.`,
              )
            }}
          />
        </>
      )}
    </Flow>
  )
}

export default function AthleteDashboard() {
  const { showModal } = useModal()
  const [sessions, setSessions] = useState<{ mentor: string; slot: Slot }[]>([])

  const recommended = [...mentors].sort(
    (a, b) =>
      Number(b.sport === ATHLETE_SPORT) - Number(a.sport === ATHLETE_SPORT),
  )

  const bookMentor = (m: Mentor) =>
    showModal(
      `Book ${m.name}`,
      <BookingFlow
        mentor={m}
        onConfirmed={(slot) =>
          setSessions((prev) =>
            prev.some(
              (s) =>
                s.mentor === m.name &&
                s.slot.date === slot.date &&
                s.slot.time === slot.time,
            )
              ? prev
              : [...prev, { mentor: m.name, slot }],
          )
        }
      />,
    )

  const cancelSession = (index: number) =>
    setSessions((prev) => prev.filter((_, i) => i !== index))

  const uploadHighlight = () =>
    showModal('Upload Highlight', (
      <p>This prototype simulates the workflow visually for investor and user demos.</p>
    ))

  return (
    <>
      <Nav cta={{ to: '/coach', label: 'Coach View' }} />
      <main>
        <section className="section">
          <div className="header">
            <div>
              <p className="eyebrow">High school athlete dashboard</p>
              <h2>Jordan Reed recruiting hub</h2>
            </div>
            <button className="button primary" onClick={uploadHighlight}>
              Upload Highlight
            </button>
          </div>
          <div className="grid dash">
            <article className="panel profile">
              <div className="profileRow">
                <span className="avatar">JR</span>
                <div>
                  <h3>Jordan Reed</h3>
                  <p>Football | Wide Receiver | Class of 2027</p>
                  <small>Charlotte, NC | 6'1" | 185 lbs | GPA 3.7</small>
                </div>
              </div>
              <div className="between">
                <span>Profile completion</span>
                <strong>86%</strong>
              </div>
              <div className="progress">
                <span style={{ width: '86%' }}></span>
              </div>
            </article>
            <article className="panel">
              <h3>Recruiting Status</h3>
              <ol>
                <li>Profile verified</li>
                <li>Three highlights uploaded</li>
                <li>Coach interest received</li>
                <li>Schedule campus calls</li>
              </ol>
            </article>
            <article className="panel metric">
              <span>Coach Views</span>
              <strong>124</strong>
              <p>11 new views this week</p>
            </article>
            <article className="panel metric">
              <span>Saved by Coaches</span>
              <strong>9</strong>
              <p>NC, VA, and SC programs</p>
            </article>
            <article className="panel wide">
              <div className="between">
                <div>
                  <h3>Recommended Mentors</h3>
                  <small>Matched to your sport and recruiting goals</small>
                </div>
                <Link to="/mentor">View all</Link>
              </div>
              <div id="mentors" className="grid">
                {recommended.map((m) => (
                  <article className="mentor" key={m.name}>
                    <span className="miniAvatar"></span>
                    <div>
                      <strong>{m.name}</strong>
                      {m.sport === ATHLETE_SPORT && (
                        <span className="tag">Recommended</span>
                      )}
                      <br />
                      <small>{m.role}</small>
                    </div>
                    <button className="mini" onClick={() => bookMentor(m)}>
                      {money(m.price)}
                    </button>
                  </article>
                ))}
              </div>
            </article>
            <article className="panel" aria-live="polite">
              <h3>Upcoming Sessions</h3>
              <div className="session">
                <strong>Film Review with Cam Porter</strong>
                <span>Thursday, 7:00 PM</span>
                <small>Route release package and recruiting outreach review</small>
              </div>
              {sessions.map((s, i) => (
                <div className="session" key={`${s.mentor}-${s.slot.date}-${s.slot.time}`}>
                  <strong>Session with {s.mentor}</strong>
                  <span>
                    {s.slot.date}, {s.slot.time}
                  </span>
                  <small>Requested — awaiting mentor confirmation</small>
                  <button
                    type="button"
                    className="textBtn"
                    onClick={() => cancelSession(i)}
                  >
                    Cancel request
                  </button>
                </div>
              ))}
            </article>
            <Link className="panel" to="/meal">
              <span>Meal Plan</span>
              <h3>3,050 calories</h3>
              <small>Performance goal: lean muscle</small>
            </Link>
            <Link className="panel" to="/training">
              <span>Training Schedule</span>
              <h3>5 day split</h3>
              <small>Speed, hands, and explosiveness</small>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
