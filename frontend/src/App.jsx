import React, { useState } from 'react';
import axios from 'axios';

// URL API Server Express Backend (Port 5000)
const API_URL = 'http://localhost:5000/api/assets';

function App() {
  const [role, setRole] = useState('logistik'); 
  
  // 1. UPDATE STATE: Menampung 6 Parameter Sesuai Kebutuhan Smart Contract Agung
  const [inputData, setInputData] = useState({ 
    id: '', 
    pengirim: '', 
    penerima: '', 
    statusBarang: 'Pemeriksaan Bea Cukai', // Default status awal
    lokasiSaatIni: '', 
    pemegangAset: 'Logistik' // Default pemegang pertama
  });

  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  // 📦 SISI LOGISTIK: SUBMIT 6 PARAMETER KE BLOCKCHAIN
  const handleSubmitBarang = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 2. UPDATE PAYLOAD: Format JSON Baru Mengikuti Aturan Main Jaringan Fabric
    const dataBarang = {
      id: inputData.id,
      pengirim: inputData.pengirim,
      penerima: inputData.penerima,
      statusBarang: inputData.statusBarang,
      lokasiSaatIni: inputData.lokasiSaatIni,
      pemegangAset: inputData.pemegangAset
    };

    try {
      await axios.post(API_URL, dataBarang);
      alert(`🎉 BERHASIL! Aset ${dataBarang.id} sukses melewati konsensus dan tertulis di Ledger Blockchain.`);
      
      // Reset Form (Status & Pemegang dikembalikan ke default)
      setInputData({ 
        id: '', 
        pengirim: '', 
        penerima: '', 
        statusBarang: 'Pemeriksaan Bea Cukai', 
        lokasiSaatIni: '', 
        pemegangAset: 'Logistik' 
      });
    } catch (error) {
      console.error("Error submit transaction:", error);
      alert("Gagal mengirim data! Periksa apakah skema di Backend sudah di-update 6 parameter juga oleh tim Backend.");
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ SISI BEA CUKAI: GET DATA 6 PARAMETER BERDASARKAN ID
  const handleCariBarang = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    setLoading(true);
    setSearchResult(null);

    try {
      const response = await axios.get(`${API_URL}/${searchId}`);
      setSearchResult(response.data);
    } catch (error) {
      console.error("Error querying asset:", error);
      alert(`Aset dengan ID ${searchId} tidak ditemukan di CouchDB State Jaringan.`);
    } finally {
      setLoading(false);
    }
  };

  // =================== DESAIN TAMPILAN (STYLING) ===================
  const styles = {
    container: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", "Segoe UI", sans-serif', color: '#1e293b', padding: '40px 20px' },
    wrapper: { maxWidth: '800px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '40px' },
    title: { fontSize: '26px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' },
    subtitle: { color: '#64748b', fontSize: '14px' },
    buttonContainer: { display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' },
    btnNav: (isActive, activeColor) => ({ padding: '10px 20px', fontSize: '14px', fontWeight: '600', borderRadius: '8px', border: '1px solid', borderColor: isActive ? activeColor : '#e2e8f0', backgroundColor: isActive ? activeColor : '#ffffff', color: isActive ? '#ffffff' : '#475569', cursor: 'pointer' }),
    card: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    formGroup: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    input: { padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc' },
    select: { padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none' },
    btnSubmit: { gridColumn: '1 / -1', padding: '14px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
    resultBox: { backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '20px' },
    gridResult: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* HEADER */}
        <header style={styles.header}>
          <h1 style={styles.title}>🚢 DApp Sistem Pelacakan Logistik Ekspor-Impor</h1>
          <p style={styles.subtitle}>Hyperledger Fabric Channel Connection — 6 Parameters Validated</p>
          
          <div style={styles.buttonContainer}>
            <button onClick={() => setRole('logistik')} style={styles.btnNav(role === 'logistik', '#2563eb')}>
              📦 Otoritas Logistik (Form Input)
            </button>
            <button onClick={() => setRole('beacukai')} style={styles.btnNav(role === 'beacukai', '#10b981')}>
              🛡️ Otoritas Bea Cukai (Audit Ledger)
            </button>
          </div>
        </header>

        {/* MAIN APPLICATION CARD */}
        <main style={styles.card}>
          {role === 'logistik' ? (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#0f172a' }}>📦 Manifes Ekspor Baru (6 Parameters Verified)</h3>
              <form onSubmit={handleSubmitBarang} style={styles.formGroup}>
                
                <input style={styles.input} type="text" name="id" placeholder="ID Barang (e.g., BRG-04)" value={inputData.id} onChange={handleInputChange} required />
                <input style={styles.input} type="text" name="nama" placeholder="Nama Komoditas / Barang" value={inputData.nama} onChange={handleInputChange} required />
                <input style={styles.input} type="text" name="pengirim" placeholder="Nama Perusahaan Pengirim" value={inputData.pengirim} onChange={handleInputChange} required />
                <input style={styles.input} type="text" name="penerima" placeholder="Nama Perusahaan Penerima" value={inputData.penerima} onChange={handleInputChange} required />
                <input style={styles.input} type="text" name="lokasiSaatIni" placeholder="Lokasi Terkini Pos Hub (e.g., Tanjung Priok)" value={inputData.lokasiSaatIni} onChange={handleInputChange} required />
                
                {/* Opsi Dropdown Pemegang Aset untuk Menjaga Integritas Data */}
                <select style={styles.select} name="pemegangAset" value={inputData.pemegangAset} onChange={handleInputChange}>
                  <option value="Logistik">Logistik (Default)</option>
                  <option value="BeaCukai">Otoritas Bea Cukai</option>
                  <option value="Maskapai/Shipping">Maskapai / Shipping Line</option>
                </select>

                <button type="submit" disabled={loading} style={styles.btnSubmit}>
                  {loading ? 'Mengirim Transaksi ke Jaringan Node...' : 'Kirim & Amankan ke Blockchain Ledger'}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#0f172a' }}>🛡️ Audit Data Manifest Kriptografi</h3>
              <form onSubmit={handleCariBarang} style={{ display: 'flex', gap: '10px' }}>
                <input style={{ ...styles.input, flex: 1 }} type="text" placeholder="Masukkan ID Barang yang ingin di-audit..." value={searchId} onChange={(e) => setSearchId(e.target.value)} required />
                <button type="submit" style={{ ...styles.btnSubmit, marginTop: 0, padding: '0 25px', backgroundColor: '#10b981' }}>
                  {loading ? 'Mencari...' : 'Audit Ledger'}
                </button>
              </form>

              {searchResult && (
                <div style={styles.resultBox}>
                  <h4 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>🔒 Hasil Manifest Terverifikasi (CouchDB State):</h4>
                  <div style={styles.gridResult}>
                    <p><strong>ID Aset:</strong> {searchResult.id || searchResult.Record?.id}</p>
                    <p><strong>Nama Barang:</strong> {searchResult.nama || searchResult.Record?.nama}</p>
                    <p><strong>Pihak Pengirim:</strong> {searchResult.pengirim || searchResult.Record?.pengirim}</p>
                    <p><strong>Pihak Penerima:</strong> {searchResult.penerima || searchResult.Record?.penerima}</p>
                    <p><strong>Lokasi Koordinat:</strong> {searchResult.lokasiSaatIni || searchResult.Record?.lokasiSaatIni}</p>
                    <p><strong>Pemegang Kendali:</strong> <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{searchResult.pemegangAset || searchResult.Record?.pemegangAset}</span></p>
                  </div>
                  <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                    <p style={{ margin: 0 }}><strong>Status Log Jaringan:</strong> <span style={{ color: '#ea580c', fontWeight: 'bold' }}>{searchResult.statusBarang || searchResult.Record?.statusBarang}</span></p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default App;