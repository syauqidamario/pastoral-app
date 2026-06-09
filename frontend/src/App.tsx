import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DaftarUmat from "./pages/DaftarUmat";
import TambahUmat from "./pages/TambahUmat";
import KelolaLingkungan from "./pages/KelolaLingkungan"; // Import halaman baru

export interface Umat {
  id: string;
  namaLengkap: string;
  sudahKrisma: boolean;
  lingkungan?: {
    id: number;
    namaLingkungan: string;
  };
}

interface Lingkungan {
  id: number;
  namaLingkungan: string;
}

interface Wilayah {
  id: number;
  namaWilayah: string;
  lingkungan: Lingkungan[];
}

function App() {
  const [umat, setUmat] = useState<Umat[]>([]);
  const [lingkunganList, setLingkunganList] = useState<Lingkungan[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]); // State baru untuk wilayah
  const [role, setRole] = useState<"warga" | "admin">("warga");

  useEffect(() => {
    refreshSemuaData();
  }, []);

  const refreshSemuaData = () => {
    fetchUmat();
    fetchLingkungan();
    fetchWilayah();
  };

  const fetchUmat = async () => {
    try {
      const response = await axios.get<Umat[]>(
        "http://localhost:5001/api/umat",
      );
      setUmat(response.data);
    } catch (error) {
      console.error("Gagal mengambil data umat:", error);
    }
  };

  const fetchLingkungan = async () => {
    try {
      const response = await axios.get<Lingkungan[]>(
        "http://localhost:5001/api/lingkungan",
      );
      setLingkunganList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data lingkungan:", error);
    }
  };

  const fetchWilayah = async () => {
    try {
      const response = await axios.get<Wilayah[]>(
        "http://localhost:5001/api/wilayah",
      );
      setWilayahList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data wilayah:", error);
    }
  };

  const handleTambahUmat = async (nama: string, idLingkungan: number) => {
    try {
      await axios.post("http://localhost:5001/api/umat", {
        namaLengkap: nama,
        lingkunganId: idLingkungan,
      });
      fetchUmat();
    } catch (error) {
      console.error("Gagal menambah data:", error);
    }
  };

  return (
    <BrowserRouter>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          <h2>Portal Pastoral Lingkungan</h2>
          <div>
            <span style={{ marginRight: "10px" }}>Masuk sebagai: </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "warga" | "admin")}
            >
              <option value="warga">Warga Lingkungan</option>
              <option value="admin">Admin (Romo/Ketua)</option>
            </select>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav style={{ margin: "20px 0", display: "flex", gap: "15px" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: "bold",
            }}
          >
            📋 Daftar Umat
          </Link>
          {role === "admin" && (
            <>
              <Link
                to="/tambah"
                style={{
                  textDecoration: "none",
                  color: "#28a745",
                  fontWeight: "bold",
                }}
              >
                ➕ Tambah Umat
              </Link>
              <Link
                to="/kelola"
                style={{
                  textDecoration: "none",
                  color: "#e0a800",
                  fontWeight: "bold",
                }}
              >
                ⚙️ Kelola Lingkungan
              </Link>
            </>
          )}
        </nav>

        <hr />

        {/* Penjelajah Rute Halaman */}
        <Routes>
          <Route path="/" element={<DaftarUmat umat={umat} role={role} />} />
          <Route
            path="/tambah"
            element={
              role === "admin" ? (
                <TambahUmat
                  onTambah={handleTambahUmat}
                  lingkunganList={lingkunganList}
                />
              ) : (
                <h3 style={{ color: "red" }}>
                  Akses Ditolak! Anda bukan pengurus/admin.
                </h3>
              )
            }
          />
          <Route
            path="/kelola"
            element={
              role === "admin" ? (
                <KelolaLingkungan
                  wilayahList={wilayahList}
                  onRefresh={refreshSemuaData}
                />
              ) : (
                <h3 style={{ color: "red" }}>
                  Akses Ditolak! Anda bukan pengurus/admin.
                </h3>
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
