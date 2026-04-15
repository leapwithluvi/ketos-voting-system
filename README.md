# 🗳️ Ketos Voting System

Sistem Pemilihan Ketua OSIS (E-Voting) berbasis web yang **Aman**, **Transparan**, dan **Modern**. Dibangun menggunakan teknologi terkini untuk memastikan integritas setiap suara.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-blue?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)

---

## ✨ Fitur Unggulan

### 👨‍💼 Panel Administrator
- **Dashboard Statistik**: Visualisasi data perolehan suara secara real-time menggunakan grafik interaktif (Recharts).
- **Manajemen Kandidat**: Kelola pasangan calon (Paslon) secara lengkap mulai dari foto up hingga visi-misi.
- **Manajemen Siswa**: CRUD data siswa, fitur **Import massal via Excel/CSV**, dan **Export data** ke format Excel.
- **Kontrol Sesi**: Fitur untuk Membuka/Menutup sesi voting secara global dengan satu klik.
- **Audit Logs**: Rekaman aktivitas penting untuk menjamin transparansi sistem.

### 🧑‍🎓 Panel Siswa (Voter)
- **Login Terproteksi**: Akses menggunakan NISN unik dan password yang aman.
- **Eksplorasi Visi-Misi**: Siswa dapat membaca detail visi dan misi setiap kandidat sebelum memilih.
- **One-Click Voting**: Proses pemilihan yang intuitif dengan konfirmasi modal untuk mencegah kesalahan pilih.
- **Single Vote Assurance**: Garansi satu suara per siswa menggunakan sistem transaksi database atomic.

---

## 🔐 Standar Keamanan

- **Integritas Suara**: Setiap suara dicatat menggunakan **PostgreSQL Transactions** via Prisma.
- **Proteksi Password**: Enkripsi tingkat tinggi menggunakan **bcryptjs** (saltRounds: 12).
- **Rate Limiting**: Mencegah serangan brute-force pada login dan spamming pada endpoint voting.
- **Audit Trails**: Melacak alamat IP dan User-Agent untuk setiap aktivitas krusial.
- **Input Sanitization**: Proteksi terhadap serangan XSS dan SQL Injection.
- **Role-Based Access Control (RBAC)**: Proteksi middleware yang memisahkan hak akses Admin dan Siswa.

---

## 🛠️ Stack Teknologi

| Komponen | Teknologi |
|---|---|
| **Frontend** | Next.js 15 (App Router), Tailwind CSS v4, Lucide Icons |
| **Backend** | Next.js Server Actions, REST API |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Autentikasi** | NextAuth.js v5 |
| **Validasi** | Zod |
| **Logging** | Winston & Custom Audit Logs |
| **Statistik** | Recharts |

---

## � Struktur Proyek

```
ketos-voting-system/
├── prisma/                  # Database Schema & Migrations
│   ├── schema.prisma        # Definisi Model (PostgreSQL)
│   └── seed.ts              # Script Seeding Data (Admin & Siswa)
├── src/
│   ├── app/                 # Next.js App Router Pages
│   │   ├── (auth)/          # Authentication Routes
│   │   ├── (admin)/         # Admin Dashboard & Management
│   │   ├── (user)/          # Student Voting Dashboard
│   │   └── api/             # Backend RESTful API
│   ├── components/          # Reusable UI Components
│   │   ├── admin/           # Admin-specific Components
│   │   ├── user/            # Student-specific Components
│   │   └── ui/              # Generic UI Components
│   ├── lib/                 # Core Logic & Shared Utilities
│   │   ├── prisma.ts        # Prisma Client Singleton
│   │   ├── auth.ts          # Authentication Settings
│   │   ├── audit.ts         # Audit Logging Logic
│   │   └── validations.ts   # Zod Schemas
│   ├── hooks/               # Custom React Hooks
│   ├── types/               # TypeScript Definitions
│   └── middleware.ts        # Security & Auth Middleware
├── public/                  # Static Assets (Images, Icons)
├── next.config.ts           # Next.js Configuration
└── package.json             # Dependencies & Scripts
```

---

## � Panduan Instalasi

### 1. Persiapan
Pastikan Anda sudah menginstall **Node.js v20+** dan **PostgreSQL**.

### 2. Clone & Install
```bash
git clone <repository-url>
cd ketos-voting-system
npm install
```

### 3. Konfigurasi Database
Buat file `.env` di root folder dan masukkan koneksi PostgreSQL Anda:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ketos_voting_system?schema=public"
NEXTAUTH_SECRET="gunakan-string-random-32-karakter"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Push Schema & Data Awal
Jalankan perintah berikut untuk menyiapkan database dan mengisi data contoh:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```

Akses aplikasi di: `http://localhost:3000`

---

## 📋 Login Default (Hasil Seed)

| Role | User (NISN) | Password |
|---|---|---|
| **Administrator** | `0000000001` | `Admin@12345` |
| **Siswa Contoh** | `1234500001` | `Password@123` |

---

## 📝 Lisensi
Proyek ini dilisensikan di bawah **MIT License**. Silakan gunakan untuk kebutuhan edukasi dan sekolah Anda.
