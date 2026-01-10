import React, { useEffect, useState } from 'react';

// Dashboard moderne pour les statistiques admin
export default function AdminStats({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

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
            <span>🏆</span> Statistiques par Squad
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
            {squadStats.map((sq, idx) => {
              const squadName = sq.squad || sq.squadName || 'N/A';
              const salesCount = sq.nombre_ventes || sq.salesCount || sq.sales || sq.total_sales || 0;
              const usersCount = sq.nombre_utilisateurs || sq.utilisateurs || sq.usersCount || sq.users || sq.user_count || 0;
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
              const color = colors[idx % colors.length];
              return (
                <div key={squadName} style={{background:'#fff',borderRadius:14,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.08)',border:`3px solid ${color}`}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                    <div style={{background:color,color:'#fff',width:48,height:48,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:700}}>
                      {squadName}
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:28,fontWeight:700,color:color}}>{salesCount}</div>
                      <div style={{fontSize:13,color:'#64748b'}}>ventes</div>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,color:'#64748b',fontSize:14}}>
                    <span>👥</span>
                    <span>{usersCount} membres</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === TOP VENDEURS === */}
      {topUsers && topUsers.length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{fontSize:24,fontWeight:700,color:'#1e293b',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
            <span>🥇</span> Top Vendeurs
          </h2>
          <div style={{background:'#fff',borderRadius:14,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
            {topUsers.slice(0, 10).map((u, idx) => {
              const username = u.username || u.userName || 'N/A';
              const userId = u.id || u.userId || u.id_user || 'N/A';
              const sales = u.nombre_ventes || u.salesCount || u.sales || u.total_sales || u.ventes || 0;
              const quantity = u.quantite_totale || u.totalQuantity || u.quantity || u.total_quantity || u.quantite || 0;
              const medals = ['🥇', '🥈', '🥉'];
              const colors = ['#f59e0b', '#94a3b8', '#cd7f32'];
              return (
                <div key={userId + '_' + idx} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 0',borderBottom:idx < topUsers.length - 1 ? '1px solid #e2e8f0' : 'none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:16}}>
                    <span style={{fontSize:32}}>{medals[idx] || '🏅'}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:18,color:'#1e293b'}}>{username}</div>
                      <div style={{fontSize:14,color:'#64748b',marginTop:2}}>
                        <span style={{fontWeight:600}}>ID: {userId}</span>
                        <span style={{margin:'0 8px',color:'#cbd5e1'}}>•</span>
                        <span>Quantité totale: <strong>{quantity}</strong> articles</span>
                      </div>
                    </div>
                  </div>
                  <div style={{background:colors[idx] || '#f0f9ff',color:colors[idx] ? '#fff' : '#2563eb',padding:'10px 20px',borderRadius:24,fontWeight:700,fontSize:18,boxShadow:'0 2px 8px rgba(0,0,0,0.15)',minWidth:120,textAlign:'center'}}>
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
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
            {topProducts.slice(0, 6).map((p, idx) => {
              const productId = p.id_produit || p.productId || p.id || 'N/A';
              const count = p.fois_vendu || p.salesCount || p.count || p.total || 0;
              const quantity = p.quantite_totale || p.totalQuantity || p.quantity || 0;
              return (
                <div key={productId} style={{background:'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',borderRadius:14,padding:18,boxShadow:'0 2px 12px rgba(0,0,0,0.1)'}}>
                  <div style={{fontSize:36,marginBottom:8}}>📦</div>
                  <div style={{fontSize:18,fontWeight:700,color:'#1e293b',marginBottom:4}}>Produit {productId}</div>
                  <div style={{fontSize:14,color:'#64748b',marginBottom:8}}>{count} ventes</div>
                  <div style={{background:'rgba(255,255,255,0.7)',padding:'6px 10px',borderRadius:8,fontSize:13,fontWeight:600,color:'#92400e'}}>
                    Quantité: {quantity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === STATS MESSAGES === */}
      {messageStats && Object.keys(messageStats).length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{fontSize:24,fontWeight:700,color:'#1e293b',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
            <span>💬</span> Statistiques Messages
          </h2>
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
