import { useAuth } from '../context/AuthContext'
import Admin from './Admin'
import User from './User/User'

const Dashboard = () => {
  const { role } = useAuth()

  if (role === 'admin') return <Admin />
  if (role === 'user') return <User />
  
  return <p>Rol no válido</p>
}

export default Dashboard

