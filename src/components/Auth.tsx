import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

export type Role = 'athlete' | 'mentor' | 'coach'

export const ROLE_HOME: Record<Role, string> = {
  athlete: '/athlete',
  mentor: '/mentor',
  coach: '/coach',
}

export const ROLE_LABEL: Record<Role, string> = {
  athlete: 'Athlete',
  mentor: 'Mentor',
  coach: 'Coach',
}

// Each role sees and can reach only its own pages.
export const ROLE_NAV: Record<Role, { to: string; label: string }[]> = {
  athlete: [
    { to: '/athlete', label: 'Dashboard' },
    { to: '/meal', label: 'Meal Plan' },
    { to: '/training', label: 'Training' },
  ],
  mentor: [{ to: '/mentor', label: 'Dashboard' }],
  coach: [
    { to: '/coach', label: 'Recruiting Feed' },
    { to: '/profile', label: 'Recruit Profiles' },
  ],
}

export const canAccess = (role: Role, path: string): boolean =>
  ROLE_NAV[role].some((link) => link.to === path)

interface AuthApi {
  role: Role | null
  login: (role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthApi | null>(null)

const STORAGE_KEY = 'strive_role'

export function useAuth(): AuthApi {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

function readStoredRole(): Role | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'athlete' || stored === 'mentor' || stored === 'coach'
    ? stored
    : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(() => readStoredRole())

  const login = useCallback((next: Role) => {
    localStorage.setItem(STORAGE_KEY, next)
    setRole(next)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setRole(null)
  }, [])

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
