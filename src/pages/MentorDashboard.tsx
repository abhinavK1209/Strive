import { useMemo, useState, type FormEvent } from 'react'
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
import {
  getMentorThreads,
  getMentorshipRequests,
  sendMentorMessage,
  updateRequestStatus,
  type MentorshipRequest,
} from '../lib/demoState'

type MentorTab = 'overview' | 'schedule' | 'requests' | 'chats' | 'reviews'

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

function SchedulePanel({ requests }: { requests: MentorshipRequest[] }) {
  const [openSlots, setOpenSlots] = useState<Slot[]>([])
  const accepted = requests.filter((request) => request.status === 'accepted')
  const sameSlot = (a: Slot, b: Slot) => a.date === b.date && a.time === b.time
  const addSlot = (slot: Slot) =>
    setOpenSlots((previous) => previous.some((item) => sameSlot(item, slot)) ? previous : [...previous, slot])
  const removeSlot = (slot: Slot) =>
    setOpenSlots((previous) => previous.filter((item) => !sameSlot(item, slot)))

  return <div className="schedulePanel">
    <div className="scheduleSide">
      <h4 className="scheduleHeading">Set Availability</h4>
      <Scheduler confirmLabel="Open Slot" onConfirm={addSlot} />
      {openSlots.length > 0 && <div className="slotList" style={{ marginTop: 12 }}><p className="slotListLabel">Open slots ({openSlots.length})</p><div className="chips">{openSlots.map((slot) => <span className="slotChip" key={`${slot.date}-${slot.time}`}>{slot.date} | {slot.time}<button type="button" className="chipRemove" aria-label={`Remove ${slot.date} at ${slot.time}`} onClick={() => removeSlot(slot)}>&times;</button></span>)}</div></div>}
    </div>
    <div className="scheduleSide">
      <h4 className="scheduleHeading">Upcoming Connected Sessions</h4>
      {accepted.length === 0 ? <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>No accepted athlete sessions yet.</p> : <div style={{ display: 'grid', gap: 10 }}>{accepted.map((request) => <div className="sessionConfirmed" key={request.requestId}><div className="sessionConfirmedIcon" aria-hidden="true">✓</div><div><strong>{request.athleteProfile.fullName}</strong><span>{new Date(request.preferredDateTime).toLocaleString()} · {request.sessionType}</span></div></div>)}</div>}
      <p className="demoChatNote">Only accepted athlete-created requests appear here. Static sample bookings are kept separate from the connected demo flow.</p>
    </div>
  </div>
}

function RequestsPanel({ requests, onChange }: { requests: MentorshipRequest[]; onChange: () => void }) {
  const change = (requestId: string, status: 'accepted' | 'declined') => {
    updateRequestStatus(requestId, status)
    onChange()
  }
  return <div className="grid">{requests.length ? requests.map((request) => <article className="panel" key={request.requestId}><div className="between"><div><h3>{request.athleteProfile.fullName}</h3><small>{request.athleteProfile.sport} · {request.athleteProfile.position}</small></div><span className={`demoStatus ${request.status}`}>{request.status}</span></div><p><strong>{request.sessionType}</strong><br/>{new Date(request.preferredDateTime).toLocaleString()}</p><p>"{request.athleteMessage}"</p>{request.status === 'pending' && <div className="demoToolbar"><button className="button primary" onClick={() => change(request.requestId, 'accepted')}>Accept</button><button className="button ghost" onClick={() => change(request.requestId, 'declined')}>Decline</button></div>}</article>) : <article className="panel demoEmpty"><p>No requests for this mentor yet.</p></article>}</div>
}

function ChatsPanel({ requests }: { requests: MentorshipRequest[] }) {
  const ids = new Set(requests.map((request) => request.requestId))
  const readThreads = () => getMentorThreads().filter((thread) => ids.has(thread.requestId))
  const [threads, setThreads] = useState(readThreads)
  const [activeId, setActiveId] = useState(threads[0]?.requestId ?? '')
  const active = threads.find((thread) => thread.requestId === activeId)
  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!active) return
    const form = event.currentTarget
    const text = String(new FormData(form).get('message') || '').trim()
    if (!text) return
    sendMentorMessage(active.requestId, text)
    setThreads(readThreads())
    form.reset()
  }
  return <div className="demoChat mentorDashboardChat"><aside className="panel demoThreads">{threads.length ? threads.map((thread) => <button className={thread.requestId === activeId ? 'demoThread active' : 'demoThread'} key={thread.requestId} onClick={() => setActiveId(thread.requestId)}><span className="demoThreadDot"/><strong>{requests.find((request) => request.requestId === thread.requestId)?.athleteProfile.fullName || 'Demo Athlete'}</strong><small>{thread.status}</small></button>) : <div className="demoEmpty">No chats for this mentor yet.</div>}</aside><section className="panel demoChatPanel">{active ? <><div className="between"><div><h3>{requests.find((request) => request.requestId === active.requestId)?.athleteProfile.fullName || 'Demo Athlete'}</h3><small>Shared browser-local conversation</small></div><span className={`demoStatus ${active.status}`}>{active.status}</span></div><div className="demoMessages">{active.messages.map((message, index) => <div className={`demoMessage ${message.sender === 'mentor' ? 'athlete' : 'mentor'}`} key={`${message.createdAt}-${index}`}><span>{message.text}</span><small>{message.sender === 'mentor' ? 'You' : 'Athlete'}</small></div>)}</div><form className="demoMessageForm" onSubmit={send}><input name="message" required placeholder="Reply as mentor..." /><button className="button primary">Send Reply</button></form></> : <div className="demoEmpty">Select an athlete conversation.</div>}</section></div>
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
  const [requests, setRequests] = useState(getMentorshipRequests)
  const filteredRequests = requests.filter((request) => request.mentorName === mentor.name)
  const refreshRequests = () => setRequests(getMentorshipRequests())

  const TABS: { id: MentorTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'requests', label: 'Requests' },
    { id: 'chats', label: 'Chats' },
    { id: 'reviews', label: 'Reviews' },
  ]

  return <>
    <Nav />
    <div className="demoNotice"><div><strong>Demo Mode</strong><span>Requests, conversations, and accepted sessions are shared with the athlete view in this browser.</span></div></div>
    <main><section className="section soft mentorSection">
      <div className="coachHeader"><div><p className="eyebrow">Mentor dashboard</p><h2>Mentorship Center</h2></div><MentorSelector current={mentor} onChange={setMentor} /></div>
      <div className="coachTabs" role="tablist" aria-label="Mentor sections">{TABS.map((item) => <button key={item.id} role="tab" aria-selected={tab === item.id} className={`coachTab ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>
      {tab === 'overview' && <div className="mentorOverview"><article className="panel mentorProfileCard"><div className="profileRow"><span className="avatar">{mentor.initials}</span><div><h3 style={{ margin: 0 }}>{mentor.name}</h3><p style={{ margin: '3px 0 0' }}>{mentor.role}</p></div></div><p style={{ marginTop: 14, fontSize: '.9rem', color: 'var(--ink)', lineHeight: 1.6 }}>{mentor.bio}</p><div className="mentorStats"><div className="mentorStat"><strong>{mentor.sessions}</strong><span>Sessions</span></div><div className="mentorStat"><strong>{mentor.rating}</strong><span>Rating</span></div><div className="mentorStat"><strong>{money(mentor.price)}</strong><span>/ session</span></div></div></article><PricingPanel mentor={mentor} /><article className="panel sessionTypesCard"><h3>Session Types</h3><SessionTypesPanel mentorName={mentor.name} /></article></div>}
      {tab === 'schedule' && <article className="panel" style={{ padding: 0, overflow: 'hidden' }}><SchedulePanel requests={filteredRequests} /></article>}
      {tab === 'requests' && <RequestsPanel requests={filteredRequests} onChange={refreshRequests} />}
      {tab === 'chats' && <ChatsPanel key={mentor.name} requests={filteredRequests} />}
      {tab === 'reviews' && <article className="panel"><h3>Athlete Reviews - {mentor.name}</h3><ReviewsPanel mentorName={mentor.name} /></article>}
    </section></main>
  </>
}
