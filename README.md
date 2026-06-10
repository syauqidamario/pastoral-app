# ⛪ Portal Pastoral Paroki (Pastoral App)

Aplikasi manajemen sensus umat dan administrasi dokumen sakramen paroki berbasis digital. Aplikasi ini dilengkapi dengan sistem pembatasan hak akses (*Role-based Access Control*) dan alur persetujuan bertingkat (*Approval Workflow*) untuk menjamin validitas dokumen sakral gereja sesuai hukum kanonik.

---

## 🚀 Fitur Utama

- **Autentikasi Multi-Role**: Pemisahan hak akses dinamis antara **Warga**, **Ketua Lingkungan**, dan **Pastor Paroki (Romo)**.
- **Manajemen Sensus Umat (CRUD)**: Pengelolaan data identitas umat paroki yang terikat relasional dengan data lingkungan.
- **Hierarki Struktur Paroki**: Fitur dinamis mandiri bagi pengurus untuk membuat **Wilayah Baru** dan **Lingkungan Baru** secara visual berbentuk *tree structure*.
- **Approval Workflow Dokumen Sakramen**: 
  1. **Warga** mengajukan draf berkas sakramen (Baptis, Krisma, Pernikahan). Status awal: `PENDING`.
  2. **Ketua Lingkungan** melakukan verifikasi fisik awal tingkat akar rumput. Status: `DISETUJUI_KETUA`.
  3. **Pastor Paroki** melakukan peninjauan akhir dan ketok palu hukum. Status: `VERIFIED_PASTOR`. Data draf otomatis disalin dan disahkan ke tabel utama Buku Besar Paroki.

---

## 💻 Tech Stack

### Frontend (Client)
- **React.js** dengan **Vite** & **TypeScript**
- **React Router Dom** (Sistem Navigasi & Proteksi Jalur)
- **Axios** (Komunikasi Data API)

### Backend (Server)
- **Node.js** dengan **Express** & **TypeScript**
- **Prisma ORM** (Data Mapping Engine)
- **SQLite** (Database Relasional Lokal)

---

## 📂 Struktur Proyek

```text
pastoral-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Skema database & Relasi 1-to-1 Sakramen
│   │   └── dev.db             # Database SQLite lokal
│   ├── src/
│   │   └── index.ts           # Otak Express API & Logika Transaksi Approval
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/             # Login.tsx, DaftarUmat.tsx, InboxPengajuan.tsx, dll
│   │   └── App.tsx            # Poros Navigasi & Integrasi State Utama
│   └── package.json
└── .gitignore                 # Filter pengaman folder dari GitHub
