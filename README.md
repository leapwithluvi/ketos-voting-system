# 🗳️ E-Voting OSIS

Sistem pemilihan ketua OSIS elektronik yang **aman**, **profesional**, dan **modern** — dibangun dengan Next.js 15, MongoDB, dan standar keamanan web terkini.

---

## ✨ Fitur Utama

### 👨‍💼 Admin
- Dashboard real-time dengan grafik perolehan suara (Recharts)
- Manajemen kandidat (CRUD, upload foto, visi-misi)
- Manajemen siswa (CRUD, import Excel/CSV massal, export data)
- Reset password siswa dengan generate otomatis
- Cetak kartu login siswa (print-ready)
- Buka/tutup sesi voting
- Akun admin aman dengan role-based access control

### 🧑‍🎓 Siswa
- Login dengan NISN + password
- Lihat semua kandidat beserta visi-misi lengkap
- Voting dengan konfirmasi modal
- Suara hanya bisa diberikan **sekali** (atomic transaction)

### 🔐 Keamanan
- **bcryptjs** saltRounds 12 untuk hash password
- **Rate limiting** pada login (5 percobaan/15 menit), vote, dan upload
- **Account lockout** setelah 5 gagal login (terkunci 15 menit)
- **Atomic vote transaction** (MongoDB session) — tidak bisa double vote
- **Zod validation** di semua API endpoint
- **Audit log** setiap aksi penting tersimpan di database
- **Security headers** (CSP, X-Frame-Options, X-XSS-Protection, dll.)
- **Input sanitization** untuk mencegah XSS
- **JWT session** via NextAuth v5
- Middleware proteksi route admin vs user

---

## 🛠️ Tech Stack

| Kategori | Library |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js v5 (Auth.js) |
| Validation | Zod |
| Password | bcryptjs (saltRounds: 12) |
| Rate Limiting | rate-limiter-flexible |
| Charts | Recharts |
| Excel/CSV | xlsx + papaparse |
| Image Opt. | sharp |
| Notifications | react-hot-toast |
| Icons | lucide-react |

---

## 🚀 Cara Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd osis-voting
npm install
```

### 2. Konfigurasi Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/osis-voting
NEXTAUTH_SECRET=buat-string-random-min-32-karakter
NEXTAUTH_URL=http://localhost:3000
```

> **Generate secret:** `openssl rand -base64 32`

### 3. Buat Akun Admin

```bash
# Install tsx jika belum ada
npm install -D tsx

# Jalankan seed
MONGODB_URI=mongodb://localhost:27017/osis-voting npx tsx scripts/seed.ts
```

Output:
```
✅ Admin berhasil dibuat!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NISN     : 0000000001
  Password : Admin@12345
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5. Build Production

```bash
npm run build
npm start
```

---

## 📁 Struktur Folder

```
src/
├── app/
│   ├── (auth)/login/          # Halaman login
│   ├── (admin)/               # Layout + halaman admin
│   │   ├── dashboard/         # Dashboard dengan statistik
│   │   ├── kandidat/          # CRUD kandidat
│   │   ├── siswa/             # CRUD + import/export siswa
│   │   └── pengaturan/        # Buka/tutup sesi voting
│   ├── (user)/                # Layout + halaman siswa
│   │   ├── dashboard/         # Halaman voting
│   │   └── kandidat/[id]/     # Detail kandidat
│   └── api/                   # REST API routes
│       ├── auth/[...nextauth]/ # NextAuth handler
│       ├── kandidat/          # CRUD kandidat API
│       ├── vote/              # Submit suara API
│       ├── stats/             # Statistik + sesi voting
│       ├── siswa/             # CRUD + import/export siswa
│       ├── upload/            # Upload gambar
│       └── health/            # Health check
├── components/
│   ├── admin/                 # Komponen khusus admin
│   └── user/                  # Komponen khusus siswa
├── lib/                       # Utilities
│   ├── db.ts                  # MongoDB singleton
│   ├── auth.ts                # NextAuth config
│   ├── validations.ts         # Zod schemas
│   ├── password.ts            # bcrypt helpers
│   ├── rateLimit.ts           # Rate limiters
│   ├── audit.ts               # Audit log helper
│   ├── excel.ts               # xlsx/papaparse helpers
│   ├── logger.ts              # Logger
│   └── sanitize.ts            # Input sanitizer
├── models/                    # Mongoose models
│   ├── User.ts
│   ├── Candidate.ts
│   └── AuditLog.ts            # + VotingSession
├── hooks/                     # React hooks
│   ├── useDebounce.ts
│   └── usePagination.ts
├── types/index.ts             # TypeScript types
└── middleware.ts              # Auth + route protection
```

---

## 📋 Alur Penggunaan

### Setup Awal (Admin)
1. Login dengan akun admin
2. Buka **Kandidat** → tambah pasangan calon (foto, visi, misi)
3. Buka **Siswa** → import data siswa via Excel (gunakan template) atau tambah manual
4. Cetak kartu login untuk dibagikan ke siswa
5. Buka **Pengaturan** → aktifkan sesi voting

### Voting (Siswa)
1. Login dengan NISN + password (default: `OSIS` + 4 digit terakhir NISN)
2. Pilih kandidat favorit
3. Konfirmasi pilihan di modal
4. Selesai — suara tercatat dan tidak bisa diubah

### Monitoring (Admin)
1. Dashboard menampilkan real-time progress
2. Grafik batang perolehan suara per kandidat
3. Persentase partisipasi pemilih
4. Tutup sesi voting setelah selesai

---

## 🔑 Default Password Siswa

```
Password = "OSIS" + 4 digit terakhir NISN
Contoh NISN 1234567890 → Password: OSIS7890
```

Admin dapat reset password kapan saja dari halaman Data Siswa.

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/api/health` | - | Health check |
| `POST` | `/api/auth/[...nextauth]` | - | NextAuth handler |
| `GET` | `/api/kandidat` | Public | List kandidat |
| `POST` | `/api/kandidat` | Admin | Tambah kandidat |
| `PATCH` | `/api/kandidat/[id]` | Admin | Edit kandidat |
| `DELETE` | `/api/kandidat/[id]` | Admin | Hapus kandidat |
| `POST` | `/api/vote` | User | Submit suara |
| `GET` | `/api/stats` | Public | Statistik voting |
| `POST` | `/api/stats` | Admin | Buat sesi voting |
| `PATCH` | `/api/stats` | Admin | Update sesi voting |
| `GET` | `/api/siswa` | Admin | List siswa |
| `POST` | `/api/siswa` | Admin | Tambah siswa |
| `PATCH` | `/api/siswa/[id]` | Admin | Edit siswa |
| `DELETE` | `/api/siswa/[id]` | Admin | Hapus siswa |
| `POST` | `/api/siswa/[id]/reset-password` | Admin | Reset password |
| `POST` | `/api/siswa/import` | Admin | Import Excel/CSV |
| `GET` | `/api/siswa/export` | Admin | Export Excel |
| `POST` | `/api/upload` | Admin | Upload gambar |

---

## 🛡️ Keamanan Detail

### Rate Limiting
| Endpoint | Limit | Window | Blokir |
|---|---|---|---|
| Login | 5 percobaan | 15 menit | 15 menit |
| Vote | 3 percobaan | 1 jam | - |
| Upload | 10 kali | 1 jam | - |
| API umum | 100 req | 1 menit | - |

### Account Lockout
Akun dikunci **15 menit** setelah 5 kali gagal login berturut-turut.

### Atomic Voting
Proses voting menggunakan **MongoDB Transaction** — increment vote count dan mark user sudah memilih terjadi dalam satu atomic operation, mencegah race condition.

---

## 🖨️ Format Import Excel

| Kolom | Tipe | Contoh |
|---|---|---|
| NISN | String (10 digit) | `1234567890` |
| Nama Lengkap | String | `Budi Santoso` |
| Kelas | Enum: X/XI/XII | `X` |
| Jurusan | String | `IPA` |

Download template di: **Admin → Siswa → Import → Download Template**

---

## 📝 License

MIT — Bebas digunakan untuk kebutuhan sekolah.
