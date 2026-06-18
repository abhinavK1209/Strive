import { useMemo, useState } from 'react'
import Nav from '../components/Nav'
import { Flow, useModal } from '../components/Modal'
import { athletes, SPORT_POSITIONS, type Athlete } from '../data'

// ── Contact flow modal ───────────────────────────────────────────────────────

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

// ── Athlete profile modal ────────────────────────────────────────────────────

const HIGHLIGHT_TITLES = [
  'Season Highlights Reel',
  'Game Film — Conference Finals',
  'Skills Showcase',
  'Combine Performance',
]

function AthleteProfile({
  athlete,
  isSaved,
  isContacted,
  onSave,
  onContact,
}: {
  athlete: Athlete
  isSaved: boolean
  isContacted: boolean
  onSave: () => void
  onContact: () => void
}) {
  return (
    <div className="profileModal">
      <div className="profileModalHero">
        <div className="profileModalAvatar">
          {athlete.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="profileModalMeta">
          <p className="eyebrow profileEyebrow">
            {athlete.sport} · {athlete.position}
          </p>
          <h3 className="profileModalName">{athlete.name}</h3>
          <p className="profileModalSchool">
            {athlete.school} · Class of {athlete.year} · {athlete.state} ·{' '}
            {athlete.height} · {athlete.weight}
          </p>
        </div>
      </div>

      <div className="profileModalStats">
        {athlete.statLabels.map((s) => (
          <div className="profileStat" key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <p className="profileModalBio">{athlete.bio}</p>

      <div className="profileModalSection">
        <h4 className="profileModalHeading">Achievements</h4>
        <ul className="profileAchievements">
          {athlete.achievements.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="profileModalSection">
        <h4 className="profileModalHeading">Highlights</h4>
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
      </div>

      <div className="profileModalActions">
        <button
          type="button"
          className="button primary"
          aria-pressed={isSaved}
          onClick={onSave}
        >
          {isSaved ? 'Saved ✓' : 'Save Athlete'}
        </button>
        <button
          type="button"
          className="button ghost"
          disabled={isContacted}
          onClick={onContact}
        >
          {isContacted ? 'Interest Sent' : 'Send Interest'}
        </button>
      </div>
    </div>
  )
}

// ── Main dashboard ───────────────────────────────────────────────────────────

export default function CoachDashboard() {
  const { showModal } = useModal()
  const [sport, setSport] = useState('all')
  const [position, setPosition] = useState('all')
  const [year, setYear] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('year')
  const [saved, setSaved] = useState<Athlete[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [contacted, setContacted] = useState<string[]>([])

  const uniq = (values: string[]) => [...new Set(values)]

  const sports = useMemo(() => uniq(athletes.map((a) => a.sport)), [])

  // Positions depend on the selected sport
  const positions = useMemo(() => {
    if (sport === 'all') return uniq(athletes.map((a) => a.position))
    return SPORT_POSITIONS[sport] ?? []
  }, [sport])

  const years = useMemo(() => uniq(athletes.map((a) => a.year)).sort(), [])
  const states = useMemo(() => uniq(athletes.map((a) => a.state)).sort(), [])

  const handleSportChange = (next: string) => {
    setSport(next)
    // Reset position if the current one doesn't belong to the new sport
    if (next !== 'all') {
      const valid = SPORT_POSITIONS[next] ?? []
      if (!valid.includes(position)) setPosition('all')
    } else {
      setPosition('all')
    }
  }

  const list = useMemo(() => {
    const filtered = athletes.filter(
      (a) =>
        (sport === 'all' || a.sport === sport) &&
        (position === 'all' || a.position === position) &&
        (year === 'all' || a.year === year) &&
        (stateFilter === 'all' || a.state === stateFilter),
    )
    return [...filtered].sort((a, b) => {
      if (sortBy === 'gpa') return Number(b.gpa) - Number(a.gpa)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return Number(a.year) - Number(b.year)
    })
  }, [sport, position, year, stateFilter, sortBy])

  const isSaved = (a: Athlete) => saved.some((s) => s.name === a.name)
  const isContacted = (a: Athlete) => contacted.includes(a.name)

  const toggleSave = (a: Athlete) =>
    setSaved((prev) =>
      prev.some((s) => s.name === a.name)
        ? prev.filter((s) => s.name !== a.name)
        : [...prev, a],
    )

  const removeSaved = (name: string) =>
    setSaved((prev) => prev.filter((s) => s.name !== name))

  const toggleSelect = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    )

  const saveSelected = () => {
    setSaved((prev) => {
      const have = new Set(prev.map((s) => s.name))
      const additions = athletes.filter(
        (a) => selected.includes(a.name) && !have.has(a.name),
      )
      return [...prev, ...additions]
    })
    setSelected([])
  }

  const markContacted = (a: Athlete) =>
    setContacted((prev) => (prev.includes(a.name) ? prev : [...prev, a.name]))

  const openProfile = (a: Athlete) => {
    showModal(
      a.name,
      <AthleteProfile
        athlete={a}
        isSaved={isSaved(a)}
        isContacted={isContacted(a)}
        onSave={() => toggleSave(a)}
        onContact={() =>
          showModal(
            `Contact ${a.name}`,
            <ContactFlow athlete={a} onSent={() => markContacted(a)} />,
          )
        }
      />,
    )
  }

  const contactAthlete = (a: Athlete) =>
    showModal(
      `Contact ${a.name}`,
      <ContactFlow athlete={a} onSent={() => markContacted(a)} />,
    )

  return (
    <>
      <Nav />
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
                onChange={(e) => handleSportChange(e.target.value)}
              >
                <option value="all">All sports</option>
                {sports.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select
                id="position"
                aria-label="Filter by position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="all">All positions</option>
                {positions.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <select
                id="year"
                aria-label="Filter by class year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="all">All class years</option>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              {states.length > 1 && (
                <select
                  id="state"
                  aria-label="Filter by state"
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                >
                  <option value="all">All states</option>
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              )}
              <select
                id="sort"
                aria-label="Sort athletes"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="year">Graduating soonest</option>
                <option value="gpa">Top GPA</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>
          <div className="coachLayout">
            <div className="feedColumn">
              {selected.length > 0 && (
                <div className="bulkBar" role="status" aria-live="polite">
                  <span>{selected.length} selected</span>
                  <div className="bulkActions">
                    <button className="button primary" onClick={saveSelected}>
                      Save selected
                    </button>
                    <button
                      className="button ghost"
                      onClick={() => setSelected([])}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
              <div id="feed" className="feed">
                {list.length ? (
                  list.map((a) => (
                    <article className="athleteCard" key={a.name}>
                      <label className="cardSelect">
                        <input
                          type="checkbox"
                          checked={selected.includes(a.name)}
                          onChange={() => toggleSelect(a.name)}
                          aria-label={`Select ${a.name} for bulk actions`}
                        />
                        Select
                      </label>
                      <div className="athleteContent">
                        <p className="cardMeta">
                          {a.sport} | {a.position}
                        </p>
                        <h3>{a.name}</h3>
                        <p>
                          {a.school} | Class of {a.year} | {a.state} | GPA{' '}
                          {a.gpa}
                        </p>
                        <p className="cardPhysical">
                          {a.height} · {a.weight}
                        </p>
                        <strong>{a.stats}</strong>
                        <div className="cardActions">
                          <button
                            className="button primary"
                            onClick={() => openProfile(a)}
                          >
                            View Profile
                          </button>
                          <button
                            className="button ghost"
                            aria-pressed={isSaved(a)}
                            onClick={() => toggleSave(a)}
                          >
                            {isSaved(a) ? 'Saved ✓' : 'Save'}
                          </button>
                        </div>
                        <div className="cardActions" style={{ marginTop: 8 }}>
                          <button
                            className="button ghost"
                            disabled={isContacted(a)}
                            onClick={() => contactAthlete(a)}
                            style={{ gridColumn: '1 / -1' }}
                          >
                            {isContacted(a) ? 'Interest Sent' : 'Send Interest'}
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
            </div>
            <aside className="savedAside">
              <div className="panel savedPanel">
                <h3>Saved Recruits</h3>
                <div id="saved" aria-live="polite">
                  {saved.length ? (
                    saved.map((a) => (
                      <div className="request savedRow" key={a.name}>
                        <div>
                          <strong>{a.name}</strong>
                          <span>
                            {a.sport} | {a.position} | {a.gpa} GPA
                          </span>
                        </div>
                        <button
                          type="button"
                          className="chipRemove"
                          aria-label={`Remove ${a.name} from saved`}
                          onClick={() => removeSaved(a.name)}
                        >
                          &times;
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No saved recruits yet.</p>
                  )}
                </div>
                <p className="muted">
                  Athletes cannot message coaches first. Coaches initiate
                  contact after saving or showing interest.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  )
}
