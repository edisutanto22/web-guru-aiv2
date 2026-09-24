# WEB GURU AI V2

Aplikasi administrasi guru berbasis HTML, CSS, dan JavaScript yang siap dipublikasikan melalui GitHub Pages.

## Fitur V2
- Dashboard dan statistik
- Data siswa: tambah, cari, hapus, export CSV
- Absensi berdasarkan tanggal: Hadir/Izin/Sakit/Alpa
- Penilaian: input, rekap, export CSV
- AI Guru lokal: generator soal, rangkuman, tujuan pembelajaran, ide aktivitas
- Laporan dan cetak
- Pengaturan profil guru/sekolah/mapel
- Backup JSON dan Restore JSON
- Mode gelap/terang
- Responsive HP dan laptop
- localStorage

## Cara menjalankan
Buka `index.html` di browser.

## Deploy ke GitHub Pages
1. Buat repository, misalnya `web-guru-ai`.
2. Upload `index.html`, `style.css`, `script.js`, dan `README.md`.
3. Pilih Settings > Pages.
4. Source: Deploy from a branch.
5. Branch: `main`; Folder: `/ (root)`.
6. Save.
7. Buka alamat GitHub Pages yang diberikan.

## Catatan arsitektur
V2 belum memakai server/database. Data disimpan pada localStorage browser. Backup JSON dapat digunakan untuk memindahkan data secara manual.

Untuk V3, arsitektur dapat dikembangkan menjadi:
Frontend -> API/Backend -> Database
dengan autentikasi guru, database terpusat, import Excel, multi-user, dan integrasi AI API.

## Keamanan
Jangan menaruh API key AI, password database, atau kredensial rahasia di `script.js`/repository frontend publik. Integrasi AI berbayar sebaiknya melalui backend/server.
