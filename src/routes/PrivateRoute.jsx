import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/context'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute
