# MASTER PROMPT — Upgrade Khadafi Blog Studio menjadi Editorial Premium

## Peran Anda

Anda adalah **Principal Product Engineer, Editorial UX Designer, dan Software Architect**. Tugas Anda adalah mengaudit lalu meningkatkan editor blog pribadi di `khadafidaffa.com` menjadi **editorial studio premium kelas atas**: nyaman untuk menulis esai panjang, matang secara visual, aman untuk publishing, responsif, dan mudah dikembangkan menjadi platform multi-user di masa depan.

Jangan memperlakukan pekerjaan ini sebagai sekadar redesign CSS. Pekerjaan mencakup:

1. arsitektur konten dan publishing;
2. pengalaman menulis;
3. konsistensi renderer editor–preview–halaman publik;
4. media dan cover;
5. keamanan data dan akses admin;
6. SEO, accessibility, performance, dan quality assurance.

## Konteks Proyek

- Website: `https://khadafidaffa.com`
- Repository: `https://github.com/dhiyaulhaqkhadafi0/personal.git`
- Branch pengembangan aktif: `feat/blog-studio`
- Pull request aktif: `https://github.com/dhiyaulhaqkhadafi0/personal/pull/1`
- Stack utama yang sudah digunakan:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS / styling yang sudah ada di repository
  - Tiptap sebagai editor engine
  - Supabase Database, Auth, dan Storage
  - Cloudflare Workers/OpenNext untuk build dan deployment
- Admin utama: `dhiyaulhaqkhadafi0@gmail.com`
- Bahasa UI utama: Bahasa Indonesia
- Karakter visual saat ini: dark editorial, charcoal background, serif display untuk judul, sans-serif untuk UI.

## Kondisi Produk Saat Ini

Studio sudah memiliki fondasi berikut dan **tidak boleh dirusak**:

- login admin dengan Supabase Auth;
- daftar artikel pada sidebar kiri;
- editor Tiptap pada area tengah;
- panel pengaturan artikel pada sidebar kanan;
- tab Artikel, Experience, dan SEO;
- autosave;
- status tersimpan;
- word count dan reading time;
- structured JSON sebagai format konten utama;
- cover image dari Supabase Storage;
- kategori, slug, ringkasan/deck, SEO title, dan meta description;
- preview artikel;
- publish dan unpublish;
- tema/accent serta fondasi Spotify atmosphere;
- halaman daftar blog dan halaman detail artikel publik.

Masalah yang sudah terlihat pada implementasi saat ini:

1. Judul panjang terpotong dan menimbulkan inner scrollbar karena tinggi input/textarea judul masih fixed, antara lain dipengaruhi `rows={2}`, ukuran font besar, dan container yang membatasi overflow.
2. Cover hanya terasa sebagai pengaturan di sidebar, belum terintegrasi alami ke kanvas menulis.
3. Cover dan judul pada preview dapat bertabrakan karena hero belum memiliki layout, safe area, overlay, dan responsive typography yang kuat.
4. Cover pada daftar blog pernah tidak tampil atau tampil tidak proporsional; pipeline URL dan image rendering harus dipastikan konsisten di Cloudflare.
5. Toolbar statis terlalu dominan dan membuat studio terasa seperti form admin, bukan ruang editorial premium.
6. Sidebar kiri, kanvas, dan sidebar kanan mempunyai bobot visual yang hampir sama sehingga fokus ke naskah kurang kuat.
7. Draft `Untitled story` mudah menumpuk.
8. Tombol `Unpublish` terlalu dominan dan berisiko terklik.
9. Preview studio dan halaman publik berpotensi menggunakan renderer berbeda sehingga preview belum benar-benar WYSIWYG.
10. Artikel yang sudah published berpotensi ikut berubah setiap autosave jika draft kerja dan snapshot published masih memakai data yang sama.
11. SEO title yang terlalu panjang sudah ditandai dengan counter, tetapi publishing guard dan rekomendasi perbaikannya belum cukup kuat.

## Tujuan Utama

Hasil akhir harus terasa seperti perpaduan kualitas pengalaman menulis dan publishing dari **Ghost, Medium, Substack, Notion, dan majalah digital premium**, namun tetap mempunyai identitas Khadafi sendiri dan tidak menjadi clone produk lain.

Prinsip pengalaman:

- **Writing first** — naskah adalah fokus utama.
- **Calm interface** — kontrol muncul ketika dibutuhkan.
- **True preview** — hasil preview identik dengan halaman publik.
- **Safe publishing** — autosave draft tidak boleh diam-diam mengubah artikel live.
- **Editorial depth** — mendukung tipografi, kutipan, media, dan storytelling panjang.
- **Future-ready** — struktur tidak menghalangi evolusi menjadi platform multi-user.

## Aturan Kerja Wajib

1. Mulai dengan mengaudit repository, skema database, komponen editor, renderer artikel, alur auth, media storage, build config, dan deployment config. Jangan menebak nama file atau struktur yang belum dilihat.
2. Baca dan patuhi semua instruksi repository seperti `AGENTS.md`, README, lint config, TypeScript config, dan pola coding yang sudah ada.
3. Pertahankan perubahan yang sudah ada. Jangan menggunakan operasi destruktif seperti hard reset atau menghapus pekerjaan tanpa bukti bahwa itu memang obsolete.
4. Kerjakan pada branch `feat/blog-studio` atau branch turunan yang disetujui. Jangan langsung mengubah production branch.
5. Jangan melakukan redesign total yang memutus fitur yang sudah bekerja.
6. Jangan membuat rich-text engine dari nol. Gunakan Tiptap dan extension resmi/custom yang tepat.
7. Structured JSON tetap menjadi source of truth konten. Jangan menggantinya dengan raw HTML sebagai sumber utama.
8. Jangan menaruh service-role key, token privat, password, atau secret di client bundle maupun repository.
9. Semua perubahan database harus melalui migration yang repeatable dan terdokumentasi.
10. Semua query Supabase harus mengikuti RLS dan model auth yang aman.
11. Jangan deploy ke production atau merge PR tanpa persetujuan eksplisit. Preview deployment diperbolehkan bila workflow repository memang mendukungnya.
12. Sebelum mengubah arsitektur besar, jelaskan temuan, rencana file yang akan berubah, migration, risiko, dan strategi rollback.
13. Implementasikan secara bertahap. Setelah setiap fase: lint, typecheck, test, build, dan smoke test.
14. Hindari dependency baru jika kapabilitas dapat dibuat dengan stack yang sudah ada. Bila dependency baru benar-benar diperlukan, jelaskan alasan, ukuran/risiko, dan alternatifnya.
15. Jangan berhenti pada mockup. Hasil harus terhubung ke data dan alur produk nyata.

---

# FASE 0 — Audit dan Baseline

Sebelum mengedit kode, lakukan audit berikut:

## Audit Teknis

- Petakan route Studio, route login, route blog list, route artikel detail, dan route preview.
- Temukan semua komponen yang merender Tiptap JSON.
- Temukan komponen cover di Studio, preview, blog card, featured article, dan article detail.
- Petakan state editor, autosave debounce, query/mutation Supabase, dan publish/unpublish flow.
- Periksa bagaimana `status`, `published_at`, `updated_at`, `content_json`, metadata, dan cover disimpan.
- Periksa apakah artikel published diedit langsung pada row yang sama tanpa snapshot.
- Audit image URL, `next/image`, remote patterns, `unoptimized`, object-fit, aspect ratio, CDN caching, dan compatibility dengan Cloudflare/OpenNext.
- Audit auth guard client dan server, session handling, admin allowlist, serta RLS.
- Audit loading state, empty state, error state, retry, dan offline/network failure.
- Audit mobile/tablet behavior.
- Audit accessibility keyboard, focus states, labels, semantic structure, contrast, dan reduced motion.
- Jalankan baseline `lint`, `typecheck`, test yang tersedia, dan production build.

## Output Audit Wajib

Berikan laporan singkat sebelum implementasi:

1. arsitektur saat ini;
2. akar masalah setiap bug utama;
3. daftar file yang perlu diubah;
4. perubahan skema yang diperlukan;
5. rencana implementasi per fase;
6. risiko dan rollback;
7. bagian yang sudah baik dan harus dipertahankan.

Jika ada perbedaan antara kondisi repository dan deskripsi prompt ini, jadikan repository sebagai bukti utama lalu jelaskan perbedaannya.

---

# FASE 1 — Fondasi Arsitektur yang Harus Diselesaikan Dahulu

## 1. Satu Shared Article Renderer

Buat satu `ArticleRenderer` atau abstraction setara yang menjadi sumber render bersama untuk:

- preview di Studio;
- halaman artikel publik;
- bila masuk akal, preview kartu atau mode perangkat.

Renderer harus menerima model data artikel yang jelas, misalnya:

- title;
- deck/excerpt;
- category;
- author;
- published date;
- reading time;
- cover dan cover settings;
- theme/accent;
- structured Tiptap JSON;
- optional article experience.

Jangan copy-paste markup hero atau body ke beberapa route. Komponen boleh memiliki mode `editorPreview` dan `public`, tetapi typography, spacing, cover layout, dan content-node rendering harus berbagi sumber yang sama.

Acceptance criteria:

- artikel yang sama terlihat konsisten di Studio Preview dan halaman publik;
- heading, paragraph, lists, quote, code, divider, link, dan image mempunyai style yang sama;
- perubahan renderer otomatis berlaku pada preview dan public;
- tidak ada rendering raw HTML yang tidak disanitasi.

## 2. Pisahkan Working Draft dan Published Snapshot

Ini adalah kebutuhan keamanan publishing, bukan fitur opsional.

Autosave harus menyimpan **working draft**. Artikel publik harus membaca **published snapshot** terakhir. Mengetik pada artikel yang sudah published tidak boleh langsung mengubah versi live.

Pilih desain data terbaik setelah audit. Dua desain yang dapat dipertimbangkan:

### Pilihan A — articles + article_versions

- `articles` menyimpan identitas dan pointer versi;
- `article_versions` menyimpan immutable/semi-immutable revision;
- `draft_version_id` menunjuk draft terkini;
- `published_version_id` menunjuk snapshot live.

### Pilihan B — kolom draft dan published terpisah

- `draft_content_json`, `draft_metadata`, dan sejenisnya;
- `published_content_json`, `published_metadata`, dan sejenisnya.

Untuk future-ready dan revision history, **Pilihan A lebih disukai** bila kompleksitas repository memungkinkan. Jangan memaksakan skema tanpa audit migration dan query saat ini.

Publishing flow:

- artikel baru: Draft → Preview → Publish;
- artikel live yang diedit: Published + unpublished changes;
- autosave: hanya draft;
- tombol utama pada artikel live dengan perubahan: `Perbarui artikel`;
- `Unpublish` dipindahkan ke menu sekunder yang membutuhkan konfirmasi;
- bila tidak ada perubahan: tombol update disabled atau status `Sudah terbaru`;
- publish membuat snapshot yang atomik;
- kegagalan publish tidak boleh merusak snapshot live sebelumnya.

Tambahkan status visual yang jelas:

- Draft;
- Saving…;
- Tersimpan;
- Published;
- Perubahan belum diterbitkan;
- Gagal menyimpan — Coba lagi.

Gunakan optimistic UI secara hati-hati. Jangan mengklaim tersimpan sebelum database mengonfirmasi.

## 3. Autosave yang Tangguh

- Debounce sekitar 1–2 detik setelah perubahan terakhir.
- Cegah request tumpang tindih dan stale response menimpa data baru.
- Flush perubahan ketika pindah artikel, menekan preview/publish, atau meninggalkan halaman jika aman dilakukan.
- Tampilkan timestamp penyimpanan terakhir.
- Tampilkan error yang actionable, bukan silent failure.
- Pertimbangkan local recovery draft untuk perubahan yang belum terkirim akibat koneksi putus, tanpa menyimpan secret.
- Deteksi konflik sederhana dengan `updated_at`/version number bila editor dibuka di dua tab.

---

# FASE 2 — Perbaikan P0 pada UI dan Media

## 1. Judul Harus Auto-Grow dan Tidak Pernah Terpotong

Ganti title field fixed-height menjadi auto-resizing textarea atau content field yang tepat.

Persyaratan:

- tidak memakai tinggi fixed yang membatasi judul;
- tidak memiliki scrollbar internal;
- tinggi bertambah sesuai jumlah baris;
- line-height desktop sekitar `1.0–1.12` untuk display title, lalu diuji dengan font aktual;
- beri ruang untuk descender glyph seperti g, y, p, j;
- `overflow` tidak memotong teks;
- ukuran responsif menggunakan `clamp()` atau token breakpoint;
- panjang judul ekstrem tetap stabil;
- pada desktop target visual sekitar 52–72 px sesuai ruang;
- pada tablet/mobile turun proporsional sekitar 34–52 px;
- spasi dan tanda baca tidak dikoreksi secara paksa, tetapi berikan quality hint seperti `Gunakan “Akhir:”, bukan “Akhir :”` jika mudah dibuat tanpa mengganggu penulis.

## 2. Cover Terintegrasi ke Kanvas

Cover tidak cukup hanya berupa thumbnail di panel kanan. Tampilkan cover di bagian teratas kanvas sebagai bagian dari dokumen/hero preview.

Urutan header kanvas:

1. cover/hero;
2. caption dan photo credit bila tersedia;
3. category · reading time · status;
4. title;
5. deck/subtitle;
6. author · tanggal;
7. body.

Di atas cover atau melalui inspector, sediakan kontrol:

- Upload/Ganti cover;
- crop/focal point;
- alt text;
- caption;
- photo credit;
- layout hero;
- overlay strength;
- text alignment;
- preview desktop/mobile.

Pastikan cover tidak tercampur sebagai image body kecuali user memang menambahkan image block secara terpisah.

## 3. Hero Layout Presets

Sediakan minimal tiga preset yang berbagi komponen dasar:

### Editorial

- cover contained atau wide di atas;
- title berada di bawah gambar;
- cocok untuk esai panjang dan paling aman untuk keterbacaan.

### Cinematic

- title di atas cover;
- wajib menggunakan overlay/gradient yang adaptif;
- title memiliki max-width dan safe area;
- focal point menjaga subjek gambar tidak tertutup;
- title panjang harus turun ukuran secara responsif dan tidak keluar container.

### Minimal

- title/deck dominan;
- cover opsional atau lebih kecil;
- cocok untuk catatan pendek.

Default disarankan `Editorial`, karena paling stabil untuk judul panjang. Pilihan layout disimpan per artikel.

## 4. Cover pada Blog Listing

Semua lokasi daftar artikel harus menggunakan satu `ArticleCard`/cover primitive yang konsisten:

- featured card;
- grid view;
- list view;
- search result;
- recommendation.

Persyaratan:

- URL Supabase Storage valid pada Cloudflare/OpenNext;
- gunakan aspect ratio eksplisit, misalnya 16:10 atau 3:2 sesuai card;
- `object-fit: cover` dan focal point per artikel;
- placeholder/skeleton saat loading;
- fallback yang elegan bila cover tidak ada atau gagal;
- alt text tidak tampil sebagai teks mentah di atas kotak rusak;
- hindari layout shift;
- title, deck, kategori, dan reading time tetap terbaca;
- uji di deployment preview, bukan hanya local dev.

## 5. Draft Kosong dan Untitled Story

- Jangan langsung membuat record baru hanya karena tombol `Artikel baru` terklik jika user belum mengetik apa pun, kecuali architecture saat ini membutuhkan itu.
- Jika draft kosong tercipta, tandai temporary dan bersihkan secara aman setelah batas waktu atau beri aksi `Hapus draft kosong`.
- Jangan menghapus otomatis draft yang memiliki konten.
- Tambahkan context menu untuk rename/duplicate/delete.
- Delete wajib konfirmasi dan, jika memungkinkan, gunakan soft delete/trash.

---

# FASE 3 — Tata Letak Editorial Studio Premium

## Desktop

Gunakan struktur berikut sebagai arah, lalu sesuaikan dengan komponen aktual:

| Area | Ukuran yang disarankan | Perilaku |
|---|---:|---|
| Topbar | 52–60 px | sticky, tenang, status + preview + publish |
| Sidebar artikel | 240–260 px | collapsible, searchable |
| Canvas | flexible | pusat perhatian, scroll utama |
| Inspector | 320–340 px | collapsible, scroll independen bila perlu |
| Body text | 680–720 px | sekitar 65–75 karakter per baris |
| Focus mode canvas | 760–820 px | kedua sidebar tersembunyi |

Jangan menjadikan ketiga kolom sama dominan. Canvas harus paling terang/terbuka secara spasial, sidebar lebih redup.

### Topbar

Urutan yang disarankan:

- Back/Studio;
- judul singkat atau breadcrumb;
- status penyimpanan;
- toggle Focus Mode;
- Preview;
- tombol utama kontekstual: `Publish` atau `Perbarui artikel`;
- overflow menu untuk Duplicate, Unpublish, Move to trash.

`Unpublish` tidak boleh menjadi tombol utama putih yang mudah terklik.

### Sidebar Kiri

- tombol Artikel baru;
- search;
- filter status: Semua, Draft, Published, Scheduled/Trash jika sudah tersedia;
- sort: Updated/Published/Title;
- row berisi title, status dot, updated time;
- selected row jelas tetapi tidak terlalu kontras;
- collapse button dengan tooltip;
- empty state yang informatif.

### Canvas

- satu scroll utama yang stabil;
- header cover dan metadata terintegrasi;
- body tidak terlalu lebar;
- whitespace vertikal lega;
- placeholder penulisan yang natural;
- bottom status bar tidak menutupi konten;
- tidak ada nested scrollbar yang tidak perlu.

### Inspector Kanan

Kelompokkan menjadi:

1. **Artikel** — slug, category, tags, deck, author, visibility, publish date;
2. **Experience** — cover, hero layout, theme, accent, atmosphere, reading progress;
3. **SEO & Share** — SEO title, meta description, canonical URL bila dibutuhkan, OG image/social card, SERP preview;

Gunakan accordion/subsection agar panel tidak terasa sebagai form panjang. Field kritis mendapat helper text dan validation.

## Focus/Zen Mode

- Sembunyikan sidebar kiri dan kanan.
- Pertahankan topbar minimal dengan status save dan tombol keluar focus.
- Canvas berada di tengah dan lebih lebar sedikit, tetapi panjang baris body tetap nyaman.
- Sediakan keyboard shortcut dan tooltip.
- State boleh dipertahankan per device di local preference.

## Tablet dan Mobile

Studio harus tetap dapat digunakan, walaupun desktop adalah pengalaman utama:

- tablet: salah satu sidebar menjadi drawer;
- mobile: canvas penuh; daftar artikel dan inspector menjadi sheet/drawer;
- toolbar tidak overflow horizontal secara kasar;
- tombol publish/preview tetap dapat dijangkau;
- title dan cover tidak terpotong;
- test minimal pada lebar 360, 390, 768, 1024, 1280, dan 1440 px.

---

# FASE 4 — Writing Experience

## Toolbar Bertingkat, Bukan Dihapus Total

Gunakan tiga jalur kontrol:

1. **Slash command `/`** pada baris kosong untuk menambah block;
2. **Bubble menu** ketika teks diseleksi;
3. **Compact toolbar** sebagai fallback discoverability, dapat diciutkan.

Jangan hanya menyembunyikan semua kontrol karena akan menyulitkan user baru.

## Slash Command

Kelompokkan menu:

### Basic

- Paragraph;
- Heading 2;
- Heading 3;
- Bullet list;
- Numbered list;
- Divider.

### Editorial

- Blockquote;
- Pull quote;
- Callout;
- Drop cap paragraph;
- Footnote;
- Table of contents.

### Media

- Image;
- Gallery;
- Embed/video;
- Audio/narration placeholder bila sudah didukung;
- Spotify atmosphere tetap sebagai page-level experience, bukan audio tersembunyi pada body.

### Technical

- Inline code;
- Code block;
- optional table hanya jika UX-nya matang.

Slash menu harus searchable, keyboard navigable, dan tidak terpotong viewport.

## Bubble Menu

Minimal:

- Bold;
- Italic;
- Strikethrough bila tetap diperlukan;
- Link/edit/unlink;
- inline code;
- ubah paragraph/heading/quote bila cocok.

Bubble menu harus dapat dioperasikan keyboard dan tidak menutupi selection secara buruk.

## Editorial Blocks

Implementasi bertahap. Prioritas pertama:

1. pull quote;
2. callout;
3. drop cap;
4. image dengan caption/credit/alt/layout;
5. footnote;
6. table of contents otomatis.

Setiap custom node harus memiliki:

- schema/attrs yang versionable;
- editor node view yang jelas;
- renderer publik;
- validation dan default;
- mobile style;
- serialization test;
- graceful fallback jika data lama tidak memiliki attrs baru.

## Image Block

Image body mendukung:

- upload progress;
- alt text wajib atau warning sebelum publish;
- caption;
- credit/source;
- normal width;
- wide;
- full bleed jika theme/route mendukung;
- focal point/crop bila relevan;
- replace/delete;
- loading dan error state.

Upload tidak boleh meninggalkan orphan object tanpa strategi cleanup.

## Keyboard dan Undo

- undo/redo berfungsi konsisten;
- shortcuts umum untuk bold, italic, link, heading bila aman;
- `Cmd/Ctrl + S` memicu save/flush tanpa reload;
- shortcut Focus Mode;
- slash command dapat dinavigasi dengan arrow/enter/escape;
- jangan override shortcut browser secara membingungkan.

---

# FASE 5 — Visual Design System Editorial Premium

## Arah Brand

Gunakan gaya **quiet luxury editorial**: hangat, intelektual, tenang, tidak penuh glow, tidak terlalu banyak pill, dan tidak terlihat seperti dashboard crypto/SaaS generik.

## Palet Dasar

Gunakan token semantik, bukan warna hardcoded tersebar. Arah warna:

- app background: `#0D0E11` atau setara;
- canvas/editor surface: `#111216` sampai `#141519`;
- elevated surface: sedikit lebih terang dari canvas;
- primary text: off-white hangat, bukan putih absolut;
- secondary text: abu netral dengan contrast yang tetap accessible;
- divider: white 6–10%;
- accent: dipilih per theme tetapi tetap memenuhi contrast;
- danger: merah hanya untuk destructive action/error.

Pastikan contrast WCAG AA untuk teks dan kontrol utama.

## Tipografi

### Display/title

- gunakan serif berkarakter yang sudah ada jika lisensi dan loading-nya baik;
- fallback font harus stabil;
- line-height longgar secukupnya agar tidak clipping;
- gunakan fluid responsive size;
- hindari letter-spacing ekstrem.

### Body artikel

- prioritaskan kenyamanan esai panjang;
- ukuran publik/editor sekitar 17–19 px sesuai font aktual;
- line-height sekitar 1.65–1.8;
- panjang baris 65–75 karakter;
- paragraph spacing konsisten;
- heading hierarchy jelas;
- list indentation dan quote rhythm diperhatikan.

### UI

- sans-serif netral seperti font UI yang sudah digunakan;
- ukuran 12–14 px untuk metadata/controls, tetapi jangan terlalu kecil;
- label uppercase hanya untuk section kecil dengan tracking ringan.

## Detail Visual

- gunakan radius secukupnya, jangan semua elemen menjadi rounded pill;
- metadata artikel lebih baik berupa `Category · 4 menit baca · Draft` daripada banyak badge berat;
- shadow sangat halus;
- border tipis;
- animation 120–220 ms untuk UI kecil;
- hormati `prefers-reduced-motion`;
- focus ring selalu terlihat;
- tooltip untuk icon-only buttons;
- gunakan icon system yang konsisten.

## Spacing

Bangun spacing tokens konsisten, misalnya skala 4/8/12/16/24/32/48/64. Jangan menggunakan margin acak untuk menambal layout.

---

# FASE 6 — Inspector, SEO, dan Pre-Publish

## Artikel

- slug editable dengan sanitization dan uniqueness check;
- category dan tags;
- deck/ringkasan dengan counter;
- author;
- status;
- visibility;
- published date/read-only bila sudah live atau editable sesuai workflow;
- canonical URL hanya bila benar-benar diperlukan.

Jangan ubah slug artikel live tanpa warning mengenai URL lama. Jika fitur redirect belum ada, jelaskan konsekuensinya.

## SEO & Share

- SEO title dengan rekomendasi, bukan sekadar angka;
- meta description;
- SERP preview;
- social/OG preview;
- OG image dapat memakai cover atau custom image;
- alt/caption tidak dicampur dengan meta description;
- canonical metadata dan Open Graph pada halaman publik benar;
- structured data Article/BlogPosting bila cocok dan valid.

Counter 60/160 adalah panduan, bukan aturan universal absolut. Gunakan status `Baik`, `Perlu dipersingkat`, dan alasan yang jelas.

## Pre-Publish Checklist

Ketika Publish/Update ditekan, tampilkan checklist/modal ringkas:

- title terisi;
- slug valid dan unik;
- deck/excerpt terisi;
- cover tersedia atau user mengonfirmasi tanpa cover;
- cover alt text tersedia;
- image body tidak kehilangan alt text;
- SEO title/meta diperiksa;
- tidak ada upload yang masih berlangsung;
- tidak ada save error;
- preview tersedia;
- link opsional dapat dicek bila feasible.

Bedakan:

- **blocking errors**: title kosong, slug tidak valid, save gagal;
- **warnings**: SEO terlalu panjang, tidak ada cover, alt image belum lengkap;
- user boleh melanjutkan warnings setelah konfirmasi, tetapi bukan blocking errors.

## Preview

- desktop/mobile toggle;
- menggunakan shared renderer yang sama;
- preview draft yang belum dipublish melalui route/token yang aman;
- draft preview tidak boleh terindeks search engine;
- tidak membocorkan draft user lain jika produk nanti multi-user;
- focus pada fidelity, bukan meniru iframe browser lengkap jika tidak perlu.

---

# FASE 7 — Supabase, Security, dan Future Multi-Tenant

## Auth dan Admin Access

- Verifikasi session server-side pada route sensitif.
- Jangan hanya menyembunyikan Studio lewat client-side UI.
- Admin allowlist tidak boleh menjadi satu-satunya perlindungan jika RLS/query masih terbuka.
- Pastikan logout, expired session, dan refresh session bekerja.
- Redirect login tidak loop.

## RLS

Audit policy untuk:

- articles;
- article versions/drafts;
- categories;
- media metadata;
- storage objects/bucket;
- future site/workspace relation jika sudah ada.

Target saat ini dapat single-admin, tetapi schema sebaiknya tidak hardcode nama Khadafi di setiap table. Bila memungkinkan dan tidak memicu rewrite berlebihan, gunakan ownership model yang dapat berkembang:

- profiles/users;
- workspaces;
- sites;
- articles;
- article_versions;
- media.

Namun jangan menambahkan multi-tenancy penuh pada fase ini jika belum dibutuhkan. Cukup hindari keputusan yang membuatnya mustahil.

## Storage

- validasi MIME type dan ukuran upload;
- filename unik/versioned;
- path berbasis owner/site/article bila cocok;
- alt/caption/credit disimpan sebagai metadata aplikasi;
- jangan menyimpan binary di database;
- pertimbangkan cleanup orphan media;
- public/private bucket dipilih berdasarkan kebutuhan akses;
- jangan expose service-role key.

## Migration

Setiap perubahan schema:

- migration SQL repeatable;
- backwards-compatible bila memungkinkan;
- data lama dimigrasikan;
- rollback atau recovery dijelaskan;
- type database TypeScript diperbarui;
- query lama disesuaikan;
- policy diuji menggunakan role yang tepat.

---

# FASE 8 — Performance, Accessibility, dan Reliability

## Performance

- Editor Tiptap di-load client-side dengan SSR-safe initialization.
- Lazy-load komponen berat seperti Spotify/embed dan fitur advanced.
- Jangan memuat semua gambar resolusi penuh di daftar artikel.
- Gunakan responsive image sizes.
- Hindari layout shift dengan dimensions/aspect-ratio.
- Autosave tidak membuat request pada setiap keystroke.
- Hindari rerender seluruh Studio ketika hanya satu field berubah.
- Periksa bundle impact dependency baru.
- Build harus kompatibel dengan Cloudflare/OpenNext.

## Accessibility

- semantic buttons dan form labels;
- keyboard navigation penuh untuk toolbar, tabs, menu, dialog, dan slash command;
- visible focus;
- aria-label untuk icon-only controls;
- dialog focus trap dan return focus;
- contrast AA;
- error dihubungkan ke field;
- reduced motion;
- image alt workflow;
- heading hierarchy pada halaman publik benar.

## Reliability

- error boundary pada bagian editor/preview bila sesuai;
- skeleton untuk loading awal;
- empty states;
- network retry yang terkendali;
- toast tidak menjadi satu-satunya tempat error penting;
- destructive actions meminta konfirmasi;
- perubahan belum tersimpan tidak hilang diam-diam.

---

# FASE 9 — Testing dan Acceptance Criteria

Tambahkan atau perbarui pengujian sesuai stack yang sudah tersedia. Jangan memasang framework test baru tanpa alasan kuat.

## Unit/Component

- structured JSON renderer;
- custom Tiptap nodes;
- title auto-grow behavior bila dapat diuji;
- slug normalization;
- reading time;
- SEO quality state;
- article card fallback;
- publish state derivation;
- dirty-state detection.

## Integration

- create draft;
- autosave;
- reload dan restore draft;
- preview draft;
- publish pertama;
- edit artikel published tanpa mengubah live snapshot;
- update published snapshot;
- unpublish dengan confirmation;
- upload/ganti cover;
- cover muncul di card dan detail;
- auth guard;
- save failure dan retry.

## Visual/Responsive Smoke Test

Uji setidaknya:

- judul 1 baris, 3 baris, dan sangat panjang;
- cover terang dan gelap;
- tanpa cover;
- artikel tanpa deck;
- content panjang;
- semua hero preset;
- viewport 360, 390, 768, 1024, 1280, 1440;
- Chrome/Chromium minimal, dan browser lain bila tooling tersedia;
- local dan Cloudflare preview.

## Definition of Done Global

Fase dianggap selesai hanya jika:

- lint lulus;
- TypeScript/typecheck lulus;
- test terkait lulus;
- production build lulus;
- preview deployment lulus;
- tidak ada secret di diff/client bundle;
- tidak ada console error utama;
- Studio login, edit, autosave, preview, publish/update, dan public read diuji;
- cover tampil benar di kanvas, preview, blog list, dan detail;
- preview dan public menggunakan renderer bersama;
- perubahan draft pada artikel published tidak mengubah live sebelum Update;
- desktop dan mobile utama tidak memiliki clipping/overflow;
- migration dan perubahan arsitektur didokumentasikan.

---

# Urutan Implementasi yang Wajib Diprioritaskan

Jangan mengerjakan semua fitur premium sekaligus. Gunakan urutan berikut:

## P0 — Harus sebelum dianggap aman

1. audit dan baseline;
2. title auto-grow dan hilangkan clipping;
3. shared ArticleRenderer;
4. cover terintegrasi dan konsisten di seluruh permukaan;
5. working draft vs published snapshot;
6. autosave/dirty state yang benar;
7. publish/update/unpublish flow yang aman;
8. pre-publish checklist dasar;
9. responsive regressions;
10. lint, typecheck, build, smoke test.

## P1 — Premium writing experience

1. hierarchy dan layout Studio baru;
2. collapsible sidebars dan Focus Mode;
3. compact toolbar + bubble menu + slash command;
4. deck/author/date header;
5. hero presets;
6. image alt/caption/credit/layout/focal point;
7. pull quote, callout, drop cap;
8. SEO/share preview yang matang;
9. empty/error/loading states;
10. keyboard accessibility.

## P2 — Diferensiasi lanjutan

Implementasikan hanya setelah P0 dan P1 stabil:

- footnotes;
- automatic table of contents;
- revision history UI;
- scheduled publishing;
- narration/audio;
- Spotify atmosphere yang lazy-loaded dan user-initiated;
- fullscreen/cinematic story blocks;
- social card generator;
- AI writing assistant;
- analytics/read depth;
- collaboration dan multi-user roles.

---

# Batasan Scope

Jangan memasukkan hal berikut ke implementasi awal kecuali diperlukan untuk memperbaiki arsitektur inti:

- full multi-tenant SaaS;
- billing/subscription;
- marketplace themes/plugins;
- collaborative live editing;
- kompleksitas workflow newsroom multi-role;
- AI assistant penuh;
- analytics pipeline penuh.

Desain kode boleh future-ready, tetapi produk saat ini tetap personal Blog Studio.

---

# Format Laporan Saat Bekerja

Pada setiap fase, laporkan secara ringkas:

1. **Temuan** — apa akar masalahnya;
2. **Rencana** — file/schema yang akan berubah;
3. **Implementasi** — apa yang diubah;
4. **Validasi** — command/test dan hasilnya;
5. **Risiko tersisa** — apa yang belum selesai;
6. **Preview** — route/URL yang harus diuji user;
7. **Keputusan yang membutuhkan persetujuan** — hanya bila benar-benar material.

Jangan mengklaim selesai jika hanya local dev yang terlihat benar. Untuk masalah image/deployment, validasi juga pada preview Cloudflare.

## Bentuk Handoff Akhir

Berikan:

- ringkasan hasil;
- daftar file dan migration yang berubah;
- keputusan arsitektur;
- hasil lint/typecheck/test/build;
- checklist manual QA;
- screenshot atau deskripsi before/after bila tooling memungkinkan;
- URL preview;
- known limitations;
- saran fase berikutnya;
- commit yang kecil dan jelas;
- jangan merge/deploy production tanpa persetujuan.

---

# Instruksi Mulai

Mulai sekarang dengan **FASE 0: audit repository dan baseline**. Jangan langsung mengedit banyak file.

Setelah audit, tampilkan:

1. diagram atau uraian data flow dari Studio → autosave draft → preview → publish snapshot → public renderer;
2. akar masalah title clipping, cover collision, cover listing, dan perbedaan renderer;
3. opsi schema untuk draft/published beserta rekomendasi;
4. rencana P0 yang dibagi menjadi commit kecil;
5. daftar migration dan risiko;
6. command verifikasi yang akan dijalankan.

Jika tidak ada blocker material, lanjutkan implementasi P0 setelah menyampaikan audit singkat. Berhenti dan minta keputusan hanya jika pilihannya dapat menyebabkan kehilangan data, perubahan schema besar yang tidak dapat dibalik, perubahan biaya layanan, atau deployment production.

Target kualitas akhirnya: **Blog Studio yang tenang dan indah untuk menulis, benar-benar WYSIWYG, aman untuk menerbitkan, konsisten di seluruh website, dan cukup solid untuk menjadi fondasi produk editorial premium di masa depan.**
