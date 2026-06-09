import { useState } from "react";

// Struktur data lingkungan untuk Dropdown
interface Lingkungan {
  id: number;
  namaLingkungan: string;
}

interface TambahUmatProps {
  onTambah: (nama: string, lingkunganId: number) => void;
  lingkunganList: Lingkungan[]; // Menerima daftar lingkungan dari App.tsx
}

export default function TambahUmat({
  onTambah,
  lingkunganList,
}: TambahUmatProps) {
  const [nama, setNama] = useState("");
  const [selectedLingkunganId, setSelectedLingkunganId] = useState<number | "">(
    "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !selectedLingkunganId)
      return alert("Mohon isi nama dan pilih lingkungan!");

    // Kirim data nama dan ID lingkungan dalam bentuk angka ke App.tsx
    onTambah(nama, Number(selectedLingkunganId));

    // Reset Form
    setNama("");
    setSelectedLingkunganId("");
    alert("Data umat berhasil disimpan ke database!");
  };

  return (
    <div style={{ maxWidth: "400px", marginTop: "20px" }}>
      <h3>Formulir Tambah Umat Baru (Khusus Pengurus)</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Nama Lengkap Umat:
          </label>
          <input
            placeholder="Contoh: Yohanes Paul"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Pilih Lingkungan:
          </label>
          <select
            value={selectedLingkunganId}
            onChange={(e) =>
              setSelectedLingkunganId(
                e.target.value ? Number(e.target.value) : "",
              )
            }
            style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
          >
            <option value="">-- Klik untuk memilih --</option>
            {lingkunganList.map((lingk) => (
              <option key={lingk.id} value={lingk.id}>
                {lingk.namaLingkungan}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Simpan Data Umat
        </button>
      </form>
    </div>
  );
}
