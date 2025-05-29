import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Layout from './layout/Layout.jsx'
import { initUsers } from './api/mockApi.js'

const startApp = async () => {
  await initUsers()

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>
        <Layout>
          <App />
        </Layout>
      </AuthProvider>
    </StrictMode>
  )
}

startApp()
