import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Konfigurasi alamat API Backend (Port 5000 sesuai arahan Tim Backend)
const API_URL = 'http://localhost:5000/api/assets';

function App() {
  const [role, setRole] = useState('logistik');
  const [inputData, setInputData] = useState({ id: '', nama: '', berat: '', tujuan: '' });
  const [blockchainData, setBlockchainData] = useState([]); // State untuk menampung data dari ledger
  const [loading, setLoading] = useState(false);

  // Fungsi Otomatis: Mengambil data dari Blockchain saat halaman Bea Cukai dibuka
  useEffect(() => {
    if (role === 'beacukai') {
      fetchBlockchainData();
    }
  }, [role]);

  const fetchBlockchainData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      // Backend mengembalikan array data asset blockchain
      setBlockchainData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data blockchain:", error);
      alert("Gagal terhubung ke API Backend. Pastikan server port 5000 menyala.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  // Fungsi Kirim Data ke Jaringan Fabric via Backend
  const handleSubmitBarang = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Proses Pemetaan Skema Data (Data Mapping) sesuai request tim Backend
    const payload = {
      id: inputData.id,
      nama: inputData.nama,
      status: `Pemeriksaan Bea Cukai (${inputData.berat} KG)`, // Memetakan berat ke status
      lokasi: inputData.tujuan // Memetakan tujuan ke lokasi
    };

    try {
      const response = await axios.post(API_URL, payload);
      alert(`🎉 Sukses! Data berhasil ditulis ke Ledger Blockchain. Hash Transaksi tersimpan.`);
      // Reset Form input setelah sukses
      setInputData({ id: '', nama: '', berat: '', tujuan: '' });
    } catch (error) {
      console.error("Gagal mengirim data ke blockchain:", error);
      alert("Gagal submit data ke Ledger Hyperledger Fabric.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Verifikasi / Approve untuk Pihak Bea Cukai
  const handleApproveBarang = async (assetId) => {
    try {
      // Menembak endpoint update status ke backend
      await axios.put(`${API_URL}/${assetId}`, {
        status: 'APPROVED & RELEASED',
        lokasi: 'Dermaga Keberangkatan Internasional'
      });
      alert(`🛡️ Sukses! Status Konsensus Asset ${assetId} berhasil di-update ke Ledger.`);
      fetchBlockchainData(); // Refresh isi tabel
    } catch (error) {
      console.error("Gagal melakukan verifikasi:", error);
      alert("Gagal melakukan update konsensus di channel.");
    }
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
      backgroundColor: loading ? '#64748b' : '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
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
    badge: (status) => ({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: status?.includes('APPROVED') ? '#d1fae5' : '#ffedd5',
      color: status?.includes('APPROVED') ? '#065f46' : '#ea580c',
    }),
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
                <button type="submit" disabled={loading} style={styles.btnSubmit}>
                  {loading ? 'Memproses ke Channel Ledger...' : 'Kirim & Amankan ke Blockchain Ledger'}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h3 style={styles.cardTitle}>🛡️ Validasi & Konsensus Manifes</h3>
              {loading ? (
                <p style={{ textAlign: 'center', color: '#64748b' }}>Sedang melakukan query data ke CouchDB...</p>
              ) : blockchainData.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b' }}>Belum ada aset manifes logistik terdaftar di ledger.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID Barang</th>
                      <th style={styles.th}>Nama Barang</th>
                      <th style={styles.th}>Lokasi Terkini</th>
                      <th style={styles.th}>Status Ledger</th>
                      <th style={styles.th}>Aksi Konsensus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockchainData.map((asset) => (
                      <tr key={asset.id}>
                        <td style={styles.td}><strong>{asset.id}</strong></td>
                        <td style={styles.td}>{asset.nama}</td>
                        <td style={styles.td}>{asset.lokasi || asset.Record?.lokasi}</td>
                        <td style={styles.td}>
                          <span style={styles.badge(asset.status || asset.Record?.status)}>
                            {(asset.status || asset.Record?.status).toUpperCase()}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {!(asset.status || asset.Record?.status)?.includes('APPROVED') && (
                            <button onClick={() => handleApproveBarang(asset.id)} style={styles.btnAction}>
                              Approve & Release
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default App;