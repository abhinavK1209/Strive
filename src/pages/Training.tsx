import { useState, type FormEvent } from 'react'
import Nav from '../components/Nav'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function generateTraining(d: Record<string, string>): string[] {
  return [
    `${d.goal} lift, acceleration mechanics, and position footwork.`,
    `${d.sport} skill block, mobility, and film study.`,
    'Tempo conditioning, core stability, and recovery stretch.',
    'Power session, short-area quickness, and competitive reps.',
    'Game-speed skill work, reaction drills, and recruiting highlight clips.',
    'Optional light recovery and nutrition reset.',
  ]
}

const defaults = { sport: 'Basketball', goal: 'Explosiveness' }

export default function Training() {
  const [plan, setPlan] = useState<string[]>(() => generateTraining(defaults))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    ) as Record<string, string>
    setPlan(generateTraining(d))
  }

  return (
    <>
      <Nav cta={{ to: '/meal', label: 'Meal Tool' }} />
      <main>
        <section className="section">
          <div className="header">
            <div>
              <p className="eyebrow">Training</p>
              <h2>Weekly training schedule</h2>
            </div>
          </div>
          <form className="form" id="trainForm" onSubmit={onSubmit}>
            <input required name="sport" aria-label="Sport" defaultValue="Basketball" placeholder="Sport" />
            <input
              required
              name="position"
              aria-label="Position"
              defaultValue="Point Guard"
              placeholder="Position"
            />
            <select name="level" aria-label="Competition level" defaultValue="Varsity starter">
              <option>Varsity starter</option>
              <option>Junior varsity</option>
              <option>Club athlete</option>
            </select>
            <input
              required
              name="availability"
              aria-label="Weekly availability"
              defaultValue="5 days"
              placeholder="Weekly availability"
            />
            <select name="goal" aria-label="Training goal" defaultValue="Explosiveness">
              <option>Explosiveness</option>
              <option>Speed</option>
              <option>Strength</option>
              <option>Endurance</option>
              <option>Skill development</option>
            </select>
            <button className="button primary">Generate Schedule</button>
          </form>
          <div id="trainOut" className="grid output" aria-live="polite">
            {days.map((day, i) => (
              <article className="plan" key={day}>
                <strong>{day}</strong>
                <p>{plan[i]}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
