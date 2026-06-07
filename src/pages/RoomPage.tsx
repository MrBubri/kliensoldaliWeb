import { useState } from "react";
import type { Table } from "../types/types";
import RoomView from "../components/RoomView";
import TableDetails from "../components/TableDetails";
import SummaryPanel from "../components/layout/SummaryPanel";
import { useTables } from "../hooks/useTables";
import { useAppSelector } from "../store/hooks";

export default function RoomPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [roomWidth] = useState(600);
  const [roomHeight] = useState(500);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const roomSize = { width: roomWidth, height: roomHeight };

  const {
    tables,
    conflictingIds,
    handleMove,
    commitMove,
    handleDelete,
    handleUpdateStatus,
    handleUpdateColor,
    handleUpdatePosition,
    handleUpdateLocked,
    handleSaveTable,
  } = useTables(roomSize);

  const handleSelect = (t: Table | null) => {
    if (!user) return;
    setSelectedTable(t);
  };

  return (
    <div className="flex flex-col gap-6 min-w-fit">
      <div className="flex gap-6 flex-grow items-start">
        <div className="flex flex-col gap-6 flex-grow">
          <RoomView
            tables={tables}
            selectedTable={selectedTable}
            onSelect={handleSelect}
            onMove={handleMove}
            width={roomSize.width}
            height={roomSize.height}
            onFinishMove={(id, pos) => commitMove(id, pos)}
            conflictingIds={conflictingIds}
            isAdmin={isAdmin}
          />
          <SummaryPanel tables={tables} />
        </div>

        {user && (
          <div className="flex flex-col gap-4 bg-white rounded shadow p-3 w-[420px]">
            {selectedTable ? (
              <TableDetails
                key={selectedTable.id}
                table={tables.find((t) => t.id === selectedTable.id)!}
                roomSize={roomSize}
                role={user?.role ?? null}
                onClose={() => setSelectedTable(null)}
                onDelete={(id) => {
                  handleDelete(id);
                  setSelectedTable(null);
                }}
                onUpdateStatus={handleUpdateStatus}
                onUpdateColor={handleUpdateColor}
                onUpdatePosition={handleUpdatePosition}
                onUpdateLocked={handleUpdateLocked}
                onSave={handleSaveTable}
              />
            ) : (
              <p className="text-gray-400 text-sm text-center mt-4">
                Kattints egy asztalra a részletek megtekintéséhez.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
