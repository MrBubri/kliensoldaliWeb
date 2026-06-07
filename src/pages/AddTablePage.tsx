import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTablePage() {
  const navigate = useNavigate();

  const [type, setType] = useState("foosball");
  const [category, setCategory] = useState("normal");
  const [color, setColor] = useState("green");
  const [status, setStatus] = useState(8);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/tables`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE ?? "",
        },
        body: JSON.stringify({
          type,
          category,
          color,
          status,
          position: { x: posX, y: posY },
          isLocked,
        }),
      });

      if (!res.ok) {
        setError("Nem sikerült létrehozni az asztalt.");
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Hálózati hiba történt.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Asztal hozzáadása</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && (
        <p className="text-green-600 mb-4">
          Asztal sikeresen létrehozva! Átirányítás...
        </p>
      )}

      <label className="block text-sm mb-1">Típus</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="snooker">snooker</option>
        <option value="air-hockey">air-hockey</option>
        <option value="foosball">foosball</option>
      </select>

      <label className="block text-sm mb-1">Kategória</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="competition">verseny</option>
        <option value="normal">normál</option>
        <option value="kids">gyerek</option>
      </select>

      <label className="block text-sm mb-1">Szín</label>
      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="red">Piros</option>
        <option value="green">Zöld</option>
        <option value="blue">Kék</option>
        <option value="yellow">Sárga</option>
        <option value="purple">Lila</option>
      </select>

      <label className="block text-sm mb-1">Állapot: {status}</label>
      <input
        type="range"
        min={1}
        max={10}
        value={status}
        onChange={(e) => setStatus(Number(e.target.value))}
        className="w-full mb-4"
      />

      <label className="block text-sm mb-1">Pozíció X</label>
      <input
        type="number"
        value={posX}
        onChange={(e) => setPosX(Number(e.target.value))}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block text-sm mb-1">Pozíció Y</label>
      <input
        type="number"
        value={posY}
        onChange={(e) => setPosY(Number(e.target.value))}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={isLocked}
          onChange={(e) => setIsLocked(e.target.checked)}
        />
        Rögzített (nem mozgatható)
      </label>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Létrehozás
      </button>
    </div>
  );
}
