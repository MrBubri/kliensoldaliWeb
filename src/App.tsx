import { useState } from "react";
import type { Table } from "./types/types";
import RoomView from "./components/RoomView";
import TableDetails from "./components/TableDetails";
import NewTableForm from "./components/NewTableForm";
import SummaryPanel from "./components/layout/SummaryPanel";
import { useTables } from "./hooks/useTables";

export default function App() {
  const [activeTab, setActiveTab] = useState<"new" | "details">("new");
  const [roomWidth, setRoomWidth] = useState(600);
  const [roomHeight, setRoomHeight] = useState(500);
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
    handleCreateRequest,
  } = useTables(roomSize);

  const handleSelect = (t: Table | null) => {
    setSelectedTable(t);
    setActiveTab("details");
  };

  return (
    <div className="p-6 flex flex-col gap-6 bg-gray-50 min-h-screen min-w-fit">
      <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
        Roomlie - App
      </h3>

      <div className="flex items-center gap-2">
        <span className="font-semibold">Terem mérete:</span>
        <input
          type="number"
          value={roomWidth}
          onChange={(e) => setRoomWidth(Number(e.target.value))}
          className="w-20 border p-1"
        />
        <span>×</span>
        <input
          type="number"
          value={roomHeight}
          onChange={(e) => setRoomHeight(Number(e.target.value))}
          className="w-20 border p-1"
        />
        <button className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
          Alkalmaz
        </button>
      </div>

      <div className="flex gap-6 flex-grow items-start">
        <div className="flex flex-col gap-6 flex-grow">
          <RoomView
            tables={tables}
            selectedTable={selectedTable}
            onSelect={handleSelect}
            onMove={handleMove}
            width={roomSize.width}
            height={roomSize.height}
            onFinishMove={commitMove}
            conflictingIds={conflictingIds}
          />
          <SummaryPanel tables={tables} />
        </div>

        <div className="flex flex-col gap-4 bg-white rounded shadow p-3 w-[420px]">
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 text-center font-semibold ${activeTab === "new" ? "border-b-2 border-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("new")}
            >
              Új asztal
            </button>
            <button
              className={`flex-1 py-2 text-center font-semibold ${activeTab === "details" ? "border-b-2 border-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("details")}
              disabled={!selectedTable}
            >
              Asztal részletei
            </button>
          </div>

          {activeTab === "new" && (
            <NewTableForm onCreateRequest={handleCreateRequest} />
          )}

          {activeTab === "details" && selectedTable && (
            <TableDetails
              key={selectedTable.id}
              table={tables.find((t) => t.id === selectedTable.id)!}
              roomSize={roomSize}
              onClose={() => {
                setSelectedTable(null);
                setActiveTab("new");
              }}
              onDelete={(id) => {
                handleDelete(id);
                setSelectedTable(null);
                setActiveTab("new");
              }}
              onUpdateStatus={handleUpdateStatus}
              onUpdateColor={handleUpdateColor}
              onUpdatePosition={handleUpdatePosition}
              onUpdateLocked={handleUpdateLocked}
            />
          )}
        </div>
      </div>
    </div>
  );
}
