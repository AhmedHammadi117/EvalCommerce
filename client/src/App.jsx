import React, { useState } from 'react'

// App: choisit la vue en fonction du `user.role` retourné par le backend au login
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import UserPage from './components/UserPage'
import ManagerPage from './components/ManagerPage'
import AdminPage from './components/AdminPage'

export default function App() {
  const [user, setUser] = useState(null)

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
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
