import { useState, useEffect } from "react";
import type { Table } from "../types/types";
import { getTableSize } from "../utils/placement";

type Timeslot = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

type Props = {
  table: Table;
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: number) => void;
  onUpdateColor: (id: number, color: string) => void;
  onUpdatePosition: (id: number, pos: { x: number; y: number }) => void;
  onUpdateLocked: (id: number, locked: boolean) => void;
  roomSize: { width: number; height: number };
  onSave?: (id: number, updates: Partial<Table>) => void;
  role?: "admin" | "user" | null;
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
  onSave,
  role,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState(table.status);
  const [color, setColor] = useState(table.color);
  const [locked, setLocked] = useState(table["is-locked"] ?? false);

  const [selectedDate, setSelectedDate] = useState("");
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingHeadcount, setBookingHeadcount] = useState(1);
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!selectedDate) return;

    const load = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/tables/${table.id}/timeslots?date=${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE ?? "",
            },
          },
        );
        const data = await res.json();
        setTimeslots(data);
        setSelectedTime("");
      } catch {
        console.error("Nem sikerült betölteni az időpontokat.");
      }
    };

    load();
  }, [selectedDate, table.id, token]);

  const handleBooking = async () => {
    setBookingError("");
    if (!selectedDate || !selectedTime) {
      setBookingError("Kérjük válassz dátumot és időpontot!");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE ?? "",
          },
          body: JSON.stringify({
            tableId: table.id,
            date: selectedDate,
            startTime: selectedTime.split("-")[0],
            endTime: selectedTime.split("-")[1],
            name: bookingName,
            email: bookingEmail,
            phone: bookingPhone,
            headcount: bookingHeadcount,
            notes: bookingNotes,
          }),
        },
      );

      if (!res.ok) {
        setBookingError("Nem sikerült a foglalás.");
        return;
      }

      setBookingSuccess(true);
      setSelectedDate("");
      setSelectedTime("");
      setBookingName("");
      setBookingEmail("");
      setBookingPhone("");
      setBookingHeadcount(1);
      setBookingNotes("");
    } catch {
      setBookingError("Hálózati hiba történt.");
    }
  };

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded border border-gray-300 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">Asztal részletei</h3>
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

      {/* ADMIN SZERKESZTÉS */}
      {role === "admin" && (
        <>
          <p className="mt-2">
            <strong>Szín:</strong>
          </p>
          <select
            value={color}
            disabled={!editMode}
            onChange={(e) => setColor(e.target.value)}
            className="w-full border p-1 rounded mb-2"
          >
            <option value="red">Piros</option>
            <option value="green">Zöld</option>
            <option value="blue">Kék</option>
            <option value="yellow">Sárga</option>
            <option value="purple">Lila</option>
          </select>

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
                    const { width, height, clearance } = getTableSize(
                      table.type,
                    );
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
                    onSave?.(table.id, {
                      status,
                      color,
                      "is-locked": locked,
                      position: { x: table.position.x, y: table.position.y },
                    });
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
        </>
      )}

      {role === "user" && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Foglalás</h4>

          {bookingSuccess && (
            <p className="text-green-600 mb-2">
              Sikeres foglalás! Várd meg a jóváhagyást.
            </p>
          )}
          {bookingError && <p className="text-red-500 mb-2">{bookingError}</p>}

          <label className="block text-sm mb-1">Dátum</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border p-1 rounded mb-3"
            min={new Date().toISOString().split("T")[0]}
          />

          {timeslots.length > 0 && (
            <>
              <label className="block text-sm mb-1">Időpont</label>
              <div className="flex flex-wrap gap-1 mb-3">
                {timeslots.map((slot) => (
                  <button
                    key={slot.startTime}
                    disabled={!slot.isAvailable}
                    onClick={() =>
                      setSelectedTime(`${slot.startTime}-${slot.endTime}`)
                    }
                    className={`px-2 py-1 text-xs rounded border ${
                      selectedTime === `${slot.startTime}-${slot.endTime}`
                        ? "bg-blue-600 text-white border-blue-600"
                        : slot.isAvailable
                          ? "bg-white hover:bg-gray-100"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {slot.startTime}–{slot.endTime}
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedTime && (
            <>
              <label className="block text-sm mb-1">Név</label>
              <input
                type="text"
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
                className="w-full border p-1 rounded mb-2"
              />

              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={bookingEmail}
                onChange={(e) => setBookingEmail(e.target.value)}
                className="w-full border p-1 rounded mb-2"
              />

              <label className="block text-sm mb-1">Telefon</label>
              <input
                type="text"
                value={bookingPhone}
                onChange={(e) => setBookingPhone(e.target.value)}
                className="w-full border p-1 rounded mb-2"
              />

              <label className="block text-sm mb-1">Résztvevők száma</label>
              <input
                type="number"
                min={1}
                value={bookingHeadcount}
                onChange={(e) => setBookingHeadcount(Number(e.target.value))}
                className="w-full border p-1 rounded mb-2"
              />

              <label className="block text-sm mb-1">
                Megjegyzés (opcionális)
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                className="w-full border p-1 rounded mb-3"
                rows={2}
              />

              <button
                onClick={handleBooking}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Foglalás
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
