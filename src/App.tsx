import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import Navbar from "./components/layout/Navbar";
import RoomPage from "./pages/RoomPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import IncomingBookingsPage from "./pages/IncomingBookingsPage";
import AddTablePage from "./pages/AddTablePage";

export default function App() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<RoomPage />} />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/" />}
          />
          <Route
            path="/my-bookings"
            element={isUser ? <MyBookingsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/incoming-bookings"
            element={isAdmin ? <IncomingBookingsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/add-table"
            element={isAdmin ? <AddTablePage /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
    </div>
  );
}
