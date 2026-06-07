import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (password.length < 6) {
      setError("A jelszónak legalább 6 karakter hosszúnak kell lennie.");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE ?? "",
          },
          body: JSON.stringify({ name, email, password }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Hiba történt a regisztráció során.");
        return;
      }

      navigate("/login");
    } catch {
      setError("Hálózati hiba történt.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Regisztráció</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <label className="block text-sm mb-1">Név</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block text-sm mb-1">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block text-sm mb-1">Jelszó</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded mb-6"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Regisztráció
      </button>

      <p className="text-sm text-center mt-4">
        Már van fiókod?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Jelentkezz be
        </Link>
      </p>
    </div>
  );
}
