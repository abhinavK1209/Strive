import { Navigate, Route, Routes } from 'react-router-dom'
import { type ReactNode } from 'react'
import { AuthProvider, ROLE_HOME, canAccess, useAuth } from './components/Auth'
import { ModalProvider } from './components/Modal'
import CoachDashboard from './pages/CoachDashboard'
import Profile from './pages/Profile'
import {
  DemoCalendar,
  DemoChats,
  DemoLanding,
  DemoMeal,
  DemoMentor,
  DemoSelector,
  DemoTraining,
  default as DemoAthleteDashboard,
} from './pages/DemoExperience'

function RequireRole({ path, children }: { path: string; children: ReactNode }) {
  const { role } = useAuth()
  if (!role) return <Navigate to="/login" replace />
  if (!canAccess(role, path)) return <Navigate to={ROLE_HOME[role]} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<DemoLanding />} />
          <Route path="/welcome" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<DemoSelector />} />
          <Route path="/athlete" element={<RequireRole path="/athlete"><DemoAthleteDashboard /></RequireRole>} />
          <Route path="/athlete/calendar" element={<RequireRole path="/athlete"><DemoCalendar /></RequireRole>} />
          <Route path="/athlete/mentor-chats" element={<RequireRole path="/athlete"><DemoChats /></RequireRole>} />
          <Route path="/mentor" element={<RequireRole path="/mentor"><DemoMentor /></RequireRole>} />
          <Route path="/coach" element={<RequireRole path="/coach"><><div className="demoNotice"><div><strong>Demo Mode</strong><span>Athletes, highlights, and recruiting activity are fictional.</span></div></div><CoachDashboard /></></RequireRole>} />
          <Route path="/profile" element={<RequireRole path="/profile"><Profile /></RequireRole>} />
          <Route path="/meal" element={<RequireRole path="/meal"><DemoMeal /></RequireRole>} />
          <Route path="/training" element={<RequireRole path="/training"><DemoTraining /></RequireRole>} />
        </Routes>
      </ModalProvider>
    </AuthProvider>
  )
}
