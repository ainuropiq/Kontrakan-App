# 🚂 Cara Deploy Kontrakan Manager ke Railway
## Panduan Lengkap Step-by-Step

---

## 📋 Yang Dibutuhkan
- Akun GitHub (gratis) → github.com
- Akun Railway (gratis) → railway.app
- Aplikasi VS Code
- Git (download di git-scm.com)

---

## ══════════════════════════════════
## LANGKAH 1 — Persiapan di Komputer
## ══════════════════════════════════

### 1A. Install Git (jika belum ada)
- Download di: https://git-scm.com/download/win
- Install dengan klik Next → Next → Finish

### 1B. Buka folder proyek di VS Code
- Buka VS Code
- File → Open Folder → pilih folder `kontrakan-railway`

### 1C. Buka Terminal di VS Code
- Tekan `Ctrl + `` ` (backtick, tombol di atas Tab)
- Terminal muncul di bagian bawah

---

## ══════════════════════════════════
## LANGKAH 2 — Upload ke GitHub
## ══════════════════════════════════

Ketik perintah berikut satu per satu di Terminal VS Code:

```bash
# Inisialisasi Git
git init

# Tambahkan semua file
git add .

# Simpan (commit) pertama
git commit -m "Pertama: Kontrakan Manager App"
```

Sekarang buat repository di GitHub:
1. Buka github.com → Login
2. Klik tombol **"+"** pojok kanan atas → **"New repository"**
3. Nama repository: `kontrakan-manager`
4. Pilih **Public**
5. Klik **"Create repository"**

GitHub akan tampilkan perintah. Ketik di Terminal VS Code:

```bash
git remote add origin https://github.com/USERNAME/kontrakan-manager.git
git branch -M main
git push -u origin main
```

> Ganti `USERNAME` dengan username GitHub Anda

✅ File sudah ada di GitHub!

---

## ══════════════════════════════════
## LANGKAH 3 — Deploy di Railway
## ══════════════════════════════════

### 3A. Buat Akun Railway
1. Buka: https://railway.app
2. Klik **"Login with GitHub"**
3. Authorize Railway untuk akses GitHub Anda

### 3B. Buat Project Baru
1. Di dashboard Railway → klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository `kontrakan-manager`
4. Klik **"Deploy Now"**

Railway akan mulai build otomatis (tunggu ~2 menit).

### 3C. Tambahkan Database PostgreSQL
1. Di halaman project Railway → klik **"+ New"**
2. Pilih **"Database"** → **"Add PostgreSQL"**
3. Database otomatis dibuat dan terhubung!

Railway otomatis menambahkan variabel `DATABASE_URL` ke project Anda.

### 3D. Cek Variabel Environment
1. Klik service `kontrakan-manager` (bukan database)
2. Pilih tab **"Variables"**
3. Pastikan ada: `DATABASE_URL` (sudah otomatis dari step 3C)
4. Klik **"+ New Variable"** → tambahkan:
   - Key: `NODE_ENV` → Value: `production`

### 3E. Dapatkan URL Aplikasi
1. Klik service `kontrakan-manager`
2. Pilih tab **"Settings"**
3. Di bagian **"Networking"** → klik **"Generate Domain"**
4. URL akan muncul seperti: `https://kontrakan-manager-xxx.railway.app`

✅ **Aplikasi Anda sudah online!**

---

## ══════════════════════════════════
## LANGKAH 4 — Verifikasi
## ══════════════════════════════════

1. Buka URL Railway di browser HP
2. Cek semua tab: Unit, Bayar, Keluhan, Laporan, Kontak
3. Coba tambah unit dan keluhan
4. Coba tombol WhatsApp

Jika berhasil → data tersimpan di PostgreSQL Railway! ✅

---

## ══════════════════════════════════
## LANGKAH 5 — Install ke HP
## ══════════════════════════════════

**Android:**
1. Buka Chrome HP → akses URL Railway Anda
2. Ketuk menu ⋮ → "Tambahkan ke layar utama"
3. App langsung bisa dipakai offline!

**iPhone:**
1. Buka Safari → akses URL Railway
2. Ketuk ikon Share → "Add to Home Screen"

---

## 🔄 Cara Update Aplikasi

Setiap kali Anda ubah kode dan push ke GitHub, Railway otomatis deploy ulang:

```bash
git add .
git commit -m "Update: [tulis perubahan]"
git push
```

Railway akan deploy otomatis dalam ~1 menit!

---

## 🛠 Kustomisasi Data Default

Edit file `db/schema.sql` bagian INSERT untuk mengganti:
- Nama penyewa awal
- No. WhatsApp penyewa
- Tarif sewa
- Nama & alamat properti

Lalu push ke GitHub → Railway update otomatis.

---

## ❓ Troubleshoot Umum

**App tidak bisa dibuka:**
→ Cek tab "Deployments" di Railway, lihat log error

**Database error:**
→ Pastikan `DATABASE_URL` sudah ada di Variables

**WhatsApp tidak terbuka:**
→ Pastikan no. WA format 628xxx (tanpa + atau 0 di depan)

**Port error:**
→ Jangan set PORT secara manual, Railway mengaturnya otomatis

---

## 💰 Biaya Railway

- **Hobby Plan (Gratis):** $5 credit/bulan, cukup untuk app skala kecil
- **PostgreSQL:** Termasuk dalam credit gratis
- **Tanpa kartu kredit** untuk mulai

Untuk kontrakan 9 unit → plan gratis sudah lebih dari cukup!

---

*Kontrakan Manager — Deploy Guide v1.0*
