import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AdminPage({ user, onLogout }) {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    fetch(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.ok) setUsers(d.data || []) 
        else setError(d.message) })
      .catch(() => setError('Impossible de charger les utilisateurs'))

    fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.ok) setStats(d.data || d) })
      .catch(() => {})
  }, [])

  return (
    <div className="card">
      <div className="brand">EvalCommerce — Admin</div>
      <div style={{marginBottom:12}}>Bonjour <strong>{user.username}</strong></div>

      <h3>Utilisateurs</h3>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <div>
        {users.length ? (
          <ul>
            {users.map(u => <li key={u.id}>{u.username} — {u.role} — squad: {u.squad || '-'}</li>)}
          </ul>
        ) : <div>Aucun utilisateur</div>}
      </div>

      <h3>Statistiques</h3>
      <pre style={{whiteSpace:'pre-wrap',background:'#f8fafc',padding:10,borderRadius:6}}>{stats ? JSON.stringify(stats, null, 2) : 'Chargement...'}</pre>

      <div style={{marginTop:12}}>
        <button onClick={() => { localStorage.clear(); onLogout(); }}>Se déconnecter</button>
      </div>
    </div>
  )
}
