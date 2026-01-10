import React, { useState, useEffect } from 'react'
import ManagerStats from './ManagerStats'

// ManagerPage: affichage moderne avec stats et messagerie pour le manager
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function ManagerPage({ user, onLogout }) {
  const token = localStorage.getItem('token')
  
  // KPI statiques pour l'affichage rapide
  const staticKpis = { teamSize: 8, activeThisWeek: 5, messagesSent: 12 }
  const [kpis, setKpis] = useState(staticKpis)

  useEffect(() => {
    // Essayer de récupérer des KPI dynamiques si l'API admin est disponible (403 possible)
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return // probable 403 pour managers
        const data = await res.json()
        if (data && data.ok && data.data) {
          const d = data.data
          setKpis({
            teamSize: d.teamSize || d.usersCount || kpis.teamSize,
            activeThisWeek: d.activeThisWeek || d.active || kpis.activeThisWeek,
            messagesSent: d.messageCount || d.messages || kpis.messagesSent
          })
        }
      } catch (err) {
        // silent fail -> garder static
      }
    }
    load()
  }, [])

  return (
    <div className="card" style={{maxWidth:'1200px',width:'100%'}}>
      <div className="brand">EvalCommerce — Espace gestionnaire</div>
      <div style={{marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:20,fontWeight:600,color:'#1e293b'}}>Bonjour <strong style={{color:'#2563eb'}}>{user.username}</strong></div>
          <div style={{fontSize:14,color:'#64748b'}}>Tableau de bord gestionnaire — Squad {user.squad || 'N/A'}</div>
        </div>
        <button 
          style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:8,padding:'10px 18px',cursor:'pointer',fontWeight:600}} 
          onClick={() => { localStorage.clear(); onLogout(); }}>
          🚪 Se déconnecter
        </button>
      </div>

      {/* KPI en haut de page */}
      <div className="kpi-grid" style={{marginBottom:24}}>
        <div className="kpi-card flex-row">
          <div className="kpi-icon">👥</div>
          <div>
            <div className="kpi-title">Taille équipe</div>
            <div className="kpi-value">{kpis.teamSize}</div>
          </div>
        </div>
        <div className="kpi-card flex-row">
          <div className="kpi-icon">⚡</div>
          <div>
            <div className="kpi-title">Actifs cette semaine</div>
            <div className="kpi-value">{kpis.activeThisWeek}</div>
          </div>
        </div>
        <div className="kpi-card flex-row">
          <div className="kpi-icon">✉️</div>
          <div>
            <div className="kpi-title">Messages envoyés</div>
            <div className="kpi-value">{kpis.messagesSent}</div>
          </div>
        </div>
      </div>

      {/* Composant moderne avec stats et messagerie */}
      <ManagerStats token={token} />
    </div>
  )
}
