import { useRef, useState } from 'react'
import Nav from '../components/Nav'
import Scheduler, { type Slot } from '../components/Scheduler'
import { money } from '../data'

export default function MentorDashboard() {
  const [price, setPrice] = useState(80)
  const [accepted, setAccepted] = useState(false)
  const [openSlots, setOpenSlots] = useState<Slot[]>([])
  const [justOpened, setJustOpened] = useState<Slot | null>(null)
  const calendarRef = useRef<HTMLElement>(null)
  const fee = price * 0.15

  const sameSlot = (a: Slot, b: Slot) => a.date === b.date && a.time === b.time

  const addSlot = (slot: Slot) => {
    setOpenSlots((prev) =>
      prev.some((s) => sameSlot(s, slot)) ? prev : [...prev, slot],
    )
    setJustOpened(slot)
  }

  const removeSlot = (slot: Slot) => {
    setOpenSlots((prev) => prev.filter((s) => !sameSlot(s, slot)))
    setJustOpened((cur) => (cur && sameSlot(cur, slot) ? null : cur))
  }

  const focusCalendar = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    calendarRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    })
    calendarRef.current?.querySelector<HTMLButtonElement>('.calDay')?.focus()
  }

  return (
    <>
      <Nav />
      <main>
        <section className="section soft">
          <div className="header">
            <div>
              <p className="eyebrow">College athlete mentor dashboard</p>
              <h2>Mentorship business center</h2>
            </div>
            <button className="button dark" onClick={focusCalendar}>
              Manage Availability
            </button>
          </div>
          <div className="bento">
            <article className="panel profile">
              <div className="profileRow">
                <span className="avatar">CP</span>
                <div>
                  <h3>Cam Porter</h3>
                  <p>UNC Football | Defensive Back</p>
                  <small>ACC starter, team captain, 4.0 mentor rating</small>
                </div>
              </div>
            </article>
            <article className="panel">
              <h3>Pricing Setup</h3>
              <label>
                Session price{' '}
                <input
                  id="price"
                  type="range"
                  min="25"
                  max="150"
                  value={price}
                  aria-valuetext={money(price)}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </label>
              <div className="earn">
                <span>Gross</span>
                <strong id="gross">{money(price)}</strong>
              </div>
              <div className="earn">
                <span>15% platform fee</span>
                <strong id="fee">{money(fee)}</strong>
              </div>
              <div className="earn net">
                <span>Net payout</span>
                <strong id="net">{money(price - fee)}</strong>
              </div>
            </article>
            <article className="panel wide" id="availability" ref={calendarRef}>
              <div className="between">
                <div>
                  <h3>Availability Calendar</h3>
                  <small>Pick the times athletes can book</small>
                </div>
              </div>
              <Scheduler confirmLabel="Open Slot" onConfirm={addSlot} />
              <p className="openStatus" role="status" aria-live="polite">
                {justOpened
                  ? `${justOpened.date} at ${justOpened.time} is now open for athletes to book.`
                  : ''}
              </p>
              <div className="slotList" aria-live="polite">
                {openSlots.length ? (
                  <>
                    <p className="slotListLabel">Open slots ({openSlots.length})</p>
                    <div className="chips">
                      {openSlots.map((s) => (
                        <span className="slotChip" key={`${s.date}-${s.time}`}>
                          {s.date} | {s.time}
                          <button
                            type="button"
                            className="chipRemove"
                            aria-label={`Remove ${s.date} at ${s.time}`}
                            onClick={() => removeSlot(s)}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <small>No open slots yet. Pick a day and time above.</small>
                )}
              </div>
            </article>
            <article className="panel">
              <h3>Booking Requests</h3>
              <div className="request">
                <strong>Jordan Reed</strong>
                <span>Film review, 45 minutes</span>
                <button
                  className="mini"
                  disabled={accepted}
                  onClick={() => setAccepted(true)}
                >
                  {accepted ? 'Accepted' : 'Accept'}
                </button>
              </div>
            </article>
            <article className="panel">
              <h3>Upcoming Sessions</h3>
              {accepted && (
                <div className="session">
                  <strong>Jordan Reed</strong>
                  <span>Thursday, 7:00 PM</span>
                  <small>Film review, 45 minutes</small>
                </div>
              )}
              <div className="session">
                <strong>Avery Scott</strong>
                <span>Sunday, 3:30 PM</span>
                <small>Nutrition advice for tournament week</small>
              </div>
            </article>
            <article className="panel">
              <h3>Session Types</h3>
              <div className="chips">
                <span>Recruiting Advice</span>
                <span>Film Review</span>
                <span>Training Advice</span>
                <span>Nutrition Advice</span>
                <span>College Life Q&amp;A</span>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
