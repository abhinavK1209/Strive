import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import ExistingMentorDashboard from './MentorDashboard'
import { mentors, money, type Mentor } from '../data'
import { generateMeal, generateTraining, type MealInput, type TrainInput } from '../lib/plans'
import { useAuth, ROLE_HOME, type Role } from '../components/Auth'
import {
  createMentorshipRequest,
  getAthleteProfile,
  getDemoEvents,
  getMentorThreads,
  getMentorshipRequests,
  getSavedMealPlan,
  getSavedTrainingPlan,
  resetAthleteDemo,
  saveAthleteProfile,
  saveMealPlan,
  saveTrainingPlan,
  sendDemoMessage,
  
  updateRequestStatus,
  type AthleteDemoProfile,
  type MealPlanDay,
} from '../lib/demoState'

const demoCss = `
.demoNotice{display:flex;justify-content:space-between;gap:18px;align-items:center;padding:12px clamp(18px,5vw,72px);background:#efffd2;border-bottom:1px solid #d1e9a4}.demoNotice div{display:flex;gap:10px;align-items:baseline}.demoNotice strong{font-size:.76rem;letter-spacing:.08em;text-transform:uppercase}.demoNotice span{color:#46503f;font-size:.9rem}.demoSubnav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 24px}.demoSubnav a{padding:8px 12px;border:1px solid var(--line);border-radius:999px;font-size:.82rem;font-weight:800}.demoOnboard{padding:clamp(30px,6vw,70px);border-radius:18px;background:radial-gradient(circle at 85% 15%,rgba(182,255,46,.26),transparent 28%),#111512;color:#fff}.demoOnboard p{max-width:680px;color:#ced7cf}.demoSurvey{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:24px}.demoSurvey label{display:grid;gap:6px;font-size:.82rem;font-weight:800}.demoSurvey input,.demoSurvey select,.demoSurvey textarea{width:100%}.demoSurvey .full{grid-column:1/-1}.demoCheck{display:flex;gap:10px;flex-wrap:wrap}.demoCheck label{display:flex;align-items:center;gap:6px;padding:8px 10px;border:1px solid #39433b;border-radius:8px}.demoCheck input{width:auto;min-height:auto}.demoBannerCard{padding:26px;border-radius:14px;background:#111512;color:#fff}.demoBannerCard p{color:#c8d0c9}.demoToolbar{display:flex;gap:10px;flex-wrap:wrap}.demoMuted{color:var(--muted)}.demoStatus{display:inline-flex;width:max-content;padding:4px 8px;border-radius:999px;background:#edf2eb;font-size:.68rem;font-weight:900;text-transform:uppercase}.demoStatus.accepted{background:#dcf6d1;color:#285b17}.demoStatus.declined{background:#fae2df;color:#8a3027}.demoBooking{margin-top:14px;padding:16px;border:1px solid var(--line);border-radius:10px;background:var(--soft)}.demoBooking form{display:grid;gap:10px}.demoEvents{display:grid;gap:12px}.demoEvent{display:grid;grid-template-columns:100px 1fr;gap:18px;padding:20px;border:1px solid var(--line);border-radius:12px;background:#fff}.demoEventType{align-self:start;padding:6px 9px;border-radius:999px;background:#eaffc3;text-align:center;font-size:.7rem;font-weight:900;text-transform:uppercase}.demoEventType.mentor{background:#e5edff;color:#24498b}.demoEventType.coach{background:#eee4ff;color:#604099}.demoChat{display:grid;grid-template-columns:minmax(220px,.65fr) minmax(0,1.5fr);gap:18px}.demoThreads{display:grid;gap:8px}.demoThread{display:grid;gap:4px;width:100%;padding:12px;border:1px solid transparent;border-radius:9px;background:transparent;text-align:left;cursor:pointer}.demoThread.active{border-color:var(--lime);background:var(--soft)}.demoThread small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted)}.demoMeeting{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:16px 0;padding:16px;border-radius:10px;background:#111512;color:#fff}.demoMeeting div{display:grid}.demoMessages{display:flex;min-height:260px;flex-direction:column;justify-content:flex-end;gap:9px}.demoMessage{display:grid;gap:3px;max-width:76%}.demoMessage span{padding:11px 13px;border-radius:14px 14px 14px 3px;background:var(--soft)}.demoMessage.athlete{align-self:flex-end;text-align:right}.demoMessage.athlete span{border-radius:14px 14px 3px 14px;background:var(--lime)}.demoMessage small{color:var(--muted)}.demoMessageForm{display:flex;gap:8px;margin-top:16px}.demoMessageForm input{width:100%}.demoLandingNav{display:flex;justify-content:space-between;align-items:center;padding:16px clamp(18px,5vw,72px);border-bottom:1px solid var(--line)}.demoHero{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center;padding:clamp(64px,9vw,110px) clamp(18px,5vw,72px);background:linear-gradient(180deg,#f5f7f3,#fff)}.demoHero h1{max-width:850px}.demoPreview{min-height:430px;padding:28px;border-radius:22px;background:#111512;color:#fff;box-shadow:0 24px 60px rgba(12,15,13,.18)}.demoPreview p{color:#cbd3cc}.demoViews{padding:clamp(55px,8vw,90px) clamp(18px,5vw,72px);background:#111512;color:#fff}.demoViewGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.demoView{display:flex;min-height:260px;flex-direction:column;padding:26px;border:1px solid #39413b;border-radius:14px;background:#1d231f}.demoView p{color:#bec7bf}.demoView strong{margin-top:auto;color:var(--lime)}.demoProof{padding:clamp(55px,8vw,90px) clamp(18px,5vw,72px)}.demoProofGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.demoFooter{padding:30px clamp(18px,5vw,72px);background:#111512;color:#fff}.demoRolePage{min-height:100vh;padding:50px clamp(18px,5vw,72px);background:#111512;color:#fff}.demoRolePage>div{max-width:1100px;margin:auto}.demoRolePage .demoView{cursor:pointer;text-align:left;color:#fff}.demoRolePage .brand{color:#fff;margin-bottom:70px}.demoEmpty{padding:28px;text-align:center;color:var(--muted)}@media(max-width:820px){.demoHero,.demoViewGrid,.demoProofGrid,.demoChat,.demoSurvey{grid-template-columns:1fr}.demoHero{padding-top:48px}.demoPreview{min-height:auto}.demoNotice,.demoNotice div,.demoMeeting{align-items:flex-start;flex-direction:column}.demoEvent{grid-template-columns:1fr}}

.demoCalendarShell{overflow:hidden;border:1px solid var(--line);border-radius:16px;background:#fff;box-shadow:var(--shadow)}
.demoCalendarToolbar{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--line)}
.demoCalendarToolbar h3{margin:0}.demoCalendarNav{width:40px;height:40px;border:1px solid var(--line);border-radius:9px;background:var(--soft);cursor:pointer;font-weight:900}
.demoCalendarSummary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}.demoCalendarSummary div{padding:14px;border:1px solid var(--line);border-radius:10px;background:#fff}.demoCalendarSummary strong,.demoCalendarSummary span{display:block}.demoCalendarSummary strong{font-size:1.4rem}.demoCalendarSummary span{color:var(--muted);font-size:.76rem;font-weight:800}
.demoCalendarGrid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}.demoCalendarWeekday{padding:9px;border-bottom:1px solid var(--line);background:var(--soft);color:var(--muted);font-size:.7rem;font-weight:900;text-align:center;text-transform:uppercase}
.demoCalendarDay{min-height:140px;padding:9px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}.demoCalendarDay:nth-child(7n){border-right:0}.demoCalendarDay.outside{background:#fafbf9;color:#a3aba5}.demoCalendarDay time{display:grid;width:28px;height:28px;place-items:center;border-radius:50%;font-size:.8rem;font-weight:900}.demoCalendarDay.today time{background:var(--lime);color:var(--ink)}
.demoCalendarEvents{display:grid;gap:5px;margin-top:7px}.demoCalendarEvent{overflow:hidden;padding:6px 7px;border-left:3px solid;border-radius:6px;background:var(--soft)}.demoCalendarEvent strong,.demoCalendarEvent small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.demoCalendarEvent strong{font-size:.69rem}.demoCalendarEvent small{color:var(--muted);font-size:.61rem}.demoCalendarEvent.training{border-color:#7ccf00;background:#efffd7}.demoCalendarEvent.meal{border-color:#e7a000;background:#fff3ce}.demoCalendarEvent.mentor{border-color:#6f66ff;background:#eeecff}.demoCalendarEvent.coach{border-color:#1688d4;background:#e5f4ff}
.demoChat{grid-template-columns:minmax(180px,240px) minmax(0,1fr);width:100%}.demoThreads{min-width:0}.demoThread{grid-template-columns:8px minmax(0,1fr) auto;align-items:center;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:#fff}.demoThread.active{border-color:#7ccf00;background:#f4ffe5}.demoThreadDot{width:7px;height:7px;border-radius:50%;background:var(--lime-dark)}.demoThread small{text-transform:capitalize}.demoChatPanel{min-width:0}.demoMessage{max-width:min(72%,680px)}.demoChatNote{margin-top:12px;color:var(--muted);font-size:.75rem}
.demoAssistantLayout{display:grid;grid-template-columns:minmax(320px,.8fr) minmax(0,1.2fr);gap:22px;align-items:start}.demoAssistant{overflow:hidden;border:1px solid var(--line);border-radius:16px;background:#fff;box-shadow:var(--shadow)}.demoAssistantHeader{display:flex;gap:10px;align-items:center;padding:16px 18px;border-bottom:1px solid var(--line)}.demoAssistantAvatar{display:grid;width:34px;height:34px;place-items:center;border-radius:9px;background:var(--lime);font-size:.7rem;font-weight:950}.demoAssistantLog{display:flex;min-height:250px;max-height:390px;overflow-y:auto;flex-direction:column;gap:10px;padding:18px;background:var(--soft)}.demoAssistantMessage,.demoUserMessage{max-width:90%;padding:10px 12px;border-radius:13px;background:#fff;font-size:.88rem}.demoUserMessage{align-self:flex-end;color:#fff;background:var(--ink)}.demoAssistantMessage.success{background:#efffd7}.demoAssistantForm{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:12px}.demoAssistantForm input{min-width:0}.demoPlanStack{display:grid;gap:10px}.demoPlanStack .plan{margin:0}
.demoMentorChats{margin-top:28px}.demoMentorChats .demoChat{margin-top:16px}
@media(max-width:900px){.demoAssistantLayout{grid-template-columns:1fr}.demoCalendarDay{min-height:105px;padding:6px}}
@media(max-width:700px){.demoCalendarShell{overflow-x:auto}.demoCalendarGrid{min-width:760px}.demoCalendarSummary{grid-template-columns:repeat(2,1fr)}.demoThreads{display:flex;overflow-x:auto}.demoThread{min-width:150px}.demoMessage{max-width:88%}}
`

function DemoStyles() {
  return <style>{demoCss}</style>
}

function DemoNotice({ children }: { children?: ReactNode }) {
  return <div className="demoNotice"><div><strong>Demo Mode</strong><span>This experience uses fictional, browser-local mock data.</span></div>{children}</div>
}

const athleteLinks = [
  ['/athlete', 'Dashboard'],
  ['/athlete/calendar', 'Calendar'],
  ['/athlete/mentor-chats', 'Mentor Chats'],
  ['/meal', 'Meal Plan'],
  ['/training', 'Training'],
] as const

function AthleteSubnav() {
  return <nav className="demoSubnav" aria-label="Athlete demo">{athleteLinks.map(([to,label]) => <Link key={to} to={to}>{label}</Link>)}</nav>
}

const blankProfile: AthleteDemoProfile = {
  fullName: '', sport: '', position: '', graduationYear: '2028', school: '', location: '', gpa: '', height: '', weight: '',
  skillLevel: 'Varsity starter', mainGoal: 'Get recruited', trainingDays: '4', preferredTime: 'After school',
  dietaryPreference: 'No restrictions', mentorInterests: [],
}

function AthleteSurvey({ initial, onSave }: { initial?: AthleteDemoProfile | null; onSave: (profile: AthleteDemoProfile) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const profile = Object.fromEntries(form.entries()) as unknown as AthleteDemoProfile
    profile.mentorInterests = form.getAll('mentorInterests').map(String)
    onSave(profile)
  }
  const value = initial ?? blankProfile
  return <form className="demoSurvey" onSubmit={submit}>
    <label>Full name<input required name="fullName" defaultValue={value.fullName} placeholder="Jordan Reed" /></label>
    <label>Sport<input required name="sport" defaultValue={value.sport} placeholder="Basketball" /></label>
    <label>Position or event<input required name="position" defaultValue={value.position} placeholder="Point Guard" /></label>
    <label>Graduation year<input required name="graduationYear" defaultValue={value.graduationYear} /></label>
    <label>School<input required name="school" defaultValue={value.school} placeholder="Central High School" /></label>
    <label>Location<input required name="location" defaultValue={value.location} placeholder="Charlotte, NC" /></label>
    <label>GPA (optional)<input name="gpa" defaultValue={value.gpa} placeholder="3.7" /></label>
    <label>Height (optional)<input name="height" defaultValue={value.height} placeholder={"6'1\""} /></label>
    <label>Weight (optional)<input name="weight" defaultValue={value.weight} placeholder="175 lbs" /></label>
    <label>Current skill level<select name="skillLevel" defaultValue={value.skillLevel}><option>Varsity starter</option><option>Junior varsity</option><option>Club athlete</option><option>Developing athlete</option><option>Elite prospect</option></select></label>
    <label>Main goal<select name="mainGoal" defaultValue={value.mainGoal}><option>Get recruited</option><option>Improve performance</option><option>Build strength</option><option>Improve endurance</option><option>Gain exposure</option><option>Improve explosiveness</option></select></label>
    <label>Training days per week<select name="trainingDays" defaultValue={value.trainingDays}><option value="3">3 days</option><option value="4">4 days</option><option value="5">5 days</option><option value="6">6 days</option></select></label>
    <label>Preferred time<select name="preferredTime" defaultValue={value.preferredTime}><option>After school</option><option>Early morning</option><option>Evening</option><option>Weekends</option></select></label>
    <label>Dietary preference<select name="dietaryPreference" defaultValue={value.dietaryPreference}><option>No restrictions</option><option>High-protein</option><option>Vegetarian</option><option>Budget-friendly</option><option>Dairy-free</option><option>Gluten-free</option></select></label>
    <div className="full"><strong>Mentor interests</strong><div className="demoCheck">{['Film review','Recruiting advice','Strength training','Nutrition','Position-specific coaching'].map(item => <label key={item}><input type="checkbox" name="mentorInterests" value={item} defaultChecked={value.mentorInterests.includes(item)} />{item}</label>)}</div></div>
    <button className="button primary full">Create Personalized Demo</button>
  </form>
}

export function DemoLanding() {
  return <><DemoStyles /><header className="demoLandingNav"><Link className="brand" to="/"><span className="logo" /><span>Strive</span></Link><Link className="button primary" to="/login">Explore Demo</Link></header><main>
    <section className="demoHero"><div><p className="eyebrow">Interactive product demo</p><h1>See how Strive could connect the full recruiting journey.</h1><p>Explore fictional athlete profiles, mentorship, coach discovery, and personalized performance tools. No account or real signup is required.</p><div className="actions"><Link className="button primary" to="/login">Choose a Demo View</Link><a className="button ghost" href="#demo-views">What the demo shows</a></div></div><div className="demoPreview"><p className="eyebrow">Athlete view preview</p><h2>From profile to preparation.</h2><p>Build a personalized demo athlete, generate a training and meal plan, request mentorship, and watch the same request appear in the mentor view.</p><div className="chips"><span>Browser-local data</span><span>Connected role flows</span><span>Rule-based personalization</span></div></div></section>
    <section className="demoViews" id="demo-views"><p className="eyebrow">Demo views</p><h2>Choose a perspective.</h2><p>Each view demonstrates a different part of the product vision using fictional data.</p><div className="demoViewGrid"><Link className="demoView" to="/login"><small>High School Athlete</small><h3>Athlete Demo</h3><p>Create a profile, personalize performance plans, request mentors, and track activity.</p><strong>Explore Athlete Demo →</strong></Link><Link className="demoView" to="/login"><small>College Mentor</small><h3>Mentor Demo</h3><p>Review shared athlete requests, manage availability, and preview transparent payouts.</p><strong>Explore Mentor Demo →</strong></Link><Link className="demoView" to="/login"><small>College Coach</small><h3>Coach Demo</h3><p>Browse fictional prospects, filter highlights, save recruits, and preview outreach.</p><strong>Explore Coach Demo →</strong></Link></div></section>
    <section className="demoProof"><p className="eyebrow">What this prototype demonstrates</p><h2>A connected product concept, not claimed traction.</h2><div className="demoProofGrid"><article className="panel"><h3>Personalized athlete journey</h3><p>Survey answers power browser-local profile, training, nutrition, and scheduling views.</p></article><article className="panel"><h3>Cross-role mentorship</h3><p>Athlete requests persist into the mentor dashboard and conversation experience.</p></article><article className="panel"><h3>Recruiting discovery</h3><p>Fictional profiles show how coaches could filter, save, and contact prospects.</p></article></div></section>
  </main><footer className="demoFooter"><strong>Strive Interactive Product Demo</strong><p>All names, statistics, messages, pricing, and activity are fictional.</p></footer></>
}

export function DemoSelector() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const choose = (role: Role) => { login(role); navigate(ROLE_HOME[role]) }
  return <main className="demoRolePage"><DemoStyles /><div><Link className="brand" to="/"><span className="logo" /><span>Strive</span></Link><p className="eyebrow">Explore the product</p><h1>Choose a demo view</h1><p>Explore Strive as a High School Athlete, College Mentor, or College Coach. Every view uses fictional mock data; no account setup is required.</p><div className="demoViewGrid"><button className="demoView" onClick={() => choose('athlete')}><small>High School Athlete</small><h2>Athlete Demo</h2><p>Build a personalized recruiting journey and connect with mentors.</p><strong>Explore Athlete View →</strong></button><button className="demoView" onClick={() => choose('mentor')}><small>College Mentor</small><h2>Mentor Demo</h2><p>Manage requests, availability, rates, and demo sessions.</p><strong>Explore Mentor View →</strong></button><button className="demoView" onClick={() => choose('coach')}><small>College Coach</small><h2>Coach Demo</h2><p>Discover fictional prospects and preview coach-led outreach.</p><strong>Explore Coach View →</strong></button></div></div></main>
}

function MentorBooking({ mentor, profile, onDone }: { mentor: Mentor; profile: AthleteDemoProfile; onDone: () => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    createMentorshipRequest({ athleteProfile: profile, mentorName: mentor.name, sessionType: String(data.get('sessionType')), preferredDateTime: String(data.get('when')), athleteMessage: String(data.get('message')) })
    onDone()
  }
  const interests = profile.mentorInterests.length ? profile.mentorInterests : ['Film review','Recruiting advice','Training advice']
  return <div className="demoBooking"><form onSubmit={submit}><label>Session type<select name="sessionType">{interests.map(item => <option key={item}>{item}</option>)}</select></label><label>Preferred date/time<input type="datetime-local" name="when" required /></label><label>Message<textarea name="message" required defaultValue={`I'd like help with ${profile.mainGoal.toLowerCase()} and feedback on my ${profile.position} recruiting journey.`} /></label><button className="button primary">Send Demo Request</button></form></div>
}

export default function DemoAthleteDashboard() {
  const [profile, setProfile] = useState(getAthleteProfile)
  const [editing, setEditing] = useState(false)
  const [booking, setBooking] = useState<Mentor | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)
  const requests = getMentorshipRequests()
  const save = (next: AthleteDemoProfile) => { saveAthleteProfile(next); setProfile(next); setEditing(false) }
  const reset = () => { resetAthleteDemo(); setProfile(null); setEditing(false) }
  return <><DemoStyles /><Nav /><DemoNotice><Link className="button ghost" to="/login">Switch Demo View</Link></DemoNotice><main><section className="section"><AthleteSubnav />{!profile || editing ? <article className="demoOnboard"><p className="eyebrow">Personalize your demo</p><h2>Build Your Athlete Demo Profile</h2><p>Answer a few questions so Strive can personalize your recruiting profile, training plan, meal plan, and schedule.</p><AthleteSurvey initial={profile} onSave={save} /></article> : <><div className="header"><div><p className="eyebrow">High school athlete demo</p><h2>{profile.fullName.split(' ')[0]}'s recruiting hub</h2></div><div className="demoToolbar"><button className="button ghost" onClick={() => setEditing(true)}>Edit Profile Survey</button><button className="button primary">Preview Highlight Upload</button></div></div><div className="bento"><article className="panel profile"><div className="profileRow"><span className="avatar">{profile.fullName.split(' ').map(n => n[0]).join('').slice(0,2)}</span><div><h3>{profile.fullName}</h3><p>{profile.sport} | {profile.position} | Class of {profile.graduationYear}</p><small>{profile.school} · {profile.location}{profile.gpa ? ` · GPA ${profile.gpa}` : ''}</small></div></div><div className="between"><span>Primary goal</span><strong>{profile.mainGoal}</strong></div></article><article className="panel heroStat"><span className="heroStatLabel">Sample recruiting activity</span><div className="heroStatMain"><strong>Demo</strong><span>mock data only</span></div><p className="heroStatSub">This card demonstrates where coach views and saves could appear.</p></article><article className="panel"><h3>Your plan</h3><div className="chips"><span>{profile.skillLevel}</span><span>{profile.trainingDays} training days</span><span>{profile.preferredTime}</span><span>{profile.dietaryPreference}</span></div></article><article className="panel wide"><h3>Recommended Mentors</h3><small>Matched to {profile.sport} and your selected interests</small><div className="grid">{mentors.sort((a,b) => Number(b.sport===profile.sport)-Number(a.sport===profile.sport)).map(mentor => <article className="mentor" key={mentor.name}><span className="miniAvatar" /><div><strong>{mentor.name}</strong>{mentor.sport===profile.sport && <span className="tag">Recommended</span>}<br/><small>{mentor.role}</small></div><button className="mini" onClick={() => setBooking(booking?.name===mentor.name?null:mentor)}>Request · {money(mentor.price)}</button>{booking?.name===mentor.name && <MentorBooking mentor={mentor} profile={profile} onDone={() => { setBooking(null); setRequestVersion(v=>v+1) }} />}</article>)}</div></article><article className="panel"><h3>Mentorship Activity</h3>{requests.length ? <div className="session" key={requestVersion}><strong>{requests[0].sessionType} with {requests[0].mentorName}</strong><span>{requests[0].preferredDateTime}</span><small>{requests[0].status} · visible in Mentor Demo</small></div> : <p className="demoMuted">Request a mentor to connect the athlete and mentor demo views.</p>}</article><Link className="panel col1" to="/meal"><span>Personalized Meal Plan</span><h3>{profile.dietaryPreference}</h3><small>Built from your survey</small></Link><Link className="panel col1" to="/training"><span>Personalized Training</span><h3>{profile.trainingDays} day plan</h3><small>{profile.mainGoal}</small></Link></div><div className="demoToolbar" style={{marginTop:24}}><Link className="button ghost" to="/athlete/calendar">View Calendar</Link><Link className="button ghost" to="/athlete/mentor-chats">Open Mentor Chats</Link><button className="textBtn" onClick={reset}>Reset Demo Data</button></div></>}</section></main></>
}

export function DemoCalendar() {
  const profile = getAthleteProfile()
  const events = getDemoEvents()
  const requests = getMentorshipRequests()
  const requestById = new Map(requests.map((request) => [request.requestId, request]))
  const calendarEvents = events.filter((event) => event.type !== 'mentor' || requestById.get(event.id)?.status !== 'declined').map((event) => {
    if (event.type !== 'mentor') return event
    const status = requestById.get(event.id)?.status
    return { ...event, title: status === 'accepted' ? 'Confirmed Mentor Meeting' : 'Pending Mentor Request' }
  })
  const [cursor, setCursor] = useState(() => new Date())
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const first = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - first.getDay())
  const localKey = (value: Date | string) => {
    const date = value instanceof Date ? value : new Date(value)
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
  }
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })
  const move = (offset: number) => setCursor(new Date(year, month + offset, 1))
  const labels = { training: 'Training', meal: 'Nutrition', mentor: 'Mentor', coach: 'Coach' }
  return <><DemoStyles /><Nav /><DemoNotice><Link to="/login">Switch Demo View</Link></DemoNotice><main><section className="section"><AthleteSubnav /><div className="header"><div><p className="eyebrow">Athlete schedule</p><h2>{profile ? `${profile.fullName.split(' ')[0]}'s` : 'Your'} demo calendar</h2><p>Training, nutrition, mentor meetings, and coach activity in one connected view.</p></div><Link className="button primary" to="/training">Create Training Plan</Link></div>{!profile ? <article className="panel demoEmpty"><h3>Build your athlete profile first</h3><Link className="button primary" to="/athlete">Build Demo Profile</Link></article> : <><div className="demoCalendarSummary">{(['training','meal','mentor','coach'] as const).map(type=><div key={type}><strong>{calendarEvents.filter(event=>event.type===type).length}</strong><span>{labels[type]}</span></div>)}</div><div className="demoCalendarShell"><header className="demoCalendarToolbar"><button className="demoCalendarNav" aria-label="Previous month" onClick={()=>move(-1)}>←</button><h3>{first.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</h3><button className="demoCalendarNav" aria-label="Next month" onClick={()=>move(1)}>→</button></header><div className="demoCalendarGrid">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day=><div className="demoCalendarWeekday" key={day}>{day}</div>)}{cells.map(date=>{const key=localKey(date);const dayEvents=calendarEvents.filter(event=>localKey(event.datetime)===key);return <article className={`demoCalendarDay ${date.getMonth()!==month?'outside':''} ${key===localKey(new Date())?'today':''}`} key={key}><time dateTime={key}>{date.getDate()}</time><div className="demoCalendarEvents">{dayEvents.map(event=><div className={`demoCalendarEvent ${event.type}`} key={event.id} title={event.description}><strong>{event.title}</strong><small>{labels[event.type]} · {new Date(event.datetime).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</small></div>)}</div></article>})}</div></div></>}</section></main></>
}

export function DemoChats() {
  const [threads, setThreads] = useState(getMentorThreads)
  const [activeId, setActiveId] = useState(threads[0]?.requestId ?? '')
  const active = threads.find(thread => thread.requestId===activeId)
  const send = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if(!active)return; const form=event.currentTarget; const text=String(new FormData(form).get('message')||'').trim(); if(!text)return; sendDemoMessage(active.requestId,text); setThreads(getMentorThreads()); form.reset() }
  return <><DemoStyles /><Nav /><DemoNotice><Link to="/login">Switch Demo View</Link></DemoNotice><main><section className="section"><AthleteSubnav /><div className="header"><div><p className="eyebrow">Athlete communication</p><h2>Mentor Chats</h2><p>Messages are shared with the mentor view. Mentors only reply when a message is sent from that side.</p></div></div><div className="demoChat"><aside className="panel demoThreads"><h3>Your mentors</h3>{threads.length?threads.map(thread=><button className={thread.requestId===activeId?'demoThread active':'demoThread'} key={thread.requestId} onClick={()=>setActiveId(thread.requestId)}><span className="demoThreadDot"/><strong>{thread.mentorName}</strong><small>{thread.status}</small></button>):<div className="demoEmpty"><p>No mentor chats yet.</p><Link to="/athlete">Request a mentor session</Link></div>}</aside><section className="panel demoChatPanel">{active?<><div className="between"><div><h3>{active.mentorName}</h3><small>Shared demo conversation</small></div><span className={`demoStatus ${active.status}`}>{active.status}</span></div><div className="demoMeeting"><div><small>{active.status==='accepted'?'Upcoming demo meeting':active.status==='declined'?'Request declined':'Pending mentor request'}</small><strong>{active.meeting}</strong></div>{active.status==='accepted'&&<button className="button dark">Join Demo Meeting</button>}</div><div className="demoMessages">{active.messages.map((message,index)=><div className={`demoMessage ${message.sender}`} key={`${message.createdAt}-${index}`}><span>{message.text}</span><small>{message.sender==='athlete'?'You':active.mentorName}</small></div>)}</div><form className="demoMessageForm" onSubmit={send}><input name="message" required placeholder="Write a message..." /><button className="button primary">Send</button></form><p className="demoChatNote">No automatic mentor responses are generated.</p></>:<div className="demoEmpty"><h3>No conversation selected</h3><Link className="button primary" to="/athlete">Browse Mentors</Link></div>}</section></div></section></main></>
}

export function DemoMentor() {
  return <><DemoStyles /><ExistingMentorDashboard /></>
}

function profileMeal(profile: AthleteDemoProfile): MealInput {
  return { sport:profile.sport,age:'17',height:profile.height||'Not provided',weight:profile.weight||'170 lbs',goal:profile.mainGoal,restrictions:profile.dietaryPreference,intensity:'High intensity' }
}
export function DemoMeal() {
  const profile=getAthleteProfile()
  const [days,setDays]=useState<MealPlanDay[]>(()=>getSavedMealPlan()?.days??[])
  const [messages,setMessages]=useState<string[]>([])
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const form=event.currentTarget;const text=String(new FormData(form).get('message')||'').trim();setMessages(previous=>[...previous,`You: ${text}`]);if(text!=='Create my weekly meal plan'){setMessages(previous=>[...previous,'The site is still in progress, and this chat is not functional yet. To see what the site will function like enter "Create my weekly meal plan."']);form.reset();return}if(!profile){setMessages(previous=>[...previous,'Build your athlete profile first so the demo can personalize your plan.']);form.reset();return}const base=generateMeal(profileMeal(profile));const week=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day,index)=>({day,meals:base.meals.slice(0,4).map(meal=>`${meal.label}: ${meal.text}`),focus:index<Number(profile.trainingDays)?`Fuel ${profile.sport} training for ${profile.mainGoal.toLowerCase()} with ${profile.dietaryPreference.toLowerCase()} choices.`:`Recovery nutrition, steady hydration, and ${profile.dietaryPreference.toLowerCase()} choices.`}));saveMealPlan(week);setDays(week);setMessages(previous=>[...previous,'Your weekly meal plan has been created and added to your calendar.']);form.reset()}
  return <><DemoStyles /><Nav /><DemoNotice><Link to="/login">Switch Demo View</Link></DemoNotice><main><section className="section soft"><AthleteSubnav /><div className="header"><div><p className="eyebrow">Demo AI meal assistant</p><h2>Fuel the week for {profile?.fullName.split(' ')[0]||'your athlete'}.</h2><p>This controlled demo supports one message and does not represent a fully functional AI. Not medical advice.</p></div></div><div className="demoAssistantLayout"><section className="demoAssistant"><header className="demoAssistantHeader"><span className="demoAssistantAvatar">AI</span><div><h3>Strive Meal Assistant</h3><small>Controlled product demo</small></div></header><div className="demoAssistantLog"><div className="demoAssistantMessage">Enter <strong>Create my weekly meal plan</strong> to generate the sample.</div>{messages.map((message,index)=><div className={message.startsWith('You:')?'demoUserMessage':message.startsWith('Your weekly')?'demoAssistantMessage success':'demoAssistantMessage'} key={index}>{message}</div>)}</div><form className="demoAssistantForm" onSubmit={submit}><input name="message" required placeholder="Create my weekly meal plan" /><button className="button primary">Send</button></form></section><div className="demoPlanStack">{days.length?days.map(day=><article className="plan" key={day.day}><strong>{day.day}</strong><p>{day.meals.join(' · ')}</p><small>{day.focus}</small></article>):<article className="panel demoEmpty"><h3>Your weekly plan will appear here</h3><p>The supported prompt also replaces prior nutrition reminders on your calendar.</p></article>}</div></div></section></main></>
}

export function DemoTraining() {
  const profile=getAthleteProfile()
  const [plan,setPlan]=useState(()=>getSavedTrainingPlan()?.sessions??[])
  const [messages,setMessages]=useState<string[]>([])
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const form=event.currentTarget;const text=String(new FormData(form).get('message')||'').trim();setMessages(previous=>[...previous,`You: ${text}`]);if(text!=='Create my weekly training plan'){setMessages(previous=>[...previous,'The site is still in progress, and this chat is not functional yet. To see what the site will function like enter "Create my weekly training plan."']);form.reset();return}if(!profile){setMessages(previous=>[...previous,'Build your athlete profile first so the demo can personalize your plan.']);form.reset();return}const input:TrainInput={sport:profile.sport,position:profile.position,level:profile.skillLevel,availability:`${profile.trainingDays} days`,goal:profile.mainGoal};const next=generateTraining(input);saveTrainingPlan(profile,next);setPlan(next);setMessages(previous=>[...previous,'Your weekly training plan has been created and added to your calendar.']);form.reset()}
  return <><DemoStyles /><Nav /><DemoNotice><Link to="/login">Switch Demo View</Link></DemoNotice><main><section className="section"><AthleteSubnav /><div className="header"><div><p className="eyebrow">Demo AI training assistant</p><h2>Build a week for {profile?.fullName.split(' ')[0]||'your athlete'}.</h2><p>This controlled demo supports one message and uses sport, position, goal, skill level, and availability.</p></div></div><div className="demoAssistantLayout"><section className="demoAssistant"><header className="demoAssistantHeader"><span className="demoAssistantAvatar">AI</span><div><h3>Strive Training Assistant</h3><small>Controlled product demo</small></div></header><div className="demoAssistantLog"><div className="demoAssistantMessage">Enter <strong>Create my weekly training plan</strong> to generate the sample.</div>{messages.map((message,index)=><div className={message.startsWith('You:')?'demoUserMessage':message.startsWith('Your weekly')?'demoAssistantMessage success':'demoAssistantMessage'} key={index}>{message}</div>)}</div><form className="demoAssistantForm" onSubmit={submit}><input name="message" required placeholder="Create my weekly training plan" /><button className="button primary">Send</button></form></section><div className="demoPlanStack">{plan.length?plan.map(day=><article className={day.rest?'plan rest':'plan'} key={day.day}><strong>{day.day}</strong><p className="planFocus">{day.focus}</p><p>{day.detail}</p></article>):<article className="panel demoEmpty"><h3>Your weekly plan will appear here</h3><p>The supported prompt also replaces prior training sessions on your calendar.</p></article>}</div></div></section></main></>
}
