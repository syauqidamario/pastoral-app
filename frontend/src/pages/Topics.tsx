import { useState } from "react";

interface KategoriTopic {
  id: string;
  judul: string;
  tag: "PENGUMUMAN" | "KATEKESIS" | "LITURGI" | "KEGIATAN";
  ringkasan: string;
  tanggal: string;
}

export default function Topics() {
  const [filterTag, setFilterTag] = useState<string>("SEMUA");

  // Simulasi data mading paroki
  const daftarTopik: KategoriTopic[] = [
    {
      id: "1",
      judul: "Persyaratan Pendaftaran Sakramen Krisma Tahun 2026",
      tag: "PENGUMUMAN",
      ringkasan:
        "Bagi umat yang telah berusia minimal 13 tahun atau kelas 8 SMP, pendaftaran krisma gelombang II resmi dibuka hingga akhir bulan ini melalui ketua lingkungan masing-masing.",
      tanggal: "10 Juni 2026",
    },
    {
      id: "2",
      judul: "Memahami Makna Urutan Liturgi Ekaristi",
      tag: "KATEKESIS",
      ringkasan:
        "Mengapa kita berdiri saat pembacaan Injil dan berlutut saat Doa Syukur Agung? Yuk pelajari kembali makna gestur tubuh kita dalam perayaan sakral ekaristi.",
      tanggal: "08 Juni 2026",
    },
    {
      id: "3",
      judul: "Pelatihan Dirigen dan Pemazmur Wilayah",
      tag: "LITURGI",
      ringkasan:
        "Seksi Liturgi Paroki mengadakan workshop pembekalan dirigen kor dan pemazmur baru untuk persiapan tugas triwulan kedua.",
      tanggal: "05 Juni 2026",
    },
    {
      id: "4",
      judul: "Aksi Sosial OMK: Kunjungan Panti Asuhan",
      tag: "KEGIATAN",
      ringkasan:
        "Rekan-rekan Orang Muda Katolik (OMK) akan menggelar bakti sosial dan donasi buku pelajaran di Panti Asuhan St. Vincentius akhir pekan ini.",
      tanggal: "01 Juni 2026",
    },
  ];

  const topikTerfilter =
    filterTag === "SEMUA"
      ? daftarTopik
      : daftarTopik.filter((t) => t.tag === filterTag);

  return (
    <div
      style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}
    >
      <h3>📰 Ruang Edukasi & Topik Pastoral</h3>
      <p style={{ color: "#666", fontSize: "14px" }}>
        Dapatkan informasi katekese, pengumuman resmi, dan seputar kegiatan iman
        di lingkup paroki.
      </p>

      {/* Filter Navigasi Kecil */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
          flexWrap: "wrap",
        }}
      >
        {["SEMUA", "PENGUMUMAN", "KATEKESIS", "LITURGI", "KEGIATAN"].map(
          (tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid #007bff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold",
                backgroundColor: filterTag === tag ? "#007bff" : "white",
                color: filterTag === tag ? "white" : "#007bff",
              }}
            >
              {tag}
            </button>
          ),
        )}
      </div>

      {/* Daftar Kartu Topik */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {topikTerfilter.map((topik) => (
          <div
            key={topik.id}
            style={{
              border: "1px solid #e0e0e0",
              padding: "18px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  backgroundColor:
                    topik.tag === "PENGUMUMAN"
                      ? "#f8d7da"
                      : topik.tag === "KATEKESIS"
                        ? "#d4edda"
                        : topik.tag === "LITURGI"
                          ? "#cce5ff"
                          : "#fff3cd",
                  color:
                    topik.tag === "PENGUMUMAN"
                      ? "#721c24"
                      : topik.tag === "KATEKESIS"
                        ? "#155724"
                        : topik.tag === "LITURGI"
                          ? "#004085"
                          : "#856404",
                }}
              >
                {topik.tag}
              </span>
              <small style={{ color: "#888" }}>{topik.tanggal}</small>
            </div>
            <h4
              style={{ margin: "0 0 8px 0", color: "#222", fontSize: "16px" }}
            >
              {topik.judul}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#555",
                textAlign: "justify",
              }}
            >
              {topik.ringkasan}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
