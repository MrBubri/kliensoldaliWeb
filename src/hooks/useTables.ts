import { useState } from "react";
import initialTables from "../data/tables.json";
import type { Table } from "../types/types";
import { canPlaceTableAt, getTableSize } from "../utils/placement";

export function useTables(roomSize: { width: number; height: number }) {
  const [tables, setTables] = useState<Table[]>(() =>
    (initialTables as Table[]).map((t) => ({ ...t })),
  );

  const conflictingIds = new Set<number>(
    tables.flatMap((t) => {
      const ok = canPlaceTableAt(t, t.position, tables, roomSize);
      return ok ? [] : [t.id];
    }),
  );

  const handleMove = (id: number, pos: { x: number; y: number }) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t["is-locked"]) return t;

        const size = getTableSize(t.type);
        const clamped = {
          x: Math.min(
            Math.max(pos.x, size.clearance),
            roomSize.width - size.width - size.clearance,
          ),
          y: Math.min(
            Math.max(pos.y, size.clearance),
            roomSize.height - size.height - size.clearance,
          ),
        };

        return { ...t, position: clamped };
      }),
    );
  };

  const commitMove = (id: number) => {
    const t = tables.find((x) => x.id === id);
    if (!t) return;

    const ok = canPlaceTableAt(t, t.position, tables, roomSize);
    if (!ok) {
      const size = getTableSize(t.type);
      const x = Math.min(
        Math.max(t.position.x, 0),
        roomSize.width - size.width,
      );
      const y = Math.min(
        Math.max(t.position.y, 0),
        roomSize.height - size.height,
      );
      setTables((prev) =>
        prev.map((p) => (p.id === id ? { ...p, position: { x, y } } : p)),
      );
    }
  };

  const handleDelete = (id: number) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateStatus = (id: number, status: number) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleUpdateColor = (id: number, color: string) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, color } : t)));
  };

  const handleUpdatePosition = (id: number, pos: { x: number; y: number }) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, position: pos } : t)),
    );
  };

  const handleUpdateLocked = (id: number, locked: boolean) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, "is-locked": locked } : t)),
    );
  };

  const handleCreateRequest = (partial: Omit<Table, "id">) => {
    const newId = Math.max(0, ...tables.map((t) => t.id)) + 1;
    const candidate: Table = { id: newId, ...partial };

    const { width, height, clearance } = getTableSize(candidate.type);
    const { x, y } = candidate.position;

    if (
      x - clearance < 0 ||
      y - clearance < 0 ||
      x + width + clearance > roomSize.width ||
      y + height + clearance > roomSize.height
    ) {
      alert("Az asztal nem kerülhet a terem falán kívülre.");
      return;
    }

    setTables((prev) => [...prev, candidate]);
    return candidate;
  };

  return {
    tables,
    conflictingIds,
    handleMove,
    commitMove,
    handleDelete,
    handleUpdateStatus,
    handleUpdateColor,
    handleUpdatePosition,
    handleUpdateLocked,
    handleCreateRequest,
  };
}
