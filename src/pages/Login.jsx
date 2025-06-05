import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginMock } from '../api/mockApi'
import { useAuth } from '../context/AuthContext'
import BeautyLoginSignup from '../components/loginSignupForm/BeautyLoginSignup'
import UseFormState from '../hooks/UseFormState'
import { isEmpty, isValidEmail } from '../utils/validations'

const Login = () => {
  const { login, isAuthenticated, role } = useAuth()
  const navigate = useNavigate()

  const {
    state,
    setField,
    setLoadingRequest
  } = UseFormState({
    email: '',
    password: '',
    error: '',
    emailError: '',
    passwordError: '',
    loadingRequest: false
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'admin' ? '/admin' : '/user')
    }
  }, [isAuthenticated, navigate, role])

  const handleSubmitUser = async (e) => {
    e.preventDefault()
    setField('error', '')
    let hasError = false

    if (isEmpty(state.email)) {
      setField('emailError', 'El correo no puede estar vacío')
      hasError = true
    } else if (!isValidEmail(state.email)) {
      setField('emailError', 'Formato de correo inválido')
      hasError = true
    } else {
      setField('emailError', '')
    }

    if (isEmpty(state.password)) {
      setField('passwordError', 'La contraseña no puede estar vacía')
      hasError = true
    } else {
      setField('passwordError', '')
    }

    if (hasError) return

    setLoadingRequest(true)

    try {
      const { token, user } = await loginMock({
        email: state.email,
        password: state.password
      })

      login(token, user)
      navigate(user.role === 'admin' ? '/admin' : '/user')
    } catch (err) {
      setField('error', 'Credenciales inválidas')
    } finally {
      setLoadingRequest(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <BeautyLoginSignup
        email={state.email}
        password={state.password}
        onEmailChange={(e) => setField('email', e.target.value)}
        onPasswordChange={(e) => setField('password', e.target.value)}
        onSubmit={handleSubmitUser}
        loading={state.loadingRequest}
        error={state.error}
        emailError={state.emailError}
        passwordError={state.passwordError}
      />
    </div>
  )
}

export default Login
