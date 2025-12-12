import React, { useEffect, useState } from 'react'
import AdminUsers from './AdminUsers'

// AdminPage: consomme `/admin/stats` et `/admin/users` via `API_BASE`.
// Récupère le token depuis `localStorage` et envoie `Authorization: Bearer <token>`.
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
        const res = await fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
        const d = await res.json().catch(() => null)
        if (d && d.ok) setStats(d.data || d)
      } catch (err) {
        // ignore
      }
    }
    load()
    const tid = setInterval(load, 30000)
    return () => clearInterval(tid)
  }, [token])

  return (
    <div className="card">
      <div className="brand">EvalCommerce — Admin</div>
      <div style={{marginBottom:12}}>Bonjour <strong>{user.username}</strong></div>

      {/* KPI */}
      <div className="kpi-grid" style={{marginBottom:12}}>
        <div className="kpi-card flex-row"><div className="kpi-icon">👥</div><div><div className="kpi-title">Utilisateurs</div><div className="kpi-value">{users.length || '—'}</div></div></div>
        <div className="kpi-card flex-row"><div className="kpi-icon">📈</div><div><div className="kpi-title">Ventes totales</div><div className="kpi-value">{(stats && (stats.salesTotal || stats.totalSales || stats.sales_total)) ? (stats.salesTotal || stats.totalSales || stats.sales_total) : '—'}</div></div></div>
        <div className="kpi-card flex-row"><div className="kpi-icon">✉️</div><div><div className="kpi-title">Messages</div><div className="kpi-value">{(stats && (stats.messageCount || stats.message_count)) ? (stats.messageCount || stats.message_count) : '—'}</div></div></div>
      </div>

      <AdminUsers token={token} />

      <h3 style={{marginTop:14}}>Données brutes</h3>
      <pre style={{whiteSpace:'pre-wrap',background:'#f8fafc',padding:10,borderRadius:6}}>{stats ? JSON.stringify(stats, null, 2) : 'Chargement...'}</pre>

      <div style={{marginTop:12}}>
        <button onClick={() => { localStorage.clear(); onLogout(); }}>Se déconnecter</button>
      </div>
    </div>
  )
}
