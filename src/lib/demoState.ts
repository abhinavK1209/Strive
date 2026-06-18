export interface AthleteDemoProfile {
  fullName: string
  sport: string
  position: string
  graduationYear: string
  school: string
  location: string
  gpa: string
  height: string
  weight: string
  skillLevel: string
  mainGoal: string
  trainingDays: string
  preferredTime: string
  dietaryPreference: string
  mentorInterests: string[]
}

export interface MentorshipRequest {
  requestId: string
  athleteProfile: AthleteDemoProfile
  mentorName: string
  sessionType: string
  preferredDateTime: string
  athleteMessage: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export interface DemoEvent {
  id: string
  type: 'Training' | 'Mentor' | 'Coach' | 'Reminder'
  title: string
  when: string
  description: string
}

export interface MentorThread {
  requestId: string
  mentorName: string
  meeting: string
  status: MentorshipRequest['status']
  messages: { sender: 'athlete' | 'mentor'; text: string; createdAt: string }[]
}

export const DEMO_KEYS = {
  profile: 'striveDemoAthleteProfile',
  events: 'striveDemoAthleteEvents',
  requests: 'striveDemoMentorshipRequests',
  messages: 'striveDemoMentorMessages',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getAthleteProfile = () => read<AthleteDemoProfile | null>(DEMO_KEYS.profile, null)
export const getDemoEvents = () => read<DemoEvent[]>(DEMO_KEYS.events, [])
export const getMentorshipRequests = () => read<MentorshipRequest[]>(DEMO_KEYS.requests, [])
export const getMentorThreads = () => read<MentorThread[]>(DEMO_KEYS.messages, [])

const focusFor = (profile: AthleteDemoProfile) => {
  const value = `${profile.sport} ${profile.position} ${profile.mainGoal}`.toLowerCase()
  if (value.includes('basketball')) return ['Vertical jump & landing', 'Agility & first step', 'Lower-body power', 'Ball handling & finishing', 'Sprint conditioning', 'Mobility & recovery']
  if (value.includes('soccer')) return ['Acceleration & change of direction', 'First touch & finishing', 'Single-leg strength', 'Aerobic intervals', 'Position movement', 'Mobility & recovery']
  if (value.includes('football')) return ['Acceleration mechanics', 'Position footwork', 'Total-body strength', 'Explosive power', 'Game-speed reps', 'Mobility & recovery']
  if (value.includes('endurance')) return ['Aerobic base', 'Tempo intervals', 'Strength endurance', 'Technique under fatigue', 'Recovery movement', 'Long conditioning']
  return ['Movement quality', 'Sport skill', 'Total-body strength', 'Speed & agility', 'Competitive reps', 'Mobility & recovery']
}

export function saveAthleteProfile(profile: AthleteDemoProfile) {
  write(DEMO_KEYS.profile, profile)
  const keep = getDemoEvents().filter((event) => event.type !== 'Training')
  const days = Math.max(2, Math.min(6, Number(profile.trainingDays) || 3))
  const focus = focusFor(profile)
  const training: DemoEvent[] = Array.from({ length: days }, (_, index) => ({
    id: `training-${index}`,
    type: 'Training',
    title: focus[index],
    when: `Day ${index + 1} · ${profile.preferredTime}`,
    description: `${profile.skillLevel} progression for ${profile.position}.`,
  }))
  if (!keep.some((event) => event.id === 'coach-demo')) {
    keep.push({ id: 'coach-demo', type: 'Coach', title: 'Sample coach interest review', when: 'Friday · 6:00 PM', description: 'Review mock profile activity and prepare follow-up questions.' })
  }
  write(DEMO_KEYS.events, [...training, ...keep])
}

export function createMentorshipRequest(input: Omit<MentorshipRequest, 'requestId' | 'createdAt' | 'status'>) {
  const request: MentorshipRequest = { ...input, requestId: `request-${Date.now()}`, createdAt: new Date().toISOString(), status: 'pending' }
  write(DEMO_KEYS.requests, [request, ...getMentorshipRequests()])
  write(DEMO_KEYS.events, [...getDemoEvents(), { id: request.requestId, type: 'Mentor', title: `${request.sessionType} with ${request.mentorName}`, when: request.preferredDateTime, description: 'Pending demo mentorship request.' }])
  const firstName = request.athleteProfile.fullName.split(' ')[0] || 'Athlete'
  const thread: MentorThread = {
    requestId: request.requestId,
    mentorName: request.mentorName,
    meeting: request.preferredDateTime,
    status: 'pending',
    messages: [
      { sender: 'athlete', text: request.athleteMessage, createdAt: request.createdAt },
      { sender: 'mentor', text: `Thanks, ${firstName}! I received your demo request and will review your goals before our session.`, createdAt: new Date().toISOString() },
    ],
  }
  write(DEMO_KEYS.messages, [thread, ...getMentorThreads()])
  return request
}

export function updateRequestStatus(requestId: string, status: MentorshipRequest['status']) {
  const requests = getMentorshipRequests().map((request) => request.requestId === requestId ? { ...request, status } : request)
  write(DEMO_KEYS.requests, requests)
  const reply = status === 'accepted' ? 'Your demo session is confirmed. Bring one highlight clip and your top recruiting question.' : 'That time does not work in this demo. Please request another session.'
  const threads = getMentorThreads().map((thread) => thread.requestId === requestId ? { ...thread, status, messages: [...thread.messages, { sender: 'mentor' as const, text: reply, createdAt: new Date().toISOString() }] } : thread)
  write(DEMO_KEYS.messages, threads)
}

export function sendDemoMessage(requestId: string, text: string) {
  const now = new Date().toISOString()
  const threads = getMentorThreads().map((thread) => thread.requestId === requestId ? {
    ...thread,
    messages: [...thread.messages, { sender: 'athlete' as const, text, createdAt: now }, { sender: 'mentor' as const, text: 'Great question. I would add that to our demo session agenda and share practical next steps.', createdAt: now }],
  } : thread)
  write(DEMO_KEYS.messages, threads)
}

export function resetAthleteDemo() {
  Object.values(DEMO_KEYS).forEach((key) => localStorage.removeItem(key))
}
