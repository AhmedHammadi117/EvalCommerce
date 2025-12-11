import React from 'react'

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="card">
      <div className="brand">EvalCommerce — Tableau</div>
      <div style={{marginBottom:12}}>Bonjour <strong>{user.username}</strong> — rôle: {user.role}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <div style={{padding:10,background:'#f8fafc',borderRadius:8}}>Stat 1<br/><strong>—</strong></div>
        <div style={{padding:10,background:'#f8fafc',borderRadius:8}}>Stat 2<br/><strong>—</strong></div>
      </div>
      <div style={{marginTop:14}}>
        <button onClick={() => { localStorage.clear(); onLogout(); }}>Se déconnecter</button>
      </div>
    </div>
  )
}
