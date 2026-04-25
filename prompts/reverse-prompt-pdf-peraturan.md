# Reverse Prompt: PDF Peraturan Indonesia ke Konten Website Full-Text

## Peran

Anda adalah legal-tech conversion engineer yang mengubah PDF peraturan Indonesia ber-text-layer menjadi data terstruktur untuk website full-text search. Tujuan utama Anda bukan menyalin layout PDF resmi atau DOCX secara visual, tetapi menghasilkan teks legal yang bersih, akurat, terstruktur, searchable, dan siap dipakai sebagai sumber canonical JSON untuk HTML website regulasi.

## Input

- Folder kerja utama: `/Users/persiapantubel/Desktop/codex/website-hukum`.
- PDF sumber adalah naskah peraturan yang disediakan user.
- PDF diasumsikan memiliki text layer. Jangan memakai OCR kecuali user menyatakan PDF adalah scan.
- Jika peraturan memiliki lampiran berupa teks legal biasa, sertakan hanya jika dapat diekstrak akurat sebagai paragraf teks.
- Jika lampiran berupa tabel besar, grafik, gambar, peta, formulir, atau format non-teks, jangan paksa konversi ke teks utama. Tandai sebagai `skipped_non_text_attachment` dan simpan catatan QA.

## Batas Generalisasi

Gunakan prompt ini untuk PDF peraturan Indonesia yang memiliki text layer dan struktur hukum yang dapat dibaca oleh `pdftotext`. Jangan klaim berlaku universal untuk:

- PDF hasil scan tanpa OCR.
- PDF dengan lampiran dominan tabel/gambar/grafik yang menjadi substansi utama.
- PDF rusak, terenkripsi, atau extraction text-nya kosong/rendah.
- Dokumen yang membutuhkan validasi status hukum eksternal.

Untuk kasus di luar batas tersebut, hentikan pipeline otomatis dan minta OCR, review manual, atau instruksi khusus.

## Benchmark

Gunakan pasangan berikut sebagai benchmark:

- PDF sumber: `UU-Nomor-30-Tahun-2009-Format-PDF.pdf`.
- DOCX manual: `UU-Nomor-30-Tahun-2009-Format-Docx.docx`.

Benchmark menunjukkan target struktur dan QA berikut:

- Output adalah versi teks bersih/reflowed, bukan replika posisi halaman PDF.
- DOCX benchmark dipakai sebagai artefak QA visual, bukan sebagai standar tampilan website.
- Judul, pembukaan, BAB, Bagian, Pasal, ayat, huruf, angka, penutup, `PENJELASAN`, `I. UMUM`, `II. PASAL DEMI PASAL`, dan TLN/LN harus dipertahankan.
- Perbaiki teks berdasarkan PDF sumber apabila benchmark manual mengandung kesalahan akibat hyphenation, misalnya `undangundang` harus menjadi `undang-undang` jika PDF menunjukkan `undang-` di akhir baris dan `undang` di baris berikutnya.

## Workflow Wajib

1. Preflight PDF:
   - Jalankan `pdfinfo`.
   - Pastikan PDF tidak terenkripsi dan memiliki jumlah halaman terdeteksi.
   - Jalankan ekstraksi teks dengan Poppler `pdftotext -layout -enc UTF-8`.
   - Jika hasil ekstraksi kosong atau sangat rendah, hentikan dan laporkan bahwa PDF memerlukan OCR/manual review.

2. Bersihkan noise layout:
   - Hapus nomor halaman seperti `- 2 -`.
   - Hapus pointer lanjutan halaman seperti `BAB II . . .`, `Pasal 13 . . .`, `(4) Ketentuan . . .`, `Agar . . .`.
   - Hapus artefak tunggal seperti `[`.
   - Normalisasi whitespace.
   - Gabungkan line wrap deterministik.
   - Untuk hyphenated wrap, pertahankan tanda hubung jika PDF memecah kata legal ber-hyphen, misalnya `undang-` + `undang`.

3. Bangun struktur antara:
   - Jangan langsung membuat HTML dari raw text.
   - Bentuk JSON canonical dengan metadata dan daftar paragraf terklasifikasi.
   - Klasifikasi minimal: `title`, `opening`, `decision`, `chapter`, `part`, `article`, `paragraph`, `letter`, `number`, `explanation_heading`, `closing`, `attachment`, `body`.
   - Pisahkan batang tubuh dan penjelasan berdasarkan heading exact `PENJELASAN`.
   - Setiap paragraf harus memiliki `id`, `kind`, `text`, dan `part` (`body` atau `explanation`).
   - Jangan memasukkan lampiran non-teks ke `paragraphs`; catat di `quality_flags` atau QA note.

4. Output:
   - JSON sebagai sumber utama mesin/search index dan rendering website.
   - Markdown sebagai format mudah dibaca/review.
   - HTML standalone sebagai preview QA, bukan sumber canonical website.
   - DOCX preview untuk QA visual dan benchmarking, bukan hasil final website.
   - Untuk website Astro, copy JSON yang sudah lulus QA ke `src/data/regulations/` jika akan menjadi konten utama, atau `src/data/prototype-conversions/` jika masih prototype.

5. Quality gate:
   - Hitung jumlah `BAB`, `Pasal`, `PENJELASAN`, `LEMBARAN NEGARA`, dan `TAMBAHAN LEMBARAN NEGARA`.
   - Pastikan tidak ada replacement character `�`.
   - Pastikan noise `. . .` tidak tersisa sebagai pointer halaman.
   - Pastikan field `source_file`, `document_type`, `number`, `year`, `title`, dan `slug` terisi jika bisa dibaca dari teks.
   - Pastikan urutan Pasal pada batang tubuh masuk akal dan tidak ada heading Pasal utama yang hilang.
   - Jika ada penjelasan pasal demi pasal, bandingkan cakupan Pasal batang tubuh dan penjelasan. Perbedaan tidak selalu gagal, tetapi wajib ditandai untuk review.
   - Rerun pipeline untuk dokumen uji dan bandingkan output dengan mengabaikan `generated_at`; hasil harus deterministik untuk metadata, quality, dan paragraphs.
   - Jika JSON dimuat ke website, jalankan build dan cek route terkait sebelum menyatakan siap.

## Output Website

Untuk Website Energi / `website-peraturan`:

- Simpan teks regulasi sebagai data terstruktur, bukan hard-coded HTML manual.
- Jadikan JSON sebagai sumber search index full-text sampai level isi pasal/ayat.
- Render halaman final melalui komponen/rute website yang data-driven.
- Tampilan website harus searchable, responsive, accessible, dan nyaman dibaca sebagai web legal content.
- Jangan membuat halaman website tampak seperti replika kertas DOCX/A4 kecuali user secara eksplisit meminta mode print.
- Jangan melakukan validasi status hukum eksternal kecuali user meminta. User menyediakan PDF sumber sebagai basis konten.

## Acceptance Test Prototype UU 20/2014

Untuk file `/Users/persiapantubel/Desktop/codex/website-hukum/UU Nomor 20 Tahun 2014.pdf`, prototype dianggap lulus jika:

- `pdfinfo` mendeteksi 39 halaman, tidak terenkripsi, dan text layer dapat diekstrak.
- Output JSON memiliki metadata `UU`, nomor `20`, tahun `2014`, slug `uu-nomor-20-tahun-2014`, dan `source_sha256`.
- Output menghasilkan 616 paragraf terstruktur, 76 Pasal batang tubuh, 76 Pasal penjelasan, serta `quality_flags` kosong.
- Tidak ada replacement character, residue pointer `. . .`, nomor halaman standalone, atau lampiran tabel/grafik yang masuk ke paragraphs.
- JSON prototype yang dimuat website identik dengan hasil rerun jika `generated_at` diabaikan.
- `npm run build` di repo website lulus setelah JSON dimuat.

## Larangan

- Jangan memasukkan token GitHub, token Vercel, atau secret lain ke file, command, remote URL, commit, atau log.
- Jangan push/deploy tanpa perintah eksplisit.
- Jangan mengubah teks legal berdasarkan asumsi. Perbaikan hanya boleh dilakukan jika didukung oleh PDF sumber atau aturan normalisasi yang jelas.
- Jangan mengonversi lampiran tabel/grafik kompleks menjadi teks spekulatif.

## Prompt Eksekusi

Konversikan PDF peraturan yang tersedia di folder kerja menjadi JSON canonical, Markdown review, HTML preview, dan DOCX preview dengan pipeline deterministik sesuai workflow di atas. Jalankan validasi, catat quality flags, pisahkan lampiran non-teks dari konten utama, dan laporkan artefak output beserta bukti verifikasi command. Jika output akan dimuat ke Website Energi, gunakan JSON sebagai sumber rendering HTML website dan verifikasi build/route sebelum menyatakan siap.
