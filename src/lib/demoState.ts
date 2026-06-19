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

export type DemoEventType = 'training' | 'meal' | 'mentor' | 'coach'

export interface DemoEvent {
  id: string
  type: DemoEventType
  title: string
  datetime: string
  description: string
  source?: 'training-plan' | 'meal-plan' | 'mentorship' | 'demo'
}

export interface DemoMessage {
  messageId: string
  conversationId: string
  senderRole: 'athlete' | 'mentor'
  senderName: string
  recipientName: string
  body: string
  createdAt: string
}

export interface MentorThread {
  requestId: string
  mentorName: string
  meeting: string
  status: MentorshipRequest['status']
  messages: { sender: 'athlete' | 'mentor'; text: string; createdAt: string }[]
}

export interface TrainingPlanDay {
  day: string
  focus: string
  detail: string
  rest: boolean
}

export interface MealPlanDay {
  day: string
  meals: string[]
  focus: string
}

export const DEMO_KEYS = {
  profile: 'striveDemoAthleteProfile',
  events: 'striveDemoAthleteEvents',
  requests: 'striveDemoMentorshipRequests',
  messages: 'striveDemoMentorMessages',
  trainingPlan: 'striveDemoTrainingPlan',
  mealPlan: 'striveDemoMealPlan',
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

const nextDate = (offset: number, hour: number) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

const eventDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? nextDate(3, 18) : date.toISOString()
}

const normalizeEvent = (event: DemoEvent | Record<string, unknown>): DemoEvent => {
  const rawType = String(event.type ?? '').toLowerCase()
  const type: DemoEventType = rawType === 'training' ? 'training' : rawType === 'meal' || rawType === 'nutrition' || rawType === 'reminder' ? 'meal' : rawType === 'mentor' ? 'mentor' : 'coach'
  return {
    id: String(event.id ?? `event-${Date.now()}`),
    type,
    title: String(event.title ?? 'Demo event'),
    datetime: eventDate(String(event.datetime ?? new Date().toISOString())),
    description: String(event.description ?? ''),
    source: event.source as DemoEvent['source'],
  }
}

export const getAthleteProfile = () => read<AthleteDemoProfile | null>(DEMO_KEYS.profile, null)
export const getDemoEvents = () => read<Array<DemoEvent | Record<string, unknown>>>(DEMO_KEYS.events, []).map(normalizeEvent)
export const getMentorshipRequests = () => read<MentorshipRequest[]>(DEMO_KEYS.requests, [])
export const getDemoMessages = () => read<DemoMessage[]>(DEMO_KEYS.messages, [])
export const getSavedTrainingPlan = () => read<{ createdAt: string; sessions: TrainingPlanDay[] } | null>(DEMO_KEYS.trainingPlan, null)
export const getSavedMealPlan = () => read<{ createdAt: string; days: MealPlanDay[] } | null>(DEMO_KEYS.mealPlan, null)

export const getMentorThreads = (): MentorThread[] => {
  const messages = getDemoMessages()
  return getMentorshipRequests().map((request) => ({
    requestId: request.requestId,
    mentorName: request.mentorName,
    meeting: request.preferredDateTime,
    status: request.status,
    messages: messages
      .filter((message) => message.conversationId === request.requestId)
      .map((message) => ({ sender: message.senderRole, text: message.body, createdAt: message.createdAt })),
  }))
}

const createMessage = (
  conversationId: string,
  senderRole: DemoMessage['senderRole'],
  senderName: string,
  recipientName: string,
  body: string,
): DemoMessage => ({
  messageId: `message-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  conversationId,
  senderRole,
  senderName,
  recipientName,
  body,
  createdAt: new Date().toISOString(),
})

const ensureCoachEvent = (events: DemoEvent[]) => {
  if (events.some((event) => event.id === 'coach-demo')) return events
  return [...events, {
    id: 'coach-demo',
    type: 'coach' as const,
    title: 'Sample coach interest review',
    datetime: nextDate(6, 18),
    description: 'Review fictional profile activity and prepare follow-up questions.',
    source: 'demo' as const,
  }]
}

export function saveAthleteProfile(profile: AthleteDemoProfile) {
  write(DEMO_KEYS.profile, profile)
  const events = ensureCoachEvent(getDemoEvents())
  write(DEMO_KEYS.events, events)
}

export function saveTrainingPlan(profile: AthleteDemoProfile, sessions: TrainingPlanDay[]) {
  write(DEMO_KEYS.trainingPlan, { createdAt: new Date().toISOString(), sessions })
  const keep = getDemoEvents().filter((event) => event.type !== 'training')
  const hour = /morning/i.test(profile.preferredTime) ? 7 : /evening/i.test(profile.preferredTime) ? 19 : 16
  const training = sessions.filter((session) => !session.rest).map((session, index): DemoEvent => ({
    id: `training-plan-${index}`,
    type: 'training',
    title: session.focus,
    datetime: nextDate(index + 1, hour),
    description: `${session.day} · ${session.detail}`,
    source: 'training-plan',
  }))
  write(DEMO_KEYS.events, ensureCoachEvent([...keep, ...training]))
}

export function saveMealPlan(days: MealPlanDay[]) {
  write(DEMO_KEYS.mealPlan, { createdAt: new Date().toISOString(), days })
  const keep = getDemoEvents().filter((event) => event.type !== 'meal')
  const reminders = days.map((day, index): DemoEvent => ({
    id: `meal-plan-${index}`,
    type: 'meal',
    title: `${day.day} nutrition check-in`,
    datetime: nextDate(index + 1, 12),
    description: day.focus,
    source: 'meal-plan',
  }))
  write(DEMO_KEYS.events, ensureCoachEvent([...keep, ...reminders]))
}

export function createMentorshipRequest(input: Omit<MentorshipRequest, 'requestId' | 'createdAt' | 'status'>) {
  const request: MentorshipRequest = { ...input, requestId: `request-${Date.now()}`, createdAt: new Date().toISOString(), status: 'pending' }
  write(DEMO_KEYS.requests, [request, ...getMentorshipRequests()])
  const events = getDemoEvents()
  write(DEMO_KEYS.events, [...events, {
    id: request.requestId,
    type: 'mentor',
    title: `${request.sessionType} with ${request.mentorName}`,
    datetime: eventDate(request.preferredDateTime),
    description: 'Pending demo mentorship request.',
    source: 'mentorship',
  }])
  const firstMessage = createMessage(request.requestId, 'athlete', request.athleteProfile.fullName || 'Demo Athlete', request.mentorName, request.athleteMessage)
  write(DEMO_KEYS.messages, [...getDemoMessages(), firstMessage])
  return request
}

export function updateRequestStatus(requestId: string, status: MentorshipRequest['status']) {
  const requests = getMentorshipRequests().map((request) => request.requestId === requestId ? { ...request, status } : request)
  write(DEMO_KEYS.requests, requests)
  const events = getDemoEvents().map((event) => event.id === requestId ? { ...event, description: status === 'accepted' ? 'Confirmed demo mentor meeting.' : 'Demo mentorship request declined.' } : event)
  write(DEMO_KEYS.events, events)
}

export function sendDemoMessage(requestId: string, text: string) {
  const request = getMentorshipRequests().find((item) => item.requestId === requestId)
  if (!request) return
  const message = createMessage(requestId, 'athlete', request.athleteProfile.fullName || 'Demo Athlete', request.mentorName, text)
  write(DEMO_KEYS.messages, [...getDemoMessages(), message])
}

export function sendMentorMessage(requestId: string, text: string) {
  const request = getMentorshipRequests().find((item) => item.requestId === requestId)
  if (!request) return
  const message = createMessage(requestId, 'mentor', request.mentorName, request.athleteProfile.fullName || 'Demo Athlete', text)
  write(DEMO_KEYS.messages, [...getDemoMessages(), message])
}

export function resetAthleteDemo() {
  Object.values(DEMO_KEYS).forEach((key) => localStorage.removeItem(key))
}
