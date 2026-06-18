import { useMemo, useState } from 'react'
import Nav from '../components/Nav'
import { Flow, useModal } from '../components/Modal'
import { athletes, SPORT_POSITIONS, type Athlete } from '../data'

type CoachTab = 'foryou' | 'feed' | 'profiles'

// ── Shared: contact modal ────────────────────────────────────────────────────

function ContactFlow({ athlete, onSent }: { athlete: Athlete; onSent: () => void }) {
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
            Class of {athlete.year} · GPA {athlete.gpa}
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

// ── Shared: athlete profile modal ────────────────────────────────────────────

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
          {athlete.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="profileModalMeta">
          <p className="eyebrow profileEyebrow">{athlete.sport} · {athlete.position}</p>
          <h3 className="profileModalName">{athlete.name}</h3>
          <p className="profileModalSchool">
            {athlete.school} · Class of {athlete.year} · {athlete.state} · {athlete.height} · {athlete.weight}
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
          {athlete.achievements.map((a) => <li key={a}>{a}</li>)}
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
        <button type="button" className="button primary" aria-pressed={isSaved} onClick={onSave}>
          {isSaved ? 'Saved ✓' : 'Save Athlete'}
        </button>
        <button type="button" className="button ghost" disabled={isContacted} onClick={onContact}>
          {isContacted ? 'Interest Sent' : 'Send Interest'}
        </button>
      </div>
    </div>
  )
}

// ── For You: TikTok-style snap scroll ────────────────────────────────────────

function ForYouCard({
  athlete,
  idx,
  total,
  isSaved,
  onSave,
  onProfile,
}: {
  athlete: Athlete
  idx: number
  total: number
  isSaved: boolean
  onSave: () => void
  onProfile: () => void
}) {
  return (
    <div className="forYouCard" aria-label={`${athlete.name}, ${athlete.sport} ${athlete.position}`}>
      {/* Mock video background */}
      <div className="forYouBg">
        <div className="forYouBgGrad" />
        <div className="forYouStarShape" aria-hidden="true" />
      </div>

      {/* Play button */}
      <button
        className="forYouPlay"
        aria-label={`Play highlight for ${athlete.name}`}
        onClick={onProfile}
      >
        ▶
      </button>

      {/* Progress dots */}
      <div className="forYouDots" aria-hidden="true">
        {Array.from({ length: Math.min(total, 5) }).map((_, i) => (
          <span
            key={i}
            className={i === idx % 5 ? 'forYouDot active' : 'forYouDot'}
          />
        ))}
      </div>

      {/* Bottom overlay */}
      <div className="forYouOverlay">
        <div className="forYouMeta">
          <span className="forYouBadge">{athlete.sport}</span>
          <span className="forYouBadge">{athlete.position}</span>
        </div>
        <h2 className="forYouName">{athlete.name}</h2>
        <p className="forYouSchool">{athlete.school} · Class of {athlete.year} · {athlete.state}</p>
        <p className="forYouStats">{athlete.stats}</p>
        <div className="forYouActions">
          <button
            className="button primary forYouBtn"
            onClick={onProfile}
          >
            View Profile
          </button>
          <button
            className={`forYouSaveBtn ${isSaved ? 'saved' : ''}`}
            onClick={onSave}
            aria-pressed={isSaved}
            aria-label={isSaved ? 'Saved' : 'Save athlete'}
          >
            {isSaved ? '★' : '☆'}
          </button>
        </div>
        <p className="forYouCounter">{idx + 1} / {total}</p>
      </div>
    </div>
  )
}

function ForYouFeed({
  saved,
  onSave,
  onOpenProfile,
}: {
  saved: Athlete[]
  onSave: (a: Athlete) => void
  onOpenProfile: (a: Athlete) => void
}) {
  return (
    <div className="forYouWrap" aria-label="For You highlight feed">
      {athletes.map((a, idx) => (
        <ForYouCard
          key={a.name}
          athlete={a}
          idx={idx}
          total={athletes.length}
          isSaved={saved.some((s) => s.name === a.name)}
          onSave={() => onSave(a)}
          onProfile={() => onOpenProfile(a)}
        />
      ))}
    </div>
  )
}

// ── Recruiting Feed ──────────────────────────────────────────────────────────

function RecruitingFeed({
  saved,
  contacted,
  onSave,
  onOpenProfile,
  onContact,
  onToggleSelect,
  selected,
  onSaveSelected,
  onRemoveSaved,
}: {
  saved: Athlete[]
  contacted: string[]
  onSave: (a: Athlete) => void
  onOpenProfile: (a: Athlete) => void
  onContact: (a: Athlete) => void
  onToggleSelect: (name: string) => void
  selected: string[]
  onSaveSelected: () => void
  onRemoveSaved: (name: string) => void
}) {
  const [sport, setSport] = useState('all')
  const [position, setPosition] = useState('all')
  const [year, setYear] = useState('all')
  const [sortBy, setSortBy] = useState('year')

  const uniq = (vals: string[]) => [...new Set(vals)]
  const sports = useMemo(() => uniq(athletes.map((a) => a.sport)), [])
  const positions = useMemo(
    () => (sport === 'all' ? uniq(athletes.map((a) => a.position)) : SPORT_POSITIONS[sport] ?? []),
    [sport],
  )
  const years = useMemo(() => uniq(athletes.map((a) => a.year)).sort(), [])

  const handleSportChange = (next: string) => {
    setSport(next)
    if (next !== 'all') {
      if (!(SPORT_POSITIONS[next] ?? []).includes(position)) setPosition('all')
    } else {
      setPosition('all')
    }
  }

  const list = useMemo(() => {
    const filtered = athletes.filter(
      (a) =>
        (sport === 'all' || a.sport === sport) &&
        (position === 'all' || a.position === position) &&
        (year === 'all' || a.year === year),
    )
    return [...filtered].sort((a, b) => {
      if (sortBy === 'gpa') return Number(b.gpa) - Number(a.gpa)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return Number(a.year) - Number(b.year)
    })
  }, [sport, position, year, sortBy])

  const isSaved = (a: Athlete) => saved.some((s) => s.name === a.name)

  return (
    <div className="coachLayout">
      <div className="feedColumn">
        {/* Compact filter row */}
        <div className="feedFilters">
          <select aria-label="Sport" value={sport} onChange={(e) => handleSportChange(e.target.value)}>
            <option value="all">All sports</option>
            {sports.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select aria-label="Position" value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="all">All positions</option>
            {positions.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select aria-label="Class year" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="all">All years</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
          <select aria-label="Sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="year">Graduating soonest</option>
            <option value="gpa">Top GPA</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {selected.length > 0 && (
          <div className="bulkBar" role="status" aria-live="polite">
            <span>{selected.length} selected</span>
            <div className="bulkActions">
              <button className="button primary" onClick={onSaveSelected}>Save selected</button>
              <button className="button ghost" onClick={() => onToggleSelect('__clear__')}>Clear</button>
            </div>
          </div>
        )}

        <div className="feed">
          {list.length ? list.map((a) => (
            <article className="athleteCard" key={a.name}>
              <label className="cardSelect">
                <input
                  type="checkbox"
                  checked={selected.includes(a.name)}
                  onChange={() => onToggleSelect(a.name)}
                  aria-label={`Select ${a.name}`}
                />
                Select
              </label>
              <div className="athleteContent">
                <p className="cardMeta">{a.sport} | {a.position}</p>
                <h3>{a.name}</h3>
                <p>{a.school} | Class of {a.year} | {a.state} | GPA {a.gpa}</p>
                <p className="cardPhysical">{a.height} · {a.weight}</p>
                <strong>{a.stats}</strong>
                <div className="cardActions">
                  <button className="button primary" onClick={() => onOpenProfile(a)}>
                    View Profile
                  </button>
                  <button className="button ghost" aria-pressed={isSaved(a)} onClick={() => onSave(a)}>
                    {isSaved(a) ? 'Saved ✓' : 'Save'}
                  </button>
                </div>
                <div className="cardActions" style={{ marginTop: 8 }}>
                  <button
                    className="button ghost"
                    disabled={contacted.includes(a.name)}
                    onClick={() => onContact(a)}
                    style={{ gridColumn: '1 / -1' }}
                  >
                    {contacted.includes(a.name) ? 'Interest Sent' : 'Send Interest'}
                  </button>
                </div>
              </div>
            </article>
          )) : (
            <div className="panel"><h3>No athletes match those filters.</h3><p>Try another sport or position.</p></div>
          )}
        </div>
      </div>

      <aside className="savedAside">
        <div className="panel savedPanel">
          <h3>Saved Recruits {saved.length > 0 && <span className="savedCount">{saved.length}</span>}</h3>
          <div aria-live="polite">
            {saved.length ? saved.map((a) => (
              <div className="request savedRow" key={a.name}>
                <div>
                  <strong>{a.name}</strong>
                  <span>{a.sport} | {a.position} | {a.gpa} GPA</span>
                </div>
                <button
                  type="button"
                  className="chipRemove"
                  aria-label={`Remove ${a.name}`}
                  onClick={() => onRemoveSaved(a.name)}
                >
                  &times;
                </button>
              </div>
            )) : (
              <p>No saved recruits yet.</p>
            )}
          </div>
          <p className="muted">
            Athletes cannot message coaches first. Coaches initiate contact after saving or showing interest.
          </p>
        </div>
      </aside>
    </div>
  )
}

// ── Browse Profiles ──────────────────────────────────────────────────────────

function BrowseProfiles({
  onOpenProfile,
}: {
  onOpenProfile: (a: Athlete) => void
}) {
  const [sport, setSport] = useState('all')
  const [position, setPosition] = useState('all')
  const [selected, setSelected] = useState<Athlete | null>(null)

  const allSports = [...new Set(athletes.map((a) => a.sport))]
  const positions = sport === 'all'
    ? [...new Set(athletes.map((a) => a.position))]
    : SPORT_POSITIONS[sport] ?? []

  const handleSportChange = (next: string) => {
    setSport(next)
    if (next !== 'all') {
      if (!(SPORT_POSITIONS[next] ?? []).includes(position)) setPosition('all')
    } else setPosition('all')
    setSelected(null)
  }

  const filtered = athletes.filter(
    (a) => (sport === 'all' || a.sport === sport) && (position === 'all' || a.position === position),
  )

  if (selected) {
    return (
      <div className="profileDetailWrap">
        <button className="button ghost" style={{ marginBottom: 20 }} onClick={() => setSelected(null)}>
          ← Back to profiles
        </button>
        <div className="profileDetailHero">
          <div className="profileDetailAvatar">
            {selected.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>{selected.sport} · {selected.position}</p>
            <h2 style={{ margin: '4px 0 6px' }}>{selected.name}</h2>
            <p style={{ margin: 0 }}>
              {selected.school} · Class of {selected.year} · {selected.state} · {selected.height} · {selected.weight}
            </p>
          </div>
          <button
            className="button primary"
            style={{ marginLeft: 'auto' }}
            onClick={() => onOpenProfile(selected)}
          >
            Full Profile
          </button>
        </div>
        <div className="stats" style={{ marginBottom: 20 }}>
          {selected.statLabels.map((s) => (
            <span key={s.label}><strong>{s.value}</strong>{s.label}</span>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1.4fr .8fr', gap: 16, marginBottom: 20 }}>
          <article className="panel">
            <div className="heroImg" />
            <h3>About</h3>
            <p style={{ color: 'var(--ink)' }}>{selected.bio}</p>
          </article>
          <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <article className="panel">
              <h3>Achievements</h3>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {selected.achievements.map((a) => <li key={a} style={{ marginBottom: 5 }}>{a}</li>)}
              </ul>
            </article>
          </div>
        </div>
        <article className="panel">
          <h3>Highlights</h3>
          <div className="highlightGrid">
            {HIGHLIGHT_TITLES.map((title) => (
              <div className="highlightCard" key={title}>
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

  return (
    <>
      <div className="feedFilters" style={{ marginBottom: 20 }}>
        <select aria-label="Sport" value={sport} onChange={(e) => handleSportChange(e.target.value)}>
          <option value="all">All sports</option>
          {allSports.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select aria-label="Position" value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="all">All positions</option>
          {positions.map((p) => <option key={p}>{p}</option>)}
        </select>
        <span className="feedCount">{filtered.length} athlete{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="profileGrid">
        {filtered.map((a) => (
          <button key={a.name} className="profileCard" onClick={() => setSelected(a)}>
            <div className="profileCardAvatar">
              {a.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="profileCardBody">
              <p className="cardMeta" style={{ color: '#6fba00', margin: '0 0 3px', fontSize: '.82rem' }}>
                {a.sport} · {a.position}
              </p>
              <strong style={{ display: 'block', fontSize: '1rem' }}>{a.name}</strong>
              <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>
                {a.school} · Class of {a.year}
              </span>
              <p style={{ margin: '6px 0 0', fontSize: '.78rem', color: 'var(--muted)' }}>
                {a.height} · GPA {a.gpa}
              </p>
            </div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="panel"><h3>No athletes match those filters.</h3><p>Try another sport or position.</p></div>
      )}
    </>
  )
}

// ── Main dashboard ───────────────────────────────────────────────────────────

export default function CoachDashboard() {
  const { showModal } = useModal()
  const [tab, setTab] = useState<CoachTab>('foryou')
  const [saved, setSaved] = useState<Athlete[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [contacted, setContacted] = useState<string[]>([])

  const toggleSave = (a: Athlete) =>
    setSaved((prev) =>
      prev.some((s) => s.name === a.name)
        ? prev.filter((s) => s.name !== a.name)
        : [...prev, a],
    )

  const removeSaved = (name: string) =>
    setSaved((prev) => prev.filter((s) => s.name !== name))

  const toggleSelect = (name: string) => {
    if (name === '__clear__') { setSelected([]); return }
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    )
  }

  const saveSelected = () => {
    setSaved((prev) => {
      const have = new Set(prev.map((s) => s.name))
      const additions = athletes.filter((a) => selected.includes(a.name) && !have.has(a.name))
      return [...prev, ...additions]
    })
    setSelected([])
  }

  const markContacted = (a: Athlete) =>
    setContacted((prev) => (prev.includes(a.name) ? prev : [...prev, a.name]))

  const openProfile = (a: Athlete) =>
    showModal(
      a.name,
      <AthleteProfile
        athlete={a}
        isSaved={saved.some((s) => s.name === a.name)}
        isContacted={contacted.includes(a.name)}
        onSave={() => toggleSave(a)}
        onContact={() =>
          showModal(
            `Contact ${a.name}`,
            <ContactFlow athlete={a} onSent={() => markContacted(a)} />,
          )
        }
      />,
    )

  const TABS: { id: CoachTab; label: string }[] = [
    { id: 'foryou', label: 'For You' },
    { id: 'feed', label: 'Recruiting Feed' },
    { id: 'profiles', label: 'Browse Profiles' },
  ]

  return (
    <>
      <Nav />
      <main>
        <section className="section coach coachSection">
          {/* Page header */}
          <div className="coachHeader">
            <div>
              <p className="eyebrow">College coach dashboard</p>
              <h2>Verified Recruiting</h2>
            </div>
            {saved.length > 0 && (
              <div className="coachSavedBadge" onClick={() => setTab('feed')} role="button" tabIndex={0}>
                <span className="coachSavedNum">{saved.length}</span>
                <span>Saved</span>
              </div>
            )}
          </div>

          {/* Segmented tab control */}
          <div className="coachTabs" role="tablist" aria-label="Coach dashboard sections">
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

          {/* Tab panels */}
          {tab === 'foryou' && (
            <ForYouFeed
              saved={saved}
              onSave={toggleSave}
              onOpenProfile={openProfile}
            />
          )}

          {tab === 'feed' && (
            <RecruitingFeed
              saved={saved}
              contacted={contacted}
              onSave={toggleSave}
              onOpenProfile={openProfile}
              onContact={(a) =>
                showModal(
                  `Contact ${a.name}`,
                  <ContactFlow athlete={a} onSent={() => markContacted(a)} />,
                )
              }
              onToggleSelect={toggleSelect}
              selected={selected}
              onSaveSelected={saveSelected}
              onRemoveSaved={removeSaved}
            />
          )}

          {tab === 'profiles' && (
            <BrowseProfiles onOpenProfile={openProfile} />
          )}
        </section>
      </main>
    </>
  )
}
