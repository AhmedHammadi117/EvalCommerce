import React, { useState } from 'react'

// Composant Login principal
export default function Login({ onLogin }) {
  // Login classique
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  // Mot de passe oublié
  const [showForgot, setShowForgot] = useState(false)
  const [fp, setFP] = useState({ username: '', nom: '', prenom: '', date_naissance: '' })
  const [fpResult, setFPResult] = useState(null)
  const [fpVerified, setFPVerified] = useState(false)
  const [fpNewPass, setFPNewPass] = useState('')

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
      localStorage.setItem('token', data.token)
      onLogin(data.user)
    } catch (err) {
      setError('Impossible de contacter le serveur')
    }
  }

  // Soumission du formulaire mot de passe oublié
  // Vérification d'identité
  const submitForgot = async (e) => {
    e.preventDefault()
    setFPResult(null)
    setFPVerified(false)
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const res = await fetch(`${API_BASE}/login/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fp)
      })
      const data = await res.json()
      setFPResult(data.message || (data.ok ? 'Succès' : 'Erreur'))
      if (data.ok) setFPVerified(true)
    } catch (err) {
      setFPResult('Erreur réseau')
    }
  }

  // Réinitialisation du mot de passe
  const submitReset = async (e) => {
    e.preventDefault()
    setFPResult(null)
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const res = await fetch(`${API_BASE}/login/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fp, new_password: fpNewPass })
      })
      const data = await res.json()
      setFPResult(data.message || (data.ok ? 'Succès' : 'Erreur'))
      if (data.ok) {
        setFPVerified(false)
        setShowForgot(false)
        setFP({ username: '', nom: '', prenom: '', date_naissance: '' })
        setFPNewPass('')
      }
    } catch (err) {
      setFPResult('Erreur réseau')
    }
  }

  return (
    <div className="card">
      <div className="brand">EvalCommerce</div>
      {!showForgot ? (
        <form onSubmit={submit}>
          <div style={{marginBottom:8}}>
            <input placeholder="Nom d'utilisateur" value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e2e8f0'}} />
          </div>
          <div style={{marginBottom:12}}>
            <input type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e2e8f0'}} />
          </div>
          <button type="submit">Se connecter</button>
          <button type="button" style={{marginLeft:8}} onClick={()=>setShowForgot(true)}>Mot de passe oublié ?</button>
          {error && <div style={{color:'crimson',marginTop:10}}>{error}</div>}
          <div className="muted" style={{marginTop:12}}>Projet scolaire — interface basique</div>
        </form>
      ) : (
        !fpVerified ? (
          <form onSubmit={submitForgot}>
            <div style={{marginBottom:8}}>
              <input placeholder="Nom d'utilisateur" value={fp.username} onChange={e=>setFP({...fp,username:e.target.value})} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e2e8f0'}} required />
            </div>
            <div style={{marginBottom:8}}>
              <input placeholder="Nom" value={fp.nom} onChange={e=>setFP({...fp,nom:e.target.value})} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e2e8f0'}} required />
            </div>
            <div style={{marginBottom:8}}>
              <input placeholder="Prénom" value={fp.prenom} onChange={e=>setFP({...fp,prenom:e.target.value})} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e2e8f0'}} required />
            </div>
            <div style={{marginBottom:12}}>
              <input type="date" placeholder="Date de naissance" value={fp.date_naissance} onChange={e=>setFP({...fp,date_naissance:e.target.value})} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e2e8f0'}} required />
            </div>
            <button type="submit">Vérifier mon identité</button>
            <button type="button" style={{marginLeft:8}} onClick={()=>setShowForgot(false)}>Annuler</button>
            {fpResult && <div style={{color:fpResult.includes('succès')||fpResult.includes('Succès')?'green':'crimson',marginTop:10}}>{fpResult}</div>}
            <div className="muted" style={{marginTop:12}}>Saisissez vos informations pour réinitialiser votre mot de passe</div>
          </form>
        ) : (
          <form onSubmit={submitReset}>
            <div style={{marginBottom:12}}>
              <input type="password" placeholder="Nouveau mot de passe" value={fpNewPass} onChange={e=>setFPNewPass(e.target.value)} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e2e8f0'}} required />
            </div>
            <button type="submit">Enregistrer le nouveau mot de passe</button>
            <button type="button" style={{marginLeft:8}} onClick={()=>{setFPVerified(false);setFPResult(null);setFPNewPass('')}}>Annuler</button>
            {fpResult && <div style={{color:fpResult.includes('succès')||fpResult.includes('Succès')?'green':'crimson',marginTop:10}}>{fpResult}</div>}
            <div className="muted" style={{marginTop:12}}>Choisissez un nouveau mot de passe sécurisé</div>
          </form>
        )
      )}
    </div>
  )
}

