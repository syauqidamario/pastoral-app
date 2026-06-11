-- CreateTable
CREATE TABLE "BukuBaptis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomorLB" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" DATETIME NOT NULL,
    "namaAyah" TEXT NOT NULL,
    "namaIbu" TEXT NOT NULL,
    "tanggalBaptis" DATETIME NOT NULL,
    "tempatBaptis" TEXT NOT NULL DEFAULT 'Gereja Paroki',
    "namaRomo" TEXT NOT NULL,
    "waliBaptisPria" TEXT NOT NULL,
    "waliBaptisWanita" TEXT NOT NULL,
    "tanggalKrisma" DATETIME,
    "tempatKrisma" TEXT,
    "nomorLC" TEXT,
    "tanggalNikah" DATETIME,
    "tempatNikah" TEXT,
    "nomorLM" TEXT,
    "namaPasangan" TEXT,
    "catatanPinggirLain" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BukuBaptis_nomorLB_key" ON "BukuBaptis"("nomorLB");
