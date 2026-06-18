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
  const [year, setYear] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('year')
  const [saved, setSaved] = useState<Athlete[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [contacted, setContacted] = useState<string[]>([])

  const uniq = (values: string[]) => [...new Set(values)]
  const sports = useMemo(() => uniq(athletes.map((a) => a.sport)), [])
  const positions = useMemo(() => uniq(athletes.map((a) => a.position)), [])
  const years = useMemo(
    () => uniq(athletes.map((a) => a.year)).sort(),
    [],
  )
  const states = useMemo(() => uniq(athletes.map((a) => a.state)).sort(), [])

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
      return Number(a.year) - Number(b.year) // graduating soonest first
    })
  }, [sport, position, year, stateFilter, sortBy])

  const isSaved = (a: Athlete) => saved.some((s) => s.name === a.name)

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
                onChange={(e) => setSport(e.target.value)}
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
                        <strong>{a.stats}</strong>
                        <div className="cardActions">
                          <button
                            className="button primary"
                            aria-pressed={isSaved(a)}
                            onClick={() => toggleSave(a)}
                          >
                            {isSaved(a) ? 'Saved ✓' : 'Save Athlete'}
                          </button>
                          <button
                            className="button ghost"
                            disabled={contacted.includes(a.name)}
                            onClick={() => contactAthlete(a)}
                          >
                            {contacted.includes(a.name)
                              ? 'Interest Sent'
                              : 'Contact'}
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
                Athletes cannot message coaches first. Coaches initiate contact
                after saving or showing interest.
              </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  )
}
