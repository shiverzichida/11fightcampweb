# 🥊 11 Fight Camp - Official Website & Class Booking System

Website resmi dan platform booking online untuk **11 Fight Camp**, sasana bela diri & combat fitness di Pontianak, Kalimantan Barat.

Mengusung kurikulum pelatihan **Muay Thai, Boxing, Brazilian Jiu-Jitsu (BJJ), MMA, dan Fighter Conditioning**.

---

## 🚀 Tech Stack
* **Frontend:** [Next.js 15+ (App Router)](https://nextjs.org/) + React 19 + TypeScript
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Combat Dark Aesthetic
* **Icons:** [Lucide React](https://lucide.dev/)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
* **Local Fallback:** Browser LocalStorage Engine (Memungkinkan develop & testing lokal instan tanpa Supabase)
* **Hosting & CI/CD:** [Vercel](https://vercel.com/) + GitHub

---

## ⚡ Fitur Utama

1. **Beranda Interaktif (Landing Page):**
   * Tampilan modern bertema seni bela diri (*combat gym*).
   * Showcase program kelas: Muay Thai, Boxing, BJJ, MMA, HIIT Conditioning, Private 1-on-1.
   * Tim pelatih (*coaches*) berpengalaman dengan rekam jejak kompetisi.
   * Paket membership & sesi latihan drop-in.
   * Peta terintegrasi & info fasilitas sasana (Jl. Dr. Rubini No. 11, Pontianak).
   * Tautan langsung ke Instagram resmi [@11fightcamp](https://www.instagram.com/11fightcamp/?hl=en).

2. **Sistem Booking Jadwal Kelas (`/booking`):**
   * Pemilihan tanggal latihan secara interaktif.
   * Kuota peserta dinamis per sesi (otomatis mendeteksi slot tersisa atau *Sold Out*).
   * Formulir pendaftaran peserta (Nama, WhatsApp, tingkat pengalaman).
   * **Tiket Booking Digital** dengan kode reservasi unik (contoh: `11FC-4819`).
   * **WhatsApp Direct Button:** Mengirim tiket langsung ke WhatsApp Admin (`+62 881-8124-824`) dengan pesan otomatis yang rapi.

3. **Panel Admin Manajemen (`/admin`):**
   * **Manajemen Jadwal:** Tambah jadwal baru (pilih hari, jam, pelatih, kuota, harga drop-in), aktifkan/nonaktifkan, dan hapus jadwal.
   * **Daftar Reservasi:** Pantau seluruh pendaftar, pencarian berdasarkan nama/kode booking, filter status (*confirmed*, *attended*, *cancelled*), dan aksi tandai hadir.
   * **Ringkasan Metrik:** Total booking, jadwal sesi mingguan, kehadiran, dan estimasi pendapatan.

---

## 💻 Panduan Menjalankan di Komputer Lokal

### 1. Prasyarat
* Node.js v18+ atau v20+ atau v24+
* npm

### 2. Jalankan Aplikasi
Masuk ke folder proyek dan jalankan server lokal:
```bash
npm run dev
```
Buka browser di:
* Website Utama: [http://localhost:3000](http://localhost:3000)
* Halaman Booking: [http://localhost:3000/booking](http://localhost:3000/booking)
* Panel Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

> 💡 **Info Penting:** Aplikasi sudah dilengkapi **Local Storage Engine**. Anda bisa langsung mencoba booking kelas dan menambah jadwal di `/admin` secara lokal tanpa perlu konfigurasi database terlebih dahulu!

---

## 🗄️ Menghubungkan ke Supabase (Cloud Database)

Jika Anda ingin menyimpan data secara permanen di cloud database Supabase:

1. Buat akun dan proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka menu **SQL Editor** di Supabase.
3. Buka file `supabase/schema.sql` pada proyek ini, salin seluruh kodenya, dan jalankan (*Run*) di SQL Editor Supabase. File ini akan membuat tabel `classes`, `trainers`, `schedules`, `bookings` serta data awal (*seed data*).
4. Buat file `.env.local` di root folder proyek ini (atau salin dari `.env.local.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Restart server lokal (`npm run dev`). Website akan otomatis mendeteksi Supabase dan menggunakannya sebagai database utama!

---

## 🐙 Menyimpan ke GitHub

Untuk mengunggah kode ke akun GitHub Anda:

```bash
# 1. Pastikan semua perubahan sudah ter-commit
git add .
git commit -m "feat: complete 11 Fight Camp web platform with booking system"

# 2. Buat repository baru di GitHub (misal: 11fightcamp)
# 3. Hubungkan repository lokal ke GitHub (ganti URL dengan repo Anda):
git remote add origin https://github.com/USERNAME/11fightcamp.git
git branch -M main
git push -u origin main
```

---

## ☁️ Deploy ke Vercel (Produksi)

1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan login menggunakan akun GitHub Anda.
2. Klik **"Add New..."** -> **"Project"**.
3. Pilih repository `11fightcamp` yang telah di-push ke GitHub.
4. Pada bagian **Environment Variables**, tambahkan:
   * `NEXT_PUBLIC_SUPABASE_URL` : (URL Supabase Anda)
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` : (Anon Key Supabase Anda)
5. Klik **"Deploy"**.
6. Dalam 1-2 menit website 11 Fight Camp akan online di domain Vercel gratis (misal: `11fightcamp.vercel.app`) atau bisa dihubungkan ke custom domain seperti `11fightcamp.com`.

---

## 📍 Informasi Sasana
* **Alamat:** Jl. Dr. Rubini No. 11, Akcaya, Kec. Pontianak Selatan, Kota Pontianak, Kalimantan Barat 78113
* **WhatsApp:** +62 881-8124-824
* **Instagram:** [@11fightcamp](https://www.instagram.com/11fightcamp/?hl=en)
