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
          <p className="eyebrow">AI training schedule page</p>
          <h2>Build a weekly training schedule.</h2>
          <form className="form" id="trainForm" onSubmit={onSubmit}>
            <input name="sport" defaultValue="Basketball" placeholder="Sport" />
            <input
              name="position"
              defaultValue="Point Guard"
              placeholder="Position"
            />
            <select name="level" defaultValue="Varsity starter">
              <option>Varsity starter</option>
              <option>Junior varsity</option>
              <option>Club athlete</option>
            </select>
            <input
              name="availability"
              defaultValue="5 days"
              placeholder="Weekly availability"
            />
            <select name="goal" defaultValue="Explosiveness">
              <option>Explosiveness</option>
              <option>Speed</option>
              <option>Strength</option>
              <option>Endurance</option>
              <option>Skill development</option>
            </select>
            <button className="button primary">Generate Schedule</button>
          </form>
          <div id="trainOut" className="grid output">
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
