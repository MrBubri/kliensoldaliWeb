import React, { useState } from "react";
import type { Table } from "../types/types";
import { getTableSize } from "../utils/placement";

type Props = {
  table: Table;
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: number) => void;
  onUpdateColor: (id: number, color: string) => void;
  onUpdatePosition: (id: number, pos: { x: number; y: number }) => void;
  onUpdateLocked: (id: number, locked: boolean) => void;
  roomSize: { width: number; height: number };
};

export default function TableDetails({
  table,
  onClose,
  onDelete,
  onUpdateStatus,
  onUpdateColor,
  onUpdatePosition,
  onUpdateLocked,
  roomSize,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState(table.status);
  const [color, setColor] = useState(table.color);
  const [locked, setLocked] = useState(table["is-locked"] ?? false);

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded border border-gray-300 w-80">
      <div className="flex justify-between items-center mb-3 relative z-10">
        <h3 className="text-lg font-bold text-black bg-white px-1 relative z-20">
          Asztal részletei
        </h3>

        <button className="text-sm text-gray-500" onClick={onClose}>
          Bezár
        </button>
      </div>

      <p>
        <strong>Típus:</strong> {table.type}
      </p>
      <p>
        <strong>Kategória:</strong> {table.category}
      </p>

      {/* SZÍN */}
      <p className="mt-2">
        <strong>Szín:</strong>
      </p>
      <input
        type="color"
        value={color}
        disabled={!editMode}
        onChange={(e) => setColor(e.target.value)}
        className="w-full mb-2"
      />
      <p className="mt-2">
        <strong>Állapot:</strong> {status}/10
      </p>

      <input
        type="range"
        min={1}
        max={10}
        value={status}
        disabled={!editMode}
        onChange={(e) => setStatus(Number(e.target.value))}
        className="w-full mt-2"
      />
      <p className="mt-2">
        <strong>Pozíció:</strong>
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          value={table.position.x}
          disabled={!editMode}
          onChange={(e) =>
            onUpdatePosition(table.id, {
              x: Number(e.target.value),
              y: table.position.y,
            })
          }
          className="w-20 border p-1"
        />

        <input
          type="number"
          value={table.position.y}
          disabled={!editMode}
          onChange={(e) =>
            onUpdatePosition(table.id, {
              x: table.position.x,
              y: Number(e.target.value),
            })
          }
          className="w-20 border p-1"
        />
      </div>

      <label className="flex items-center gap-2 mt-3">
        <input
          type="checkbox"
          checked={locked}
          disabled={!editMode}
          onChange={(e) => setLocked(e.target.checked)}
        />
        Rögzített (nem mozgatható)
      </label>

      <div className="flex gap-2 mt-4">
        {!editMode ? (
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => setEditMode(true)}
          >
            Módosítás
          </button>
        ) : (
          <>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={() => {
                const { width, height, clearance } = getTableSize(table.type);
                const x = table.position.x;
                const y = table.position.y;

                if (
                  x - clearance < 0 ||
                  y - clearance < 0 ||
                  x + width + clearance > roomSize.width ||
                  y + height + clearance > roomSize.height
                ) {
                  alert("Az asztal nem kerülhet a terem falán kívülre.");
                  return;
                }

                onUpdateStatus(table.id, status);
                onUpdateColor(table.id, color);
                onUpdateLocked(table.id, locked);
                setEditMode(false);
              }}
            >
              Mentés
            </button>

            <button
              className="px-3 py-1 bg-gray-400 text-white rounded"
              onClick={() => setEditMode(false)}
            >
              Mégse
            </button>
          </>
        )}

        <button
          className="px-3 py-1 bg-red-600 text-white rounded ml-auto"
          onClick={() => onDelete(table.id)}
        >
          Törlés
        </button>
      </div>
    </div>
  );
}
