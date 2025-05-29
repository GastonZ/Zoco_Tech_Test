import React from 'react'
import style from './style.module.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Layout = ({ children }) => {
    return (
        <div className={`${style.container} min-h-screen`}>
            <div className={style.content}>
                {children}
            </div>
            <ToastContainer />
        </div>
    )
}

export default Layout