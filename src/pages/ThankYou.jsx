import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ThankYou() {
  const { cardCode } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        // Mencari data berdasarkan cardCode yang ada di fisik kartu
        const q = query(collection(db, "cards"), where("cardCode", "==", cardCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setStoreData(doc.data());
          });
        } else {
          setStoreData(null);
        }
      } catch (error) {
        console.error("Gagal mengambil data kartu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cardCode) {
      fetchCardData();
    }
  }, [cardCode]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Memuat...</div>;
  }

  // Jika kartu belum di-setting oleh admin/belum diisi link oleh customer
  if (!storeData || !storeData.reviewLink) {
    return (
      <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '50px 20px' }}>
        <h2>Kartu Belum Aktif</h2>
        <p>Silakan hubungkan kartu ini melalui Dashboard Admin.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '50px 20px', background: '#f9f9f9', height: '100vh' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', display: 'inline-block', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
        <h2>Terima Kasih </h2>
        <h3 style={{ textTransform: 'uppercase', color: '#333' }}>{storeData.storeName}</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>Penilaian Anda sangat berarti bagi kami.</p>
        
        {/* Tombol langsung mengarah ke link Whitespark / Google Review yang diinput di dashboard */}
        <a 
          href={storeData.reviewLink} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ background: '#1a73e8', color: 'white', padding: '12px 24px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', display: 'inline-block', marginTop: '20px' }}
        >
           Beri Ulasan di Google
        </a>
      </div>
    </div>
  );
}