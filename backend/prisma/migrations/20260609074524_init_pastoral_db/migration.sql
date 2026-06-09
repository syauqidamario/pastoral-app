-- CreateTable
CREATE TABLE "Wilayah" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namaWilayah" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Lingkungan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namaLingkungan" TEXT NOT NULL,
    "wilayahId" INTEGER NOT NULL,
    CONSTRAINT "Lingkungan_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Umat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "namaLengkap" TEXT NOT NULL,
    "namaBaptis" TEXT,
    "lingkunganId" INTEGER NOT NULL,
    "sudahBaptis" BOOLEAN NOT NULL DEFAULT false,
    "sudahKomuni" BOOLEAN NOT NULL DEFAULT false,
    "sudahKrisma" BOOLEAN NOT NULL DEFAULT false,
    "sudahMenikah" BOOLEAN NOT NULL DEFAULT false,
    "statusAktif" TEXT NOT NULL DEFAULT 'aktif',
    CONSTRAINT "Umat_lingkunganId_fkey" FOREIGN KEY ("lingkunganId") REFERENCES "Lingkungan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
