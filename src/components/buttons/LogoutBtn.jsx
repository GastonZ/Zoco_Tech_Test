import React from 'react'
import { useAuth } from '../../context/AuthContext'
import RegularBtn from './RegularBtn'
import { useNavigate } from 'react-router-dom'

const LogoutBtn = () => {

    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }
    return (
        <RegularBtn className={' bg-yellow-300 rounded-lg py-2 px-4 hover:bg-yellow-500 transition cursor-pointer'} text={'Cerrar sesión'} onClick={handleLogout} />
    )
}

export default LogoutBtn