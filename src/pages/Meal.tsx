import { useState, type FormEvent } from 'react'
import Nav from '../components/Nav'
import { generateMeal, type MealInput, type MealPlan } from '../lib/plans'

const defaults: MealInput = {
  sport: 'Football',
  age: '17',
  height: `6'1"`,
  weight: '185 lbs',
  goal: 'Performance',
  restrictions: 'No pork',
  intensity: 'High intensity',
}

export default function Meal() {
  const [plan, setPlan] = useState<MealPlan>(() => generateMeal(defaults))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as unknown as MealInput
    setPlan(generateMeal(d))
  }

  return (
    <>
      <Nav />
      <main>
        <section className="section soft">
          <div className="header">
            <div>
              <p className="eyebrow">Nutrition</p>
              <h2>Performance meal plan</h2>
            </div>
          </div>
          <form className="form" id="mealForm" onSubmit={onSubmit}>
            <input required name="sport" aria-label="Sport" defaultValue={defaults.sport} placeholder="Sport" />
            <input required name="age" aria-label="Age" defaultValue={defaults.age} placeholder="Age" />
            <input required name="height" aria-label="Height" defaultValue={defaults.height} placeholder="Height" />
            <input required name="weight" aria-label="Weight" defaultValue={defaults.weight} placeholder="Weight" />
            <select name="goal" aria-label="Goal" defaultValue={defaults.goal}>
              <option>Performance</option>
              <option>Muscle gain</option>
              <option>Fat loss</option>
              <option>Maintenance</option>
            </select>
            <input
              name="restrictions"
              aria-label="Dietary restrictions"
              defaultValue={defaults.restrictions}
              placeholder="Dietary restrictions (e.g. vegetarian, no dairy)"
            />
            <select name="intensity" aria-label="Training intensity" defaultValue={defaults.intensity}>
              <option>High intensity</option>
              <option>Moderate intensity</option>
              <option>Light intensity</option>
            </select>
            <button className="button primary">Generate Meal Plan</button>
          </form>

          <div className="macros" aria-live="polite">
            <div className="macro">
              <strong>{plan.calories.toLocaleString()}</strong>
              <span>calories / day</span>
            </div>
            <div className="macro">
              <strong>{plan.protein}g</strong>
              <span>protein</span>
            </div>
            <div className="macro">
              <strong>{plan.carbs}g</strong>
              <span>carbs</span>
            </div>
            <div className="macro">
              <strong>{plan.fat}g</strong>
              <span>fat</span>
            </div>
          </div>

          <div id="mealOut" className="grid output" aria-live="polite">
            {plan.meals.map(({ label, text }) => (
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
