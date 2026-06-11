import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css"; // 👈 Mengimpor sistem responsif kita

interface BukuBaptis {
  id: string;
  nomorLB: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  namaAyah: string;
  namaIbu: string;
  tanggalBaptis: string;
  tempatBaptis: string;
  namaRomo: string;
  waliBaptisPria: string;
  waliBaptisWanita: string;
  tanggalKrisma?: string | null;
  tempatKrisma?: string | null;
  nomorLC?: string | null;
  tanggalNikah?: string | null;
  tempatNikah?: string | null;
  nomorLM?: string | null;
  namaPasangan?: string | null;
  catatanPinggirLain?: string | null;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"ADMIN" | "UMAT" | null>(null);
  const [loggedUsername, setLoggedUsername] = useState("");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const [records, setRecords] = useState<BukuBaptis[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: "",
    nomorLB: "",
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    namaAyah: "",
    namaIbu: "",
    tanggalBaptis: "",
    tempatBaptis: "Gereja Paroki",
    namaRomo: "",
    waliBaptisPria: "",
    waliBaptisWanita: "",
    tanggalKrisma: "",
    tempatKrisma: "",
    nomorLC: "",
    tanggalNikah: "",
    tempatNikah: "",
    nomorLM: "",
    namaPasangan: "",
    catatanPinggirLain: "",
  });

  const [myCertificate, setMyCertificate] = useState<BukuBaptis | null>(null);

  useEffect(() => {
    if (isLoggedIn && userRole === "ADMIN") fetchAllRecords();
  }, [isLoggedIn, userRole]);

  const fetchAllRecords = async () => {
    try {
      const res = await axios.get<BukuBaptis[]>(
        "http://localhost:5002/api/baptis",
      );
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await axios.post(
        "http://localhost:5002/api/login",
        loginForm,
      );
      setIsLoggedIn(true);
      setUserRole(res.data.role);
      setLoggedUsername(res.data.username);
      if (res.data.role === "UMAT") setMyCertificate(res.data.bukuBaptis);
    } catch (err: any) {
      setLoginError(err.response?.data?.error || "Gagal masuk.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setLoggedUsername("");
    setMyCertificate(null);
    setLoginForm({ username: "", password: "" });
  };

  const resetForm = () => {
    setForm({
      id: "",
      nomorLB: "",
      namaLengkap: "",
      tempatLahir: "",
      tanggalLahir: "",
      namaAyah: "",
      namaIbu: "",
      tanggalBaptis: "",
      tempatBaptis: "Gereja Paroki",
      namaRomo: "",
      waliBaptisPria: "",
      waliBaptisWanita: "",
      tanggalKrisma: "",
      tempatKrisma: "",
      nomorLC: "",
      tanggalNikah: "",
      tempatNikah: "",
      nomorLM: "",
      namaPasangan: "",
      catatanPinggirLain: "",
    });
    setIsEditing(false);
  };

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5002/api/baptis/${form.id}`, form);
        alert("🎉 Data berhasil diperbarui!");
      } else {
        await axios.post("http://localhost:5002/api/baptis", form);
        alert("🎉 Sukses mendaftarkan lembar baru!");
      }
      resetForm();
      fetchAllRecords();
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal.");
    }
  };

  const handleEditClick = (r: BukuBaptis) => {
    setIsEditing(true);
    setForm({
      id: r.id,
      nomorLB: r.nomorLB,
      namaLengkap: r.namaLengkap,
      tempatLahir: r.tempatLahir,
      tanggalLahir: r.tanggalLahir ? r.tanggalLahir.split("T")[0] : "",
      namaAyah: r.namaAyah,
      namaIbu: r.namaIbu,
      tanggalBaptis: r.tanggalBaptis ? r.tanggalBaptis.split("T")[0] : "",
      tempatBaptis: r.tempatBaptis,
      namaRomo: r.namaRomo,
      waliBaptisPria: r.waliBaptisPria,
      waliBaptisWanita: r.waliBaptisWanita,
      tanggalKrisma: r.tanggalKrisma ? r.tanggalKrisma.split("T")[0] : "",
      tempatKrisma: r.tempatKrisma || "",
      nomorLC: r.nomorLC || "",
      tanggalNikah: r.tanggalNikah ? r.tanggalNikah.split("T")[0] : "",
      tempatNikah: r.tempatNikah || "",
      nomorLM: r.nomorLM || "",
      namaPasangan: r.namaPasangan || "",
      catatanPinggirLain: r.catatanPinggirLain || "",
    });
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Hapus lembar arsip secara permanen?")) return;
    try {
      await axios.delete(`http://localhost:5002/api/baptis/${id}`);
      fetchAllRecords();
      resetForm();
    } catch (err) {
      alert("Gagal.");
    }
  };

  const recordsFiltered = records.filter(
    (r) =>
      r.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nomorLB.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          padding: "15px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "380px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <h2 style={{ margin: "0 0 5px 0", color: "#1e293b" }}>
              {" "}
              Anamnesis Baptis
            </h2>
            <small style={{ color: "#64748b", fontWeight: "bold" }}>
              Masuk Dokumen Buku Besar
            </small>
          </div>
          <form
            onSubmit={handleLoginSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                Username / Nomor LB
              </label>
              <input
                type="text"
                required
                placeholder="adminparoki atau Nomor LB"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  boxSizing: "border-box",
                  borderRadius: "5px",
                  border: "1px solid #cbd5e1",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                Password Keamanan
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  boxSizing: "border-box",
                  borderRadius: "5px",
                  border: "1px solid #cbd5e1",
                }}
              />
            </div>
            {loginError && (
              <div
                style={{
                  color: "#ef4444",
                  backgroundColor: "#fef2f2",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                ⚠️ {loginError}
              </div>
            )}
            <button
              type="submit"
              style={{
                padding: "12px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Masuk Sesi 🔑
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* HEADER BANNER RESPONSIF */}
      <div
        className="header-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1e293b",
          padding: "15px 20px",
          borderRadius: "8px",
          color: "white",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "20px" }}>
            📖 Liber Baptizatorum Digital
          </h2>
          <small style={{ color: "#94a3b8" }}>
            Sesi: <strong>{loggedUsername}</strong> (
            {userRole === "ADMIN" ? "🛡️ Administrator" : "👤 Umat Paroki"})
          </small>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Keluar 🚪
        </button>
      </div>

      {/* SISI UMAT */}
      {userRole === "UMAT" && myCertificate && (
        <div
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderLeft: "8px solid #2563eb",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              fontFamily: "serif",
              boxSizing: "border-box",
              overflowX: "hidden",
            }}
          >
            <div
              style={{
                textAlign: "center",
                borderBottom: "2px double #333",
                paddingBottom: "15px",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "22px" }}>
                Testimonium Baptismi
              </h2>
              <small>
                No Buku Besar: <strong>{myCertificate.nomorLB}</strong>
              </small>
            </div>
            <p style={{ fontSize: "14px" }}>
              Menerangkan dengan sah bahwa umat bernama:{" "}
              <strong
                style={{
                  fontSize: "18px",
                  color: "#1e3a8a",
                  display: "block",
                  margin: "5px 0",
                }}
              >
                {myCertificate.namaLengkap}
              </strong>
            </p>

            {/* Responsivitas Konten Piagam Mandiri */}
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table
                style={{
                  width: "100%",
                  fontSize: "14px",
                  lineHeight: "2",
                  marginBottom: "20px",
                  minWidth: "300px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "110px" }}>Lahir di</td>
                    <td>
                      : {myCertificate.tempatLahir},{" "}
                      {new Date(myCertificate.tanggalLahir).toLocaleDateString(
                        "id-ID",
                        { dateStyle: "long" },
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Nama Ayah</td>
                    <td>: {myCertificate.namaAyah}</td>
                  </tr>
                  <tr>
                    <td>Nama Ibu</td>
                    <td>: {myCertificate.namaIbu}</td>
                  </tr>
                  <tr style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ paddingTop: "8px" }}>
                      <strong>Telah Dibaptis</strong>
                    </td>
                    <td style={{ paddingTop: "8px" }}>
                      : Tanggal{" "}
                      <strong>
                        {new Date(
                          myCertificate.tanggalBaptis,
                        ).toLocaleDateString("id-ID", { dateStyle: "long" })}
                      </strong>{" "}
                      di {myCertificate.tempatBaptis}
                    </td>
                  </tr>
                  <tr>
                    <td>Oleh Romo</td>
                    <td>: {myCertificate.namaRomo}</td>
                  </tr>
                  <tr>
                    <td>Wali Baptis</td>
                    <td>
                      : {myCertificate.waliBaptisPria} &{" "}
                      {myCertificate.waliBaptisWanita}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontFamily: "sans-serif",
                fontSize: "12px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#334155",
                  borderBottom: "1px solid #cbd5e1",
                  paddingBottom: "4px",
                }}
              >
                📜 Notae Marginales (Catatan Pinggir Resmi):
              </h4>
              {myCertificate.nomorLC ? (
                <div style={{ marginBottom: "6px" }}>
                  🔹 <strong>Sakramen Krisma:</strong> Diterima pada{" "}
                  {new Date(myCertificate.tanggalKrisma!).toLocaleDateString(
                    "id-ID",
                  )}{" "}
                  di {myCertificate.tempatKrisma} (Reg LC:{" "}
                  {myCertificate.nomorLC})
                </div>
              ) : (
                <div style={{ color: "#94a3b8" }}>
                  🔹 Belum ada catatan Sakramen Krisma.
                </div>
              )}

              {myCertificate.nomorLM ? (
                <div style={{ marginTop: "6px" }}>
                  🔹 <strong>Sakramen Pernikahan:</strong> Menikah dengan{" "}
                  <strong>{myCertificate.namaPasangan}</strong> pada{" "}
                  {new Date(myCertificate.tanggalNikah!).toLocaleDateString(
                    "id-ID",
                  )}{" "}
                  di {myCertificate.tempatNikah} (Reg LM:{" "}
                  {myCertificate.nomorLM})
                </div>
              ) : (
                <div style={{ color: "#94a3b8", marginTop: "4px" }}>
                  🔹 Belum ada catatan Sakramen Pernikahan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SISI ADMIN RESPONSIVE FLEX LAYOUT */}
      {userRole === "ADMIN" && (
        <div className="dashboard-grid">
          {/* PANEL INPUT FORM */}
          <div className="panel-form">
            <h3
              style={{
                marginTop: 0,
                borderBottom: "2px solid #10b981",
                paddingBottom: "8px",
                fontSize: "16px",
              }}
            >
              {isEditing ? "📝 Edit Berkas Buku Besar" : "➕ Input Lembar Baru"}
            </h3>
            <form
              onSubmit={handleSaveRecord}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "13px",
              }}
            >
              <input
                type="text"
                required
                placeholder="Nomor Buku Besar (No. LB)"
                value={form.nomorLB}
                onChange={(e) => setForm({ ...form, nomorLB: e.target.value })}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                required
                placeholder="Nama Lengkap Umat"
                value={form.namaLengkap}
                onChange={(e) =>
                  setForm({ ...form, namaLengkap: e.target.value })
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />

              <div
                className="form-row-flex"
                style={{ display: "flex", gap: "5px" }}
              >
                <input
                  type="text"
                  required
                  placeholder="Tempat Lahir"
                  value={form.tempatLahir}
                  onChange={(e) =>
                    setForm({ ...form, tempatLahir: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="date"
                  required
                  value={form.tanggalLahir}
                  onChange={(e) =>
                    setForm({ ...form, tanggalLahir: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div
                className="form-row-flex"
                style={{ display: "flex", gap: "5px" }}
              >
                <input
                  type="text"
                  required
                  placeholder="Nama Ayah"
                  value={form.namaAyah}
                  onChange={(e) =>
                    setForm({ ...form, namaAyah: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="Nama Ibu Kandung"
                  value={form.namaIbu}
                  onChange={(e) =>
                    setForm({ ...form, namaIbu: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div
                className="form-row-flex"
                style={{ display: "flex", gap: "5px" }}
              >
                <input
                  type="date"
                  required
                  value={form.tanggalBaptis}
                  onChange={(e) =>
                    setForm({ ...form, tanggalBaptis: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="Tempat Baptis"
                  value={form.tempatBaptis}
                  onChange={(e) =>
                    setForm({ ...form, tempatBaptis: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <input
                type="text"
                required
                placeholder="Romo Pembaptis"
                value={form.namaRomo}
                onChange={(e) => setForm({ ...form, namaRomo: e.target.value })}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />

              <div
                className="form-row-flex"
                style={{ display: "flex", gap: "5px" }}
              >
                <input
                  type="text"
                  required
                  placeholder="Wali Pria"
                  value={form.waliBaptisPria}
                  onChange={(e) =>
                    setForm({ ...form, waliBaptisPria: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="Wali Wanita"
                  value={form.waliBaptisWanita}
                  onChange={(e) =>
                    setForm({ ...form, waliBaptisWanita: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <strong style={{ marginTop: "5px", color: "#15803d" }}>
                🕊️ Catatan Krisma
              </strong>
              <input
                type="text"
                placeholder="No LC Krisma"
                value={form.nomorLC}
                onChange={(e) => setForm({ ...form, nomorLC: e.target.value })}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <div
                className="form-row-flex"
                style={{ display: "flex", gap: "5px" }}
              >
                <input
                  type="date"
                  value={form.tanggalKrisma}
                  onChange={(e) =>
                    setForm({ ...form, tanggalKrisma: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="text"
                  placeholder="Tempat Krisma"
                  value={form.tempatKrisma}
                  onChange={(e) =>
                    setForm({ ...form, tempatKrisma: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <strong style={{ marginTop: "5px", color: "#b45309" }}>
                💍 Catatan Pernikahan
              </strong>
              <input
                type="text"
                placeholder="Nama Pasangan Hidup"
                value={form.namaPasangan}
                onChange={(e) =>
                  setForm({ ...form, namaPasangan: e.target.value })
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                placeholder="No LM Pernikahan"
                value={form.nomorLM}
                onChange={(e) => setForm({ ...form, nomorLM: e.target.value })}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <div
                className="form-row-flex"
                style={{ display: "flex", gap: "5px" }}
              >
                <input
                  type="date"
                  value={form.tanggalNikah}
                  onChange={(e) =>
                    setForm({ ...form, tanggalNikah: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="text"
                  placeholder="Tempat Menikah"
                  value={form.tempatNikah}
                  onChange={(e) =>
                    setForm({ ...form, tempatNikah: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "10px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                {isEditing
                  ? "Terapkan Perubahan Data"
                  : "Masukkan ke Buku Besar"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "6px",
                    backgroundColor: "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Batal Edit
                </button>
              )}
            </form>
          </div>

          {/* PANEL KANAN: LIST VIEW TABEL RESPONSIVITAS TINGGI */}
          <div className="panel-tabel">
            <input
              type="text"
              placeholder="🔍 Cari cepat via Nama / Nomor LB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
                marginBottom: "15px",
              }}
            />

            {/* Container Khusus untuk Mencegah Tabel Rusak di HP */}
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f8fafc",
                      borderBottom: "2px solid #e2e8f0",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "10px" }}>No LB</th>
                    <th style={{ padding: "10px" }}>Nama Umat</th>
                    <th style={{ padding: "10px" }}>Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody>
                  {recordsFiltered.map((r) => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          color: "#1e3a8a",
                        }}
                      >
                        {r.nomorLB}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <strong>{r.namaLengkap}</strong>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          Ibu: {r.namaIbu}
                        </div>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button
                            onClick={() => handleEditClick(r)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#3b82f6",
                              color: "white",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                          >
                            Edit ⚙️
                          </button>
                          <button
                            onClick={() => handleDeleteClick(r.id)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                          >
                            Hapus 🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
