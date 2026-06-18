// Plan engines: turn athlete criteria into actual meal/training prescriptions.
// Everything here is pure and deterministic so the same inputs always produce
// the same plan — no randomness, no fixed text that ignores the form.

const num = (s: string | undefined, fallback: number): number => {
  const m = (s ?? '').match(/-?\d+(\.\d+)?/)
  return m ? Number(m[0]) : fallback
}

const has = (haystack: string, ...needles: string[]): boolean => {
  const h = haystack.toLowerCase()
  return needles.some((n) => h.includes(n))
}

/* ----------------------------- Meal plan ----------------------------- */

export interface MealInput {
  sport: string
  age: string
  height: string
  weight: string
  goal: string
  restrictions: string
  intensity: string
}

export interface MealPlan {
  calories: number
  protein: number
  carbs: number
  fat: number
  meals: { label: string; text: string }[]
}

// Pick the first protein the athlete's restrictions allow, in priority order.
function protein(restrictions: string, options: string[], plantFallback: string): string {
  const vegetarian = has(restrictions, 'vegetarian', 'vegan', 'plant')
  const vegan = has(restrictions, 'vegan')
  for (const opt of options) {
    const o = opt.toLowerCase()
    if (vegetarian && has(o, 'chicken', 'beef', 'turkey', 'salmon', 'fish', 'tuna', 'pork', 'steak'))
      continue
    if (vegan && has(o, 'egg', 'yogurt', 'cheese', 'whey', 'dairy', 'milk')) continue
    if (has(restrictions, 'no pork', 'pork-free') && has(o, 'pork', 'bacon', 'ham')) continue
    if (has(restrictions, 'no fish', 'no seafood', 'shellfish') && has(o, 'salmon', 'fish', 'tuna', 'shrimp'))
      continue
    if (has(restrictions, 'no dairy', 'dairy-free', 'lactose') && has(o, 'yogurt', 'cheese', 'milk', 'whey'))
      continue
    if (has(restrictions, 'no egg', 'egg-free') && has(o, 'egg')) continue
    return opt
  }
  return plantFallback
}

export function generateMeal(d: MealInput): MealPlan {
  const lbs = num(d.weight, 185)
  const age = num(d.age, 17)
  const goal = (d.goal || 'Performance').toLowerCase()

  // Calories per lb scale with training intensity; teen athletes (<18) get a bump.
  const intensityCal = has(d.intensity, 'high') ? 20 : has(d.intensity, 'moderate') ? 17 : 15
  const youthBump = age < 18 ? 1.05 : 1
  let calories = lbs * intensityCal * youthBump

  // Goal shifts the surplus/deficit and the protein target (grams per lb).
  let proteinPerLb = 0.9
  if (goal.includes('muscle')) {
    calories += 400
    proteinPerLb = 1.0
  } else if (goal.includes('fat')) {
    calories -= 400
    proteinPerLb = 1.1
  } else if (goal.includes('performance')) {
    calories += 200
  }

  const proteinG = Math.round(lbs * proteinPerLb)
  const fatG = Math.round((calories * 0.25) / 9)
  const carbsG = Math.max(0, Math.round((calories - proteinG * 4 - fatG * 9) / 4))
  calories = Math.round(calories / 10) * 10

  const r = d.restrictions || ''
  const bfast = protein(r, ['Egg-white scramble', 'Greek yogurt', 'tofu scramble'], 'tofu scramble')
  const lunchP = protein(r, ['grilled chicken', 'lean beef', 'turkey', 'tempeh'], 'tempeh & lentils')
  const dinnerP = protein(r, ['salmon', 'grilled chicken', 'lean steak', 'black beans'], 'chickpea & quinoa bowl')
  const snackP = protein(r, ['whey protein smoothie', 'turkey wrap', 'pea-protein smoothie'], 'pea-protein smoothie')

  const carbHeavy = goal.includes('performance') || has(d.intensity, 'high')
  const meals: { label: string; text: string }[] = [
    {
      label: 'Breakfast',
      text: `${bfast} with oats, berries${carbHeavy ? ', and a bagel' : ''} — fuel before ${d.intensity.toLowerCase()} ${d.sport.toLowerCase()} work.`,
    },
    {
      label: 'Lunch',
      text: `${cap(lunchP)} rice bowl with avocado and vegetables, sized for ${goal}.`,
    },
    {
      label: 'Dinner',
      text: `${cap(dinnerP)} with sweet potatoes and greens to support overnight recovery.`,
    },
    {
      label: 'Snacks',
      text: `${cap(snackP)}, trail mix, and a banana 30 min pre-training.`,
    },
    {
      label: 'Hydration',
      text: `${Math.round(lbs * 0.6)}-${Math.round(lbs * 0.75)} oz water daily${has(d.intensity, 'high') ? ', plus electrolytes around hard sessions.' : '.'}`,
    },
  ]
  if (r.trim()) meals.push({ label: 'Restrictions honored', text: `Plan built around: ${r}.` })

  return { calories, protein: proteinG, carbs: carbsG, fat: fatG, meals }
}

/* --------------------------- Training plan --------------------------- */

export interface TrainInput {
  sport: string
  position: string
  level: string
  availability: string
  goal: string
}

export interface TrainDay {
  day: string
  focus: string
  detail: string
  rest: boolean
}

const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Ordered training focuses per goal — earlier entries are prioritized when the
// athlete has fewer available days, so the most important work always lands.
const FOCUS: Record<string, { focus: string; detail: (d: TrainInput) => string }[]> = {
  explosiveness: [
    { focus: 'Power & plyometrics', detail: (d) => `Trap-bar jumps, bounds, and ${d.position.toLowerCase()} starts.` },
    { focus: 'Max strength', detail: () => 'Heavy squat/hinge triples with full rest.' },
    { focus: 'Speed & reaction', detail: (d) => `Short sprints and ${d.sport.toLowerCase()} reaction drills.` },
    { focus: 'Skill + power transfer', detail: (d) => `Loaded ${d.position.toLowerCase()} movements into game reps.` },
    { focus: 'Tempo conditioning', detail: () => 'Tempo runs and core stability circuit.' },
  ],
  speed: [
    { focus: 'Acceleration', detail: (d) => `10-30yd sprints and ${d.position.toLowerCase()} get-offs.` },
    { focus: 'Max velocity', detail: () => 'Flying sprints and sprint-float-sprint reps.' },
    { focus: 'Speed endurance', detail: () => 'Repeat 60s with controlled rest.' },
    { focus: 'Skill at speed', detail: (d) => `${d.sport} skills executed at game tempo.` },
    { focus: 'Mobility & tempo', detail: () => 'Hip mobility and easy tempo conditioning.' },
  ],
  strength: [
    { focus: 'Lower-body strength', detail: () => 'Squat, deadlift, and unilateral accessory work.' },
    { focus: 'Upper-body strength', detail: () => 'Press, pull, and shoulder health work.' },
    { focus: 'Full-body power', detail: () => 'Cleans, jumps, and medicine-ball throws.' },
    { focus: 'Skill + core', detail: (d) => `${d.position} skill block and anti-rotation core.` },
    { focus: 'Conditioning', detail: () => 'Sled pushes and aerobic finisher.' },
  ],
  endurance: [
    { focus: 'Aerobic base', detail: () => 'Steady-state run at conversational pace.' },
    { focus: 'Threshold', detail: () => 'Cruise intervals at race effort.' },
    { focus: 'Tempo + strength', detail: () => 'Tempo work paired with strength-endurance circuit.' },
    { focus: 'Skill conditioning', detail: (d) => `${d.sport} skills under accumulated fatigue.` },
    { focus: 'Long conditioning', detail: () => 'Extended low-intensity session.' },
  ],
  'skill development': [
    { focus: 'Technical skills', detail: (d) => `${d.position} fundamentals and film breakdown.` },
    { focus: 'Skill + strength', detail: () => 'Skill block followed by foundational lift.' },
    { focus: 'Decision-making', detail: (d) => `Small-sided ${d.sport.toLowerCase()} games and reads.` },
    { focus: 'Speed & agility', detail: () => 'Change-of-direction ladder and cone work.' },
    { focus: 'Recovery skill work', detail: () => 'Light technical reps and mobility.' },
  ],
}

export function generateTraining(d: TrainInput): TrainDay[] {
  const goalKey = (d.goal || 'Explosiveness').toLowerCase()
  const pool = FOCUS[goalKey] ?? FOCUS.explosiveness

  // How many days the athlete actually trains drives the whole layout.
  let trainDays = Math.min(7, Math.max(2, num(d.availability, 5)))
  // Club / JV athletes cap volume one day lower to manage load.
  if (has(d.level, 'club', 'junior') && trainDays > 5) trainDays = 5

  // Spread the training days as evenly as possible across the week.
  const trainIdx = new Set<number>()
  for (let i = 0; i < trainDays; i++) {
    trainIdx.add(Math.round((i * (WEEK.length - 1)) / (trainDays - 1 || 1)))
  }
  // Rounding collisions can drop a day — fill forward until we hit the target.
  for (let i = 0; trainIdx.size < trainDays && i < WEEK.length; i++) trainIdx.add(i)

  let focusN = 0
  return WEEK.map((day, i) => {
    if (!trainIdx.has(i)) {
      return { day, focus: 'Rest & recovery', detail: 'Sleep, hydration, and light mobility.', rest: true }
    }
    const block = pool[focusN % pool.length]
    focusN++
    return { day, focus: block.focus, detail: block.detail(d), rest: false }
  })
}

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)
