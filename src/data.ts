export interface Mentor {
  name: string
  role: string
  sport: string
  price: number
}

export interface Athlete {
  name: string
  sport: string
  position: string
  year: string
  school: string
  state: string
  gpa: string
  stats: string
}

export const mentors: Mentor[] = [
  { name: 'Cam Porter', role: 'UNC Football | Defensive Back', sport: 'Football', price: 80 },
  { name: 'Leah Mitchell', role: 'Duke Basketball | Guard', sport: 'Basketball', price: 95 },
  { name: 'Nico Alvarez', role: 'Wake Forest Soccer | Midfielder', sport: 'Soccer', price: 65 },
]

export const athletes: Athlete[] = [
  {
    name: 'Jordan Reed',
    sport: 'Football',
    position: 'Wide Receiver',
    year: '2027',
    school: 'Myers Park High',
    state: 'NC',
    gpa: '3.7',
    stats: '812 yards | 10 TD | 4.48 forty',
  },
  {
    name: 'Maya Collins',
    sport: 'Basketball',
    position: 'Point Guard',
    year: '2026',
    school: 'Cardinal Gibbons',
    state: 'NC',
    gpa: '3.8',
    stats: '24.1 PPG | 6.8 AST | 42% 3PT',
  },
  {
    name: 'Avery Scott',
    sport: 'Soccer',
    position: 'Forward',
    year: '2026',
    school: 'Durham Academy',
    state: 'NC',
    gpa: '3.9',
    stats: '22 goals | 11 assists | captain',
  },
]

export const money = (n: number): string => `$${Number(n).toFixed(0)}`
