import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXG-DvNGFhm0d_Gkm-4eGlDVmIVQfKrxU",
  authDomain: "mathskuuy.firebaseapp.com",
  projectId: "mathskuuy",
  storageBucket: "mathskuuy.firebasestorage.app",
  messagingSenderId: "833593472273",
  appId: "1:833593472273:web:9da78fb4725f5d19c548b0",
  measurementId: "G-T4ZG2E5G35"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveScoreToLeaderboard(data) {
  try {
    const cleanedName = String(data.name || "").trim();

    if (!cleanedName) {
      console.error("Nama kosong, score tidak disimpan");
      return false;
    }

    const leaderboardRef = collection(db, "leaderboard");
    const existingQuery = query(
      leaderboardRef,
      where("name", "==", cleanedName)
    );

    const snapshot = await getDocs(existingQuery);

    if (!snapshot.empty) {
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data();

      const oldScore = Number(existingData.score || 0);
      const newScore = Number(data.score || 0);

      const oldAvgTime = Number(existingData.avgTime || 999999);
      const newAvgTime = Number(data.avgTime || 999999);

      const shouldUpdate =
        newScore > oldScore ||
        (newScore === oldScore && newAvgTime < oldAvgTime);

      if (shouldUpdate) {
        await updateDoc(doc(db, "leaderboard", existingDoc.id), {
          name: cleanedName,
          score: newScore,
          correct: Number(data.correct || 0),
          avgTime: Number(data.avgTime || 0),
          createdAt: serverTimestamp()
        });

        console.log("Score player berhasil diupdate 🔥");
      } else {
        console.log("Score lama tetap dipakai, tidak update");
      }

      return true;
    }

    await addDoc(leaderboardRef, {
      name: cleanedName,
      score: Number(data.score || 0),
      correct: Number(data.correct || 0),
      avgTime: Number(data.avgTime || 0),
      createdAt: serverTimestamp()
    });

    console.log("Score baru berhasil disimpan 🔥");
    return true;
  } catch (error) {
    console.error("Gagal simpan score:", error);
    return false;
  }
}

export async function getLeaderboardData() {
  try {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      limit(50)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data()
    }));
  } catch (error) {
    console.error("Gagal ambil leaderboard:", error);
    throw error;
  }
}