import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function ManagerPage({ user, onLogout }) {
  const [form, setForm] = useState({ idDestinataire: '', squad: '', titre: '', contenu: '', toSquad: false })
  const [message, setMessage] = useState(null)
  const token = localStorage.getItem('token')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const body = {
        titre: form.titre,
        contenu: form.contenu
      }
      if (form.toSquad) body.squad = form.squad
      else body.idDestinataire = parseInt(form.idDestinataire, 10)

      const res = await fetch(`${API_BASE}/api/message/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) return setMessage(data.message || 'Erreur envoi')
      setMessage('Message envoyé')
      setForm({ idDestinataire: '', squad: '', titre: '', contenu: '', toSquad: false })
    } catch (err) {
      setMessage('Impossible de contacter le serveur')
    }
  }

  return (
    <div className="card">
      <div className="brand">EvalCommerce — Espace gestionnaire</div>
      <div style={{marginBottom:12}}>Bonjour <strong>{user.username}</strong></div>

      <h3>Envoyer un message</h3>
      <form onSubmit={submit} style={{marginBottom:12}}>
        <label><input type="checkbox" checked={form.toSquad} onChange={e=>setForm({...form,toSquad:e.target.checked})} /> Envoyer à une squad</label>
        {form.toSquad ? (
          <input placeholder="Nom de la squad (A/B)" value={form.squad} onChange={e=>setForm({...form,squad:e.target.value})} />
        ) : (
          <input placeholder="ID destinataire" value={form.idDestinataire} onChange={e=>setForm({...form,idDestinataire:e.target.value})} />
        )}
        <input placeholder="Titre" value={form.titre} onChange={e=>setForm({...form,titre:e.target.value})} />
        <textarea placeholder="Contenu" value={form.contenu} onChange={e=>setForm({...form,contenu:e.target.value})} />
        <button type="submit">Envoyer</button>
      </form>
      {message && <div style={{color:'crimson'}}>{message}</div>}

      <div style={{marginTop:12}}>
        <button onClick={() => { localStorage.clear(); onLogout(); }}>Se déconnecter</button>
      </div>
    </div>
  )
}
