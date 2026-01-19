import React, { useEffect, useState } from 'react';

// Dashboard moderne pour les statistiques admin
export default function AdminStats({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Filtres pour les tableaux
  const [filterSquad, setFilterSquad] = useState('');
  const [filterProduct, setFilterProduct] = useState('');

  // Fonction pour télécharger les ventes en Excel (CSV)
  const downloadVentesExcel = async () => {
    try {
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/admin/ventes';
      const res = await fetch(apiUrl, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (!data.ok || !data.data) return alert('Erreur de chargement des ventes');
      
      const ventes = data.data;
      const header = 'ID Vente,ID User,Username,Équipe,ID Produit,Quantité,Adresse,Date Vente\n';
      const rows = ventes.map(v => {
        const idVente = v.id_vente || '';
        const idUser = v.id_user || '';
        const username = (v.username || 'N/A').replace(/"/g, '""');
        const squad = (v.squad || 'N/A').replace(/"/g, '""');
        const idProduit = v.id_produit || '';
        const quantite = v.quantite || 0;
        const adresse = (v.adresse || '').replace(/"/g, '""');
        const dateVente = v.date_vente ? v.date_vente.slice(0, 19).replace('T', ' ') : '';
        return `${idVente},${idUser},"${username}","${squad}",${idProduit},${quantite},"${adresse}","${dateVente}"`;
      }).join('\n');
      const csv = header + rows;
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ventes_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erreur lors du téléchargement: ' + err.message);
    }
  };

  // Fonction pour télécharger les statistiques de messages en Excel (CSV)
  const downloadMessagesExcel = async () => {
    try {
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/admin/messages';
      const res = await fetch(apiUrl, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (!data.ok || !data.data) return alert('Erreur de chargement des messages');
      
      const messages = data.data;
      const header = 'ID Message,Titre,Contenu,Date Envoi,Lu,ID Expéditeur,Expéditeur,ID Destinataire,Destinataire\n';
      const rows = messages.map(m => {
        const idMessage = m.idMessage || '';
        const titre = (m.titre || '').replace(/"/g, '""');
        const contenu = (m.contenu || '').replace(/"/g, '""').replace(/\n/g, ' ');
        const dateEnvoi = m.dateEnvoi ? m.dateEnvoi.slice(0, 19).replace('T', ' ') : '';
        const lu = m.lu ? 'Oui' : 'Non';
        const idExp = m.idExpediteur || '';
        const expUsername = (m.expediteur_username || 'N/A').replace(/"/g, '""');
        const idDest = m.idDestinataire || '';
        const destUsername = (m.destinataire_username || 'N/A').replace(/"/g, '""');
        return `${idMessage},"${titre}","${contenu}","${dateEnvoi}","${lu}",${idExp},"${expUsername}",${idDest},"${destUsername}"`;
      }).join('\n');
      const csv = header + rows;
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `messages_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erreur lors du téléchargement: ' + err.message);
    }
  };

  useEffect(() => {
    if (!token) return;
    
    const loadStats = () => {
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/admin/stats';
      fetch(apiUrl, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) {
            setError(`Erreur ${res.status}`);
          } else if (data && data.ok) {
            setStats(data.data || data);
            setLastUpdate(new Date());
            setError(null);
          } else {
            setError('Erreur de chargement');
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Erreur réseau: ' + err.message);
          setLoading(false);
        });
    };

    setLoading(true);
    loadStats();
    
    // Rafraîchissement automatique toutes les 10 secondes
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, [token]);

  if (!token) return <div>Non authentifié.</div>;
  if (loading) return <div style={{textAlign:'center',padding:40,color:'#64748b'}}>⏳ Chargement des statistiques...</div>;
  if (error) return <div style={{color:'red',padding:20}}>{error}</div>;
  if (!stats) return <div>Aucune donnée disponible.</div>;

  // Extraction des données avec fallback
  const salesStats = stats.sales || stats.salesStats || {};
  const squadStats = stats.squads || stats.squadStats || [];
  const topUsers = (stats.users && stats.users.by_user) || stats.topUsers || stats.salesPerUser || [];
  const topProducts = stats.products || stats.topProducts || stats.productStats || [];
  const messageStats = stats.messages || stats.messageStats || {};
  const summary = stats.summary || {};

  // KPI globaux avec fallback sur summary
  const totalSales = summary.total_sales || salesStats.total_ventes || salesStats.total || salesStats.totalSales || stats.salesTotal || 0;
  const totalQuantity = salesStats.quantite_totale || salesStats.totalQuantity || salesStats.total_quantity || 0;
  const totalMessages = summary.total_messages || messageStats.total_messages || messageStats.total || messageStats.totalMessages || stats.messageCount || 0;
  const totalUsers = summary.total_users || stats.totalUsers || stats.userCount || (stats.users && stats.users.count) || 0;

  // Filtrage des équipes
  const filteredSquads = squadStats.filter(sq => {
    const squadName = (sq.squad || sq.squadName || '').toString().toLowerCase();
    return filterSquad === '' || squadName.includes(filterSquad.toLowerCase());
  });

  // Filtrage des produits
  const filteredProducts = topProducts.filter(p => {
    const productId = (p.id_produit || p.productId || p.id || '').toString();
    return filterProduct === '' || productId.includes(filterProduct);
  });

  return (
    <div style={{width:'100%',maxWidth:'1200px',margin:'0 auto'}}>
      {/* Indicateur de dernière mise à jour */}
      <div style={{textAlign:'right',marginBottom:12,fontSize:13,color:'#64748b',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:6}}>
        <span>🔄</span>
        <span>Dernière mise à jour: {lastUpdate.toLocaleTimeString()}</span>
        <span style={{background:'#22c55e',width:8,height:8,borderRadius:'50%',animation:'pulse 2s infinite'}}></span>
      </div>

      {/* === KPI CARDS === */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20,marginBottom:32}}>
        <div style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',color:'#fff',borderRadius:16,padding:24,boxShadow:'0 4px 20px rgba(102,126,234,0.4)'}}>
          <div style={{fontSize:42,marginBottom:8}}>📦</div>
          <div style={{fontSize:14,opacity:0.9,marginBottom:4}}>Ventes totales</div>
          <div style={{fontSize:36,fontWeight:700}}>{totalSales}</div>
          <div style={{fontSize:12,opacity:0.8,marginTop:4}}>Nombre de transactions</div>
        </div>
        <div style={{background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',color:'#fff',borderRadius:16,padding:24,boxShadow:'0 4px 20px rgba(245,87,108,0.4)'}}>
          <div style={{fontSize:42,marginBottom:8}}>📊</div>
          <div style={{fontSize:14,opacity:0.9,marginBottom:4}}>Quantité vendue</div>
          <div style={{fontSize:36,fontWeight:700}}>{totalQuantity}</div>
          <div style={{fontSize:12,opacity:0.8,marginTop:4}}>Articles au total</div>
        </div>
        <div style={{background:'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',color:'#fff',borderRadius:16,padding:24,boxShadow:'0 4px 20px rgba(79,172,254,0.4)'}}>
          <div style={{fontSize:42,marginBottom:8}}>✉️</div>
          <div style={{fontSize:14,opacity:0.9,marginBottom:4}}>Messages envoyés</div>
          <div style={{fontSize:36,fontWeight:700}}>{totalMessages}</div>
          <div style={{fontSize:12,opacity:0.8,marginTop:4}}>Communications</div>
        </div>
        <div style={{background:'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',color:'#fff',borderRadius:16,padding:24,boxShadow:'0 4px 20px rgba(67,233,123,0.4)'}}>
          <div style={{fontSize:42,marginBottom:8}}>👥</div>
          <div style={{fontSize:14,opacity:0.9,marginBottom:4}}>Utilisateurs actifs</div>
          <div style={{fontSize:36,fontWeight:700}}>{totalUsers}</div>
          <div style={{fontSize:12,opacity:0.8,marginTop:4}}>Membres inscrits</div>
        </div>
      </div>

      {/* === STATS PAR SQUAD === */}
      {squadStats && squadStats.length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{fontSize:24,fontWeight:700,color:'#1e293b',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
            <span>🏆</span> Statistiques par Équipe
          </h2>
          {/* Barre de recherche */}
          <div style={{marginBottom:16}}>
            <input
              type="text"
              placeholder="Filtrer par équipe..."
              value={filterSquad}
              onChange={e => setFilterSquad(e.target.value)}
              style={{padding:10,borderRadius:8,border:'1px solid #e2e8f0',width:'100%',maxWidth:300,fontSize:14}}
            />
          </div>
          {/* Tableau des équipes */}
          <div style={{overflowX:'auto',background:'#fff',borderRadius:14,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f8fafc',borderBottom:'2px solid #e2e8f0'}}>
                  <th style={{padding:16,textAlign:'left',fontWeight:600,color:'#475569'}}>Équipe</th>
                  <th style={{padding:16,textAlign:'center',fontWeight:600,color:'#475569'}}>Membres</th>
                  <th style={{padding:16,textAlign:'center',fontWeight:600,color:'#475569'}}>Ventes</th>
                  <th style={{padding:16,textAlign:'center',fontWeight:600,color:'#475569'}}>Quantité totale</th>
                </tr>
              </thead>
              <tbody>
                {filteredSquads.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{textAlign:'center',padding:24,color:'#94a3b8'}}>Aucun résultat</td>
                  </tr>
                ) : (
                  filteredSquads.map((sq, idx) => {
                    const squadName = sq.squad || sq.squadName || 'N/A';
                    const salesCount = sq.nombre_ventes || sq.salesCount || sq.sales || sq.total_sales || 0;
                    const usersCount = sq.nombre_utilisateurs || sq.utilisateurs || sq.usersCount || sq.users || sq.user_count || 0;
                    const quantity = sq.quantite_totale || sq.totalQuantity || sq.quantity || 0;
                    return (
                      <tr key={squadName} style={{borderBottom:'1px solid #f1f5f9',transition:'background 0.2s'}} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <td style={{padding:16}}>
                          <div style={{display:'flex',alignItems:'center',gap:12}}>
                            <div style={{background:'#3b82f6',color:'#fff',width:40,height:40,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700}}>
                              {squadName}
                            </div>
                            <span style={{fontWeight:600,fontSize:16,color:'#1e293b'}}>Équipe {squadName}</span>
                          </div>
                        </td>
                        <td style={{padding:16,textAlign:'center',color:'#64748b',fontSize:15}}>
                          <span style={{background:'#f1f5f9',padding:'4px 12px',borderRadius:20,fontWeight:600}}>👥 {usersCount}</span>
                        </td>
                        <td style={{padding:16,textAlign:'center'}}>
                          <span style={{fontSize:20,fontWeight:700,color:'#3b82f6'}}>{salesCount}</span>
                        </td>
                        <td style={{padding:16,textAlign:'center',color:'#64748b',fontSize:15,fontWeight:600}}>{quantity}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === TOP VENDEURS === */}
      {topUsers && topUsers.length > 0 && (
        <div style={{marginBottom:32}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
            <h2 style={{fontSize:24,fontWeight:700,color:'#1e293b',display:'flex',alignItems:'center',gap:10,margin:0}}>
              <span>🥇</span> Top 5 Vendeurs
            </h2>
            <button onClick={downloadVentesExcel} style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'10px 18px',cursor:'pointer',fontWeight:600,display:'flex',alignItems:'center',gap:8,fontSize:14}}>
              <span>📥</span> Télécharger Excel
            </button>
          </div>
          <div style={{background:'#fff',borderRadius:14,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
            {topUsers.slice(0, 5).map((u, idx) => {
              const username = u.username || u.userName || 'N/A';
              const userId = u.id || u.userId || u.id_user || 'N/A';
              const sales = u.nombre_ventes || u.salesCount || u.sales || u.total_sales || u.ventes || 0;
              const quantity = u.quantite_totale || u.totalQuantity || u.quantity || u.total_quantity || u.quantite || 0;
              const medals = ['🥇', '🥈', '🥉', '🏅', '🏅'];
              const colors = ['#f59e0b', '#94a3b8', '#cd7f32', '#cbd5e1', '#e2e8f0'];
              return (
                <div key={userId + '_' + idx} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 0',borderBottom:idx < 4 ? '1px solid #e2e8f0' : 'none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:16}}>
                    <span style={{fontSize:32}}>{medals[idx]}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:18,color:'#1e293b'}}>{username}</div>
                      <div style={{fontSize:14,color:'#64748b',marginTop:2}}>
                        <span style={{fontWeight:600}}>ID: {userId}</span>
                        <span style={{margin:'0 8px',color:'#cbd5e1'}}>•</span>
                        <span>Quantité totale: <strong>{quantity}</strong> articles</span>
                      </div>
                    </div>
                  </div>
                  <div style={{background:colors[idx] || '#f0f9ff',color:idx < 3 ? '#fff' : '#475569',padding:'10px 20px',borderRadius:24,fontWeight:700,fontSize:18,boxShadow:'0 2px 8px rgba(0,0,0,0.15)',minWidth:120,textAlign:'center'}}>
                    {sales} ventes
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === TOP PRODUITS === */}
      {topProducts && topProducts.length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{fontSize:24,fontWeight:700,color:'#1e293b',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
            <span>📦</span> Produits les plus vendus
          </h2>
          {/* Barre de recherche */}
          <div style={{marginBottom:16}}>
            <input
              type="text"
              placeholder="Filtrer par ID produit..."
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
              style={{padding:10,borderRadius:8,border:'1px solid #e2e8f0',width:'100%',maxWidth:300,fontSize:14}}
            />
          </div>
          {/* Tableau des produits */}
          <div style={{overflowX:'auto',background:'#fff',borderRadius:14,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f8fafc',borderBottom:'2px solid #e2e8f0'}}>
                  <th style={{padding:16,textAlign:'left',fontWeight:600,color:'#475569'}}>Produit</th>
                  <th style={{padding:16,textAlign:'center',fontWeight:600,color:'#475569'}}>Nombre de ventes</th>
                  <th style={{padding:16,textAlign:'center',fontWeight:600,color:'#475569'}}>Quantité totale</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{textAlign:'center',padding:24,color:'#94a3b8'}}>Aucun résultat</td>
                  </tr>
                ) : (
                  filteredProducts.map((p, idx) => {
                    const productId = p.id_produit || p.productId || p.id || 'N/A';
                    const count = p.fois_vendu || p.salesCount || p.count || p.total || 0;
                    const quantity = p.quantite_totale || p.totalQuantity || p.quantity || 0;
                    return (
                      <tr key={productId + '_' + idx} style={{borderBottom:'1px solid #f1f5f9',transition:'background 0.2s'}} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <td style={{padding:16}}>
                          <div style={{display:'flex',alignItems:'center',gap:12}}>
                            <div style={{fontSize:32}}>📦</div>
                            <span style={{fontWeight:600,fontSize:16,color:'#1e293b'}}>Produit {productId}</span>
                          </div>
                        </td>
                        <td style={{padding:16,textAlign:'center'}}>
                          <span style={{fontSize:20,fontWeight:700,color:'#f59e0b'}}>{count}</span>
                        </td>
                        <td style={{padding:16,textAlign:'center'}}>
                          <span style={{background:'#fef3c7',color:'#92400e',padding:'6px 16px',borderRadius:20,fontWeight:600,fontSize:14}}>{quantity} unités</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === STATS MESSAGES === */}
      {messageStats && Object.keys(messageStats).length > 0 && (
        <div style={{marginBottom:32}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
            <h2 style={{fontSize:24,fontWeight:700,color:'#1e293b',display:'flex',alignItems:'center',gap:10,margin:0}}>
              <span>💬</span> Statistiques Messages
            </h2>
            <button onClick={downloadMessagesExcel} style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'10px 18px',cursor:'pointer',fontWeight:600,display:'flex',alignItems:'center',gap:8,fontSize:14}}>
              <span>📥</span> Télécharger Excel
            </button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16}}>
            <div style={{background:'#fff',borderRadius:14,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.08)',borderLeft:'4px solid #3b82f6'}}>
              <div style={{fontSize:14,color:'#64748b',marginBottom:4}}>Total messages</div>
              <div style={{fontSize:32,fontWeight:700,color:'#3b82f6'}}>{messageStats.total || messageStats.total_messages || 0}</div>
            </div>
            <div style={{background:'#fff',borderRadius:14,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.08)',borderLeft:'4px solid #10b981'}}>
              <div style={{fontSize:14,color:'#64748b',marginBottom:4}}>Messages lus</div>
              <div style={{fontSize:32,fontWeight:700,color:'#10b981'}}>{messageStats.read || messageStats.messages_lus || messageStats.lu || 0}</div>
            </div>
            <div style={{background:'#fff',borderRadius:14,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.08)',borderLeft:'4px solid #f59e0b'}}>
              <div style={{fontSize:14,color:'#64748b',marginBottom:4}}>Non lus</div>
              <div style={{fontSize:32,fontWeight:700,color:'#f59e0b'}}>{messageStats.unread || messageStats.messages_non_lus || messageStats.nonLu || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
