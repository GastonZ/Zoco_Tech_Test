import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import User from './pages/User/User'
import './App.css'
import PrivateRoute from './routes/PrivateRoute'
import { initUsers } from './api/mockApi'
import { toastError } from './utils/toasts'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await initUsers()
      } catch (err) {
        toastError('Error al cargar los datos iniciales')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-yellow-300 text-xl font-semibold animate-pulse">
          Cargando datos...
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/admin' element={<PrivateRoute requiredRole="admin"><Admin /></PrivateRoute>} />
        <Route path='/user' element={<PrivateRoute requiredRole="user"><User /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App
