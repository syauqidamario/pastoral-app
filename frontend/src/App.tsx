import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import DaftarUmat from "./pages/DaftarUmat";
import TambahUmat from "./pages/TambahUmat";
import KelolaLingkungan from "./pages/KelolaLingkungan";
import Login from "./pages/Login";
import InboxPengajuan from "./pages/InboxPengajuan"; // Import halaman inbox validasi berkas

// ====================================================
// STRUCTURE INTERFACES (STRUKTUR DATA SAKRAMEN RELASIONAL)
// ====================================================
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

// ====================================================
// MAIN COMPONENT APPLICATION
// ====================================================
function App() {
  const [umat, setUmat] = useState<Umat[]>([]);
  const [lingkunganList, setLingkunganList] = useState<Lingkungan[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);

  // Status Akun Login (WARGA / KETUA_LINGKUNGAN / PASTOR / null)
  const [role, setRole] = useState<
    "WARGA" | "KETUA_LINGKUNGAN" | "PASTOR" | null
  >(null);
  const [username, setUserName] = useState("");

  // Menentukan status hak akses pengurus (Admin)
  const isAdmin = role === "PASTOR" || role === "KETUA_LINGKUNGAN";

  useEffect(() => {
    refreshSemuaData();
  }, []);

  const refreshSemuaData = () => {
    fetchUmat();
    fetchLingkungan();
    fetchWilayah();
  };

  // 📡 PENGAMBILAN DATA (API GET FETCH)
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

  // ➕ HANDLER: Menambah Umat Baru Dasar
  const handleTambahUmat = async (nama: string, idLingkungan: number) => {
    try {
      await axios.post("http://localhost:5001/api/umat", {
        namaLengkap: nama,
        lingkunganId: idLingkungan,
      });
      fetchUmat(); // Refresh tabel setelah ditambah
    } catch (error) {
      console.error("Gagal menambah umat:", error);
    }
  };

  // 🗑️ HANDLER: Menghapus Data Umat dari Database
  const handleHapusUmat = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/umat/${id}`);
      fetchUmat(); // Refresh tabel setelah dihapus
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data umat dari server.");
    }
  };

  return (
    <BrowserRouter>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        {/* ==================================================== */}
        {/* HEADER APLIKASI (Hanya muncul jika sudah login) */}
        {/* ==================================================== */}
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

        {/* ==================================================== */}
        {/* MENU NAVIGASI UTAMA (Hanya muncul jika sudah login) */}
        {/* ==================================================== */}
        {role && (
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
            {isAdmin && (
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

        {/* ==================================================== */}
        {/* PEMETAAN RUTE JALUR HALAMAN (ROUTING SYSTEM) */}
        {/* ==================================================== */}
        <Routes>
          {/* Gerbang Login Utama */}
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

          {/* Halaman Utama: Daftar Tabel Berkas Umat */}
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

          {/* Halaman Tambah Umat Baru (Khusus Pengurus) */}
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

          {/* Halaman Kelola Struktur Hierarki Wilayah/Lingkungan (Khusus Pengurus) */}
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

          {/* Halaman Kotak Masuk Validasi Pengajuan Sakramen (Khusus Pengurus) */}
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
