import { useAuth } from '../context/AuthContext'
import Admin from './Admin'
import User from './User/User'
import LogoutBtn from '../components/buttons/LogoutBtn'

const Dashboard = () => {
  const { role } = useAuth()

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-end mx-auto">
        <LogoutBtn />
      </div>

      {role === 'admin' && <Admin />}
      {role === 'user' && <User />}
      {!['admin', 'user'].includes(role) && <p>Rol no válido</p>}
    </div>
  )
}

export default Dashboard
