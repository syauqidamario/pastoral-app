export default function About() {
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: "1.6",
      }}
    >
      {/* Banner */}
      <div
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "30px",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <h1 style={{ margin: 0 }}>⛪ Profil Paroki & Portal Pastoral</h1>
        <p style={{ margin: "10px 0 0 0", opacity: 0.9 }}>
          Membangun Komunitas Iman yang Guyub, Berakar, dan Berbuah
        </p>
      </div>

      {/* Konten Utama */}
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* Kiri: Sejarah & Visi Misi */}
        <div style={{ flex: 2, minWidth: "300px" }}>
          <h3>Tentang Kami</h3>
          <p>
            Portal Pastoral ini dirancang khusus untuk mempermudah koordinasi
            administrasi sakramen dan sensus umat di tingkat Lingkungan hingga
            Paroki secara transparan, aman, dan akurat sesuai dengan ketetapan
            Hukum Kanonik Gereja Katolik.
          </p>

          <h4 style={{ color: "#007bff", marginTop: "20px" }}>
            🎯 Visi Paroki
          </h4>
          <blockquote
            style={{
              borderLeft: "4px solid #007bff",
              paddingLeft: "15px",
              fontStyle: "italic",
              color: "#555",
              margin: "10px 0",
            }}
          >
            "Menjadi persekutuan murid-murid Kristus yang semakin dewasa dalam
            iman, guyub dalam persaudaraan, dan bergerak membagikan berkat bagi
            sesama."
          </blockquote>

          <h4 style={{ color: "#007bff", marginTop: "20px" }}>📋 Misi Utama</h4>
          <ul style={{ paddingLeft: "20px" }}>
            <li>
              Menyelenggarakan liturgi yang hidup dan memperdalam hidup rohani
              umat.
            </li>
            <li>
              Mengembangkan katekese iman yang berkesinambungan bagi semua
              jenjang usia.
            </li>
            <li>
              Digitalisasi tata kelola administrasi paroki yang efisien dan
              melayani.
            </li>
          </ul>
        </div>

        {/* Kanan: Jadwal Misa */}
        <div
          style={{
            flex: 1,
            minWidth: "250px",
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            height: "fit-content",
            border: "1px solid #eee",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              borderBottom: "2px solid #007bff",
              paddingBottom: "5px",
              color: "#333",
            }}
          >
            📅 Jadwal Perayaan Ekaristi
          </h3>

          <div style={{ marginBottom: "15px" }}>
            <strong>Misa Harian:</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              Senin - Sabtu: 06.00 WIB
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Misa Jumat Pertama:</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              Jumat I: 18.00 WIB (Katedral)
            </div>
          </div>

          <div>
            <strong>Misa Hari Minggu (Sabtu Sore):</strong>
            <ul
              style={{
                paddingLeft: "15px",
                margin: "5px 0",
                fontSize: "14px",
                color: "#555",
              }}
            >
              <li>Sabtu Sore: 17.00 WIB</li>
              <li>Minggu Pagi I: 06.30 WIB</li>
              <li>Minggu Pagi II: 08.30 WIB (Misa Anak)</li>
              <li>Minggu Sore: 17.00 WIB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
