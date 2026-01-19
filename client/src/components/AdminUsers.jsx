import React, { useEffect, useState } from 'react'

// AdminUsers: CRUD users via /admin/users (token Authorization requis)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AdminUsers({ token }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Ajout des champs nom, prénom, date_naissance dans le formulaire
  const [form, setForm] = useState({ username: '', password: '', role: 'user', squad: '', nom: '', prenom: '', date_naissance: '' })
  const [editing, setEditing] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (res.ok && data.ok) setUsers(data.data || [])
      else setError(data.message || 'Erreur chargement utilisateurs')
    } catch (err) {
      setError('Erreur réseau')
    } finally { setLoading(false) }
  }

  useEffect(() => { if (token) load() }, [token])

  // Fonction de validation de la date de naissance
  const validateDateNaissance = (dateString) => {
    if (!dateString) return { valid: false, error: 'Date de naissance requise' }
    
    const birthDate = new Date(dateString)
    const today = new Date()
    
    // Calculer l'âge
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    if (age < 18) {
      return { valid: false, error: 'L\'utilisateur doit avoir au moins 18 ans' }
    }
    if (age > 75) {
      return { valid: false, error: 'L\'utilisateur ne peut pas avoir plus de 75 ans' }
    }
    
    return { valid: true }
  }

  // Création utilisateur avec les nouveaux champs
  const submitCreate = async (e) => {
    e.preventDefault()
    
    // Valider la date de naissance
    const validation = validateDateNaissance(form.date_naissance)
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    
    try {
      const payload = {
        username: form.username,
        password: form.password,
        role: form.role,
        squad: form.squad || null,
        nom: form.nom,
        prenom: form.prenom,
        date_naissance: form.date_naissance
      }
      const res = await fetch(`${API_BASE}/admin/users`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Erreur création')
      setError(null)
      setForm({ username: '', password: '', role: 'user', squad: '', nom: '', prenom: '', date_naissance: '' })
      load()
    } catch (err) { setError('Erreur réseau') }
  }

  // Pré-remplir le formulaire d'édition avec les nouveaux champs
  const startEdit = (u) => {
    setEditing(u);
    setForm({
      username: u.username,
      password: '',
      role: u.role,
      squad: u.squad || '',
      nom: u.nom || '',
      prenom: u.prenom || '',
      date_naissance: u.date_naissance ? u.date_naissance.slice(0,10) : ''
    })
  }

  // Edition utilisateur avec les nouveaux champs
  const submitEdit = async (e) => {
    e.preventDefault()
    
    // Valider la date de naissance
    const validation = validateDateNaissance(form.date_naissance)
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    
    try {
      const id = editing.id
      const payload = {
        username: form.username,
        role: form.role,
        squad: form.squad || null,
        nom: form.nom,
        prenom: form.prenom,
        date_naissance: form.date_naissance
      }
      const res = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Erreur update')
      setError(null)
      setEditing(null)
      setForm({ username: '', password: '', role: 'user', squad: '', nom: '', prenom: '', date_naissance: '' })
      load()
    } catch (err) { setError('Erreur réseau') }
  }

  const removeUser = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Erreur suppression')
      load()
    } catch (err) { setError('Erreur réseau') }
  }

  return (
    <div>
      <h3 style={{marginBottom:0}}>Gérer le personnel</h3>
      <div style={{maxWidth:520,margin:'24px auto 24px auto',background:'#fff',borderRadius:16,boxShadow:'0 2px 16px #0001',padding:24}}>
        <div style={{fontWeight:600,fontSize:18,marginBottom:12}}>{editing ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}</div>
        {error && <div style={{color:'crimson',marginBottom:10,border:'1px solid #fbb',background:'#fee',padding:8,borderRadius:8}}>{error}</div>}
        <form onSubmit={editing ? submitEdit : submitCreate} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <input className="input-modern" placeholder='Nom d’utilisateur' value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required style={{gridColumn:'1/3',padding:12,borderRadius:8,border:'1px solid #e2e8f0',fontSize:16}} />
          <select className="input-modern" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={{padding:12,borderRadius:8,border:'1px solid #e2e8f0',fontSize:16}}>
            <option value='user'>Utilisateur</option>
            <option value='manager'>Manager</option>
            <option value='admin'>Admin</option>
          </select>
          <input className="input-modern" placeholder='Équipe (A/B)' value={form.squad} onChange={e=>setForm({...form,squad:e.target.value})} style={{padding:12,borderRadius:8,border:'1px solid #e2e8f0',fontSize:16}} />
          <input className="input-modern" placeholder='Nom' value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} required style={{padding:12,borderRadius:8,border:'1px solid #e2e8f0',fontSize:16}} />
          <input className="input-modern" placeholder='Prénom' value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} required style={{padding:12,borderRadius:8,border:'1px solid #e2e8f0',fontSize:16}} />
          <input className="input-modern" type='date' placeholder='Date de naissance' value={form.date_naissance} onChange={e=>setForm({...form,date_naissance:e.target.value})} required style={{padding:12,borderRadius:8,border:'1px solid #e2e8f0',fontSize:16}} />
          {!editing && <input className="input-modern" placeholder='Mot de passe' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required style={{gridColumn:'1/3',padding:12,borderRadius:8,border:'1px solid #e2e8f0',fontSize:16}} />}
          <div style={{gridColumn:'1 / -1',display:'flex',gap:12,justifyContent:'flex-end',marginTop:8}}>
            {editing ? <button type='button' style={{background:'#eee',color:'#333',border:'none',borderRadius:8,padding:'10px 18px',fontWeight:600,cursor:'pointer'}} onClick={()=>{setEditing(null); setForm({username:'',password:'',role:'user',squad:'',nom:'',prenom:'',date_naissance:''})}}>Annuler</button> : null}
            <button type='submit' style={{background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,padding:'10px 18px',fontWeight:600,cursor:'pointer'}}>{editing ? 'Enregistrer' : 'Créer'}</button>
          </div>
        </form>
      </div>

      <div>
        {loading ? <div>Chargement...</div> : (
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>ID</th><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>Username</th><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>Role</th><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>Équipe</th><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u=> (
                <tr key={u.id}>
                  <td style={{padding:'8px 4px'}}>{u.id}</td>
                  <td style={{padding:'8px 4px'}}>{u.username}</td>
                  <td style={{padding:'8px 4px'}}>{u.role}</td>
                  <td style={{padding:'8px 4px'}}>{u.squad || '-'}</td>
                  <td style={{padding:'8px 4px'}}>
                    <button onClick={()=>startEdit(u)} style={{marginRight:8}}>Modifier</button>
                    <button onClick={()=>removeUser(u.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
