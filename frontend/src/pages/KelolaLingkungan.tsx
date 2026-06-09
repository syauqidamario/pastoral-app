import { useState } from "react";
import axios from "axios";

interface Lingkungan {
  id: number;
  namaLingkungan: string;
}

interface Wilayah {
  id: number;
  namaWilayah: string;
  lingkungan: Lingkungan[];
}

interface KelolaProps {
  wilayahList: Wilayah[];
  onRefresh: () => void;
}

export default function KelolaLingkungan({
  wilayahList,
  onRefresh,
}: KelolaProps) {
  const [namaWilayah, setNamaWilayah] = useState("");
  const [namaLingkungan, setNamaLingkungan] = useState("");
  const [selectedWilayahId, setSelectedWilayahId] = useState<number | "">("");

  // Handle Tambah Wilayah
  const handleAddWilayah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaWilayah) return alert("Isi nama wilayah!");
    try {
      await axios.post("http://localhost:5001/api/wilayah", { namaWilayah });
      setNamaWilayah("");
      onRefresh(); // Memicu refresh data di App.tsx
      alert("Wilayah baru berhasil ditambahkan!");
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Tambah Lingkungan
  const handleAddLingkungan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLingkungan || !selectedWilayahId)
      return alert("Isi nama lingkungan dan pilih wilayah!");
    try {
      await axios.post("http://localhost:5001/api/lingkungan", {
        namaLingkungan,
        wilayahId: Number(selectedWilayahId),
      });
      setNamaLingkungan("");
      setSelectedWilayahId("");
      onRefresh(); // Memicu refresh data di App.tsx
      alert("Lingkungan baru berhasil ditambahkan!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
      {/* KIRI: Form Input */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        {/* Form Wilayah */}
        <form
          onSubmit={handleAddWilayah}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <h4>1. Tambah Wilayah Baru</h4>
          <input
            placeholder="Contoh: Wilayah St. Petrus"
            value={namaWilayah}
            onChange={(e) => setNamaWilayah(e.target.value)}
            style={{
              padding: "8px",
              width: "100%",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Simpan Wilayah
          </button>
        </form>

        {/* Form Lingkungan */}
        <form
          onSubmit={handleAddLingkungan}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <h4>2. Tambah Lingkungan Baru</h4>
          <select
            value={selectedWilayahId}
            onChange={(e) =>
              setSelectedWilayahId(e.target.value ? Number(e.target.value) : "")
            }
            style={{
              padding: "8px",
              width: "100%",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          >
            <option value="">-- Pilih Wilayah Naungan --</option>
            {wilayahList.map((w) => (
              <option key={w.id} value={w.id}>
                {w.namaWilayah}
              </option>
            ))}
          </select>
          <input
            placeholder="Contoh: Lingkungan St. Agustinus"
            value={namaLingkungan}
            onChange={(e) => setNamaLingkungan(e.target.value)}
            style={{
              padding: "8px",
              width: "100%",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Simpan Lingkungan
          </button>
        </form>
      </div>

      {/* KANAN: Struktur Tree Wilayah & Lingkungan Saat Ini */}
      <div
        style={{ flex: 1, borderLeft: "2px solid #eee", paddingLeft: "20px" }}
      >
        <h4>Daftar Hierarki Struktur Pastoral</h4>
        {wilayahList.map((w) => (
          <div key={w.id} style={{ marginBottom: "15px" }}>
            <strong style={{ color: "#007bff" }}>
              🏢 {w.namaWilayah} (ID: {w.id})
            </strong>
            <ul style={{ marginTop: "5px" }}>
              {w.lingkungan.length === 0 ? (
                <li style={{ color: "#999", listStyleType: "none" }}>
                  {" "}
                  belum ada lingkungan
                </li>
              ) : (
                w.lingkungan.map((l) => (
                  <li key={l.id}>
                    🌌 {l.namaLingkungan}{" "}
                    <span style={{ fontSize: "12px", color: "#888" }}>
                      (ID: {l.id})
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
