import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = 5002;

app.use(cors());
app.use(express.json());

// ====================================================
// 🔐 GERBANG UTAMA: API LOGIN MULTI-ROLE
// ====================================================
app.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { bukuBaptis: true }, // Ikut sertakan data baptis kalau dia Umat
    });

    if (!user || user.password !== password) {
      res.status(401).json({ error: "Username atau Password salah!" });
      return;
    }

    // Jika sukses, kirim info sesi login ke frontend
    res.json({
      message: "Login Berhasil!",
      username: user.username,
      role: user.role,
      bukuBaptis: user.bukuBaptis, // Data sertifikat langsung dikirim jika dia UMAT
    });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// ====================================================
// [ADMIN CONTROL] CRUD BUKU BESAR BAPTIS
// ====================================================
app.get("/api/baptis", async (req: Request, res: Response) => {
  try {
    const data = await prisma.bukuBaptis.findMany({
      orderBy: { nomorLB: "asc" },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

app.post("/api/baptis", async (req: Request, res: Response) => {
  const {
    nomorLB,
    namaLengkap,
    tempatLahir,
    tanggalLahir,
    namaAyah,
    namaIbu,
    tanggalBaptis,
    tempatBaptis,
    namaRomo,
    waliBaptisPria,
    waliBaptisWanita,
  } = req.body;
  try {
    const recordBaru = await prisma.bukuBaptis.create({
      data: {
        nomorLB,
        namaLengkap,
        tempatLahir,
        tanggalLahir: new Date(tanggalLahir),
        namaAyah,
        namaIbu,
        tanggalBaptis: new Date(tanggalBaptis),
        tempatBaptis,
        namaRomo,
        waliBaptisPria,
        waliBaptisWanita,
      },
    });
    // Otomatis buatkan akun Umat agar ybs bisa login pakai Nomor LB-nya!
    await prisma.user.create({
      data: {
        username: nomorLB,
        password: "password123", // Password default umat baru
        role: "UMAT",
        bukuId: recordBaru.id,
      },
    });
    res.status(201).json(recordBaru);
  } catch (error: any) {
    if (error.code === "P2002")
      return res.status(400).json({ error: "Nomor LB sudah terdaftar!" });
    res.status(500).json({ error: "Gagal menyimpan" });
  }
});

app.put("/api/baptis/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    nomorLB,
    namaLengkap,
    tempatLahir,
    tanggalLahir,
    namaAyah,
    namaIbu,
    tanggalBaptis,
    tempatBaptis,
    namaRomo,
    waliBaptisPria,
    waliBaptisWanita,
    tanggalKrisma,
    tempatKrisma,
    nomorLC,
    tanggalNikah,
    tempatNikah,
    nomorLM,
    namaPasangan,
    catatanPinggirLain,
  } = req.body;
  try {
    const updated = await prisma.bukuBaptis.update({
      where: { id },
      data: {
        nomorLB,
        namaLengkap,
        tempatLahir,
        namaAyah,
        namaIbu,
        tempatBaptis,
        namaRomo,
        waliBaptisPria,
        waliBaptisWanita,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined,
        tanggalBaptis: tanggalBaptis ? new Date(tanggalBaptis) : undefined,
        tanggalKrisma: tanggalKrisma ? new Date(tanggalKrisma) : null,
        tempatKrisma: tempatKrisma || null,
        nomorLC: nomorLC || null,
        tanggalNikah: tanggalNikah ? new Date(tanggalNikah) : null,
        tempatNikah: tempatNikah || null,
        nomorLM: nomorLM || null,
        namaPasangan: namaPasangan || null,
        catatanPinggirLain: catatanPinggirLain || null,
      },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Gagal update" });
  }
});

app.delete("/api/baptis/:id", async (req: Request, res: Response) => {
  try {
    await prisma.bukuBaptis.delete({ where: { id: req.params.id } });
    res.json({ message: "Data dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal hapus" });
  }
});

// ====================================================
// 🧬 SUNTIK DATA SIMULASI SEED (Termasuk Akun Login)
// ====================================================
app.get("/api/seed", async (req: Request, res: Response) => {
  try {
    await prisma.user.deleteMany({});
    await prisma.bukuBaptis.deleteMany({});

    // 1. BUAT AKUN ADMIN UTAMA PAROKI
    await prisma.user.create({
      data: {
        username: "adminparoki",
        password: "secret123",
        role: "ADMIN",
      },
    });

    // 2. BUAT DATA BAPTIS UMAT + OTOMATIS BIKIN AKUN LOGIN NYA
    const umat1 = await prisma.bukuBaptis.create({
      data: {
        nomorLB: "LB/1998/10/045",
        namaLengkap: "Fransiskus Xaverius Adi",
        tempatLahir: "Semarang",
        tanggalLahir: new Date("1998-05-20"),
        namaAyah: "Petrus Widodo",
        namaIbu: "Maria Kristina",
        tanggalBaptis: new Date("1998-10-25"),
        tempatBaptis: "Paroki St. Yusuf",
        namaRomo: "Romo Purbo, Pr",
        waliBaptisPria: "Andreas Susilo",
        waliBaptisWanita: "Agatha Rini",
        tanggalKrisma: new Date("2012-08-15"),
        tempatKrisma: "Paroki St. Yusuf",
        nomorLC: "LC/2012/045",
      },
    });

    // Daftarkan akun login untuk umat tersebut (Username pakai No LB)
    await prisma.user.create({
      data: {
        username: "LB/1998/10/045",
        password: "password123",
        role: "UMAT",
        bukuId: umat1.id,
      },
    });

    res.send(
      "🎉 Seed Keamanan Sukses! Akun Admin & Akun Umat Relational siap digunakan.",
    );
  } catch (e) {
    res.status(500).send("Gagal: " + String(e));
  }
});

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
