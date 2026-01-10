import React, { useState, useEffect } from 'react'

// App: choisit la vue en fonction du `user.role` retourné par le backend au login
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import UserPage from './components/UserPage'
import ManagerPage from './components/ManagerPage'
import AdminPage from './components/AdminPage'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Vérifier si un token existe au démarrage et récupérer les infos utilisateur
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Décoder le token JWT pour récupérer les infos utilisateur
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.id, username: payload.username, role: payload.role, squad: payload.squad })
      } catch (err) {
        console.error('Token invalide:', err)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) {
    return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',color:'#64748b'}}>⏳ Chargement...</div>
  }

  const renderByRole = () => {
    if (!user) return null
    const role = (user.role || '').toLowerCase()
    if (role === 'admin') return <AdminPage user={user} onLogout={logout} />
    if (role === 'manager') return <ManagerPage user={user} onLogout={logout} />
    // default → commercial / user
    return <UserPage user={user} onLogout={logout} />
  }

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        renderByRole()
      )}
    </div>
  )
}
