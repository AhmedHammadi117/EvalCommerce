import React, { useState, useEffect } from 'react'
import ManagerStats from './ManagerStats'

// ManagerPage: affichage moderne avec stats et messagerie pour le manager
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function ManagerPage({ user, onLogout }) {
  const token = localStorage.getItem('token')
  
  // KPI initiaux
  const [kpis, setKpis] = useState({ teamSize: 0, activeThisWeek: 0, messagesSent: 0 })

  useEffect(() => {
    // Récupérer les vrais KPI depuis l'endpoint manager
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/manager/stats`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return
        const data = await res.json()
        if (data && data.ok && data.data) {
          // data.data est un tableau d'objets { user, ventes }
          const teamSize = data.data.length
          
          // Calculer le nombre de commerciaux actifs cette semaine
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          const activeUsers = new Set()
          
          // Calculer le nombre total de ventes (messages envoyés)
          let totalVentes = 0
          
          data.data.forEach(({ user, ventes }) => {
            totalVentes += ventes.length
            // Vérifier si ce user a fait une vente cette semaine
            ventes.forEach(v => {
              if (v.date_vente) {
                const venteDate = new Date(v.date_vente)
                if (venteDate >= oneWeekAgo) {
                  activeUsers.add(user.id)
                }
              }
            })
          })
          
          setKpis({
            teamSize: teamSize,
            activeThisWeek: activeUsers.size,
            messagesSent: totalVentes
          })
        }
      } catch (err) {
        console.error('Erreur chargement KPI:', err)
      }
    }
    if (token) load()
  }, [token])

  return (
    <div className="card" style={{maxWidth:'1200px',width:'100%'}}>
      <div className="brand">EvalCommerce — Espace gestionnaire</div>
      <div style={{marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:20,fontWeight:600,color:'#1e293b'}}>Bonjour <strong style={{color:'#2563eb'}}>{user.username}</strong></div>
          <div style={{fontSize:14,color:'#64748b'}}>Tableau de bord gestionnaire — Équipe {user.squad || 'N/A'}</div>
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
