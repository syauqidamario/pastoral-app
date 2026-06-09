import type { Umat } from "../App";

interface DaftarUmatProps {
  umat: Umat[];
  role: "warga" | "admin";
}

export default function DaftarUmat({ umat, role }: DaftarUmatProps) {
  return (
    <div>
      <h3>Daftar Umat ({role === "admin" ? "Mode Admin" : "Mode Warga"})</h3>
      <table
        border={1}
        cellPadding={8}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Nama Lengkap</th>
            <th>Lingkungan</th>
            <th>Status Krisma</th>
            {role === "admin" && <th>Aksi (Khusus Admin)</th>}
          </tr>
        </thead>
        <tbody>
          {umat.map((u) => (
            <tr key={u.id}>
              <td>{u.namaLengkap}</td>
              {/* Diubah ke u.lingkungan?.namaLingkungan karena sekarang berupa objek dari database */}
              <td>{u.lingkungan?.namaLingkungan || "Tanpa Lingkungan"}</td>
              <td>{u.sudahKrisma ? "Sudah 🕊️" : "Belum"}</td>
              {role === "admin" && (
                <td>
                  <button style={{ color: "red" }}>Hapus</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
