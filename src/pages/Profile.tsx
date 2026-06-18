import { useState } from 'react'
import Nav from '../components/Nav'
import { Flow, useModal } from '../components/Modal'
import { athletes, SPORT_POSITIONS, type Athlete } from '../data'

function ContactFlow({ athlete }: { athlete: Athlete }) {
  return (
    <Flow>
      {({ complete }) => (
        <>
          <p>
            As a verified coach you can register interest in {athlete.name}.
            They can respond and schedule a call once interest is shown.
          </p>
          <button
            type="button"
            className="button primary"
            onClick={() =>
              complete(
                `Interest sent to ${athlete.name}. They can now respond and schedule a call.`,
              )
            }
          >
            Send Interest
          </button>
        </>
      )}
    </Flow>
  )
}

const HIGHLIGHT_TITLES = [
  'Season Highlights Reel',
  'Game Film — Conference Finals',
  'Skills Showcase',
  'Combine Performance',
]

function AthleteDetailView({ athlete }: { athlete: Athlete }) {
  const { showModal } = useModal()
  return (
    <div className="profileDetailWrap">
      <div className="profileDetailHero">
        <div className="profileDetailAvatar">
          {athlete.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            {athlete.sport} · {athlete.position}
          </p>
          <h2 style={{ margin: '4px 0 6px' }}>{athlete.name}</h2>
          <p style={{ margin: 0 }}>
            {athlete.school} · Class of {athlete.year} · {athlete.state} ·{' '}
            {athlete.height} · {athlete.weight}
          </p>
        </div>
        <button
          className="button primary"
          style={{ marginLeft: 'auto' }}
          onClick={() =>
            showModal(`Contact ${athlete.name}`, <ContactFlow athlete={athlete} />)
          }
        >
          Contact Athlete
        </button>
      </div>

      <div className="stats" style={{ marginBottom: 24 }}>
        {athlete.statLabels.map((s) => (
          <span key={s.label}>
            <strong>{s.value}</strong>
            {s.label}
          </span>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr .8fr', gap: 18, marginBottom: 24 }}>
        <article className="panel">
          <div className="heroImg" />
          <h3>About</h3>
          <p style={{ color: 'var(--ink)' }}>{athlete.bio}</p>
          <p className="muted" style={{ fontSize: '.85rem' }}>
            {athlete.stats}
          </p>
        </article>
        <div style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
          <article className="panel">
            <h3>Achievements</h3>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {athlete.achievements.map((a) => (
                <li key={a} style={{ marginBottom: 6 }}>{a}</li>
              ))}
            </ul>
          </article>
          <article className="panel">
            <h3>Coach Interest</h3>
            <p>
              Use "Contact Athlete" above to register interest. {athlete.name.split(' ')[0]} can
              respond and schedule a call once a verified coach reaches out.
            </p>
          </article>
        </div>
      </div>

      <article className="panel" style={{ marginBottom: 24 }}>
        <h3>Highlights</h3>
        <div className="highlightGrid">
          {HIGHLIGHT_TITLES.map((title) => (
            <div className="highlightCard" key={title} aria-label={title}>
              <div className="highlightThumb">
                <div className="highlightPlay" aria-hidden="true">▶</div>
              </div>
              <p className="highlightTitle">{title}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

export default function Profile() {
  const [sport, setSport] = useState('all')
  const [position, setPosition] = useState('all')
  const [selected, setSelected] = useState<Athlete | null>(null)

  const allSports = [...new Set(athletes.map((a) => a.sport))]
  const positions =
    sport === 'all'
      ? [...new Set(athletes.map((a) => a.position))]
      : SPORT_POSITIONS[sport] ?? []

  const handleSportChange = (next: string) => {
    setSport(next)
    if (next !== 'all') {
      const valid = SPORT_POSITIONS[next] ?? []
      if (!valid.includes(position)) setPosition('all')
    } else {
      setPosition('all')
    }
    setSelected(null)
  }

  const filtered = athletes.filter(
    (a) =>
      (sport === 'all' || a.sport === sport) &&
      (position === 'all' || a.position === position),
  )

  return (
    <>
      <Nav />
      <main>
        <section className="section">
          {selected ? (
            <>
              <button
                className="button ghost"
                style={{ marginBottom: 24 }}
                onClick={() => setSelected(null)}
              >
                ← Back to profiles
              </button>
              <AthleteDetailView athlete={selected} />
            </>
          ) : (
            <>
              <div className="header">
                <div>
                  <p className="eyebrow">Athlete directory</p>
                  <h2>Recruit Profiles</h2>
                </div>
                <div className="filters">
                  <select
                    aria-label="Filter by sport"
                    value={sport}
                    onChange={(e) => handleSportChange(e.target.value)}
                  >
                    <option value="all">All sports</option>
                    {allSports.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    aria-label="Filter by position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option value="all">All positions</option>
                    {positions.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="profileGrid">
                {filtered.map((a) => (
                  <button
                    key={a.name}
                    className="profileCard"
                    onClick={() => setSelected(a)}
                  >
                    <div className="profileCardAvatar">
                      {a.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="profileCardBody">
                      <p className="cardMeta" style={{ color: '#6fba00', margin: '0 0 4px' }}>
                        {a.sport} · {a.position}
                      </p>
                      <strong style={{ display: 'block', fontSize: '1.05rem' }}>
                        {a.name}
                      </strong>
                      <span style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
                        {a.school} · Class of {a.year}
                      </span>
                      <p
                        style={{
                          margin: '8px 0 0',
                          fontSize: '.82rem',
                          color: 'var(--muted)',
                          lineHeight: 1.4,
                        }}
                      >
                        {a.height} · {a.weight} · GPA {a.gpa}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="panel">
                  <h3>No athletes match those filters.</h3>
                  <p>Try another sport or position.</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  )
}
