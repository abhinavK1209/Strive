export interface Mentor {
  name: string
  initials: string
  role: string
  sport: string
  price: number
  bio: string
  rating: number
  sessions: number
}

export interface MentorReview {
  mentorName: string
  athlete: string
  sport: string
  rating: number
  comment: string
  date: string
}

export interface Athlete {
  name: string
  sport: string
  position: string
  year: string
  school: string
  state: string
  gpa: string
  height: string
  weight: string
  bio: string
  stats: string
  statLabels: { value: string; label: string }[]
  achievements: string[]
}

export const SPORT_POSITIONS: Record<string, string[]> = {
  Basketball: [
    'Point Guard',
    'Shooting Guard',
    'Small Forward',
    'Power Forward',
    'Center',
  ],
  Football: [
    'Quarterback',
    'Running Back',
    'Wide Receiver',
    'Tight End',
    'Linebacker',
    'Cornerback',
  ],
  Soccer: [
    'Goalkeeper',
    'Center Back',
    'Full Back',
    'Defensive Midfielder',
    'Attacking Midfielder',
    'Winger',
    'Striker',
  ],
}

export const ALL_SESSION_TYPES = [
  'Skill Development',
  'Strength & Conditioning',
  'Game Film Review',
  'Mental Coaching',
  'Recruitment Prep',
  'Nutrition Advice',
  'College Life Q&A',
]

export const mentors: Mentor[] = [
  {
    name: 'Cam Porter',
    initials: 'CP',
    role: 'UNC Football | Defensive Back',
    sport: 'Football',
    price: 80,
    bio: 'ACC starter, team captain, two-time All-Conference selection. Specializes in film breakdown and DB technique for high school prospects.',
    rating: 4.9,
    sessions: 142,
  },
  {
    name: 'Leah Mitchell',
    initials: 'LM',
    role: 'Duke Basketball | Guard',
    sport: 'Basketball',
    price: 95,
    bio: 'ACC All-Freshman team, program assist leader. Focused on guard play, recruiting navigation, and mental performance for female athletes.',
    rating: 4.8,
    sessions: 98,
  },
  {
    name: 'Nico Alvarez',
    initials: 'NA',
    role: 'Wake Forest Soccer | Midfielder',
    sport: 'Soccer',
    price: 65,
    bio: 'Two-year starter and technical leader for the Deacons. Runs film sessions focused on positional movement and recruiting portfolio preparation.',
    rating: 4.7,
    sessions: 76,
  },
]

export const mentorDefaultSessions: Record<string, string[]> = {
  'Cam Porter': ['Game Film Review', 'Recruitment Prep', 'Mental Coaching'],
  'Leah Mitchell': ['Skill Development', 'Recruitment Prep', 'Mental Coaching', 'College Life Q&A'],
  'Nico Alvarez': ['Skill Development', 'Game Film Review', 'Nutrition Advice'],
}

export const mentorReviews: MentorReview[] = [
  // Cam Porter
  { mentorName: 'Cam Porter', athlete: 'Darius Fontaine', sport: 'Football', rating: 5, comment: 'Cam broke down my film in a way no coach has. Completely changed how I read coverages.', date: 'May 2026' },
  { mentorName: 'Cam Porter', athlete: 'Elijah Hargrove', sport: 'Football', rating: 5, comment: 'Best investment of my recruitment process. I had 3 offers within 6 weeks of working with him.', date: 'Apr 2026' },
  { mentorName: 'Cam Porter', athlete: 'Priya Nair', sport: 'Football', rating: 4, comment: 'Super detailed and patient. Helped me understand what D1 coaches look for on tape.', date: 'Mar 2026' },
  // Leah Mitchell
  { mentorName: 'Leah Mitchell', athlete: 'Maya Collins', sport: 'Basketball', rating: 5, comment: 'Leah\'s handle drills pushed me to another level. Felt the difference after just 3 sessions.', date: 'Jun 2026' },
  { mentorName: 'Leah Mitchell', athlete: 'Tori Vásquez', sport: 'Basketball', rating: 5, comment: 'She knows exactly what college coaches want to see on highlight tapes. Incredible mentor.', date: 'May 2026' },
  { mentorName: 'Leah Mitchell', athlete: 'DeShawn Okafor', sport: 'Basketball', rating: 4, comment: 'Great at breaking down off-ball movement. Helped me identify holes in my game.', date: 'Apr 2026' },
  // Nico Alvarez
  { mentorName: 'Nico Alvarez', athlete: 'Sophia Reyes', sport: 'Soccer', rating: 5, comment: 'Nico has an eye for technical detail. My first touch has improved dramatically.', date: 'May 2026' },
  { mentorName: 'Nico Alvarez', athlete: 'Kai Nakamura', sport: 'Soccer', rating: 5, comment: 'Amazing session. He walked me through my entire highlight film and rebuilt my cutting angles.', date: 'Apr 2026' },
  { mentorName: 'Nico Alvarez', athlete: 'Avery Scott', sport: 'Soccer', rating: 4, comment: 'Thorough and encouraging. Great knowledge of what college programs look for in strikers.', date: 'Mar 2026' },
]

export const athletes: Athlete[] = [
  // ── BASKETBALL ──────────────────────────────────────────────────────────────
  {
    name: 'Maya Collins',
    sport: 'Basketball',
    position: 'Point Guard',
    year: '2026',
    school: 'Cardinal Gibbons',
    state: 'NC',
    gpa: '3.8',
    height: '5\'8"',
    weight: '145 lbs',
    bio: 'Elite floor general with elite court vision and deep range. Two-time all-conference selection and program scoring leader since sophomore year.',
    stats: '24.1 PPG | 6.8 AST | 42% 3PT',
    statLabels: [
      { value: '24.1', label: 'PPG' },
      { value: '6.8', label: 'Assists' },
      { value: '42%', label: '3-Point' },
      { value: '3.8', label: 'GPA' },
    ],
    achievements: ['All-Conference 2x', 'State semifinalist', 'Academic honor roll', 'Team captain'],
  },
  {
    name: 'DeShawn Okafor',
    sport: 'Basketball',
    position: 'Shooting Guard',
    year: '2027',
    school: 'Hoggard High School',
    state: 'NC',
    gpa: '3.5',
    height: '6\'3"',
    weight: '185 lbs',
    bio: 'Explosive off-ball scorer with a quick first step and reliable mid-range game. Rated top-40 prospect in the Carolinas per PrepHoops.',
    stats: '21.3 PPG | 4.1 REB | 38% 3PT',
    statLabels: [
      { value: '21.3', label: 'PPG' },
      { value: '4.1', label: 'Rebounds' },
      { value: '38%', label: '3-Point' },
      { value: '3.5', label: 'GPA' },
    ],
    achievements: ['PrepHoops NC Top-40', 'Region all-star', 'Summer league MVP'],
  },
  {
    name: 'Tori Vásquez',
    sport: 'Basketball',
    position: 'Small Forward',
    year: '2026',
    school: 'Lake Norman Charter',
    state: 'NC',
    gpa: '3.9',
    height: '6\'0"',
    weight: '162 lbs',
    bio: 'Versatile wing with the ability to guard multiple positions and create off the bounce. Three-year starter with high-level motor and IQ.',
    stats: '18.7 PPG | 7.2 REB | 2.4 STL',
    statLabels: [
      { value: '18.7', label: 'PPG' },
      { value: '7.2', label: 'Rebounds' },
      { value: '2.4', label: 'Steals' },
      { value: '3.9', label: 'GPA' },
    ],
    achievements: ['Defensive player of year', 'All-state nominee', 'Academic all-star'],
  },
  {
    name: 'Marcus Alleyne',
    sport: 'Basketball',
    position: 'Power Forward',
    year: '2025',
    school: 'Panther Creek High',
    state: 'NC',
    gpa: '3.2',
    height: '6\'7"',
    weight: '220 lbs',
    bio: 'Physical frontcourt presence who dominates the glass and protects the rim. Skilled passer for his size with a developing face-up game.',
    stats: '14.9 PPG | 11.3 REB | 2.8 BLK',
    statLabels: [
      { value: '14.9', label: 'PPG' },
      { value: '11.3', label: 'Rebounds' },
      { value: '2.8', label: 'Blocks' },
      { value: '3.2', label: 'GPA' },
    ],
    achievements: ['Conference rebounding leader', 'All-region 2x', 'Nike EYBL participant'],
  },
  {
    name: 'Zara Pemberton',
    sport: 'Basketball',
    position: 'Center',
    year: '2027',
    school: 'Southeast Raleigh High',
    state: 'NC',
    gpa: '3.6',
    height: '6\'4"',
    weight: '208 lbs',
    bio: 'Dominant post player with soft hands and reliable footwork. Led the state in blocks last season and is coveted for her defensive versatility.',
    stats: '16.4 PPG | 13.1 REB | 4.2 BLK',
    statLabels: [
      { value: '16.4', label: 'PPG' },
      { value: '13.1', label: 'Rebounds' },
      { value: '4.2', label: 'Blocks' },
      { value: '3.6', label: 'GPA' },
    ],
    achievements: ['State blocks leader', 'Gatorade POY nominee', 'AAU national qualifier'],
  },
  // ── FOOTBALL ────────────────────────────────────────────────────────────────
  {
    name: 'Caleb Drummond',
    sport: 'Football',
    position: 'Quarterback',
    year: '2026',
    school: 'Ardrey Kell High',
    state: 'NC',
    gpa: '3.6',
    height: '6\'2"',
    weight: '205 lbs',
    bio: 'Dual-threat signal caller with elite arm strength and mobility. Posted a 27:4 TD-to-INT ratio last season while rushing for 780 yards.',
    stats: '3,412 Pass Yds | 27 TD | 68% Cmp',
    statLabels: [
      { value: '3,412', label: 'Pass Yds' },
      { value: '27', label: 'Pass TDs' },
      { value: '68%', label: 'Completion' },
      { value: '3.6', label: 'GPA' },
    ],
    achievements: ['All-state selection', 'Regional Player of Year', '247Sports 3-star'],
  },
  {
    name: 'Darius Fontaine',
    sport: 'Football',
    position: 'Running Back',
    year: '2026',
    school: 'Mallard Creek High',
    state: 'NC',
    gpa: '3.3',
    height: '5\'11"',
    weight: '198 lbs',
    bio: 'Explosive between-the-tackles runner with elite vision and balance. Rushed for 1,800+ yards two years straight and is a complete back in pass protection.',
    stats: '1,847 Rush Yds | 22 TD | 4.45 Forty',
    statLabels: [
      { value: '1,847', label: 'Rush Yds' },
      { value: '22', label: 'TDs' },
      { value: '4.45', label: '40-Yard' },
      { value: '3.3', label: 'GPA' },
    ],
    achievements: ['Conference MVP', 'State title runner-up', 'Rivals 3-star prospect'],
  },
  {
    name: 'Jordan Reed',
    sport: 'Football',
    position: 'Wide Receiver',
    year: '2027',
    school: 'Myers Park High',
    state: 'NC',
    gpa: '3.7',
    height: '6\'1"',
    weight: '183 lbs',
    bio: 'Long, rangy receiver with silky route-running and reliable hands at full extension. Ran a 4.48 forty at the Charlotte regional combine.',
    stats: '812 Rec Yds | 10 TD | 4.48 Forty',
    statLabels: [
      { value: '812', label: 'Rec Yds' },
      { value: '10', label: 'TDs' },
      { value: '4.48', label: '40-Yard' },
      { value: '3.7', label: 'GPA' },
    ],
    achievements: ['All-state nominee', 'Charlotte combine top-10 WR', 'Team captain'],
  },
  {
    name: 'Quinton Mercer',
    sport: 'Football',
    position: 'Tight End',
    year: '2025',
    school: 'South Mecklenburg High',
    state: 'NC',
    gpa: '3.4',
    height: '6\'5"',
    weight: '245 lbs',
    bio: 'Mismatch weapon with H-back versatility. Strong blocker who is equally dangerous in the passing game with contested-catch ability.',
    stats: '58 REC | 720 Yds | 9 TD',
    statLabels: [
      { value: '58', label: 'Receptions' },
      { value: '720', label: 'Rec Yds' },
      { value: '9', label: 'TDs' },
      { value: '3.4', label: 'GPA' },
    ],
    achievements: ['All-region TE', 'Senior Bowl invitee (HS)', 'Honor roll student'],
  },
  {
    name: 'Elijah Hargrove',
    sport: 'Football',
    position: 'Linebacker',
    year: '2026',
    school: 'Green Hope High',
    state: 'NC',
    gpa: '3.5',
    height: '6\'2"',
    weight: '228 lbs',
    bio: 'High-motor linebacker who reads and reacts with uncanny quickness. Led the county in tackles last season and is a reliable blitz package piece.',
    stats: '114 Tackles | 9 TFL | 5 Sacks',
    statLabels: [
      { value: '114', label: 'Tackles' },
      { value: '9', label: 'TFLs' },
      { value: '5', label: 'Sacks' },
      { value: '3.5', label: 'GPA' },
    ],
    achievements: ['Defensive POY county-wide', 'All-conference 2x', 'NCSFA All-Star Game'],
  },
  {
    name: 'Priya Nair',
    sport: 'Football',
    position: 'Cornerback',
    year: '2027',
    school: 'Leesville Road High',
    state: 'NC',
    gpa: '3.9',
    height: '5\'11"',
    weight: '172 lbs',
    bio: 'Long, physical corner with a knack for turnovers and elite recovery speed. Allowed zero receiving TDs in man coverage last regular season.',
    stats: '6 INT | 22 PBU | 4.41 Forty',
    statLabels: [
      { value: '6', label: 'Interceptions' },
      { value: '22', label: 'PBUs' },
      { value: '4.41', label: '40-Yard' },
      { value: '3.9', label: 'GPA' },
    ],
    achievements: ['All-state CB', 'Under Armour All-American nominee', 'Academic excellence award'],
  },
  // ── SOCCER ──────────────────────────────────────────────────────────────────
  {
    name: 'Lena Brauer',
    sport: 'Soccer',
    position: 'Goalkeeper',
    year: '2026',
    school: 'Cary Academy',
    state: 'NC',
    gpa: '3.8',
    height: '5\'10"',
    weight: '150 lbs',
    bio: 'Shot-stopper with commanding presence in the 18-yard box and excellent distribution. Posted a .789 save percentage and 8 shutouts last fall.',
    stats: '8 Shutouts | .789 SV% | 61 Saves',
    statLabels: [
      { value: '8', label: 'Shutouts' },
      { value: '.789', label: 'Save %' },
      { value: '61', label: 'Saves' },
      { value: '3.8', label: 'GPA' },
    ],
    achievements: ['All-state GK', 'ODP Regional pool', 'Academic all-state'],
  },
  {
    name: 'Isaiah Torrence',
    sport: 'Soccer',
    position: 'Center Back',
    year: '2025',
    school: 'Apex High',
    state: 'NC',
    gpa: '3.3',
    height: '6\'1"',
    weight: '185 lbs',
    bio: 'Commanding central defender who wins duels in the air and distributes calmly under pressure. Marshalled a back line that conceded just 9 goals all season.',
    stats: '9 Goals vs | 14 Clearances/gm | 87% Duel',
    statLabels: [
      { value: '9', label: 'Goals vs' },
      { value: '14', label: 'Clearances' },
      { value: '87%', label: 'Duel Win' },
      { value: '3.3', label: 'GPA' },
    ],
    achievements: ['All-conference CB', 'State finalist', 'ECNL club captain'],
  },
  {
    name: 'Alana Hutchins',
    sport: 'Soccer',
    position: 'Full Back',
    year: '2026',
    school: 'Holly Springs High',
    state: 'NC',
    gpa: '3.6',
    height: '5\'6"',
    weight: '143 lbs',
    bio: 'Dynamic overlapping full back with technical quality in tight spaces. Provides reliable width in attack while maintaining defensive discipline.',
    stats: '7 Assists | 3 Goals | 92% Pass Acc',
    statLabels: [
      { value: '7', label: 'Assists' },
      { value: '3', label: 'Goals' },
      { value: '92%', label: 'Pass Acc.' },
      { value: '3.6', label: 'GPA' },
    ],
    achievements: ['Conference best XI', 'ODP state pool', 'Honor roll 3 years'],
  },
  {
    name: 'Marcus Osei',
    sport: 'Soccer',
    position: 'Defensive Midfielder',
    year: '2026',
    school: 'Enloe High',
    state: 'NC',
    gpa: '3.7',
    height: '5\'9"',
    weight: '166 lbs',
    bio: 'Tenacious ball-winner who anchors the midfield and quickly transitions to attack. Posts elite pressing numbers and is the engine of every team he plays on.',
    stats: '5.8 Tackles/gm | 4 Goals | 9 Assists',
    statLabels: [
      { value: '5.8', label: 'Tackles/gm' },
      { value: '4', label: 'Goals' },
      { value: '9', label: 'Assists' },
      { value: '3.7', label: 'GPA' },
    ],
    achievements: ['All-region DM', 'NCSSCA all-star', 'Club national qualifier'],
  },
  {
    name: 'Sophia Reyes',
    sport: 'Soccer',
    position: 'Attacking Midfielder',
    year: '2027',
    school: 'Chapel Hill High',
    state: 'NC',
    gpa: '3.9',
    height: '5\'5"',
    weight: '138 lbs',
    bio: 'Creative #10 with exceptional close control and an eye for through-balls. Dictates tempo and unlocks defenses with clever movement off the ball.',
    stats: '14 Goals | 17 Assists | 72% Chance Conv',
    statLabels: [
      { value: '14', label: 'Goals' },
      { value: '17', label: 'Assists' },
      { value: '72%', label: 'Chance Conv.' },
      { value: '3.9', label: 'GPA' },
    ],
    achievements: ['Conference Player of Year', 'ECNL showcase standout', 'National honor society'],
  },
  {
    name: 'Kai Nakamura',
    sport: 'Soccer',
    position: 'Winger',
    year: '2026',
    school: 'East Chapel Hill High',
    state: 'NC',
    gpa: '3.5',
    height: '5\'8"',
    weight: '155 lbs',
    bio: 'Pacey wide attacker who takes defenders on in 1v1 situations with consistency. Dangerous from set pieces with a powerful left foot.',
    stats: '11 Goals | 13 Assists | 8 Big Chances',
    statLabels: [
      { value: '11', label: 'Goals' },
      { value: '13', label: 'Assists' },
      { value: '8', label: 'Big Chances' },
      { value: '3.5', label: 'GPA' },
    ],
    achievements: ['All-state winger', 'Regional showcase MVP', 'Club top scorer'],
  },
  {
    name: 'Avery Scott',
    sport: 'Soccer',
    position: 'Striker',
    year: '2026',
    school: 'Durham Academy',
    state: 'NC',
    gpa: '3.9',
    height: '5\'11"',
    weight: '168 lbs',
    bio: 'Explosive striker with strong first touch, direct attacking instincts, and leadership experience as team captain. Clinical finisher inside the box.',
    stats: '22 Goals | 11 Assists | Team Captain',
    statLabels: [
      { value: '22', label: 'Goals' },
      { value: '11', label: 'Assists' },
      { value: '4.61', label: '40-Yard' },
      { value: '3.9', label: 'GPA' },
    ],
    achievements: ['All-state nominee', 'Club national showcase finalist', 'Academic honor roll', 'Team captain'],
  },
]

export const money = (n: number): string => `$${Number(n).toFixed(0)}`
