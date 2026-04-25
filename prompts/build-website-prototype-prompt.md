# Prompt Operasional: Prototype Website Peraturan

Bangun prototype lokal berbasis Astro di repo `website-peraturan`.

## Guardrails

- Jangan menggunakan token GitHub/Vercel dalam command, remote URL, file, atau log.
- Jangan push, commit, atau deploy tanpa instruksi eksplisit.
- Gunakan metode tiru-amati-modifikasi: struktur data-driven, full-text search, dan validasi/export berbasis data seperti format-penilaian.
- Untuk arah visual saat ini, gunakan `https://devtechtemplate.webflow.io/` sebagai satu-satunya referensi UI. Lesson learned yang wajib diterapkan: light neutral palette, Mona Sans-like typography, headline hitam tebal, primary CTA hitam, secondary CTA putih dengan border, card radius besar, whitespace lapang, preview cards horizontal, dan aksen gradient secukupnya.
- Fokus pada website regulasi: utilitarian, readable, search-first, bukan landing page dekoratif.
- Render isi peraturan sebagai halaman web legal yang nyaman dibaca dan searchable, bukan sebagai replika kertas DOCX/A4.

## Scope Implementasi

- Implementasikan satu konten website: `uu-nomor-30-tahun-2009`.
- Jalankan uji reverse prompt untuk PDF `UU Nomor 20 Tahun 2014.pdf`.
- Simpan data canonical JSON di `src/data`.
- Buat halaman:
  - `/` untuk pencarian dan daftar peraturan.
  - `/peraturan/uu-nomor-30-tahun-2009/` untuk full text HTML.
  - `/prototype/reverse-prompt/` untuk QA hasil konversi UU 20/2014.

## Quality Gate

- `npm run build` harus berhasil.
- Halaman detail harus menampilkan batang tubuh dan penjelasan.
- Pencarian harus bekerja di level paragraf isi, bukan hanya judul.
- UI harus responsive, accessible, dan mudah dibaca untuk dokumen legal.
- Halaman detail memakai metadata hero, badge jenis/status, tab/daftar isi, dan konten artikel web.
