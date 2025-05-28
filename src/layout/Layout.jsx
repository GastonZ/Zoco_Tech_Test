import React from 'react'
import style from './style.module.css'

const Layout = ({ children }) => {
    return (
        <div className={`${style.container} min-h-screen`}>
            <div className={style.content}>
                {children}
            </div>
        </div>
    )
}

export default Layout