import React, { useEffect, useState } from 'react'

// AdminUsers: CRUD users via /admin/users (token Authorization requis)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AdminUsers({ token }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ username: '', password: '', role: 'user', squad: '' })
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

  const submitCreate = async (e) => {
    e.preventDefault()
    try {
      const payload = { username: form.username, password: form.password, role: form.role, squad: form.squad || null }
      const res = await fetch(`${API_BASE}/admin/users`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Erreur création')
      setForm({ username: '', password: '', role: 'user', squad: '' })
      load()
    } catch (err) { setError('Erreur réseau') }
  }

  const startEdit = (u) => { setEditing(u); setForm({ username: u.username, password: '', role: u.role, squad: u.squad || '' }) }

  const submitEdit = async (e) => {
    e.preventDefault()
    try {
      const id = editing.id
      const payload = { username: form.username, role: form.role, squad: form.squad || null }
      const res = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Erreur update')
      setEditing(null)
      setForm({ username: '', password: '', role: 'user', squad: '' })
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
      <h3>Gérer le personnel</h3>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <div style={{marginBottom:12}}>
        <form onSubmit={editing ? submitEdit : submitCreate} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <input placeholder='username' value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
          <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value='user'>user</option>
            <option value='manager'>manager</option>
            <option value='admin'>admin</option>
          </select>
          <input placeholder='squad (A/B)' value={form.squad} onChange={e=>setForm({...form,squad:e.target.value})} />
          {!editing && <input placeholder='password' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />}
          <div style={{gridColumn:'1 / -1',display:'flex',gap:8,justifyContent:'flex-end'}}>
            {editing ? <button type='button' onClick={()=>{setEditing(null); setForm({username:'',password:'',role:'user',squad:''})}}>Annuler</button> : null}
            <button type='submit'>{editing ? 'Enregistrer' : 'Créer'}</button>
          </div>
        </form>
      </div>

      <div>
        {loading ? <div>Chargement...</div> : (
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>ID</th><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>Username</th><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>Role</th><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>Squad</th><th style={{textAlign:'left',borderBottom:'1px solid #eee'}}>Actions</th></tr>
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
