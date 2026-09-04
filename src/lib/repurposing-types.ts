export type RepurposingPlatform =
  | 'threads'
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'youtube'
  | 'facebook'
  | 'x';

export type ContentGoal =
  | 'awareness'
  | 'engagement'
  | 'traffic'
  | 'personal_brand';

export type ContentTone =
  | 'natural'
  | 'assertive'
  | 'educational'
  | 'reflective';

export type ContentCta =
  | 'discussion'
  | 'share'
  | 'read_article'
  | 'follow'
  | 'none';

export type PlatformConfig = {
  id: RepurposingPlatform;
  name: string;
  tagline: string;
  badge: string;
  maxRecommendedLength?: number;
  outputDescription: string;
};

export const REPURPOSING_PLATFORMS: PlatformConfig[] = [
  {
    id: 'threads',
    name: 'Threads',
    tagline: 'Utas percakapan santai, bernas, dan memicu diskusi.',
    badge: '3–7 Utas',
    maxRecommendedLength: 500,
    outputDescription: 'Utas bersambung dengan batas karakter dan CTA diskusi alami.',
  },
  {
    id: 'instagram',
    name: 'Instagram Carousel',
    tagline: 'Slide edukatif visual dengan framework & insight psikologis.',
    badge: '6–10 Slide',
    outputDescription: 'Struktur slide cover, inti pembahasan, framework, dan caption lengkap.',
  },
  {
    id: 'tiktok',
    name: 'TikTok / Reels / Shorts',
    tagline: 'Script video vertikal 30–60 detik dengan hook kuat & B-roll.',
    badge: 'Video 30–60s',
    outputDescription: 'Hook 3 detik, naskah voice-over, pembagian scene, on-screen text, dan estimasi durasi.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    tagline: 'Post profesional humanis tanpa basa-basi korporat kaku.',
    badge: '1 Post Mendalam',
    outputDescription: 'Hook profesional, konteks, insight praktis, dan pertanyaan penutup.',
  },
  {
    id: 'youtube',
    name: 'YouTube Community',
    tagline: 'Rangkuman bernilai tinggi untuk audiens pelanggan channel.',
    badge: 'Community Post',
    outputDescription: 'Hook ringkas, poin inti naskah, dan pertanyaan interaktif.',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    tagline: 'Storytelling mengalir dengan konteks ramah pembaca umum.',
    badge: 'Long-form Post',
    outputDescription: 'Paragraf pendek, alur naratif mudah dicerna, dan insight aplikatif.',
  },
  {
    id: 'x',
    name: 'X Thread',
    tagline: 'Thread tajam, bernomor konsisten, dan terukur per cuitan.',
    badge: '4–8 Tweets',
    maxRecommendedLength: 280,
    outputDescription: 'Hook pertama memikat, struktur 1/N, dan batasan 280 karakter.',
  },
];

export const CONTENT_GOALS: { id: ContentGoal; label: string; description: string }[] = [
  {
    id: 'awareness',
    label: 'Bangun awareness',
    description: 'Menjangkau pembaca baru dengan gagasan pembuka yang menarik perhatian luas.',
  },
  {
    id: 'engagement',
    label: 'Dorong engagement',
    description: 'Memancing tanggapan, komentar, dan pertukaran perspektif dua arah.',
  },
  {
    id: 'traffic',
    label: 'Arahkan ke artikel',
    description: 'Memberikan intisari bernas yang mengundang pembaca menelusuri artikel lengkap.',
  },
  {
    id: 'personal_brand',
    label: 'Bangun personal brand',
    description: 'Menonjolkan pola pikir engineering, filosofi produk, dan leverage sistem.',
  },
];

export const CONTENT_TONES: { id: ContentTone; label: string; description: string }[] = [
  {
    id: 'natural',
    label: 'Natural & to the point',
    description: 'Luwes, lugas, tidak bertele-tele, dan terdengar seperti manusia asli.',
  },
  {
    id: 'assertive',
    label: 'Tegas',
    description: 'Berani mengambil posisi argumen yang kuat dan tanpa keraguan.',
  },
  {
    id: 'educational',
    label: 'Edukatif',
    description: 'Membedah konsep teknis/filosofis menjadi langkah logis yang mudah dipahami.',
  },
  {
    id: 'reflective',
    label: 'Personal/reflektif',
    description: 'Nada kontemplatif yang jujur tentang proses belajar, kegagalan, dan intuisi.',
  },
];

export const CONTENT_CTAS: { id: ContentCta; label: string; description: string; requiresPublished?: boolean }[] = [
  {
    id: 'discussion',
    label: 'Diskusi',
    description: 'Mengajak audiens membagikan pengalaman atau pandangan mereka di kolom komentar.',
  },
  {
    id: 'share',
    label: 'Bagikan',
    description: 'Mengajak audiens menyimpan atau meneruskan postingan ini ke teman/kolega.',
  },
  {
    id: 'read_article',
    label: 'Baca artikel',
    description: 'Mengarahkan pembaca ke URL artikel lengkap (hanya untuk naskah yang sudah publish).',
    requiresPublished: true,
  },
  {
    id: 'follow',
    label: 'Ikuti akun',
    description: 'Mengajak audiens mengikuti akun untuk pemikiran dan tulisan selanjutnya.',
  },
  {
    id: 'none',
    label: 'Tanpa CTA',
    description: 'Membiarkan konten berdiri sendiri tanpa ajakan aksi khusus.',
  },
];

export type RepurposingSectionType =
  | 'hook'
  | 'body'
  | 'insight'
  | 'framework'
  | 'slide'
  | 'scene'
  | 'thread_item'
  | 'cta'
  | 'caption';

export type RepurposingSection = {
  id: string;
  type: RepurposingSectionType;
  label: string;
  content: string;
  visual_note?: string;
  on_screen_text?: string;
  char_count?: number;
};

export type RepurposingResponse = {
  platform: RepurposingPlatform;
  title: string;
  sections: RepurposingSection[];
  caption?: string;
  cta: string;
  warnings: string[];
  estimated_duration_seconds?: number;
  word_count?: number;
};

export type RepurposingRequestPayload = {
  platform: RepurposingPlatform;
  goal: ContentGoal;
  tone: ContentTone;
  cta: ContentCta;
  article: {
    title: string;
    excerpt: string;
    body: string;
    category: string;
    slug: string;
    status: 'draft' | 'published';
    canonical_url?: string;
  };
};
