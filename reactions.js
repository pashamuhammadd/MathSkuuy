const reactions = {
  benar_cepat: [
    {
      text: "WOI CEPET BANGET 😭🔥",
      sticker: "assets/stickers/benar_cepat.png"
    },
    {
      text: "INI OTAK APA WIFI 5G?",
      sticker: "assets/stickers/benar_cepat.png"
    },
    {
      text: "GOKIL, OTAK NYALA 🔥",
      sticker: "assets/stickers/benar_cepat.png"
    },
    {
      text: "SANTAI DONG JAGOAN 😭",
      sticker: "assets/stickers/benar_cepat.png"
    }
  ],

  salah_cepat: [
    {
      text: "CEPET SIH, TAPI NGACO 😭",
      sticker: "assets/stickers/salah_cepat.png"
    },
    {
      text: "REFLEKS DOANG YA?",
      sticker: "assets/stickers/salah_cepat.png"
    },
    {
      text: "OTAK: OFF, JARI: ON 🗿",
      sticker: "assets/stickers/salah_cepat.png"
    },
    {
      text: "ASAL KLIK YA? JUJUR AJA 😭",
      sticker: "assets/stickers/salah_cepat.png"
    }
  ],

  benar_lambat: [
    {
      text: "LAMA SIH… TAPI PINTAR 😏",
      sticker: "assets/stickers/benar_lambat.png"
    },
    {
      text: "AKHIRNYA NYAMPE JUGA 🐌",
      sticker: "assets/stickers/benar_lambat.png"
    },
    {
      text: "PROSESNYA BERAT YA 😭",
      sticker: "assets/stickers/benar_lambat.png"
    },
    {
      text: "OTAKE PANAS DULU 🔥",
      sticker: "assets/stickers/benar_lambat.png"
    }
  ],

  salah_lambat: [
    {
      text: "UDAH LAMA… MASIH SALAH 😭",
      sticker: "assets/stickers/salah_lambat.png"
    },
    {
      text: "NGAPAIN AJA TADI? 😭",
      sticker: "assets/stickers/salah_lambat.png"
    },
    {
      text: "LOADING DOANG ISINYA GA ADA",
      sticker: "assets/stickers/salah_lambat.png"
    },
    {
      text: "INI MAH DRAMA BUKAN MIKIR 🗿",
      sticker: "assets/stickers/salah_lambat.png"
    }
  ],

  benar_sangat_lambat: [
    {
      text: "SETELAH SERIBU TAHUN… BENAR 😭",
      sticker: "assets/stickers/benar_sangat_lambat.png"
    },
    {
      text: "INI UJIAN APA ARC ANIME?",
      sticker: "assets/stickers/benar_sangat_lambat.png"
    },
    {
      text: "LAMBAT TAPI LEGEND 🔥",
      sticker: "assets/stickers/benar_sangat_lambat.png"
    },
    {
      text: "AKHIRNYA OTAKNYA NYALA JUGA 🗿",
      sticker: "assets/stickers/benar_sangat_lambat.png"
    }
  ],

  salah_sangat_lambat: [
    {
      text: "UDAH LAMA BANGET… TETEP SALAH 😭",
      sticker: "assets/stickers/salah_sangat_lambat.png"
    },
    {
      text: "INI OTAK APA WINDOWS XP ERROR?",
      sticker: "assets/stickers/salah_sangat_lambat.png"
    },
    {
      text: "MISSION FAILED TOTAL 🗿",
      sticker: "assets/stickers/salah_sangat_lambat.png"
    },
    {
      text: "SIA SIA HIDUP 😭 (eh bercanda 😆)",
      sticker: "assets/stickers/salah_sangat_lambat.png"
    }
  ]
};

export function getRandomReaction(category) {
  const pool = reactions[category];

  if (!pool || pool.length === 0) {
    return {
      text: "Tetap semangat yaa 😄",
      sticker: "assets/stickers/salah_lambat.png"
    };
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export function getFinalComment(score, maxScore) {
  const percent = (score / maxScore) * 100;

  if (percent === 100) return "GILA. Kamu boss terakhir MathSkuuy 🧠🔥";
  if (percent >= 80) return "Gokil. Otak kamu sudah level dewa MathSkuuy";
  if (percent >= 60) return "Lumayan tajam. Tinggal dikit lagi jadi pro";
  if (percent >= 40) return "Masih pemanasan. Lanjut lagi biar panas";
  return "Santai. Semua jago MathSkuuy juga pernah salah kok 😄";
}