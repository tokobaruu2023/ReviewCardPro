import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

function ReviewCard() {
  const { cardId } = useParams();

  const [loading, setLoading] = useState(true);
  const [aktif, setAktif] = useState(false);
  const [namaToko, setNamaToko] = useState("");
  const [googleReview, setGoogleReview] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const snap = await getDoc(doc(db, "cards", cardId));

      if (snap.exists()) {
        const data = snap.data();

        setAktif(data.aktif);
        setNamaToko(data.namaToko);
        setGoogleReview(data.googleReview);
      }

      setLoading(false);
    };

    loadData();
  }, [cardId]);

  if (loading) return <h2>Memuat...</h2>;

  if (!aktif) {
    return <h1>Kartu Belum Aktif</h1>;
  }

  return (
    <div style={{textAlign:"center",marginTop:"80px"}}>
      <h1>Terima Kasih</h1>

      <h2>{namaToko}</h2>

      <p>
        Penilaian Anda sangat berarti bagi kami.
      </p>

      <a
        href={googleReview}
        target="_blank"
        rel="noreferrer"
      >
        <button
          style={{
            padding:"15px 35px",
            fontSize:"18px",
            background:"#4285F4",
            color:"#fff",
            border:"none",
            borderRadius:"12px",
            cursor:"pointer"
          }}
        >
           Beri Ulasan di Google
        </button>
      </a>
    </div>
  );
}

export default ReviewCard;