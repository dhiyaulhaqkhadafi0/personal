export type AiAction =
  | 'polish'
  | 'summarize'
  | 'clarify'
  | 'strengthen_hook'
  | 'conversational'
  | 'grammar'
  | 'outline'
  | 'title_alternatives'
  | 'excerpt'
  | 'seo_meta'
  | 'editorial_review';

export const SELECTION_ACTIONS = [
  {
    id: 'polish' as const,
    label: 'Rapikan Bahasa',
    description: 'Menjadikan alur kalimat lebih mengalir alami, anggun, dan enak dibaca.',
  },
  {
    id: 'summarize' as const,
    label: 'Buat Lebih Ringkas',
    description: 'Memangkas kalimat yang bertele-tele tanpa membuang makna intinya.',
  },
  {
    id: 'clarify' as const,
    label: 'Buat Lebih Jelas & Mudah Dicerna',
    description: 'Menyederhanakan struktur rumit agar mudah dipahami pembaca.',
  },
  {
    id: 'strengthen_hook' as const,
    label: 'Perkuat Hook & Argumen',
    description: 'Mempertajam kalimat pembuka agar langsung memikat perhatian.',
  },
  {
    id: 'conversational' as const,
    label: 'Gaya Natural & Percakapan',
    description: 'Menghangatkan nada tulisan seperti berdiskusi dengan kolega cerdas.',
  },
  {
    id: 'grammar' as const,
    label: 'Periksa Tata Bahasa',
    description: 'Memperbaiki salah ketik, tanda baca, dan ejaan baku (PUEBI/KBBI).',
  },
] as const;

export const ARTICLE_ACTIONS = [
  {
    id: 'outline' as const,
    label: 'Buat Kerangka Naskah',
    description: 'Menyusun struktur outline logis dari judul dan topik utama.',
  },
  {
    id: 'title_alternatives' as const,
    label: '5 Alternatif Judul',
    description: 'Memberikan 5 opsi judul tajam, memikat, dan tanpa clickbait.',
  },
  {
    id: 'excerpt' as const,
    label: 'Buat Ringkasan (Excerpt)',
    description: 'Menulis sinopsis padat 120–160 karakter untuk pratinjau kartu.',
  },
  {
    id: 'seo_meta' as const,
    label: 'Rekomendasi SEO Meta',
    description: 'Membuat SEO Title dan Meta Description optimal untuk Google.',
  },
  {
    id: 'editorial_review' as const,
    label: 'Review Editorial Menyeluruh',
    description: 'Analisis ide utama, alur, repetisi, bagian abstrak, dan klaim fakta.',
  },
] as const;

export const EDITORIAL_SYSTEM_PROMPT = `
Kamu adalah Editor Ahli dan AI Editorial Co-Pilot untuk publikasi personal "Digital Grimoire" milik Daffa Dhiyaulhaq Khadafi.

Prinsip Editorial Wajib:
1. Bahasa Indonesia: Tulis dalam Bahasa Indonesia natural, luwes, elegan, dan mudah dicerna.
2. Tone of Voice: Tegas, to the point, praktis, serta memiliki kedalaman reflektif yang tulus bila membahas topik personal atau filosofi engineering.
3. Hindari: Jargon korporat hampa, basa-basi generik AI ("Di era modern yang serba cepat ini..."), dan clickbait murahan.
4. Integritas Data: Jangan pernah mengubah fakta, angka, kutipan, nama, atau tautan asli. Jika ada fakta yang meragukan, beri tanda catatan editorial.
5. Kejujuran: Jangan berpura-pura telah melakukan browsing web langsung atau riset eksternal.
6. Output Bersih: Kembalikan hasil langsung sesuai permintaan tanpa pengantar basa-basi seperti "Tentu, ini hasil perbaikannya:".
`.trim();

export function buildPromptForAction(
  action: AiAction,
  input: {
    selection?: string;
    title?: string;
    excerpt?: string;
    body?: string;
    customHint?: string;
  }
): { systemInstruction: string; userPrompt: string } {
  const { selection = '', title = '', excerpt = '', body = '', customHint = '' } = input;
  const hintText = customHint.trim() ? `\nPetunjuk tambahan dari penulis: "${customHint.trim()}"` : '';

  switch (action) {
    case 'polish':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Rapikan kalimat berikut agar mengalir lebih alami, jernih, dan enak dibaca. Pertahankan pesan intinya:${hintText}\n\nTeks asli:\n"""\n${selection}\n"""`,
      };

    case 'summarize':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Ringkas teks berikut menjadi lebih padat dan to the point tanpa menghilangkan esensi terpenting:${hintText}\n\nTeks asli:\n"""\n${selection}\n"""`,
      };

    case 'clarify':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Jelaskan ulang teks berikut agar konsepnya jauh lebih mudah dipahami oleh pembaca umum maupun teknis:${hintText}\n\nTeks asli:\n"""\n${selection}\n"""`,
      };

    case 'strengthen_hook':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Pertajam kalimat berikut menjadi hook atau argumen pembuka yang kuat, berbobot, dan memikat perhatian pembaca:${hintText}\n\nTeks asli:\n"""\n${selection}\n"""`,
      };

    case 'conversational':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Ubah nada kalimat berikut menjadi lebih santai, bersahabat, dan bernuansa percakapan hangat namun tetap cerdas:${hintText}\n\nTeks asli:\n"""\n${selection}\n"""`,
      };

    case 'grammar':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Periksa dan perbaiki kesalahan tata bahasa, ejaan baku (PUEBI/KBBI), serta tanda baca pada teks berikut tanpa mengubah gaya penulis:${hintText}\n\nTeks asli:\n"""\n${selection}\n"""`,
      };

    case 'outline':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Buat kerangka artikel (outline) terstruktur yang logis dan menarik berdasarkan judul dan deskripsi naskah berikut:\nJudul: "${title}"\nDeskripsi / Catatan: "${excerpt || body.slice(0, 500)}"${hintText}\n\nFormat keluaran berupa poin-poin outline naskah yang siap dikembangkan.`,
      };

    case 'title_alternatives':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Berikan tepat 5 alternatif judul artikel yang tajam, memikat rasa penasaran, dan elegan (tanpa clickbait) berdasarkan judul saat ini dan inti naskah:\nJudul saat ini: "${title}"\nInti naskah:\n"""\n${excerpt || body.slice(0, 1500)}\n"""${hintText}\n\nFormat keluaran: nomor 1 sampai 5, masing-masing satu baris.`,
      };

    case 'excerpt':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Tulis satu paragraf ringkasan / excerpt naskah (panjang ideal 120-160 karakter) yang memikat pembaca untuk membaca tulisan lengkapnya:\nJudul: "${title}"\nIsi naskah:\n"""\n${body.slice(0, 2500)}\n"""${hintText}\n\nHanya berikan teks excerpt tanpa tanda kutip pembuka atau penutup.`,
      };

    case 'seo_meta':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Berdasarkan artikel berikut, buatkan rekomendasi SEO Title (maksimal 60 karakter) dan Meta Description (maksimal 160 karakter):\nJudul: "${title}"\nIsi naskah ringkas:\n"""\n${excerpt || body.slice(0, 2000)}\n"""${hintText}\n\nFormat keluaran wajib persis seperti berikut:\nSEO_TITLE: [Judul SEO di sini]\nMETA_DESCRIPTION: [Deskripsi SEO di sini]`,
      };

    case 'editorial_review':
      return {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        userPrompt: `Lakukan review editorial kritis dan konstruktif terhadap naskah berikut:\nJudul: "${title}"\nIsi naskah:\n"""\n${body.slice(0, 4000)}\n"""${hintText}\n\nFokuskan review pada 6 aspek berikut dengan format Markdown:\n### 1. Kejelasan Ide Utama\n### 2. Alur & Struktur Naskah\n### 3. Repetisi / Bagian yang Bertele-tele\n### 4. Bagian yang Terlalu Abstrak\n### 5. Saran Hook Pembuka atau Penutup\n### 6. Catatan Klaim / Fakta yang Perlu Dicek Ulang`,
      };
  }
}
