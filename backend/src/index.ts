import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ====================================================
// 1. ENDPOINT AUTHENTICATION (LOGIN)
// ====================================================
app.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { lingkungan: true },
    });
    if (!user || user.password !== password) {
      res.status(401).json({ error: "Username atau password salah!" });
      return;
    }
    res.json({
      message: "Login Berhasil! 🎉",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        lingkunganId: user.lingkunganId,
        namaLingkungan: user.lingkungan?.namaLingkungan || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// ====================================================
// 2. ENDPOINT WORKFLOW PENGAJUAN SAKRAMEN (FITUR UTAMA)
// ====================================================

// A. WARGA: Mengajukan draf data sakramen baru
app.post("/api/pengajuan", async (req: Request, res: Response) => {
  const { umatId, jenisSakramen, dataForm } = req.body;
  try {
    const pengajuanBaru = await prisma.pengajuan.create({
      data: {
        umatId,
        jenisSakramen, // BAPTIS / KRISMA / PERNIKAHAN
        dataForm: JSON.stringify(dataForm), // Bungkus objek form jadi string text
        status: "PENDING",
      },
    });
    res.status(201).json(pengajuanBaru);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengirim pengajuan berkas" });
  }
});

// B. ADMIN/PASTOR: Mengambil semua daftar pengajuan masuk untuk diperiksa
app.get("/api/pengajuan", async (req: Request, res: Response) => {
  try {
    const daftarPengajuan = await prisma.pengajuan.findMany({
      include: {
        umat: {
          include: { lingkungan: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(daftarPengajuan);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil daftar pengajuan" });
  }
});

// C. APPROVAL ACTION: Proses persetujuan bertingkat (Ketua & Pastor)
app.patch("/api/pengajuan/:id/aksi", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, aksi, catatanPenolakan } = req.body; // aksi: 'SETUJU' | 'TOLAK'

  try {
    // 1. Ambil data draf pengajuan saat ini
    const pengajuan = await prisma.pengajuan.findUnique({ where: { id } });
    if (!pengajuan) {
      res.status(404).json({ error: "Berkas pengajuan tidak ditemukan" });
      return;
    }

    // 2. LOGIKA JIKA DITOLAK (Bisa ditolak oleh Ketua maupun Pastor)
    if (aksi === "TOLAK") {
      const hasilTolak = await prisma.pengajuan.update({
        where: { id },
        data: { status: "DITOLAK", catatanPenolakan },
      });
      res.json({ message: "Pengajuan resmi ditolak", data: hasilTolak });
      return;
    }

    // 3. LOGIKA KETUA LINGKUNGAN APPROVE
    if (role === "KETUA_LINGKUNGAN" && aksi === "SETUJU") {
      const hasilKetua = await prisma.pengajuan.update({
        where: { id },
        data: { status: "DISETUJUI_KETUA" },
      });
      res.json({
        message: "Lolos sensor Ketua Lingkungan! Menunggu verifikasi Pastor.",
        data: hasilKetua,
      });
      return;
    }

    // 4. LOGIKA PASTOR PAROKI APPROVE (VERIFIKASI FINAL & PROSES DATA UTAMA)
    if (role === "PASTOR" && aksi === "SETUJU") {
      const dataSensus = JSON.parse(pengajuan.dataForm); // Bongkar kembali string JSON form

      // Eksekusi transaksi database (Pastikan status berubah dan data masuk tabel utama)
      await prisma.$transaction(async (tx) => {
        // Update status pengajuan berkas menjadi VERIFIED_PASTOR
        await tx.pengajuan.update({
          where: { id },
          data: { status: "VERIFIED_PASTOR" },
        });

        // Pilah dan tanam data ke tabel sakramen yang asli sesuai jenisnya
        if (pengajuan.jenisSakramen === "BAPTIS") {
          await tx.dataBaptis.upsert({
            where: { umatId: pengajuan.umatId },
            update: {
              tanggalBaptis: new Date(dataSensus.tanggalBaptis),
              tempatBaptis: dataSensus.tempatBaptis,
              nomorLB: dataSensus.nomorLB,
              namaRomo: dataSensus.namaRomo,
              waliBaptis: dataSensus.waliBaptis,
            },
            create: {
              umatId: pengajuan.umatId,
              tanggalBaptis: new Date(dataSensus.tanggalBaptis),
              tempatBaptis: dataSensus.tempatBaptis,
              nomorLB: dataSensus.nomorLB,
              namaRomo: dataSensus.namaRomo,
              waliBaptis: dataSensus.waliBaptis,
            },
          });

          // Otomatis update Nama Baptis di tabel Umat utama jika diinput warga
          if (dataSensus.namaBaptis) {
            await tx.umat.update({
              where: { id: pengajuan.umatId },
              data: { namaBaptis: dataSensus.namaBaptis },
            });
          }
        } else if (pengajuan.jenisSakramen === "KRISMA") {
          await tx.dataKrisma.upsert({
            where: { umatId: pengajuan.umatId },
            update: {
              tanggalKrisma: new Date(dataSensus.tanggalKrisma),
              nomorLC: dataSensus.nomorLC,
              namaUskupRomo: dataSensus.namaUskupRomo,
              namaPelindung: dataSensus.namaPelindung,
            },
            create: {
              umatId: pengajuan.umatId,
              tanggalKrisma: new Date(dataSensus.tanggalKrisma),
              nomorLC: dataSensus.nomorLC,
              namaUskupRomo: dataSensus.namaUskupRomo,
              namaPelindung: dataSensus.namaPelindung,
            },
          });
        } else if (pengajuan.jenisSakramen === "PERNIKAHAN") {
          await tx.dataPernikahan.upsert({
            where: { umatId: pengajuan.umatId },
            update: {
              namaPasangan: dataSensus.namaPasangan,
              tanggalPernikahan: new Date(dataSensus.tanggalPernikahan),
              nomorLM: dataSensus.nomorLM,
              tempatMenikah: dataSensus.tempatMenikah,
              namaSaksi1: dataSensus.namaSaksi1,
              namaSaksi2: dataSensus.namaSaksi2,
            },
            create: {
              umatId: pengajuan.umatId,
              namaPasangan: dataSensus.namaPasangan,
              tanggalPernikahan: new Date(dataSensus.tanggalPernikahan),
              nomorLM: dataSensus.nomorLM,
              tempatMenikah: dataSensus.tempatMenikah,
              namaSaksi1: dataSensus.namaSaksi1,
              namaSaksi2: dataSensus.namaSaksi2,
            },
          });
        }
      });

      res.json({
        message:
          "🎉 Validasi Sukses! Berkas disahkan Romo & otomatis masuk Buku Besar Paroki.",
      });
      return;
    }

    res.status(400).json({ error: "Hak akses operasi tidak valid!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal memproses aksi persetujuan" });
  }
});

// ====================================================
// 3. ENDPOINT DATA UTAMA & SEED DATA
// ====================================================
app.get("/api/umat", async (req: Request, res: Response) => {
  try {
    const umat = await prisma.umat.findMany({
      include: {
        lingkungan: true,
        dataBaptis: true,
        dataKrisma: true,
        pernikahan: true,
      },
    });
    res.json(umat);
  } catch (error) {
    res.status(500).json({ error: "Gagal" });
  }
});

app.post("/api/umat", async (req: Request, res: Response) => {
  try {
    const d = await prisma.umat.create({
      data: {
        namaLengkap: req.body.namaLengkap,
        lingkunganId: Number(req.body.lingkunganId),
      },
    });
    res.status(201).json(d);
  } catch (error) {
    res.status(500).json({ error: "Gagal" });
  }
});

app.delete("/api/umat/:id", async (req: Request, res: Response) => {
  try {
    await prisma.umat.delete({ where: { id: req.params.id } });
    res.json({ m: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Gagal" });
  }
});

app.get("/api/lingkungan", async (req, res) => {
  res.json(await prisma.lingkungan.findMany());
});
app.get("/api/wilayah", async (req, res) => {
  res.json(await prisma.wilayah.findMany({ include: { lingkungan: true } }));
});
app.post("/api/wilayah", async (req, res) => {
  res.json(
    await prisma.wilayah.create({
      data: { namaWilayah: req.body.namaWilayah },
    }),
  );
});
app.post("/api/lingkungan", async (req, res) => {
  res.json(
    await prisma.lingkungan.create({
      data: {
        namaLingkungan: req.body.namaLingkungan,
        wilayahId: Number(req.body.wilayahId),
      },
    }),
  );
});

app.get("/api/seed", async (req: Request, res: Response) => {
  try {
    await prisma.pengajuan.deleteMany({}); // Ikut bersihkan riwayat draf lama
    await prisma.dataBaptis.deleteMany({});
    await prisma.dataKrisma.deleteMany({});
    await prisma.dataPernikahan.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.umat.deleteMany({});
    await prisma.lingkungan.deleteMany({});
    await prisma.wilayah.deleteMany({});

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

    const budi = await prisma.umat.create({
      data: {
        namaLengkap: "Ignatius Budi",
        namaBaptis: "Ignatius",
        lingkunganId: lingkYosef.id,
      },
    });
    await prisma.umat.create({
      data: { namaLengkap: "Marta Anita", lingkunganId: lingkTeresa.id },
    }); // Buat marta anita sekalian

    await prisma.dataBaptis.create({
      data: {
        umatId: budi.id,
        tanggalBaptis: new Date("2010-04-15"),
        tempatBaptis: "Paroki St. Perawan Maria",
        nomorLB: "LB-2010-0987",
        namaRomo: "Romo Johannes, Pr",
        waliBaptis: "Yoseph Sugeng",
      },
    });

    await prisma.user.create({
      data: { username: "romopastor", password: "password123", role: "PASTOR" },
    });
    await prisma.user.create({
      data: {
        username: "ketuayosef",
        password: "password123",
        role: "KETUA_LINGKUNGAN",
        lingkunganId: lingkYosef.id,
      },
    });
    await prisma.user.create({
      data: {
        username: "wargateresa",
        password: "password123",
        role: "WARGA",
        lingkunganId: lingkTeresa.id,
      },
    });

    res.send(
      "🎉 Seed Sukses! Database segar + skema approval penampung draf berkas siap tempur.",
    );
  } catch (error) {
    res.status(500).send("Gagal: " + String(error));
  }
});

app.listen(PORT, () => {
  console.log(`Server siap di port ${PORT}`);
});
