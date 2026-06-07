import { useState } from "react";
import type { Table } from "../types/types";

type Props = {
  onCreateRequest: (partial: Omit<Table, "id">) => void;
};

export default function NewTableForm({ onCreateRequest }: Props) {
  const [type, setType] = useState("foosball");
  const [category, setCategory] = useState("normal");
  const [color, setColor] = useState("green");
  const [status, setStatus] = useState(8);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  return (
    <div className="p-4 bg-white border rounded w-80">
      <h3 className="font-bold mb-2">Új asztal hozzáadása</h3>

      <label className="block text-sm">Típus</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full mb-2"
      >
        <option value="snooker">snooker</option>
        <option value="air-hockey">air-hockey</option>
        <option value="foosball">foosball</option>
      </select>

      <label className="block text-sm">Kategória</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-2"
      >
        <option value="competition">verseny</option>
        <option value="normal">normál</option>
        <option value="kids">gyerek</option>
      </select>

      <label className="block text-sm">Szín</label>
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

      <label className="block text-sm">Állapot {status}</label>
      <input
        type="range"
        min={1}
        max={10}
        value={status}
        onChange={(e) => setStatus(Number(e.target.value))}
        className="w-full mb-3"
      />
      <label className="block text-sm">Pozíció X</label>
      <input
        type="number"
        value={posX}
        onChange={(e) => setPosX(Number(e.target.value))}
        className="w-full mb-2"
      />

      <label className="block text-sm">Pozíció Y</label>
      <input
        type="number"
        value={posY}
        onChange={(e) => setPosY(Number(e.target.value))}
        className="w-full mb-2"
      />

      <button
        className="w-full bg-green-600 text-white py-2 rounded"
        onClick={() =>
          onCreateRequest({
            type,
            category,
            color,
            status,
            position: { x: posX, y: posY },
            "is-locked": false,
          })
        }
      >
        Létrehozás és lehelyezés
      </button>
    </div>
  );
}
