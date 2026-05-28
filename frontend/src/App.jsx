import React, { useState } from 'react';

function App() {
  const [role, setRole] = useState('logistik');
  const [inputData, setInputData] = useState({ id: '', nama: '', berat: '', tujuan: '' });

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmitBarang = (e) => {
    e.preventDefault();
    alert(`Mengirim data ke Backend untuk Blockchain: ${JSON.stringify(inputData)}`);
  };

  // Desain Variabel Gaya (Styling) Utama
  const styles = {
    container: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      color: '#1e293b',
      padding: '40px 20px',
    },
    wrapper: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0f172a',
      letterSpacing: '-0.5px',
      marginBottom: '10px',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '15px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '25px',
    },
    btnNav: (isActive, activeColor) => ({
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      borderRadius: '8px',
      border: '1px solid',
      borderColor: isActive ? activeColor : '#e2e8f0',
      backgroundColor: isActive ? activeColor : '#ffffff',
      color: isActive ? '#ffffff' : '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isActive ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
    }),
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '32px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    formGroup: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#f8fafc',
      transition: 'border-color 0.2s',
    },
    btnSubmit: {
      gridColumn: '1 / -1',
      padding: '14px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px',
      textAlign: 'left',
    },
    th: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      padding: '14px',
      fontSize: '13px',
      fontWeight: '600',
      textTransform: 'uppercase',
      borderBottom: '2px solid #e2e8f0',
    },
    td: {
      padding: '16px',
      fontSize: '14px',
      borderBottom: '1px solid #e2e8f0',
      color: '#334155',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: '#ffedd5',
      color: '#ea580c',
    },
    btnAction: {
      padding: '8px 16px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* HEADER SECTION */}
        <header style={styles.header}>
          <h1 style={styles.title}>🚢 DApp Sistem Pelacakan Logistik Ekspor-Impor</h1>
          <p style={styles.subtitle}>Permissioned Blockchain Portal — Powered by Hyperledger Fabric</p>
          
          <div style={styles.buttonContainer}>
            <button 
              onClick={() => setRole('logistik')} 
              style={styles.btnNav(role === 'logistik', '#2563eb')}
            >
              📦 Otoritas Logistik (Input Barang)
            </button>
            <button 
              onClick={() => setRole('beacukai')} 
              style={styles.btnNav(role === 'beacukai', '#10b981')}
            >
              🛡️ Otoritas Bea Cukai (Validasi Jaringan)
            </button>
          </div>
        </header>

        {/* MAIN CONTENT SECTION */}
        <main style={styles.card}>
          {role === 'logistik' ? (
            <div>
              <h3 style={styles.cardTitle}>📦 Manifes Ekspor Baru</h3>
              <form onSubmit={handleSubmitBarang} style={styles.formGroup}>
                <input style={styles.input} type="text" name="id" placeholder="ID Barang (Contoh: BRG-01)" value={inputData.id} onChange={handleInputChange} required />
                <input style={styles.input} type="text" name="nama" placeholder="Nama Barang" value={inputData.nama} onChange={handleInputChange} required />
                <input style={styles.input} type="number" name="berat" placeholder="Berat Komoditas (KG)" value={inputData.berat} onChange={handleInputChange} required />
                <input style={styles.input} type="text" name="tujuan" placeholder="Negara Tujuan Pengiriman" value={inputData.tujuan} onChange={handleInputChange} required />
                <button type="submit" style={styles.btnSubmit}>
                  Kirim & Amankan ke Blockchain Ledger
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h3 style={styles.cardTitle}>🛡️ Validasi & Konsensus Manifes</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID Barang</th>
                    <th style={styles.th}>Nama Barang</th>
                    <th style={styles.th}>Tujuan</th>
                    <th style={styles.th}>Status Ledger</th>
                    <th style={styles.th}>Aksi Konsensus</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}><strong>BRG-001</strong></td>
                    <td style={styles.td}>Crude Palm Oil (CPO)</td>
                    <td style={styles.td}>Singapore (SG)</td>
                    <td style={styles.td}><span style={styles.badge}>PENDING KONSENSUS</span></td>
                    <td style={styles.td}>
                      <button onClick={() => alert('Barang Berhasil Diverifikasi di Channel')} style={styles.btnAction}>
                        Approve & Release
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default App;