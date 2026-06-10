import { useState } from "react";
import axios from "axios";
import type { Umat } from "../App";

interface DaftarUmatProps {
  umat: Umat[];
  role: "WARGA" | "KETUA_LINGKUNGAN" | "PASTOR";
  onHapus?: (id: string) => void;
}

export default function DaftarUmat({ umat, role, onHapus }: DaftarUmatProps) {
  const isAdmin = role === "PASTOR" || role === "KETUA_LINGKUNGAN";
  const [detailUmat, setDetailUmat] = useState<Umat | null>(null);

  // State untuk form pengajuan warga
  const [showFormJenis, setShowFormJenis] = useState<
    "BAPTIS" | "KRISMA" | null
  >(null);
  const [formBaptis, setFormBaptis] = useState({
    namaBaptis: "",
    tanggalBaptis: "",
    tempatBaptis: "",
    nomorLB: "",
    namaRomo: "",
    waliBaptis: "",
  });
  const [formKrisma, setFormKrisma] = useState({
    tanggalKrisma: "",
    nomorLC: "",
    namaUskupRomo: "",
    namaPelindung: "",
  });

  const formatTanggal = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const kirimPengajuan = async (jenis: "BAPTIS" | "KRISMA") => {
    if (!detailUmat) return;
    const payloadData = jenis === "BAPTIS" ? formBaptis : formKrisma;

    try {
      await axios.post("http://localhost:5001/api/pengajuan", {
        umatId: detailUmat.id,
        jenisSakramen: jenis,
        dataForm: payloadData,
      });
      alert(
        `🎉 Sukses! Pengajuan berkas ${jenis} berhasil dikirim ke Ketua Lingkungan untuk ditinjau.`,
      );
      setShowFormJenis(null);
      setDetailUmat(null);
    } catch (error) {
      alert("Gagal mengirim pengajuan berkas.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <h3>Daftar Umat ({isAdmin ? "Mode Admin / Pengurus" : "Mode Warga"})</h3>

      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "15px",
          fontFamily: "sans-serif",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
            <th>Nama Lengkap</th>
            <th>Lingkungan</th>
            <th>Baptis</th>
            <th>Krisma</th>
            <th>Pernikahan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {umat.map((u) => (
            <tr key={u.id}>
              <td>
                <strong>{u.namaLengkap}</strong>
                {u.namaBaptis && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#555",
                      fontStyle: "italic",
                    }}
                  >
                    Nama Baptis: {u.namaBaptis}
                  </span>
                )}
              </td>
              <td>{u.lingkungan?.namaLingkungan || "Tanpa Lingkungan"}</td>
              <td>{u.dataBaptis ? "💧 Sudah" : "❌ Belum"}</td>
              <td>{u.dataKrisma ? "🕊️ Sudah" : "❌ Belum"}</td>
              <td>{u.pernikahan ? "💍 Menikah" : "⛪ Belum"}</td>
              <td>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      setDetailUmat(u);
                      setShowFormJenis(null);
                    }}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    👁️ Lihat Berkas
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onHapus && onHapus(u.id)}
                      style={{
                        color: "red",
                        backgroundColor: "transparent",
                        border: "1px solid red",
                        borderRadius: "3px",
                        padding: "4px 8px",
                        cursor: "pointer",
                      }}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL POP-UP DETAIL + FORM WORKFLOW */}
      {detailUmat && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "550px",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #eee",
                paddingBottom: "10px",
              }}
            >
              <h3 style={{ margin: 0 }}>📜 Berkas Administrasi Sakramen</h3>
              <button
                onClick={() => setDetailUmat(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>

            <p style={{ marginTop: "10px" }}>
              <strong>Nama Umat:</strong> {detailUmat.namaLengkap}
            </p>

            {/* AREA TAMPIL DATA / FORM BAPTIS */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "12px",
                borderRadius: "5px",
                margin: "15px 0",
                borderLeft: "4px solid #17a2b8",
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: "#17a2b8" }}>
                💧 Sakramen Baptis
              </h4>
              {detailUmat.dataBaptis ? (
                <div style={{ fontSize: "14px" }}>
                  <div>
                    <strong>No Buku LB:</strong> {detailUmat.dataBaptis.nomorLB}{" "}
                    | <strong>Romo:</strong> {detailUmat.dataBaptis.namaRomo}
                  </div>
                  <div>
                    <strong>Tanggal:</strong>{" "}
                    {formatTanggal(detailUmat.dataBaptis.tanggalBaptis)}
                  </div>
                </div>
              ) : role === "WARGA" && showFormJenis !== "BAPTIS" ? (
                <button
                  onClick={() => setShowFormJenis("BAPTIS")}
                  style={{
                    backgroundColor: "#17a2b8",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  ✍️ Ajukan Surat Baptis
                </button>
              ) : showFormJenis === "BAPTIS" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  <input
                    placeholder="Nama Santo/Santa Baptis"
                    onChange={(e) =>
                      setFormBaptis({
                        ...formBaptis,
                        namaBaptis: e.target.value,
                      })
                    }
                    style={{ padding: "5px" }}
                  />
                  <input
                    type="date"
                    onChange={(e) =>
                      setFormBaptis({
                        ...formBaptis,
                        tanggalBaptis: e.target.value,
                      })
                    }
                    style={{ padding: "5px" }}
                  />
                  <input
                    placeholder="Gereja/Paroki Tempat Baptis"
                    onChange={(e) =>
                      setFormBaptis({
                        ...formBaptis,
                        tempatBaptis: e.target.value,
                      })
                    }
                    style={{ padding: "5px" }}
                  />
                  <input
                    placeholder="Nomor Buku Besar (LB-XXXX)"
                    onChange={(e) =>
                      setFormBaptis({ ...formBaptis, nomorLB: e.target.value })
                    }
                    style={{ padding: "5px" }}
                  />
                  <input
                    placeholder="Nama Romo Pembaptis"
                    onChange={(e) =>
                      setFormBaptis({ ...formBaptis, namaRomo: e.target.value })
                    }
                    style={{ padding: "5px" }}
                  />
                  <input
                    placeholder="Nama Wali Baptis"
                    onChange={(e) =>
                      setFormBaptis({
                        ...formBaptis,
                        waliBaptis: e.target.value,
                      })
                    }
                    style={{ padding: "5px" }}
                  />
                  <button
                    onClick={() => kirimPengajuan("BAPTIS")}
                    style={{
                      backgroundColor: "#28a745",
                      color: "#fff",
                      padding: "8px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Kirim Berkas Ke Pengurus
                  </button>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
                  Belum mengunggah data.
                </p>
              )}
            </div>

            {/* AREA TAMPIL DATA / FORM KRISMA */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "12px",
                borderRadius: "5px",
                margin: "15px 0",
                borderLeft: "4px solid #28a745",
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: "#28a745" }}>
                🕊️ Sakramen Krisma
              </h4>
              {detailUmat.dataKrisma ? (
                <div style={{ fontSize: "14px" }}>
                  <div>
                    <strong>No Buku LC:</strong> {detailUmat.dataKrisma.nomorLC}{" "}
                    | <strong>Pelindung:</strong>{" "}
                    {detailUmat.dataKrisma.namaPelindung}
                  </div>
                  <div>
                    <strong>Tanggal:</strong>{" "}
                    {formatTanggal(detailUmat.dataKrisma.tanggalKrisma)}
                  </div>
                </div>
              ) : role === "WARGA" && showFormJenis !== "KRISMA" ? (
                <button
                  onClick={() => setShowFormJenis("KRISMA")}
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  ✍️ Ajukan Surat Krisma
                </button>
              ) : showFormJenis === "KRISMA" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  <input
                    type="date"
                    onChange={(e) =>
                      setFormKrisma({
                        ...formKrisma,
                        tanggalKrisma: e.target.value,
                      })
                    }
                    style={{ padding: "5px" }}
                  />
                  <input
                    placeholder="Nomor Sertifikat/Buku LC"
                    onChange={(e) =>
                      setFormKrisma({ ...formKrisma, nomorLC: e.target.value })
                    }
                    style={{ padding: "5px" }}
                  />
                  <input
                    placeholder="Nama Uskup / Romo Delegatus"
                    onChange={(e) =>
                      setFormKrisma({
                        ...formKrisma,
                        namaUskupRomo: e.target.value,
                      })
                    }
                    style={{ padding: "5px" }}
                  />
                  <input
                    placeholder="Nama Pelindung Krisma"
                    onChange={(e) =>
                      setFormKrisma({
                        ...formKrisma,
                        namaPelindung: e.target.value,
                      })
                    }
                    style={{ padding: "5px" }}
                  />
                  <button
                    onClick={() => kirimPengajuan("KRISMA")}
                    style={{
                      backgroundColor: "#28a745",
                      color: "#fff",
                      padding: "8px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Kirim Berkas Ke Pengurus
                  </button>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
                  Belum mengunggah data.
                </p>
              )}
            </div>

            <button
              onClick={() => setDetailUmat(null)}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "8px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
