import { Route, Routes } from 'react-router-dom'
import { ModalProvider } from './components/Modal'
import Landing from './pages/Landing'
import AthleteDashboard from './pages/AthleteDashboard'
import MentorDashboard from './pages/MentorDashboard'
import CoachDashboard from './pages/CoachDashboard'
import Profile from './pages/Profile'
import Meal from './pages/Meal'
import Training from './pages/Training'

export default function App() {
  return (
    <ModalProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/athlete" element={<AthleteDashboard />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/coach" element={<CoachDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/meal" element={<Meal />} />
        <Route path="/training" element={<Training />} />
      </Routes>
    </ModalProvider>
  )
}
