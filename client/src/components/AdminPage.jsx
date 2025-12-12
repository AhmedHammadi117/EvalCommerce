import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AdminPage({ user, onLogout }) {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return

    const load = async () => {
      try {
        const [uRes, sRes] = await Promise.all([
          fetch(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
        ])

        // users
        const uJson = await uRes.json().catch(() => null)
        if (uJson && uJson.ok) setUsers(uJson.data || [])

        // stats (tolerant mapping)
        const sJson = await sRes.json().catch(() => null)
        if (sJson && sJson.ok) {
          const d = sJson.data || sJson
          setStats(d)
        }
      } catch (err) {
        // ignore network errors for UI resilience
      }
    }

    load()

    // poll stats every 30s
    const tid = setInterval(() => { load() }, 30000)
    return () => clearInterval(tid)
  }, [])

  return (
    <div className="card">
      <div className="brand">EvalCommerce — Admin</div>
      <div style={{marginBottom:12}}>Bonjour <strong>{user.username}</strong></div>
      {/* Statique / Résumé rapide */}
      <div className="kpi-grid" style={{marginBottom:12}}>
        <div className="kpi-card flex-row"><div className="kpi-icon">👥</div><div><div className="kpi-title">Utilisateurs</div><div className="kpi-value">{users.length || '—'}</div></div></div>
        <div className="kpi-card flex-row"><div className="kpi-icon">📈</div><div><div className="kpi-title">Ventes totales</div><div className="kpi-value">{(stats && (stats.salesTotal || stats.totalSales || stats.sales_total)) ? (stats.salesTotal || stats.totalSales || stats.sales_total) : '—'}</div></div></div>
        <div className="kpi-card flex-row"><div className="kpi-icon">✉️</div><div><div className="kpi-title">Messages</div><div className="kpi-value">{(stats && (stats.messageCount || stats.message_count)) ? (stats.messageCount || stats.message_count) : '—'}</div></div></div>
      </div>

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
