import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginProps {
  // Menyesuaikan dengan Enum Role dari database backend
  setRole: (role: "WARGA" | "KETUA_LINGKUNGAN" | "PASTOR") => void;
  setUserName: (name: string) => void;
}

export default function Login({ setRole, setUserName }: LoginProps) {
  const [username, setInputUsername] = useState("");
  const [password, setInputPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password)
      return setErrorMsg("Username dan password wajib diisi!");

    setErrorMsg("");
    setLoading(true);

    try {
      // Tembak API login backend di port 5001
      const response = await axios.post("http://localhost:5001/api/login", {
        username,
        password,
      });

      const dataSukes = response.data;

      // Simpan status login ke App.tsx
      setRole(dataSukes.user.role);
      setUserName(dataSukes.user.username);

      // Tendang ke halaman utama daftar umat
      navigate("/");
    } catch (error: any) {
      // Menangkap pesan error dari backend ("Username tidak terdaftar!" atau "Password salah!")
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Gagal terhubung ke server backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          padding: "30px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "350px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#007bff", margin: "0 0 5px 0" }}>
            ⛪ Pastoral Login
          </h2>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            Silakan masukkan akun Anda
          </p>
        </div>

        {/* Notifikasi Error jika login gagal */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleLoginSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "5px",
              }}
            >
              Username:
            </label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setInputUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "5px",
              }}
            >
              Password:
            </label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setInputPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            {loading ? "Memverifikasi..." : "Masuk Aplikasi"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#888",
            textAlign: "center",
            borderTop: "1px solid #eee",
            paddingTop: "10px",
          }}
        >
          <p style={{ margin: "2px 0" }}>
            💡 Akun Uji Coba (Password: password123):
          </p>
          <ul style={{ paddingLeft: "20px", margin: 0, textAlign: "left" }}>
            <li>
              Pastor: <code style={{ fontWeight: "bold" }}>romopastor</code>
            </li>
            <li>
              Ketua Lingk:{" "}
              <code style={{ fontWeight: "bold" }}>ketuayosef</code>
            </li>
            <li>
              Warga: <code style={{ fontWeight: "bold" }}>wargateresa</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
