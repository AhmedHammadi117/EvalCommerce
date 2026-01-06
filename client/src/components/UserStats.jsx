import React, { useEffect, useState } from 'react';

// Affichage moderne de l'historique des ventes utilisateur
// Si ventes est fourni en props, on l'utilise directement (pas de fetch)
export default function UserStats({ token, ventes: ventesProp }) {
  const [ventes, setVentes] = useState(ventesProp || []);
  const [loading, setLoading] = useState(!ventesProp);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ventesProp) {
      setVentes(ventesProp);
      setLoading(false);
      return;
    }
    if (!token) return;
    setLoading(true);
    fetch(import.meta.env.VITE_API_URL + '/vente', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setVentes(data.data);
        else setError(data.message || 'Erreur lors du chargement');
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur réseau');
        setLoading(false);
      });
  }, [token, ventesProp]);

  if (!token) return <div>Non authentifié.</div>;
  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div className="card" style={{maxWidth:'900px', width:'100%'}}>
      <h2 style={{marginBottom:24, color:'#2563eb', display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:28}}>🛒</span> Mes ventes
      </h2>
      {ventes.length === 0 ? (
        <div style={{color:'#64748b',fontSize:18}}>Aucune vente enregistrée.</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18}}>
          {ventes.map(v => (
            <div key={v.id_vente} style={{background:'#f8fafc',borderRadius:12,padding:18,boxShadow:'0 2px 8px #e0e7ef',display:'flex',flexDirection:'column',gap:8}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:22}}>📦</span>
                <span style={{fontWeight:600}}>Produit&nbsp;:</span> <span>{v.id_produit}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:20}}>🔢</span>
                <span>Quantité&nbsp;:</span> <span style={{fontWeight:600}}>{v.quantite}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:20}}>📍</span>
                <span>Adresse&nbsp;:</span> <span>{v.adresse}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:18}}>🗓️</span>
                <span>Date&nbsp;:</span> <span>{new Date(v.date_vente).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
