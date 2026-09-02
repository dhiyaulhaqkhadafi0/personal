import type { TiptapNode } from '@/lib/blog-types';

export type StudioTemplate = {
  id: string;
  name: string;
  badge: string;
  description: string;
  structureTags: string[];
  defaultTitle: string;
  defaultExcerpt: string;
  content_json: TiptapNode;
  content_html: string;
};

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    id: 'blank',
    name: 'Naskah Kosong',
    badge: 'Minimalis',
    description: 'Mulai menulis dari kanvas bersih tanpa struktur awal. Cocok untuk format bebas, draf cepat, atau eksperimen ide.',
    structureTags: ['Kanvas Bersih', 'Format Bebas'],
    defaultTitle: 'Untitled story',
    defaultExcerpt: '',
    content_json: {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    },
    content_html: '<p></p>',
  },
  {
    id: 'reflection',
    name: 'Refleksi / Esai',
    badge: 'Opini & Refleksi',
    description: 'Struktur narasi personal, pemikiran mendalam, dan opini terstruktur dengan kutipan penting (pull quote).',
    structureTags: ['Prolog Naratif', 'Gagasan Utama', 'Pull Quote', 'Catatan Akhir'],
    defaultTitle: 'Untitled story',
    defaultExcerpt: 'Sebuah perenungan tentang gagasan yang berkembang dan relevansinya hari ini.',
    content_json: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Setiap pemikiran besar bermula dari satu momen pengamatan kecil yang mengusik rasa ingin tahu. Di babak pembuka ini, bangun konteks yang intim dan personal untuk mengajak pembaca menyelami topik ini bersama Anda.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Titik Balik dan Pengamatan' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Uraikan peristiwa atau pengamatan konkret yang memicu refleksi ini. Apa yang berubah dalam cara pandang Anda ketika pertama kali menyadari hal tersebut?',
            },
          ],
        },
        {
          type: 'blockquote',
          attrs: { variant: 'pullquote' },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Sebuah ide yang kuat tidak lahir dari ruang hampa, melainkan dari keberanian melihat hal biasa dengan cara yang sama sekali berbeda.',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Gagasan yang Berkembang' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Kembangkan argumen utama Anda secara runut. Sajikan sudut pandang baru yang belum banyak diulas orang lain, didukung oleh analogi atau pengalaman nyata.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Relevansi dengan Realitas Hari Ini' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Bagaimana refleksi ini kontekstual dengan situasi sekarang? Apa implikasi yang bisa dirasakan oleh pembaca dalam keseharian atau bidang mereka?',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Catatan Akhir dan Simpulan' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Tutup esai dengan renungan pamungkas atau pertanyaan terbuka yang membuat pembaca terus memikirkannya setelah selesai membaca.',
            },
          ],
        },
      ],
    },
    content_html: `
<p>Setiap pemikiran besar bermula dari satu momen pengamatan kecil yang mengusik rasa ingin tahu. Di babak pembuka ini, bangun konteks yang intim dan personal untuk mengajak pembaca menyelami topik ini bersama Anda.</p>
<h2>Titik Balik dan Pengamatan</h2>
<p>Uraikan peristiwa atau pengamatan konkret yang memicu refleksi ini. Apa yang berubah dalam cara pandang Anda ketika pertama kali menyadari hal tersebut?</p>
<blockquote class="pullquote"><p>Sebuah ide yang kuat tidak lahir dari ruang hampa, melainkan dari keberanian melihat hal biasa dengan cara yang sama sekali berbeda.</p></blockquote>
<h2>Gagasan yang Berkembang</h2>
<p>Kembangkan argumen utama Anda secara runut. Sajikan sudut pandang baru yang belum banyak diulas orang lain, didukung oleh analogi atau pengalaman nyata.</p>
<h3>Relevansi dengan Realitas Hari Ini</h3>
<p>Bagaimana refleksi ini kontekstual dengan situasi sekarang? Apa implikasi yang bisa dirasakan oleh pembaca dalam keseharian atau bidang mereka?</p>
<h2>Catatan Akhir dan Simpulan</h2>
<p>Tutup esai dengan renungan pamungkas atau pertanyaan terbuka yang membuat pembaca terus memikirkannya setelah selesai membaca.</p>
    `.trim(),
  },
  {
    id: 'guide',
    name: 'Panduan Praktis',
    badge: 'How-To / Panduan',
    description: 'Format panduan instruksional langkah demi langkah yang terarah, dilengkapi tips callout dan ikhtisar yang mudah diikuti.',
    structureTags: ['Ikhtisar', 'Prasyarat', 'Langkah Berurutan', 'Callout Tips'],
    defaultTitle: 'Untitled story',
    defaultExcerpt: 'Panduan praktis langkah demi langkah untuk menerapkan solusi terukur secara runut.',
    content_json: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Panduan praktis ini dirancang untuk memandu Anda memahami dan menerapkan solusi secara langsung. Di bagian awal, sampaikan tujuan akhir yang akan dicapai pembaca setelah menyelesaikan panduan ini.',
            },
          ],
        },
        {
          type: 'blockquote',
          attrs: { variant: 'callout' },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '💡 Catatan Penting: Pastikan Anda telah mempersiapkan prasyarat dasar sebelum memulai langkah-langkah di bawah agar alur implementasi berjalan lancar.',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Prasyarat & Persiapan Awal' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Pemahaman konseptual dasar tentang sistem atau topik terkait' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Akses terhadap perangkat lunak, alat bantu, atau kredensial yang dibutuhkan' },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Langkah-Langkah Implementasi' }],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Langkah 1: Tentukan parameter dan batasan awal proyek secara tegas.' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Langkah 2: Eksekusi konfigurasi inti dan lakukan uji coba pada skala kecil.' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Langkah 3: Validasi hasil akhir serta optimalkan kestabilan sistem.' },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Troubleshooting & Tips Efisiensi' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Sebutkan kendala umum yang berpotensi muncul beserta cara penanganan cepatnya agar pembaca tidak tersendat ketika menemui rintangan.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Rangkuman & Tindak Lanjut' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Selamat, Anda telah menyelesaikan seluruh tahapan. Simpulkan capaian utama dan berikan saran langkah lanjutan yang dapat dieksplorasi pembaca.',
            },
          ],
        },
      ],
    },
    content_html: `
<p>Panduan praktis ini dirancang untuk memandu Anda memahami dan menerapkan solusi secara langsung. Di bagian awal, sampaikan tujuan akhir yang akan dicapai pembaca setelah menyelesaikan panduan ini.</p>
<blockquote class="callout"><p>💡 Catatan Penting: Pastikan Anda telah mempersiapkan prasyarat dasar sebelum memulai langkah-langkah di bawah agar alur implementasi berjalan lancar.</p></blockquote>
<h2>Prasyarat &amp; Persiapan Awal</h2>
<ul>
  <li><p>Pemahaman konseptual dasar tentang sistem atau topik terkait</p></li>
  <li><p>Akses terhadap perangkat lunak, alat bantu, atau kredensial yang dibutuhkan</p></li>
</ul>
<h2>Langkah-Langkah Implementasi</h2>
<ol>
  <li><p>Langkah 1: Tentukan parameter dan batasan awal proyek secara tegas.</p></li>
  <li><p>Langkah 2: Eksekusi konfigurasi inti dan lakukan uji coba pada skala kecil.</p></li>
  <li><p>Langkah 3: Validasi hasil akhir serta optimalkan kestabilan sistem.</p></li>
</ol>
<h2>Troubleshooting &amp; Tips Efisiensi</h2>
<p>Sebutkan kendala umum yang berpotensi muncul beserta cara penanganan cepatnya agar pembaca tidak tersendat ketika menemui rintangan.</p>
<h2>Rangkuman &amp; Tindak Lanjut</h2>
<p>Selamat, Anda telah menyelesaikan seluruh tahapan. Simpulkan capaian utama dan berikan saran langkah lanjutan yang dapat dieksplorasi pembaca.</p>
    `.trim(),
  },
  {
    id: 'case-study',
    name: 'Case Study',
    badge: 'Analisis & Solusi',
    description: 'Analisis mendalam studi kasus: latar belakang masalah, hipotesis, solusi strategis, hingga dampak nyata terukur.',
    structureTags: ['Latar Belakang', 'Tantangan Inti', 'Solusi Strategis', 'Hasil Terukur'],
    defaultTitle: 'Untitled story',
    defaultExcerpt: 'Analisis mendalam studi kasus: tantangan kritis, keputusan strategis, dan dampak nyata terukur.',
    content_json: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Studi kasus ini mengulas bagaimana sebuah tantangan nyata dianalisis, diselesaikan melalui strategi terarah, dan dampak konkret yang berhasil dicapai.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Latar Belakang & Konteks' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Paparkan situasi awal sebelum proyek dimulai: apa kondisi sistem, siapa pihak yang terlibat, dan apa target utama yang harus dicapai.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Masalah & Tantangan Kritis' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Uraikan friksi atau rintangan utama yang menghalangi pencapaian target. Apa konsekuensi yang terjadi jika masalah tersebut dibiarkan tanpa penanganan?',
            },
          ],
        },
        {
          type: 'blockquote',
          attrs: { variant: 'callout' },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '💡 Temuan Kunci: Sering kali tantangan terbesar bukan pada eksekusi teknis, melainkan ketidaksesuaian antara ekspektasi awal dengan realitas lapangan.',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Strategi & Solusi yang Diterapkan' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Jelaskan keputusan strategis yang diambil beserta pertimbangan di baliknya. Mengapa pendekatan ini dipilih dibandingkan alternatif lain?',
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Fase 1: Riset mendalam dan pemetaan titik kebocoran efisiensi' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Fase 2: Implementasi solusi bertahap dengan feedback loop cepat' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Fase 3: Pengujian ketahanan dan stabilisasi sistem pada kondisi beban riil' },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Hasil & Dampak Terukur' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Sajikan bukti nyata dari efektivitas solusi yang diterapkan, baik berupa metrik kuantitatif (peningkatan kecepatan, penghematan waktu) maupun perubahan kualitatif.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Pembelajaran Utama (Key Takeaways)' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Rangkum kesimpulan berharga yang dapat dipetik dari pengalaman ini dan diterapkan pada kasus serupa di masa mendatang.',
            },
          ],
        },
      ],
    },
    content_html: `
<p>Studi kasus ini mengulas bagaimana sebuah tantangan nyata dianalisis, diselesaikan melalui strategi terarah, dan dampak konkret yang berhasil dicapai.</p>
<h2>Latar Belakang &amp; Konteks</h2>
<p>Paparkan situasi awal sebelum proyek dimulai: apa kondisi sistem, siapa pihak yang terlibat, dan apa target utama yang harus dicapai.</p>
<h2>Masalah &amp; Tantangan Kritis</h2>
<p>Uraikan friksi atau rintangan utama yang menghalangi pencapaian target. Apa konsekuensi yang terjadi jika masalah tersebut dibiarkan tanpa penanganan?</p>
<blockquote class="callout"><p>💡 Temuan Kunci: Sering kali tantangan terbesar bukan pada eksekusi teknis, melainkan ketidaksesuaian antara ekspektasi awal dengan realitas lapangan.</p></blockquote>
<h2>Strategi &amp; Solusi yang Diterapkan</h2>
<p>Jelaskan keputusan strategis yang diambil beserta pertimbangan di baliknya. Mengapa pendekatan ini dipilih dibandingkan alternatif lain?</p>
<ul>
  <li><p>Fase 1: Riset mendalam dan pemetaan titik kebocoran efisiensi</p></li>
  <li><p>Fase 2: Implementasi solusi bertahap dengan feedback loop cepat</p></li>
  <li><p>Fase 3: Pengujian ketahanan dan stabilisasi sistem pada kondisi beban riil</p></li>
</ul>
<h2>Hasil &amp; Dampak Terukur</h2>
<p>Sajikan bukti nyata dari efektivitas solusi yang diterapkan, baik berupa metrik kuantitatif (peningkatan kecepatan, penghematan waktu) maupun perubahan kualitatif.</p>
<h2>Pembelajaran Utama (Key Takeaways)</h2>
<p>Rangkum kesimpulan berharga yang dapat dipetik dari pengalaman ini dan diterapkan pada kasus serupa di masa mendatang.</p>
    `.trim(),
  },
];
