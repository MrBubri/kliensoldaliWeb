import React, { useRef, useState, useEffect } from "react";
import type { Table } from "../types/types";
import TableBlock from "./room/TableBlock";

type RoomViewProps = {
  tables: Table[];
  selectedTable: Table | null;
  onSelect: (table: Table | null) => void;
  onMove: (id: number, pos: { x: number; y: number }) => void;
  placementMode?: { active: boolean; newTable?: Table | null };
  onPlaceNew?: (pos: { x: number; y: number }) => void;
  width?: number;
  height?: number;
  onFinishMove: (id: number, pos: { x: number; y: number }) => void;
  conflictingIds?: Set<number>;
  isAdmin?: boolean;
};

export default function RoomView({
  tables,
  selectedTable,
  onSelect,
  onMove,
  placementMode,
  onPlaceNew,
  width = 1000,
  height = 600,
  conflictingIds = new Set(),
  isAdmin = false,
  onFinishMove,
}: RoomViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<{
    id: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  useEffect(() => {
    function onMoveMouse(e: MouseEvent) {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragging.offsetX;
      const y = e.clientY - rect.top - dragging.offsetY;
      onMove(dragging.id, { x, y });
    }

    function onUp() {
      if (dragging) {
        const t = tables.find((x) => x.id === dragging.id);
        if (t) onFinishMove(dragging.id, t.position);
      }
      setDragging(null);
    }

    window.addEventListener("mousemove", onMoveMouse);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMoveMouse);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, onMove, tables, onFinishMove]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!placementMode?.active || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    onPlaceNew?.({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseDown = (e: React.MouseEvent, table: Table) => {
    if (!isAdmin) return;
    if (table["is-locked"]) return;
    if (selectedTable?.id !== table.id) return;
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragging({
      id: table.id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-100 border border-gray-300"
      style={{ width, height }}
      onClick={handleContainerClick}
    >
      {tables.map((table) => (
        <TableBlock
          key={table.id}
          table={table}
          isSelected={selectedTable?.id === table.id}
          isConflicting={conflictingIds.has(table.id)}
          onSelect={onSelect}
          onMouseDown={handleMouseDown}
        />
      ))}

      {placementMode?.active && placementMode.newTable && (
        <div className="absolute bottom-2 left-2 p-2 bg-yellow-100 border rounded text-sm">
          Kattints a terembe az új asztal lehelyezéséhez
        </div>
      )}
    </div>
  );
}
