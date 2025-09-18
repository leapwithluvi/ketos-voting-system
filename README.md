# Ketos Voting System

**Ketos Voting System** adalah aplikasi voting sederhana untuk pemilihan Ketua OSIS di sekolah.  
<!-- Project ini dibuat menggunakan **Next.js** untuk frontend dan **Express.js** untuk backend, dengan database **MySQL**. -->

---

## 🏗️ Struktur Project (Monorepo)

``` bash
ketos-voting-system/       # Root repo
│
├── backend/               # Backend
│   ├── .vscode/
│   ├── prisma/
│   ├── src/
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/              # Frontend
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── LICENSE
└── README.md

```


---

## ⚡ Fitur
- Login siswa & admin (`/login`)  
- Daftar kandidat dengan visi & misi (`/candidates`)  
- Voting siswa (`/votes`)  
- Role-based system: user biasa dan admin  
- Otomatis menyimpan timestamp voting  

---

## 🛠️ Tech Stack
**Frontend (FE):**  
- React
- Tailwind CSS

**Backend (BE):**  
- Node.js + Express.js (TypeScript) 
- MongoDB
- Prisma
- REST API (`/login`, `/candidates`, `/votes`)  

---

<!-- ## 🧩 Database Schema

**Users Table**
- `id` (PK, auto increment)  
- `nisn` (unique, not null)  
- `password` (not null)  
- `role` (enum: 'user', 'admin', default: 'user')  

**Candidates Table**
- `id` (PK, auto increment)  
- `nama` (not null)  
- `visi`  
- `misi`  
- `photo_url`  
- `created_at` (timestamp, default current time)  

**Votes Table**
- `id` (PK, auto increment)  
- `user_id` (FK → users.id)  
- `candidate_id` (FK → candidates.id)  
- `created_at` (timestamp, default current time)  

--- -->
<!-- 
## 🚀 Cara Menjalankan

### Backend
1. Masuk folder backend:  
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
``` -->
