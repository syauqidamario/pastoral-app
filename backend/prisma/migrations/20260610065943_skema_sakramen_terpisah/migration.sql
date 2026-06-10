/*
  Warnings:

  - You are about to drop the column `sudahBaptis` on the `Umat` table. All the data in the column will be lost.
  - You are about to drop the column `sudahKomuni` on the `Umat` table. All the data in the column will be lost.
  - You are about to drop the column `sudahKrisma` on the `Umat` table. All the data in the column will be lost.
  - You are about to drop the column `sudahMenikah` on the `Umat` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "DataBaptis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "umatId" TEXT NOT NULL,
    "tanggalBaptis" DATETIME NOT NULL,
    "tempatBaptis" TEXT NOT NULL,
    "nomorLB" TEXT NOT NULL,
    "namaRomo" TEXT NOT NULL,
    "waliBaptis" TEXT NOT NULL,
    CONSTRAINT "DataBaptis_umatId_fkey" FOREIGN KEY ("umatId") REFERENCES "Umat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataKrisma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "umatId" TEXT NOT NULL,
    "tanggalKrisma" DATETIME NOT NULL,
    "nomorLC" TEXT NOT NULL,
    "namaUskupRomo" TEXT NOT NULL,
    "namaPelindung" TEXT NOT NULL,
    CONSTRAINT "DataKrisma_umatId_fkey" FOREIGN KEY ("umatId") REFERENCES "Umat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataPernikahan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "umatId" TEXT NOT NULL,
    "namaPasangan" TEXT NOT NULL,
    "tanggalPernikahan" DATETIME NOT NULL,
    "nomorLM" TEXT NOT NULL,
    "tempatMenikah" TEXT NOT NULL,
    "namaSaksi1" TEXT NOT NULL,
    "namaSaksi2" TEXT NOT NULL,
    CONSTRAINT "DataPernikahan_umatId_fkey" FOREIGN KEY ("umatId") REFERENCES "Umat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Umat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "namaLengkap" TEXT NOT NULL,
    "namaBaptis" TEXT,
    "lingkunganId" INTEGER NOT NULL,
    "statusAktif" TEXT NOT NULL DEFAULT 'aktif',
    CONSTRAINT "Umat_lingkunganId_fkey" FOREIGN KEY ("lingkunganId") REFERENCES "Lingkungan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Umat" ("id", "lingkunganId", "namaBaptis", "namaLengkap", "statusAktif") SELECT "id", "lingkunganId", "namaBaptis", "namaLengkap", "statusAktif" FROM "Umat";
DROP TABLE "Umat";
ALTER TABLE "new_Umat" RENAME TO "Umat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "DataBaptis_umatId_key" ON "DataBaptis"("umatId");

-- CreateIndex
CREATE UNIQUE INDEX "DataKrisma_umatId_key" ON "DataKrisma"("umatId");

-- CreateIndex
CREATE UNIQUE INDEX "DataPernikahan_umatId_key" ON "DataPernikahan"("umatId");
