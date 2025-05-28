import React from 'react'
import { useAuth } from '../../context/AuthContext'

const LogoutBtn = () => {

    const { logout } = useAuth()

    return (
        <div>LogoutBtn</div>
    )
}

export default LogoutBtn