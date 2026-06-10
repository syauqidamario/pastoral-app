-- CreateTable
CREATE TABLE "Pengajuan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "umatId" TEXT NOT NULL,
    "jenisSakramen" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "catatanPenolakan" TEXT,
    "dataForm" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pengajuan_umatId_fkey" FOREIGN KEY ("umatId") REFERENCES "Umat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
