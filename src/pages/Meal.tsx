import { useState, type FormEvent } from 'react'
import Nav from '../components/Nav'

type Plan = [label: string, text: string]

function generateMeal(d: Record<string, string>): Plan[] {
  return [
    [
      'Breakfast',
      `Egg-white scramble, oatmeal, berries, and electrolyte water for ${d.intensity.toLowerCase()}.`,
    ],
    [
      'Lunch',
      `Grilled chicken rice bowl with avocado, vegetables, and fruit for ${d.goal.toLowerCase()}.`,
    ],
    ['Dinner', 'Salmon, sweet potatoes, greens, and Greek yogurt to support recovery.'],
    ['Snacks', 'Protein smoothie, trail mix, turkey wrap, and banana before training.'],
    ['Hydration', '110-130 oz water daily, plus sodium/electrolytes around hard sessions.'],
    [
      'Estimates',
      `${d.weight} ${d.sport} plan: 3,050 calories, 190g protein, 390g carbs, 82g fat.`,
    ],
  ]
}

const defaults = {
  sport: 'Football',
  goal: 'Performance',
  weight: '185 lbs',
  intensity: 'High intensity',
}

export default function Meal() {
  const [plans, setPlans] = useState<Plan[]>(() => generateMeal(defaults))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    ) as Record<string, string>
    setPlans(generateMeal(d))
  }

  return (
    <>
      <Nav cta={{ to: '/training', label: 'Training Tool' }} />
      <main>
        <section className="section soft">
          <p className="eyebrow">Meal plan tool</p>
          <h2>Generate a sample performance meal plan.</h2>
          <form className="form" id="mealForm" onSubmit={onSubmit}>
            <input required name="sport" aria-label="Sport" defaultValue="Football" placeholder="Sport" />
            <input required name="age" aria-label="Age" defaultValue="17" placeholder="Age" />
            <input required name="height" aria-label="Height" defaultValue={`6'1"`} placeholder="Height" />
            <input required name="weight" aria-label="Weight" defaultValue="185 lbs" placeholder="Weight" />
            <select name="goal" aria-label="Goal" defaultValue="Performance">
              <option>Performance</option>
              <option>Muscle gain</option>
              <option>Fat loss</option>
              <option>Maintenance</option>
            </select>
            <input
              name="restrictions"
              aria-label="Dietary restrictions"
              defaultValue="No pork"
              placeholder="Dietary restrictions"
            />
            <select name="intensity" aria-label="Training intensity" defaultValue="High intensity">
              <option>High intensity</option>
              <option>Moderate intensity</option>
              <option>Light intensity</option>
            </select>
            <button className="button primary">Generate Meal Plan</button>
          </form>
          <div id="mealOut" className="grid output" aria-live="polite">
            {plans.map(([label, text]) => (
              <article className="plan" key={label}>
                <strong>{label}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
