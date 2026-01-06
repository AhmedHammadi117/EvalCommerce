import React, { useState, useEffect } from 'react'
import ManagerStats from './ManagerStats'

// ManagerPage: envoi de messages (individuel ou squad)
// Le manager envoie POST /api/message/send avec token Authorization
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function ManagerPage({ user, onLogout }) {
  // Token dynamique : se met à jour si localStorage change
  const [token, setToken] = useState(localStorage.getItem('token'));
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // KPI dynamiques calculés à partir des données de /manager/stats
  const [kpis, setKpis] = useState({ teamSize: 0, activeThisWeek: 0, messagesSent: 0 });

  useEffect(() => {
    // Charger les stats de la squad du manager et calculer les KPI
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/manager/stats`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.ok && Array.isArray(data.data)) {
          const stats = data.data;
          // teamSize = nombre de membres dans la squad
          const teamSize = stats.length;
          // messagesSent = total des ventes de la squad (exemple)
          const messagesSent = stats.reduce((acc, u) => acc + (u.ventes ? u.ventes.length : 0), 0);
          // activeThisWeek = nombre de membres ayant au moins une vente cette semaine (exemple simplifié)
          const now = new Date();
          const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          const activeThisWeek = stats.filter(u => (u.ventes || []).some(v => new Date(v.date_vente) >= weekAgo)).length;
          setKpis({ teamSize, activeThisWeek, messagesSent });
        }
      } catch (err) {
        // silent fail
      }
    };
    load();
  }, [token]);

  return (
    <div className="card">
      <div className="brand">EvalCommerce — Espace gestionnaire</div>
      <div style={{marginBottom:12}}>Bonjour <strong>{user.username}</strong></div>

      {/* KPI dynamiques */}
      <div className="kpi-grid" style={{marginBottom:20}}>
        <div className="kpi-card flex-row"><div className="kpi-icon">👥</div><div><div className="kpi-title">Taille équipe</div><div className="kpi-value">{kpis.teamSize}</div></div></div>
        <div className="kpi-card flex-row"><div className="kpi-icon">⚡</div><div><div className="kpi-title">Actifs cette semaine</div><div className="kpi-value">{kpis.activeThisWeek}</div></div></div>
        <div className="kpi-card flex-row"><div className="kpi-icon">📦</div><div><div className="kpi-title">Total ventes</div><div className="kpi-value">{kpis.messagesSent}</div></div></div>
      </div>

      <ManagerStats token={token} />

      <div style={{marginTop:20}}>
        <button onClick={() => { localStorage.clear(); onLogout(); }}>Se déconnecter</button>
      </div>
    </div>
  )
}
