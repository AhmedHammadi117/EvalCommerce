import React, { useEffect, useState } from 'react';

// Affichage moderne de l'historique des ventes utilisateur
// Si ventes est fourni en props, on l'utilise directement (pas de fetch)
export default function UserStats({ token, ventes: ventesProp }) {
  const [ventes, setVentes] = useState(ventesProp || []);
  const [loading, setLoading] = useState(!ventesProp);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(''); // ID produit
  const [filterDate, setFilterDate] = useState('');
  const [filterAdresse, setFilterAdresse] = useState('');

  useEffect(() => {
    if (ventesProp) {
      setVentes(ventesProp);
      setLoading(false);
      return;
    }
    if (!token) return;
    setLoading(true);
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/vente', {
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

  // Filtrage par ID produit, date et adresse
  const filteredVentes = ventes.filter(v => {
    const matchId = search === '' || (v.id_produit + '').includes(search);
    const matchDate = filterDate === '' || (v.date_vente && v.date_vente.startsWith(filterDate));
    const matchAdresse = filterAdresse === '' || (v.adresse && v.adresse.toLowerCase().includes(filterAdresse.toLowerCase()));
    return matchId && matchDate && matchAdresse;
  });

  if (!token) return <div>Non authentifié.</div>;
  if (loading) return <div>Chargement de l'historique des ventes...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2>Historique des ventes</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filtrer par ID produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 6, flex: 1, minWidth: 180 }}
        />
        <input
          type="date"
          placeholder="Filtrer par date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          style={{ padding: 6, minWidth: 140 }}
        />
        <input
          type="text"
          placeholder="Filtrer par adresse..."
          value={filterAdresse}
          onChange={e => setFilterAdresse(e.target.value)}
          style={{ padding: 6, flex: 2, minWidth: 200 }}
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>ID Vente</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>ID Produit</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Quantité</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Adresse</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 16, color: '#888' }}>
                  Aucun résultat.
                </td>
              </tr>
            ) : (
              filteredVentes.map(v => (
                <tr key={v.id_vente}>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{v.id_vente}</td>
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
