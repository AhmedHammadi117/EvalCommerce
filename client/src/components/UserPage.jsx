import React, { useEffect, useState } from 'react'

// UserPage: liste messages + marquer lu + ajouter vente
// Utilise `API_BASE` et envoie `Authorization: Bearer <token>` récupéré depuis localStorage
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function UserPage({ user, onLogout }) {
  const [message, setMessage] = useState(null)
  const [ventes, setVentes] = useState([])
  const [messages, setMessages] = useState([])
  const [loadingMsgs, setLoadingMsgs] = useState(true)
  const [form, setForm] = useState({ id_produit: '', quantite: '', adresse: '' })

  const token = localStorage.getItem('token')
  const [kpis, setKpis] = useState({ unread: 0, totalSales: 0, lastSale: '—' })

  useEffect(() => {
    if (!token) return
    // charger messages reçus
    setLoadingMsgs(true)
    fetch(`${API_BASE}/api/message/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.ok && Array.isArray(d.data)) setMessages(d.data)
        else setMessage(d.message || null)
      })
      .catch(() => setMessage('Impossible de charger les messages'))
      .finally(() => setLoadingMsgs(false))

    // charger ventes (historique)
    fetch(`${API_BASE}/vente`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.ok && d.data) setVentes(d.data) })
      .catch(() => {})
  }, [])

  // Recompute KPIs whenever messages or ventes change
  useEffect(() => {
    const unread = messages.filter(m => !m.lu).length
    const totalSales = ventes.length
    const lastSale = (ventes && ventes[0] && ventes[0].date_vente) ? new Date(ventes[0].date_vente).toLocaleDateString() : '—'
    setKpis({ unread, totalSales, lastSale })
  }, [messages, ventes])

  const submitVente = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/vente/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) return setMessage(data.message || 'Erreur ajout vente')
      setMessage('Vente ajoutée')
      if (data.data && data.data.historique) setVentes(data.data.historique)
      setForm({ id_produit: '', quantite: '', adresse: '' })
    } catch (err) {
      setMessage('Impossible de contacter le serveur')
    }
  }

  const markAsRead = async (idMessage) => {
    try {
      const res = await fetch(`${API_BASE}/api/message/${idMessage}/lu`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) return setMessage(data.message || 'Erreur')
      // mettre à jour localement
      setMessages(prev => prev.map(m => m.idMessage === idMessage ? { ...m, lu: 1 } : m))
      setMessage('Message marqué comme lu')
    } catch (err) {
      setMessage('Impossible de contacter le serveur')
    }
  }

  return (
    <div className="card">
      <div className="brand">EvalCommerce — Espace commercial</div>
      <div style={{marginBottom:12}}>Bonjour <strong>{user.username}</strong> — squad: {user.squad || 'N/A'}</div>

      {/* KPI dynamique (basé sur les données chargées) */}
      <div className="kpi-grid" style={{marginBottom:12}}>
        <div className="kpi-card flex-row">
          <div className="kpi-icon">📩</div>
          <div>
            <div className="kpi-title">Messages non lus</div>
            <div className="kpi-value">{kpis.unread}</div>
          </div>
        </div>
        <div className="kpi-card flex-row">
          <div className="kpi-icon">💰</div>
          <div>
            <div className="kpi-title">Ventes totales</div>
            <div className="kpi-value">{kpis.totalSales}</div>
          </div>
        </div>
        <div className="kpi-card flex-row">
          <div className="kpi-icon">🕘</div>
          <div>
            <div className="kpi-title">Dernière vente</div>
            <div className="kpi-value">{kpis.lastSale}</div>
          </div>
        </div>
      </div>

      <h3>Mes messages</h3>
      {loadingMsgs ? (<div>Chargement...</div>) : (
        <div className="messages">
          {messages.length === 0 ? (
            <div>Aucun message</div>
          ) : (
            <ul>
              {messages.map(m => (
                <li key={m.idMessage} className={m.lu ? 'read' : 'unread'}>
                  <div className="msg-head">
                    <strong>{m.titre}</strong>
                    <span className="date">{new Date(m.dateEnvoi).toLocaleString()}</span>
                  </div>
                  <div className="msg-body">{m.contenu}</div>
                  <div className="msg-meta">De: #{m.idExpediteur}</div>
                  {!m.lu && <button className="small" onClick={() => markAsRead(m.idMessage)}>Marquer lu</button>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <h3 style={{marginTop:16}}>Ajouter une vente</h3>
      <form onSubmit={submitVente} style={{marginBottom:12}}>
        <input placeholder="ID produit" value={form.id_produit} onChange={e=>setForm({...form,id_produit:e.target.value})} />
        <input placeholder="Quantité" value={form.quantite} onChange={e=>setForm({...form,quantite:e.target.value})} />
        <input placeholder="Adresse" value={form.adresse} onChange={e=>setForm({...form,adresse:e.target.value})} />
        <button type="submit">Ajouter</button>
      </form>
      {message && <div style={{color:'crimson'}}>{message}</div>}

      <h3>Historique des ventes</h3>
      <div>
        {ventes && ventes.length ? (
          <ul>
            {ventes.map(v => <li key={v.id_vente}>{v.date_vente} — produit {v.id_produit} ×{v.quantite} — {v.adresse}</li>)}
          </ul>
        ) : <div>Aucune vente</div>}
      </div>

      <div style={{marginTop:12}}>
        <button onClick={() => { localStorage.clear(); onLogout(); }}>Se déconnecter</button>
      </div>
    </div>
  )
}
