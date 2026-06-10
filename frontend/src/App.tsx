import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import DaftarUmat from "./pages/DaftarUmat";
import TambahUmat from "./pages/TambahUmat";
import KelolaLingkungan from "./pages/KelolaLingkungan";
import Login from "./pages/Login";
import InboxPengajuan from "./pages/InboxPengajuan";
import About from "./pages/About"; // 👈 Import Baru
import Topics from "./pages/Topics"; // 👈 Import Baru

export interface DataBaptis {
  id: number;
  tanggalBaptis: string;
  tempatBaptis: string;
  nomorLB: string;
  namaRomo: string;
  waliBaptis: string;
}

export interface DataKrisma {
  id: number;
  tanggalKrisma: string;
  nomorLC: string;
  namaUskupRomo: string;
  namaPelindung: string;
}

export interface DataPernikahan {
  id: number;
  namaPasangan: string;
  tanggalPernikahan: string;
  nomorLM: string;
  tempatMenikah: string;
  namaSaksi1: string;
  namaSaksi2: string;
}

export interface Umat {
  id: string;
  namaLengkap: string;
  namaBaptis?: string | null;
  lingkungan?: {
    id: number;
    namaLingkungan: string;
  };
  dataBaptis?: DataBaptis | null;
  dataKrisma?: DataKrisma | null;
  pernikahan?: DataPernikahan | null;
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
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);

  const [role, setRole] = useState<
    "WARGA" | "KETUA_LINGKUNGAN" | "PASTOR" | null
  >(null);
  const [username, setUserName] = useState("");

  const isAdmin = role === "PASTOR" || role === "KETUA_LINGKUNGAN";

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
      console.error(error);
    }
  };

  const fetchLingkungan = async () => {
    try {
      const response = await axios.get<Lingkungan[]>(
        "http://localhost:5001/api/lingkungan",
      );
      setLingkunganList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWilayah = async () => {
    try {
      const response = await axios.get<Wilayah[]>(
        "http://localhost:5001/api/wilayah",
      );
      setWilayahList(response.data);
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }
  };

  const handleHapusUmat = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/umat/${id}`);
      fetchUmat();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data.");
    }
  };

  return (
    <BrowserRouter>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        {/* Header Bar */}
        {role && (
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
            <div>
              <h2 style={{ margin: 0 }}>Portal Pastoral Lingkungan</h2>
              <small style={{ color: "#666" }}>
                Selamat datang, <strong>{username}</strong>
              </small>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span
                style={{
                  backgroundColor: isAdmin ? "#d4edda" : "#e2e3e5",
                  color: isAdmin ? "#155724" : "#383d41",
                  padding: "5px 10px",
                  borderRadius: "15px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                📌 Jabatan: {role.replace("_", " ")}
              </span>
              <button
                onClick={() => {
                  setRole(null);
                  setUserName("");
                }}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Keluar 🚪
              </button>
            </div>
          </div>
        )}

        {/* Menu Navigasi Utama */}
        {role && (
          <nav
            style={{
              margin: "20px 0",
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
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

            {/* 🌐 Menu Baru: Terbuka untuk semua Level Akses (Warga & Admin) */}
            <Link
              to="/topics"
              style={{
                textDecoration: "none",
                color: "#17a2b8",
                fontWeight: "bold",
              }}
            >
              📰 Topik Pastoral
            </Link>
            <Link
              to="/about"
              style={{
                textDecoration: "none",
                color: "#6f42c1",
                fontWeight: "bold",
              }}
            >
              ⛪ Tentang Paroki
            </Link>

            {isAdmin && (
              <>
                <span style={{ color: "#ccc" }}>|</span>
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
                    color: "#868e96",
                    fontWeight: "bold",
                  }}
                >
                  ⚙️ Struktur Paroki
                </Link>
                <Link
                  to="/inbox"
                  style={{
                    textDecoration: "none",
                    color: "#dc3545",
                    fontWeight: "bold",
                  }}
                >
                  📥 Inbox Validasi
                </Link>
              </>
            )}
          </nav>
        )}

        {role && <hr />}

        {/* Pemetaan Rute Halaman */}
        <Routes>
          <Route
            path="/login"
            element={
              !role ? (
                <Login setRole={setRole} setUserName={setUserName} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/"
            element={
              role ? (
                <DaftarUmat umat={umat} role={role} onHapus={handleHapusUmat} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Rute Halaman Umum Baru */}
          <Route
            path="/about"
            element={role ? <About /> : <Navigate to="/login" />}
          />
          <Route
            path="/topics"
            element={role ? <Topics /> : <Navigate to="/login" />}
          />

          {/* Rute Khusus Admin */}
          <Route
            path="/tambah"
            element={
              isAdmin ? (
                <TambahUmat
                  onTambah={handleTambahUmat}
                  lingkunganList={lingkunganList}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/kelola"
            element={
              isAdmin ? (
                <KelolaLingkungan
                  wilayahList={wilayahList}
                  onRefresh={refreshSemuaData}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/inbox"
            element={
              isAdmin ? (
                <InboxPengajuan role={role} onRefreshUtama={refreshSemuaData} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
