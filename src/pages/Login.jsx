import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginMock } from '../api/mockApi'
import { useAuth } from '../context/AuthContext'
import BeautyLoginSignup from '../components/loginSignupForm/BeautyLoginSignup'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmitUser = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { token, user } = await loginMock({ email, password })
      login(token, user)
      navigate('/dashboard')
    } catch (err) {
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <BeautyLoginSignup
        email={email}
        password={password}
        onEmailChange={(e) => setEmail(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onSubmit={handleSubmitUser}
        loading={loading}
        error={error}
      />
    </div>
  )
}

export default Login
