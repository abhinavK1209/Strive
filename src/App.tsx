import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/Auth'
import { ModalProvider } from './components/Modal'
import Login from './pages/Login'
import Landing from './pages/Landing'
import AthleteDashboard from './pages/AthleteDashboard'
import MentorDashboard from './pages/MentorDashboard'
import CoachDashboard from './pages/CoachDashboard'
import Profile from './pages/Profile'
import Meal from './pages/Meal'
import Training from './pages/Training'

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/welcome" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/athlete" element={<AthleteDashboard />} />
          <Route path="/mentor" element={<MentorDashboard />} />
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/meal" element={<Meal />} />
          <Route path="/training" element={<Training />} />
        </Routes>
      </ModalProvider>
    </AuthProvider>
  )
}
