import { useState, type FormEvent } from 'react'
import Nav from '../components/Nav'
import { generateTraining, type TrainInput, type TrainDay } from '../lib/plans'

const defaults: TrainInput = {
  sport: 'Basketball',
  position: 'Point Guard',
  level: 'Varsity starter',
  availability: '5 days',
  goal: 'Explosiveness',
}

export default function Training() {
  const [plan, setPlan] = useState<TrainDay[]>(() => generateTraining(defaults))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as unknown as TrainInput
    setPlan(generateTraining(d))
  }

  const trainingCount = plan.filter((d) => !d.rest).length

  return (
    <>
      <Nav />
      <main>
        <section className="section">
          <div className="header">
            <div>
              <p className="eyebrow">Training</p>
              <h2>Weekly training schedule</h2>
            </div>
          </div>
          <form className="form" id="trainForm" onSubmit={onSubmit}>
            <input required name="sport" aria-label="Sport" defaultValue={defaults.sport} placeholder="Sport" />
            <input
              required
              name="position"
              aria-label="Position"
              defaultValue={defaults.position}
              placeholder="Position"
            />
            <select name="level" aria-label="Competition level" defaultValue={defaults.level}>
              <option>Varsity starter</option>
              <option>Junior varsity</option>
              <option>Club athlete</option>
            </select>
            <input
              required
              name="availability"
              aria-label="Weekly availability"
              defaultValue={defaults.availability}
              placeholder="Days per week (e.g. 4 days)"
            />
            <select name="goal" aria-label="Training goal" defaultValue={defaults.goal}>
              <option>Explosiveness</option>
              <option>Speed</option>
              <option>Strength</option>
              <option>Endurance</option>
              <option>Skill development</option>
            </select>
            <button className="button primary">Generate Schedule</button>
          </form>
          <p className="muted" aria-live="polite">
            {trainingCount} training {trainingCount === 1 ? 'day' : 'days'} · {7 - trainingCount} recovery
          </p>
          <div id="trainOut" className="grid output" aria-live="polite">
            {plan.map(({ day, focus, detail, rest }) => (
              <article className={rest ? 'plan rest' : 'plan'} key={day}>
                <strong>{day}</strong>
                <p className="planFocus">{focus}</p>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
