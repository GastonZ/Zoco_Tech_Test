import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, isLoadingSession } = useAuth()

  if (isLoadingSession) {
    return <p className="p-4">Verificando sesión...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={`/${role}`} replace />
  }

  return children
}

export default PrivateRoute
