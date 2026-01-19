import React, { useEffect, useState } from 'react';

// Affichage moderne des stats de l'équipe du manager
export default function ManagerStats({ token }) {
  const [ventes, setVentes] = useState([]); // toutes les ventes de l'équipe
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msgUserId, setMsgUserId] = useState(null); // id du commercial ciblé ou 'equipe'
  const [msgContentSquad, setMsgContentSquad] = useState('');
  const [msgContentUser, setMsgContentUser] = useState('');
  const [msgStatus, setMsgStatus] = useState('');
  const [filters, setFilters] = useState({ vente: '', produit: '', adresse: '', date: '', commercial: '' });
  const [users, setUsers] = useState([]); // pour l'autocomplete commercial

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/manager/stats';
    fetch(apiUrl, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async res => {
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok) {
          setError(`Erreur réseau (code ${res.status}) : ${data && data.message ? data.message : 'Réponse serveur inconnue'}`);
        } else if (data && data.ok) {
          // Fusionner toutes les ventes de tous les users dans un seul tableau
          const ventesFlat = [];
          const usersList = [];
          data.data.forEach(({ user, ventes }) => {
            usersList.push({ id: user.id, username: user.username });
            ventes.forEach(v => {
              ventesFlat.push({ ...v, user });
            });
          });
          setVentes(ventesFlat);
          setUsers(usersList);
        } else {
          setError(data && data.message ? data.message : 'Erreur lors du chargement');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Erreur réseau (fetch): ' + err);
        setLoading(false);
      });
  }, [token]);

  // Envoi de message à un user ou toute l'équipe
  const sendMessage = async (idDestinataire, toSquad = false) => {
    const content = toSquad ? msgContentSquad : msgContentUser;
    if (!content.trim()) return setMsgStatus('Message vide');
    setMsgStatus('Envoi...');
    try {
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/message/send';
      const body = { titre: 'Message manager', contenu: content };
      if (toSquad) body.squad = 'ALL';
      else body.idDestinataire = idDestinataire;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.ok) {
        setMsgStatus('✅ Message envoyé !');
        if (toSquad) setMsgContentSquad('');
        else setMsgContentUser('');
        setMsgUserId(null);
        setTimeout(() => setMsgStatus(''), 2000);
      } else {
        setMsgStatus('❌ ' + (data.message || 'Erreur envoi'));
      }
    } catch (err) {
      setMsgStatus('❌ Erreur réseau : ' + err.message);
    }
  };

  // Filtrage multi-critères
  const ventesFiltrees = ventes.filter(v => {
    const matchVente = !filters.vente || (v.id_vente + '').includes(filters.vente);
    const matchProduit = !filters.produit || (v.id_produit + '').includes(filters.produit);
    const matchAdresse = !filters.adresse || (v.adresse && v.adresse.toLowerCase().includes(filters.adresse.toLowerCase()));
    const matchDate = !filters.date || (v.date_vente && v.date_vente.startsWith(filters.date));
    const matchCommercial = !filters.commercial || (v.user && v.user.username && v.user.username.toLowerCase().includes(filters.commercial.toLowerCase()));
    return matchVente && matchProduit && matchAdresse && matchDate && matchCommercial;
  });

  if (!token) return <div>Non authentifié.</div>;
  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div className="card" style={{maxWidth:'1200px',width:'100%'}}>
      <h2 style={{marginBottom:24, color:'#2563eb', display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:28}}>👥</span> Statistiques de mon équipe
      </h2>
      {/* Message collectif */}
      <div style={{marginBottom:24,padding:16,background:'#f0f9ff',borderRadius:12,border:'2px dashed #2563eb'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <span style={{fontSize:20}}>📢</span>
          <strong style={{color:'#2563eb'}}>Message à toute l'équipe</strong>
        </div>
        {msgUserId !== 'equipe' ? (
          <button style={{background:'#2563eb',color:'#fff',border:'none',borderRadius:8,padding:'10px 18px',cursor:'pointer',fontWeight:600}} onClick={()=>{setMsgUserId('equipe');setMsgStatus('');}}>✉️ Envoyer un message collectif</button>
        ) : (
          <div>
            <textarea placeholder="Message pour toute l'équipe..." value={msgContentSquad} onChange={e=>setMsgContentSquad(e.target.value)} style={{width:'100%',minHeight:60,borderRadius:8,padding:10,border:'2px solid #2563eb',fontSize:14}} />
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button style={{background:'#22c55e',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',cursor:'pointer',fontWeight:600}} onClick={()=>sendMessage(null, true)}>📤 Envoyer</button>
              <button style={{background:'#64748b',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',cursor:'pointer'}} onClick={()=>{setMsgUserId(null);setMsgStatus('');}}>Annuler</button>
            </div>
            {msgStatus && <div style={{color:msgStatus.includes('✅')?'#22c55e':'#ef4444',marginTop:8,fontWeight:600}}>{msgStatus}</div>}
          </div>
        )}
      </div>

      {/* Message personnalisé à un commercial */}
      <div style={{marginBottom:24,padding:16,background:'#f8fafc',borderRadius:12,border:'2px solid #2563eb'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <span style={{fontSize:20}}>✉️</span>
          <strong style={{color:'#2563eb'}}>Message personnalisé à un commercial</strong>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap',marginBottom:10}}>
          <select value={msgUserId || ''} onChange={e=>{setMsgUserId(e.target.value||null);setMsgContentUser('');setMsgStatus('');}} style={{padding:8,borderRadius:8,border:'1.5px solid #2563eb',minWidth:180}}>
            <option value="">Sélectionner un commercial...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username} (ID: {u.id})</option>
            ))}
          </select>
          <textarea placeholder={msgUserId ? `Message pour ${users.find(u=>u.id==msgUserId)?.username || ''}...` : 'Sélectionnez un commercial'} value={msgContentUser} onChange={e=>setMsgContentUser(e.target.value)} style={{width:320,minHeight:50,borderRadius:8,padding:8,border:'2px solid #2563eb',fontSize:14}} disabled={!msgUserId} />
          <button style={{background:'#22c55e',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',cursor:msgUserId?'pointer':'not-allowed',fontWeight:600,opacity:msgUserId?1:0.5}} onClick={()=>msgUserId && sendMessage(msgUserId, false)} disabled={!msgUserId}>Envoyer</button>
        </div>
        {msgStatus && msgUserId && <div style={{color:msgStatus.includes('✅')?'#22c55e':'#ef4444',marginTop:4,fontWeight:600}}>{msgStatus}</div>}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <input type="text" placeholder="ID vente..." value={filters.vente} onChange={e=>setFilters(f=>({...f, vente:e.target.value}))} style={{ padding: 6, minWidth: 100 }} />
        <input type="text" placeholder="ID produit..." value={filters.produit} onChange={e=>setFilters(f=>({...f, produit:e.target.value}))} style={{ padding: 6, minWidth: 100 }} />
        <input type="text" placeholder="Adresse..." value={filters.adresse} onChange={e=>setFilters(f=>({...f, adresse:e.target.value}))} style={{ padding: 6, minWidth: 140 }} />
        <input type="date" placeholder="Date..." value={filters.date} onChange={e=>setFilters(f=>({...f, date:e.target.value}))} style={{ padding: 6, minWidth: 120 }} />
        <input type="text" placeholder="Commercial..." value={filters.commercial} onChange={e=>setFilters(f=>({...f, commercial:e.target.value}))} style={{ padding: 6, minWidth: 120 }} />
      </div>

      {/* Tableau ventes */}
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #e0e7ef' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>ID Vente</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Commercial</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>ID Produit</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Quantité</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Adresse</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {ventesFiltrees.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 16, color: '#888' }}>Aucun résultat.</td>
              </tr>
            ) : (
              ventesFiltrees.map(v => (
                <tr key={v.id_vente}>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{v.id_vente}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{v.user?.username || ''}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{v.id_produit}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{v.quantite}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{v.adresse}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{v.date_vente ? v.date_vente.slice(0, 10) : ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
