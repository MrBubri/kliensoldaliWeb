import { useEffect, useState } from "react";

type Booking = {
  id: number;
  tableId: number;
  tableName: string;
  status: "pending" | "accepted" | "declined";
  date: string;
  startTime?: string;
  endTime?: string;
  name: string;
  email: string;
  phone: string;
  headcount: number;
  notes?: string;
};

export default function IncomingBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE ?? "",
          },
        },
      );
      const data = await res.json();
      setBookings(data);
    } catch {
      setError("Nem sikerült betölteni a foglalásokat.");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE ?? "",
            },
          },
        );
        const data = await res.json();
        setBookings(data);
      } catch {
        setError("Nem sikerült betölteni a foglalásokat.");
      }
    };

    load();
  }, [token]);

  const handleStatus = async (id: number, status: "accepted" | "declined") => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/bookings/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE ?? "",
        },
        body: JSON.stringify({ status }),
      },
    );
    fetchBookings();
  };

  const statusLabel = (status: string) => {
    if (status === "pending")
      return (
        <span className="px-2 py-1 bg-gray-200 rounded text-sm">Függőben</span>
      );
    if (status === "accepted")
      return (
        <span className="px-2 py-1 bg-black text-white rounded text-sm">
          Elfogadva
        </span>
      );
    if (status === "declined")
      return (
        <span className="px-2 py-1 bg-red-500 text-white rounded text-sm">
          Elutasítva
        </span>
      );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Beérkezett foglalások</h2>
      <p className="text-gray-500 mb-6">
        {bookings.filter((b) => b.status === "pending").length} függőben lévő
        foglalás vár jóváhagyásra.
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white border rounded p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setExpanded(expanded === booking.id ? null : booking.id)
              }
            >
              <div>
                <p className="font-semibold capitalize">{booking.tableName}</p>
                <p className="text-sm text-gray-500">
                  {booking.date}{" "}
                  {booking.startTime && booking.endTime
                    ? `${booking.startTime}–${booking.endTime}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {statusLabel(booking.status)}
                <span className="text-gray-400">∨</span>
              </div>
            </div>

            {expanded === booking.id && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-1 text-sm mb-4">
                  <span className="text-gray-500">Foglaló neve:</span>
                  <span className="text-right">{booking.name}</span>
                  <span className="text-gray-500">Email:</span>
                  <span className="text-right">{booking.email}</span>
                  <span className="text-gray-500">Telefon:</span>
                  <span className="text-right">{booking.phone}</span>
                  <span className="text-gray-500">Résztvevők:</span>
                  <span className="text-right">{booking.headcount} fő</span>
                  {booking.notes && (
                    <>
                      <span className="text-gray-500">Megjegyzés:</span>
                      <span className="text-right">{booking.notes}</span>
                    </>
                  )}
                </div>

                {booking.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(booking.id, "accepted")}
                      className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      Elfogad
                    </button>
                    <button
                      onClick={() => handleStatus(booking.id, "declined")}
                      className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Elutasít
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
