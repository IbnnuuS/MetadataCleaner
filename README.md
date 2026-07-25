# AI Metadata Cleaner

> Hapus seluruh metadata gambar secara instan tanpa mengurangi kualitas.

Aplikasi SaaS modern berbasis web yang dirancang untuk mendeteksi, menampilkan, membersihkan, dan memverifikasi metadata gambar secara instan demi menjaga privasi pengguna. Sistem ini sepenuhnya gratis, tanpa registrasi, dan berjalan 100% sementara di memori RAM (tanpa database atau penyimpanan file eksternal).

---

## 🚀 Fitur Utama
1. **Pembersihan Metadata EXIF/GPS/IPTC/XMP**: Menghapus seluruh tag sensitif seperti lokasi koordinat GPS, jenis kamera/lensa, author, copyright, dsb.
2. **Scanner Metadata AI**: Mendeteksi jika gambar dibuat oleh generator AI populer (Midjourney, Stable Diffusion, DALL-E, Google Gemini, dll).
3. **Verifikasi Hasil**: Melakukan scanning ulang instan pasca-pembersihan untuk membuktikan kebersihan data secara jujur.
4. **Zero-Storage Policy**: Seluruh file diproses di RAM server secara temporary dan langsung dihancurkan setelah response dikirim.
5. **Glassmorphic UI**: Antarmuka web modern dengan animasi halus, responsif, dan mendukung keyboard navigation.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: TailwindCSS & Framer Motion
- **Bahasa**: TypeScript (Strict Mode)
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Library Pemrosesan Gambar**: Pillow, piexif, exifread, pillow-heif
- **MIME & Magic Bytes**: python-magic (dengan fallback)
- **Server**: Uvicorn

---

## 📁 Struktur Proyek

```text
├── backend/
│   ├── app/
│   │   ├── core/         # Konfigurasi aplikasi
│   │   ├── routers/      # API Route Handlers (/api/scan, /api/clean)
│   │   ├── services/     # Logika pemindaian & pembersihan
│   │   ├── utils/        # Validasi mime type & magic bytes
│   │   └── main.py       # FastAPI Entry Point
│   ├── Procfile          # Konfigurasi deploy Railway
│   └── requirements.txt  # Daftar dependensi Python
│
├── frontend/
│   ├── app/              # Layout, CSS global, dan landing page Next.js
│   ├── components/       # Komponen UI modular (Navbar, Dropzone, FAQ, Footer)
│   ├── lib/              # Utilitas pembantu (styling & formatting)
│   ├── types/            # Definisi TypeScript interface
│   ├── public/           # Static asset, robots.txt, sitemap.xml
│   └── next.config.js    # Konfigurasi rewrite & build Next.js
│
└── README.md             # Panduan lengkap dokumentasi
```

---

## 💻 Panduan Instalasi Lokal

### 1. Prasyarat
- Python 3.9+ terinstal.
- Node.js 18+ & npm terinstal.

### 2. Konfigurasi & Jalankan Backend
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Buat & aktifkan virtual environment:
   ```bash
   python -m venv .venv
   # Di Windows (PowerShell):
   .\.venv\Scripts\activate
   # Di Linux/macOS:
   source .venv/bin/activate
   ```
3. Install dependensi:
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan server FastAPI:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```
   *Server backend Anda sekarang aktif di `http://localhost:8000`.*

### 3. Konfigurasi & Jalankan Frontend
1. Masuk ke direktori frontend:
   ```bash
   cd ../frontend
   ```
2. Install paket dependensi:
   ```bash
   npm install
   ```
3. Jalankan server dev Next.js:
   ```bash
   npm run dev
   ```
   *Buka browser dan buka `http://localhost:3000`.*

---

## ☁️ Panduan Deployment ke Cloud Production

### A. Deploy Backend ke Railway
1. Buat project baru di **Railway.app**.
2. Hubungkan repositori Git Anda (atau gunakan Railway CLI untuk push direktori `/backend`).
3. Pastikan Railway mendeteksi bahasa Python. Railway secara otomatis membaca `requirements.txt` dan mengeksekusi perintah di `Procfile`:
   ```text
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Dapatkan domain URL backend publik dari Railway (misal: `https://your-backend.up.railway.app`).

### B. Deploy Frontend ke Vercel
1. Masuk ke dashboard **Vercel.com**.
2. Hubungkan repositori Git Anda dan pilih root folder project `/frontend`.
3. Tambahkan Environment Variable berikut agar frontend dapat terhubung ke backend Railway:
   - Nama: `NEXT_PUBLIC_API_URL`
   - Nilai: `https://your-backend.up.railway.app` (tanpa slash `/` di akhir)
4. Klik **Deploy**. Selesai!
