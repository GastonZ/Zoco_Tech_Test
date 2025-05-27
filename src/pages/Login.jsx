import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginMock } from '../api/mockApi'
import { useAuth } from '../context/AuthContext'
import RegularBtn from '../components/buttons/RegularBtn'
import RegularInput from '../components/inputs/RegularInput'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmitUser = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { token, user } = await loginMock({ email, password })
            login(token, user)
            navigate('/dashboard')
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmitUser}
                className="w-full max-w-md bg-white p-6 rounded shadow-md space-y-4"
            >
                <h1 className="text-xl font-bold text-center">Iniciar Sesión</h1>
                {error && <div className="text-red-500">{error}</div>}
                <RegularInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <RegularInput
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <RegularBtn
                    type="submit"
                    text="Ingresar"
                    disabled={loading}
                    loading={loading}
                />
            </form>
        </div>
    )
}

export default Login