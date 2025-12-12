import React, { useState } from 'react'

// Login component: envoie POST /login, stocke `token` dans localStorage et appelle `onLogin(user)`
export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Erreur')
      // Stocker token en localStorage pour usage par le client (Authorization header)
      localStorage.setItem('token', data.token)
      onLogin(data.user)
    } catch (err) {
      setError('Impossible de contacter le serveur')
    }
  }

  return (
    <div className="card">
      <div className="brand">EvalCommerce</div>
      <form onSubmit={submit}>
        <div style={{marginBottom:8}}>
          <input placeholder="Nom d'utilisateur" value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e2e8f0'}} />
        </div>
        <div style={{marginBottom:12}}>
          <input type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e2e8f0'}} />
        </div>
        <button type="submit">Se connecter</button>
        {error && <div style={{color:'crimson',marginTop:10}}>{error}</div>}
        <div className="muted" style={{marginTop:12}}>Projet scolaire — interface basique</div>
      </form>
    </div>
  )
}
