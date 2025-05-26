import { useAuth } from "../context/context"

const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user?.name}</h1>
      <p className="mb-4">Rol: <strong>{user?.role}</strong></p>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export default Dashboard
