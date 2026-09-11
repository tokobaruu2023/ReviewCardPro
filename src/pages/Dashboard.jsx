import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { menu } = useParams(); // Menangkap sub-menu dari URL
  const activeMenu = menu || 'home'; // Jika kosong, set default ke 'home'

  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [cardCode, setCardCode] = useState('');
  const [storeName, setStoreName] = useState('');
  const [reviewLink, setReviewLink] = useState('');
  const [message, setMessage] = useState('');

  const fetchCards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cards"));
      const cardList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cardList);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const totalCards = cards.length;
  const activeCards = cards.filter(c => c.storeName && c.reviewLink).length;
  const inactiveCards = totalCards - activeCards;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDoc(doc(db, "cards", editId), {
          cardCode: cardCode.trim(),
          storeName: storeName.trim(),
          reviewLink: reviewLink.trim()
        });
        setMessage("Berhasil memperbarui kartu!");
      } else {
        await addDoc(collection(db, "cards"), {
          cardCode: cardCode.trim(),
          storeName: storeName.trim(),
          reviewLink: reviewLink.trim()
        });
        setMessage("Berhasil menambahkan kartu baru!");
      }

      setCardCode('');
      setStoreName('');
      setReviewLink('');
      setEditId(null);
      setShowModal(false);
      fetchCards();
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      setMessage("Gagal menyimpan data.");
    }
  };

  const handleEdit = (card) => {
    setEditId(card.id);
    setCardCode(card.cardCode || '');
    setStoreName(card.storeName || '');
    setReviewLink(card.reviewLink || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus kartu ini?")) {
      try {
        await deleteDoc(doc(db, "cards", id));
        setMessage("Kartu berhasil dihapus.");
        fetchCards();
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  const filteredCards = cards.filter(c => 
    c.cardCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.storeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi pembantu render tabel
  const renderTable = (showDelete = false) => (
    <div style={{ overflowX: 'auto', marginTop: '10px' }}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thTr}>
            <th style={styles.th}>No Kartu</th>
            <th style={styles.th}>Nama Toko</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => {
              const isActive = card.storeName && card.reviewLink;
              return (
                <tr key={card.id} style={styles.tdTr}>
                  <td style={styles.td}>{card.cardCode}</td>
                  <td style={styles.td}>{card.storeName || '-'}</td>
                  <td style={styles.td}>{isActive ? '🟢 Aktif' : '🔴 Belum Aktif'}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleEdit(card)} style={isActive ? styles.editBtn : styles.activateBtn}>
                      {isActive ? 'Edit' : 'Aktifkan'}
                    </button>
                    {showDelete && (
                      <button onClick={() => handleDelete(card.id)} style={styles.deleteBtn}>
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                Belum ada data kartu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Konten berdasarkan menu aktif
  const renderContent = () => {
    switch (activeMenu) {
      case 'cards':
        return (
          <div>
            <h2>Manajemen Kartu NFC</h2>
            <p style={{ color: '#666' }}>Daftar seluruh fisik kartu NFC / QR Code yang terdaftar.</p>
            {renderTable(true)}
          </div>
        );
      case 'stats':
        return (
          <div>
            <h2>Statistik Sistem</h2>
            <p style={{ color: '#666' }}>Laporan ringkas penggunaan kartu dan performa ulasan toko.</p>
            <div style={styles.statsContainer}>
              <div style={styles.statCard}>
                <h3>Total Kartu</h3>
                <p style={styles.statNumber}>{totalCards}</p>
              </div>
              <div style={{ ...styles.statCard, borderLeft: '4px solid #2e7d32' }}>
                <h3>Kartu Aktif</h3>
                <p style={{ ...styles.statNumber, color: '#2e7d32' }}>{activeCards}</p>
              </div>
              <div style={{ ...styles.statCard, borderLeft: '4px solid #c62828' }}>
                <h3>Kartu Kosong</h3>
                <p style={{ ...styles.statNumber, color: '#c62828' }}>{inactiveCards}</p>
              </div>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div>
            <h2>Data Customer (Toko)</h2>
            <p style={{ color: '#666' }}>Daftar toko/klien yang sudah mengaktifkan kartu review.</p>
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thTr}>
                    <th style={styles.th}>Nama Toko</th>
                    <th style={styles.th}>No Kartu</th>
                    <th style={styles.th}>Link Review Generator</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.filter(c => c.storeName).length > 0 ? (
                    cards.filter(c => c.storeName).map(c => (
                      <tr key={c.id} style={styles.tdTr}>
                        <td style={styles.td}><b>{c.storeName}</b></td>
                        <td style={styles.td}>{c.cardCode}</td>
                        <td style={styles.td}><a href={c.reviewLink} target="_blank" rel="noreferrer">{c.reviewLink}</a></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Belum ada customer aktif.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2>Pengaturan Sistem</h2>
            <p style={{ color: '#666' }}>Konfigurasi akun admin dan informasi sistem.</p>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '400px', marginTop: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <h4>Akun Admin</h4>
              <p><b>Username:</b> admin</p>
              <p><b>Status:</b> Super Admin 🟢</p>
            </div>
          </div>
        );
      default:
        // Halaman Home / Dashboard Utama
        return (
          <div>
            <h2>Dashboard Utama</h2>
            {message && <p style={styles.alert}>{message}</p>}

            <div style={styles.statsContainer}>
              <div style={styles.statCard}>
                <h3>Total Kartu</h3>
                <p style={styles.statNumber}>{totalCards}</p>
              </div>
              <div style={{ ...styles.statCard, borderLeft: '4px solid #2e7d32' }}>
                <h3>Aktif</h3>
                <p style={{ ...styles.statNumber, color: '#2e7d32' }}>{activeCards}</p>
              </div>
              <div style={{ ...styles.statCard, borderLeft: '4px solid #c62828' }}>
                <h3>Belum Aktif</h3>
                <p style={{ ...styles.statNumber, color: '#c62828' }}>{inactiveCards}</p>
              </div>
            </div>

            <div style={styles.actionRow}>
              <input 
                type="text" 
                placeholder="Cari Nomor Kartu / Toko..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              <button 
                onClick={() => {
                  setEditId(null);
                  setCardCode('');
                  setStoreName('');
                  setReviewLink('');
                  setShowModal(true);
                }} 
                style={styles.addButton}
              >
                + Tambah Kartu
              </button>
            </div>

            {renderTable(false)}
          </div>
        );
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.mainContent}>
        {renderContent()}

        {/* Modal Form Tambah/Edit */}
        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>{editId ? 'Edit Data Kartu' : 'Tambah Kartu Baru'}</h3>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div>
                  <label style={styles.label}>Nomor Kartu:</label>
                  <input type="text" value={cardCode} onChange={(e) => setCardCode(e.target.value)} placeholder="Contoh: M-00001" required style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Nama Toko:</label>
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Contoh: PAPARAZZI" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Link Review Generator (Whitespark / Google):</label>
                  <input type="url" value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} placeholder="https://..." style={styles.input} />
                </div>
                <div style={styles.modalButtons}>
                  <button type="submit" style={styles.saveBtn}>Simpan</button>
                  <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', background: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  mainContent: { marginLeft: '250px', padding: '30px', flex: 1, boxSizing: 'border-box' },
  alert: { background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '15px' },
  statsContainer: { display: 'flex', gap: '20px', marginBottom: '25px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '8px', flex: 1, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', textAlign: 'center' },
  statNumber: { fontSize: '24px', fontWeight: 'bold', margin: '5px 0 0 0' },
  actionRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '10px' },
  searchInput: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px' },
  addButton: { background: '#1a73e8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  thTr: { background: '#f1f3f4', textAlign: 'left' },
  th: { padding: '12px 15px', borderBottom: '1px solid #ddd', fontSize: '14px', color: '#333' },
  tdTr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 15px', fontSize: '14px', color: '#444' },
  editBtn: { background: '#fbc02d', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '5px' },
  activateBtn: { background: '#2e7d32', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  deleteBtn: { background: '#c62828', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#333' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px', boxSizing: 'border-box' },
  modalButtons: { display: 'flex', gap: '10px', marginTop: '10px' },
  saveBtn: { background: '#1a73e8', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', flex: 1, fontWeight: 'bold', cursor: 'pointer' },
  cancelBtn: { background: '#ccc', color: '#333', border: 'none', padding: '10px', borderRadius: '4px', flex: 1, fontWeight: 'bold', cursor: 'pointer' }
};