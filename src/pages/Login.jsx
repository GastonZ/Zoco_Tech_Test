import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginMock } from '../api/mockApi'
import { useAuth } from '../context/AuthContext'

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
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border px-3 py-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Contraseña</label>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    )
}

export default Login