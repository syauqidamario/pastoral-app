import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient(); // 👈 Ini variabel penolong yang tadi hilang!
const PORT = process.env.PORT || 5001; // Tetap pakai 5001 agar aman di Mac

app.use(cors());
app.use(express.json());

// 1. Endpoint READ (Mengambil semua data umat)
app.get("/api/umat", async (req: Request, res: Response) => {
  try {
    const umat = await prisma.umat.findMany({
      include: { lingkungan: true },
    });
    res.json(umat);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data umat" });
  }
});

// Endpoint untuk mengambil semua daftar lingkungan (Untuk kebutuhan Dropdown Form)
app.get("/api/lingkungan", async (req: Request, res: Response) => {
  try {
    const lingkungan = await prisma.lingkungan.findMany();
    res.json(lingkungan);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data lingkungan" });
  }
});

// 2. Endpoint CREATE (Menambahkan umat baru)
app.post("/api/umat", async (req: Request, res: Response) => {
  const { namaLengkap, lingkunganId } = req.body;
  try {
    const umatBaru = await prisma.umat.create({
      data: {
        namaLengkap,
        lingkunganId: Number(lingkunganId),
      },
    });
    res.status(201).json(umatBaru);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambah data umat" });
  }
});

// 3. Endpoint SEED (Jalur pintas menanam data otomatis)
// Endpoint SEED Versi Ramai (Banyak Wilayah & Lingkungan)
app.get("/api/seed", async (req: Request, res: Response) => {
  try {
    // 1. Bersihkan data lama
    await prisma.umat.deleteMany({});
    await prisma.lingkungan.deleteMany({});
    await prisma.wilayah.deleteMany({});

    // 2. Tanam Wilayah 1 (St. Yohanes) dan Lingkungannya
    const wilYohanes = await prisma.wilayah.create({
      data: { namaWilayah: "Wilayah St. Yohanes" },
    });
    const lingkYosef = await prisma.lingkungan.create({
      data: {
        namaLingkungan: "Lingkungan St. Yosef",
        wilayahId: wilYohanes.id,
      },
    });
    const lingkTeresa = await prisma.lingkungan.create({
      data: {
        namaLingkungan: "Lingkungan St. Teresa",
        wilayahId: wilYohanes.id,
      },
    });
    const lingkMaria = await prisma.lingkungan.create({
      data: {
        namaLingkungan: "Lingkungan St. Maria",
        wilayahId: wilYohanes.id,
      },
    });

    // 3. Tanam Wilayah 2 (St. Petrus) dan Lingkungannya
    const wilPetrus = await prisma.wilayah.create({
      data: { namaWilayah: "Wilayah St. Petrus" },
    });
    const lingkAgustinus = await prisma.lingkungan.create({
      data: {
        namaLingkungan: "Lingkungan St. Agustinus",
        wilayahId: wilPetrus.id,
      },
    });
    const lingkFransiskus = await prisma.lingkungan.create({
      data: {
        namaLingkungan: "Lingkungan St. Fransiskus",
        wilayahId: wilPetrus.id,
      },
    });

    // 4. Tanam 1 Umat awal terikat ke Lingkungan St. Yosef
    await prisma.umat.create({
      data: {
        namaLengkap: "Ignatius Budi",
        namaBaptis: "Ignatius",
        lingkunganId: lingkYosef.id,
        sudahKrisma: true,
      },
    });

    res.send(
      "🎉 Sensus Simulasi Sukses! 2 Wilayah dan 5 Lingkungan baru berhasil ditanam.",
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal menanam data: " + String(error));
  }
});

// 1. Ambil semua data Wilayah (Untuk dropdown di form Kelola Lingkungan)
app.get("/api/wilayah", async (req: Request, res: Response) => {
  try {
    const wilayah = await prisma.wilayah.findMany({
      include: { lingkungan: true }, // Sekaligus menarik data lingkungan di dalamnya
    });
    res.json(wilayah);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data wilayah" });
  }
});

// 2. Tambah Wilayah Baru
app.post("/api/wilayah", async (req: Request, res: Response) => {
  const { namaWilayah } = req.body;
  try {
    const wilayahBaru = await prisma.wilayah.create({
      data: { namaWilayah },
    });
    res.status(201).json(wilayahBaru);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambah wilayah" });
  }
});

// 3. Tambah Lingkungan Baru (Terikat ke Wilayah tertentu)
app.post("/api/lingkungan", async (req: Request, res: Response) => {
  const { namaLingkungan, wilayahId } = req.body;
  try {
    const lingkunganBaru = await prisma.lingkungan.create({
      data: {
        namaLingkungan,
        wilayahId: Number(wilayahId),
      },
    });
    res.status(201).json(lingkunganBaru);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambah lingkungan" });
  }
});

// 1. Ambil semua data Wilayah (Untuk dropdown di form Kelola Lingkungan)
app.get("/api/wilayah", async (req: Request, res: Response) => {
  try {
    const wilayah = await prisma.wilayah.findMany({
      include: { lingkungan: true }, // Sekaligus menarik data lingkungan di dalamnya
    });
    res.json(wilayah);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data wilayah" });
  }
});

// 2. Tambah Wilayah Baru
app.post("/api/wilayah", async (req: Request, res: Response) => {
  const { namaWilayah } = req.body;
  try {
    const wilayahBaru = await prisma.wilayah.create({
      data: { namaWilayah },
    });
    res.status(201).json(wilayahBaru);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambah wilayah" });
  }
});

// 3. Tambah Lingkungan Baru (Terikat ke Wilayah tertentu)
app.post("/api/lingkungan", async (req: Request, res: Response) => {
  const { namaLingkungan, wilayahId } = req.body;
  try {
    const lingkunganBaru = await prisma.lingkungan.create({
      data: {
        namaLingkungan,
        wilayahId: Number(wilayahId),
      },
    });
    res.status(201).json(lingkunganBaru);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambah lingkungan" });
  }
});

app.listen(PORT, () => {
  console.log(`Server database siap di: http://localhost:${PORT}`);
});
