import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token')
    const savedUser = sessionStorage.getItem('user')

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setToken(savedToken)
      setUser(parsedUser)
      setRole(parsedUser.role)
      setIsAuthenticated(true)
    }

    setIsLoadingSession(false)
  }, [])

  const login = (token, user) => {
    setToken(token)
    setUser(user)
    setRole(user.role)
    setIsAuthenticated(true)
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setRole(null)
    setIsAuthenticated(false)
    sessionStorage.clear()
  }

  return (
    <AuthContext.Provider value={{ token, user, role, isAuthenticated, isLoadingSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
