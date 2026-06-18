import { Navigate, Route, Routes } from 'react-router-dom'
import { type ReactNode } from 'react'
import { AuthProvider, ROLE_HOME, canAccess, useAuth } from './components/Auth'
import { ModalProvider } from './components/Modal'
import Login from './pages/Login'
import Landing from './pages/Landing'
import AthleteDashboard from './pages/AthleteDashboard'
import MentorDashboard from './pages/MentorDashboard'
import CoachDashboard from './pages/CoachDashboard'
import Profile from './pages/Profile'
import Meal from './pages/Meal'
import Training from './pages/Training'

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
          <Route path="/" element={<Landing />} />
          <Route path="/welcome" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/athlete"
            element={
              <RequireRole path="/athlete">
                <AthleteDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/mentor"
            element={
              <RequireRole path="/mentor">
                <MentorDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/coach"
            element={
              <RequireRole path="/coach">
                <CoachDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireRole path="/profile">
                <Profile />
              </RequireRole>
            }
          />
          <Route
            path="/meal"
            element={
              <RequireRole path="/meal">
                <Meal />
              </RequireRole>
            }
          />
          <Route
            path="/training"
            element={
              <RequireRole path="/training">
                <Training />
              </RequireRole>
            }
          />
        </Routes>
      </ModalProvider>
    </AuthProvider>
  )
}
