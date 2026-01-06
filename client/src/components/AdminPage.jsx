import React, { useEffect, useState } from 'react'
import AdminUsers from './AdminUsers'
import AdminStats from './AdminStats'

// AdminPage: Dashboard moderne pour l'admin
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AdminPage({ user, onLogout }) {
  const [users, setUsers] = useState([])
  const token = localStorage.getItem('token')

  return (
    <div className="card" style={{maxWidth:'1400px',width:'100%'}}>
      <div className="brand">EvalCommerce — Dashboard Admin</div>
      <div style={{marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:20,fontWeight:600,color:'#1e293b'}}>Bonjour <strong style={{color:'#2563eb'}}>{user.username}</strong></div>
          <div style={{fontSize:14,color:'#64748b'}}>Tableau de bord administrateur</div>
        </div>
        <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:8,padding:'10px 18px',cursor:'pointer',fontWeight:600}} onClick={() => { localStorage.clear(); onLogout(); }}>
          🚪 Se déconnecter
        </button>
      </div>

      {/* Dashboard statistiques moderne */}
      <AdminStats token={token} />

      {/* Gestion des utilisateurs */}
      <div style={{marginTop:40,marginBottom:20}}>
        <h2 style={{fontSize:24,fontWeight:700,color:'#1e293b',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
          <span>👥</span> Gestion des Utilisateurs
        </h2>
        <AdminUsers token={token} />
      </div>
    </div>
  )
}
