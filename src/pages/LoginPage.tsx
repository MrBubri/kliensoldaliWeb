import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE ?? "",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!res.ok) {
        setError("Hibás email vagy jelszó.");
        return;
      }

      const data = await res.json();

      const meRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
            "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE ?? "",
          },
        },
      );

      const me = await meRes.json();

      dispatch(setCredentials({ user: me, token: data.token }));
      navigate("/");
    } catch {
      setError("Hálózati hiba történt.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Bejelentkezés</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Bejelentkezés
      </button>

      <p className="text-sm text-center mt-4">
        Még nincs fiókod?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Regisztrálj
        </Link>
      </p>
    </div>
  );
}
