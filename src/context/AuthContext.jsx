import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [role, setRole] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const loadedToken = sessionStorage.getItem('token')
        const loadedUser = sessionStorage.getItem('user')

        if (loadedToken && loadedUser) {
            setToken(loadedToken)
            const user = JSON.parse(loadedUser)
            setUser(user)
            setRole(user.role)
            setIsAuthenticated(true)
        }
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
        <AuthContext.Provider value={{ token, user, role, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)