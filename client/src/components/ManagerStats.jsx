import React, { useEffect, useState } from 'react';


// Affichage moderne des stats de l'équipe du manager
export default function ManagerStats({ token }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msgUserId, setMsgUserId] = useState(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgStatus, setMsgStatus] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/manager/stats';
    fetch(apiUrl, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async res => {
        let data = null;
        try { 
          data = await res.json();
        } catch (parseErr) {
          const textBody = await res.text();
        }
        if (!res.ok) {
          setError(`Erreur réseau (code ${res.status}) : ${data && data.message ? data.message : 'Réponse serveur inconnue'}`);
        } else if (data && data.ok) {
          setStats(data.data);
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

  // Envoi de message stylé à un user ou toute la squad
  const sendMessage = async (idDestinataire, toSquad = false) => {
    if (!msgContent.trim()) return setMsgStatus('Message vide');
    setMsgStatus('Envoi...');
    try {
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/message/send';
      const body = { titre: 'Message manager', contenu: msgContent };
      if (toSquad) body.squad = 'ALL'; // sera remplacé par la squad du manager côté backend
      else body.idDestinataire = idDestinataire;
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.ok) {
        setMsgStatus('✅ Message envoyé !');
        setMsgContent('');
        setMsgUserId(null);
        setTimeout(() => setMsgStatus(''), 2000);
      } else {
        setMsgStatus('❌ ' + (data.message || 'Erreur envoi'));
      }
    } catch (err) {
      setMsgStatus('❌ Erreur réseau : ' + err.message);
    }
  };

  if (!token) return <div>Non authentifié.</div>;
  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div className="card" style={{maxWidth:'1100px',width:'100%'}}>
      <h2 style={{marginBottom:24, color:'#2563eb', display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:28}}>👥</span> Statistiques de mon équipe
      </h2>
      
      {/* Bouton pour envoyer un message à toute la squad */}
      <div style={{marginBottom:24,padding:16,background:'#f0f9ff',borderRadius:12,border:'2px dashed #2563eb'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <span style={{fontSize:20}}>📢</span>
          <strong style={{color:'#2563eb'}}>Message à toute la squad</strong>
        </div>
        {msgUserId !== 'squad' ? (
          <button style={{background:'#2563eb',color:'#fff',border:'none',borderRadius:8,padding:'10px 18px',cursor:'pointer',fontWeight:600}} onClick={()=>{setMsgUserId('squad');setMsgContent('');}}>✉️ Envoyer un message collectif</button>
        ) : (
          <div>
            <textarea placeholder="Message pour toute la squad..." value={msgContent} onChange={e=>setMsgContent(e.target.value)} style={{width:'100%',minHeight:60,borderRadius:8,padding:10,border:'2px solid #2563eb',fontSize:14}} />
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button style={{background:'#22c55e',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',cursor:'pointer',fontWeight:600}} onClick={()=>sendMessage(null, true)}>📤 Envoyer</button>
              <button style={{background:'#64748b',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',cursor:'pointer'}} onClick={()=>{setMsgUserId(null);setMsgContent('');setMsgStatus('');}}>Annuler</button>
            </div>
            {msgStatus && <div style={{color:msgStatus.includes('✅')?'#22c55e':'#ef4444',marginTop:8,fontWeight:600}}>{msgStatus}</div>}
          </div>
        )}
      </div>

      {stats.length === 0 ? (
        <div style={{color:'#64748b',fontSize:18}}>Aucun membre ou aucune vente dans votre squad.</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:24}}>
          {stats.map(({ user, ventes }) => (
            <div key={user.id} style={{background:'#f8fafc',borderRadius:14,padding:18,boxShadow:'0 2px 12px #e0e7ef',display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:24}}>🧑‍💼</span>
                <span style={{fontWeight:700,fontSize:18}}>{user.username}</span>
                <span style={{background:'#2563eb',color:'#fff',borderRadius:8,padding:'2px 8px',fontSize:13,marginLeft:8}}>ID: {user.id}</span>
              </div>
              {ventes.length === 0 ? (
                <div style={{color:'#64748b',marginLeft:10}}>Aucune vente</div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {ventes.map(v => (
                    <div key={v.id_vente} style={{background:'#fff',borderRadius:8,padding:'8px 12px',boxShadow:'0 1px 4px #e0e7ef',display:'flex',alignItems:'center',gap:10}}>
                      <span style={{fontSize:18}}>📦</span>
                      <span>Produit <b>{v.id_produit}</b></span>
                      <span>×<b>{v.quantite}</b></span>
                      <span style={{color:'#64748b'}}>{v.adresse}</span>
                      <span style={{fontSize:13,color:'#64748b'}}>{new Date(v.date_vente).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{marginTop:10}}>
                <button style={{background:'#2563eb',color:'#fff',border:'none',borderRadius:8,padding:'8px 14px',cursor:'pointer'}} onClick={()=>{setMsgUserId(user.id);setMsgContent('');setMsgStatus('');}}>✉️ Envoyer un message</button>
              </div>
              {msgUserId === user.id && (
                <div style={{marginTop:8}}>
                  <textarea placeholder={`Message pour ${user.username}...`} value={msgContent} onChange={e=>setMsgContent(e.target.value)} style={{width:'100%',minHeight:60,borderRadius:8,padding:8,border:'2px solid #2563eb'}} />
                  <div style={{display:'flex',gap:8,marginTop:6}}>
                    <button style={{background:'#22c55e',color:'#fff',border:'none',borderRadius:8,padding:'8px 14px',cursor:'pointer'}} onClick={()=>sendMessage(user.id, false)}>Envoyer</button>
                    <button style={{background:'#64748b',color:'#fff',border:'none',borderRadius:8,padding:'6px 12px',cursor:'pointer',fontSize:13}} onClick={()=>{setMsgUserId(null);setMsgContent('');setMsgStatus('');}}>Annuler</button>
                  </div>
                  {msgStatus && <div style={{color:msgStatus.includes('✅')?'#22c55e':'#ef4444',marginTop:4,fontWeight:600}}>{msgStatus}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
