import { useMemo, useState } from 'react'
import Nav from '../components/Nav'
import Scheduler, { type Slot } from '../components/Scheduler'
import {
  money,
  mentors,
  mentorReviews,
  mentorDefaultSessions,
  ALL_SESSION_TYPES,
  type Mentor,
} from '../data'

type MentorTab = 'overview' | 'schedule' | 'reviews'

// ── Star rating display ───────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="starRating" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
      <span className="starNum">{rating.toFixed(1)}</span>
    </span>
  )
}

// ── Reviews panel ────────────────────────────────────────────────────────────

function ReviewsPanel({ mentorName }: { mentorName: string }) {
  const reviews = useMemo(
    () => mentorReviews.filter((r) => r.mentorName === mentorName),
    [mentorName],
  )
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)

  return (
    <div className="reviewsPanel">
      <div className="reviewsSummary">
        <div className="reviewsAvg">
          <span className="reviewsAvgNum">{avg.toFixed(1)}</span>
          <Stars rating={Math.round(avg)} />
          <span className="reviewsCount">{reviews.length} reviews</span>
        </div>
      </div>
      <div className="reviewsList">
        {reviews.map((r) => (
          <div className="reviewCard" key={`${r.athlete}-${r.date}`}>
            <div className="reviewHeader">
              <div className="reviewAvatar">
                {r.athlete.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="reviewMeta">
                <strong className="reviewName">{r.athlete}</strong>
                <span className="reviewSport">{r.sport} · {r.date}</span>
              </div>
              <Stars rating={r.rating} />
            </div>
            <p className="reviewComment">"{r.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Unified schedule panel ────────────────────────────────────────────────────

interface BookingRequest {
  name: string
  type: string
  duration: string
  day: string
  time: string
}

const MOCK_REQUESTS: BookingRequest[] = [
  { name: 'Jordan Reed', type: 'Game Film Review', duration: '45 min', day: 'Thu', time: '7:00 PM' },
  { name: 'Darius Fontaine', type: 'Recruitment Prep', duration: '30 min', day: 'Sat', time: '10:00 AM' },
]

function SchedulePanel() {
  const [openSlots, setOpenSlots] = useState<Slot[]>([])
  const [requests] = useState<BookingRequest[]>(MOCK_REQUESTS)
  const [accepted, setAccepted] = useState<string[]>([])

  const sameSlot = (a: Slot, b: Slot) => a.date === b.date && a.time === b.time
  const addSlot = (slot: Slot) =>
    setOpenSlots((prev) => (prev.some((s) => sameSlot(s, slot)) ? prev : [...prev, slot]))
  const removeSlot = (slot: Slot) =>
    setOpenSlots((prev) => prev.filter((s) => !sameSlot(s, slot)))

  const acceptRequest = (r: BookingRequest) => {
    setAccepted((prev) => [...prev, r.name])
  }

  const confirmedSessions = requests.filter((r) => accepted.includes(r.name))
  const pendingRequests = requests.filter((r) => !accepted.includes(r.name))

  return (
    <div className="schedulePanel">
      {/* Availability calendar */}
      <div className="scheduleSide">
        <h4 className="scheduleHeading">Set Availability</h4>
        <Scheduler confirmLabel="Open Slot" onConfirm={addSlot} />
        {openSlots.length > 0 && (
          <div className="slotList" style={{ marginTop: 12 }}>
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
          </div>
        )}
      </div>

      {/* Requests + upcoming merged */}
      <div className="scheduleSide">
        <h4 className="scheduleHeading">Booking Requests</h4>
        {pendingRequests.length === 0 ? (
          <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>No pending requests.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {pendingRequests.map((r) => (
              <div className="bookingRequest" key={r.name}>
                <div className="bookingRequestInfo">
                  <strong>{r.name}</strong>
                  <span>{r.type} · {r.duration}</span>
                </div>
                <button className="button primary mini bookingAccept" onClick={() => acceptRequest(r)}>
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}

        <h4 className="scheduleHeading" style={{ marginTop: 20 }}>
          Upcoming Sessions {confirmedSessions.length > 0 && (
            <span className="savedCount">{confirmedSessions.length}</span>
          )}
        </h4>
        {confirmedSessions.length === 0 ? (
          <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>No upcoming sessions yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {confirmedSessions.map((r) => (
              <div className="sessionConfirmed" key={r.name}>
                <div className="sessionConfirmedIcon" aria-hidden="true">✓</div>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.day} at {r.time} · {r.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Always-visible Avery Scott session */}
        <div className="sessionConfirmed">
          <div className="sessionConfirmedIcon" aria-hidden="true">✓</div>
          <div>
            <strong>Avery Scott</strong>
            <span>Sun 3:30 PM · Nutrition Advice · 30 min</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Session types (selectable) ───────────────────────────────────────────────

function SessionTypesPanel({ mentorName }: { mentorName: string }) {
  const defaults = mentorDefaultSessions[mentorName] ?? []
  const [active, setActive] = useState<string[]>(defaults)

  const toggle = (type: string) =>
    setActive((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )

  return (
    <div className="sessionTypesPanel">
      <p className="sessionTypesHint">
        Toggle the session types you offer. Athletes will only see types you've enabled.
      </p>
      <div className="sessionTypeGrid">
        {ALL_SESSION_TYPES.map((type) => {
          const on = active.includes(type)
          return (
            <button
              key={type}
              className={`sessionTypeBtn ${on ? 'active' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(type)}
            >
              <span className="sessionTypeCheck" aria-hidden="true">{on ? '✓' : '+'}</span>
              {type}
            </button>
          )
        })}
      </div>
      <p className="sessionTypesActive">
        {active.length} type{active.length !== 1 ? 's' : ''} enabled
      </p>
    </div>
  )
}

// ── Pricing panel ────────────────────────────────────────────────────────────

function PricingPanel({ mentor }: { mentor: Mentor }) {
  const [price, setPrice] = useState(mentor.price)
  const [applied, setApplied] = useState(false)
  const fee = price * 0.15

  return (
    <article className="panel pricingPanel">
      <h3>Pricing</h3>
      <label className="pricingLabel">
        <span>Session rate</span>
        <input
          type="range"
          min="25"
          max="150"
          value={price}
          aria-valuetext={money(price)}
          onChange={(e) => { setPrice(Number(e.target.value)); setApplied(false) }}
        />
      </label>
      <div className="earn">
        <span>Gross</span>
        <strong>{money(price)}</strong>
      </div>
      <div className="earn">
        <span>15% platform fee</span>
        <strong>{money(fee)}</strong>
      </div>
      <div className="earn net">
        <span>Net payout</span>
        <strong>{money(price - fee)}</strong>
      </div>
      <button
        className={`button ${applied ? 'ghost' : 'primary'} pricingApply`}
        onClick={() => setApplied(true)}
        disabled={applied}
      >
        {applied ? 'Rate Applied ✓' : `Apply Rate — ${money(price - fee)} / session`}
      </button>
    </article>
  )
}

// ── Mentor selector (top of page) ────────────────────────────────────────────

function MentorSelector({
  current,
  onChange,
}: {
  current: Mentor
  onChange: (m: Mentor) => void
}) {
  return (
    <div className="mentorSelector">
      {mentors.map((m) => (
        <button
          key={m.name}
          className={`mentorSelectorBtn ${m.name === current.name ? 'active' : ''}`}
          onClick={() => onChange(m)}
        >
          <span className="mentorSelectorAvatar">{m.initials}</span>
          <span className="mentorSelectorName">{m.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  )
}

// ── Main dashboard ───────────────────────────────────────────────────────────

export default function MentorDashboard() {
  const [mentor, setMentor] = useState<Mentor>(mentors[0])
  const [tab, setTab] = useState<MentorTab>('overview')

  const TABS: { id: MentorTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'reviews', label: 'Reviews' },
  ]

  return (
    <>
      <Nav />
      <main>
        <section className="section soft mentorSection">
          {/* Page header */}
          <div className="coachHeader">
            <div>
              <p className="eyebrow">Mentor dashboard</p>
              <h2>Mentorship Center</h2>
            </div>
            <MentorSelector current={mentor} onChange={setMentor} />
          </div>

          {/* Tabs */}
          <div className="coachTabs" role="tablist" aria-label="Mentor sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={`coachTab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {tab === 'overview' && (
            <div className="mentorOverview">
              {/* Profile card */}
              <article className="panel mentorProfileCard">
                <div className="profileRow">
                  <span className="avatar">{mentor.initials}</span>
                  <div>
                    <h3 style={{ margin: 0 }}>{mentor.name}</h3>
                    <p style={{ margin: '3px 0 0' }}>{mentor.role}</p>
                  </div>
                </div>
                <p style={{ marginTop: 14, fontSize: '.9rem', color: 'var(--ink)', lineHeight: 1.6 }}>
                  {mentor.bio}
                </p>
                <div className="mentorStats">
                  <div className="mentorStat">
                    <strong>{mentor.sessions}</strong>
                    <span>Sessions</span>
                  </div>
                  <div className="mentorStat">
                    <strong>{mentor.rating}</strong>
                    <span>Rating</span>
                  </div>
                  <div className="mentorStat">
                    <strong>{money(mentor.price)}</strong>
                    <span>/ session</span>
                  </div>
                </div>
              </article>

              {/* Pricing */}
              <PricingPanel mentor={mentor} />

              {/* Session types */}
              <article className="panel sessionTypesCard">
                <h3>Session Types</h3>
                <SessionTypesPanel mentorName={mentor.name} />
              </article>
            </div>
          )}

          {/* Schedule */}
          {tab === 'schedule' && (
            <article className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              <SchedulePanel />
            </article>
          )}

          {/* Reviews */}
          {tab === 'reviews' && (
            <article className="panel">
              <h3>Athlete Reviews — {mentor.name}</h3>
              <ReviewsPanel mentorName={mentor.name} />
            </article>
          )}
        </section>
      </main>
    </>
  )
}
