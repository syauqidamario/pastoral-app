import { useState, useEffect } from "react";
import axios from "axios";

interface InboxProps {
  role: "WARGA" | "KETUA_LINGKUNGAN" | "PASTOR";
  onRefreshUtama: () => void;
}

export default function InboxPengajuan({ role, onRefreshUtama }: InboxProps) {
  const [pengajuanList, setPengajuanList] = useState<any[]>([]);

  useEffect(() => {
    fetchPengajuan();
  }, []);

  const fetchPengajuan = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/pengajuan");
      setPengajuanList(res.data);
    } catch (error) {
      console.error("Gagal mengambil inbox:", error);
    }
  };

  const handleAksi = async (id: string, aksi: "SETUJU" | "TOLAK") => {
    let catatan = "";
    if (aksi === "TOLAK") {
      catatan =
        prompt("Masukkan alasan penolakan berkas:") || "Berkas kurang lengkap";
    }

    try {
      const res = await axios.patch(
        `http://localhost:5001/api/pengajuan/${id}/aksi`,
        {
          role,
          aksi,
          catatanPenolakan: catatan,
        },
      );
      alert(res.data.message);
      fetchPengajuan(); // Refresh inbox lokal
      onRefreshUtama(); // Refresh data tabel umat utama
    } catch (error: any) {
      alert("Operasi Gagal: " + error.response?.data?.error);
    }
  };

  return (
    <div>
      <h3>📥 Kotak Masuk Validasi Dokumen Sakramen</h3>
      <p style={{ color: "#666", fontSize: "14px" }}>
        Mengevaluasi draf pengajuan sakramen dari warga paroki.
      </p>

      {pengajuanList.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic" }}>
          Belum ada pengajuan berkas masuk saat ini.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {pengajuanList.map((p) => {
            const dataFormObj = JSON.parse(p.dataForm); // Bongkar string JSON jadi objek teks biasa

            return (
              <div
                key={p.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <strong>{p.umat?.namaLengkap}</strong>
                    <span style={{ color: "#666", fontSize: "13px" }}>
                      {" "}
                      ({p.umat?.lingkungan?.namaLingkungan})
                    </span>
                  </div>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        p.status === "PENDING"
                          ? "#fff3cd"
                          : p.status === "DISETUJUI_KETUA"
                            ? "#cce5ff"
                            : p.status === "VERIFIED_PASTOR"
                              ? "#d4edda"
                              : "#f8d7da",
                      color:
                        p.status === "PENDING"
                          ? "#856404"
                          : p.status === "DISETUJUI_KETUA"
                            ? "#004085"
                            : p.status === "VERIFIED_PASTOR"
                              ? "#155724"
                              : "#721c24",
                    }}
                  >
                    Status: {p.status.replace("_", " ")}
                  </span>
                </div>

                <div style={{ fontSize: "14px", marginBottom: "12px" }}>
                  <span
                    style={{
                      backgroundColor: "#e2e3e5",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    🗂️ JALUR SAKRAMEN: {p.jenisSakramen}
                  </span>

                  {/* TAMPILAN DETAIL FORM YG DIKETIK WARGA */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "5px",
                      marginTop: "10px",
                      backgroundColor: "#f9f9f9",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {Object.keys(dataFormObj).map((key) => (
                      <div key={key}>
                        <strong>{key}:</strong> {dataFormObj[key] || "-"}
                      </div>
                    ))}
                  </div>

                  {p.catatanPenolakan && (
                    <div
                      style={{
                        color: "red",
                        marginTop: "5px",
                        fontSize: "13px",
                      }}
                    >
                      <strong>Alasan Ditolak:</strong> {p.catatanPenolakan}
                    </div>
                  )}
                </div>

                {/* TOMBOL AKSI BERDASARKAN LEVEL JABATAN */}
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Aksi untuk Ketua Lingkungan */}
                  {role === "KETUA_LINGKUNGAN" && p.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleAksi(p.id, "SETUJU")}
                        style={{
                          backgroundColor: "#28a745",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ✔️ Loloskan ke Pastor
                      </button>
                      <button
                        onClick={() => handleAksi(p.id, "TOLAK")}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ❌ Tolak Berkas
                      </button>
                    </>
                  )}

                  {/* Aksi untuk Pastor Paroki */}
                  {role === "PASTOR" && p.status === "DISETUJUI_KETUA" && (
                    <>
                      <button
                        onClick={() => handleAksi(p.id, "SETUJU")}
                        style={{
                          backgroundColor: "#007bff",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        🏛️ Sahkan & Ketok Palu (Masuk Buku Besar)
                      </button>
                      <button
                        onClick={() => handleAksi(p.id, "TOLAK")}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ❌ Tolak Berkas
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
