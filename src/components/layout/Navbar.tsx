import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex items-center gap-6">
      <Link to="/" className="text-xl font-bold">
        Roomlie
      </Link>

      {!user && (
        <>
          <Link to="/" className="text-gray-600 hover:text-black">
            Terem
          </Link>
          <Link to="/login" className="text-gray-600 hover:text-black">
            Bejelentkezés
          </Link>
          <Link to="/register" className="text-gray-600 hover:text-black">
            Regisztráció
          </Link>
        </>
      )}

      {user && !user.role.includes("admin") && (
        <>
          <span className="font-semibold">{user.name}</span>
          <Link to="/" className="text-gray-600 hover:text-black">
            Terem
          </Link>
          <Link to="/my-bookings" className="text-gray-600 hover:text-black">
            Foglalásaim
          </Link>
          <button
            onClick={handleLogout}
            className="ml-auto text-gray-600 hover:text-black"
          >
            Kijelentkezés
          </button>
        </>
      )}

      {user?.role === "admin" && (
        <>
          <span className="font-semibold">
            {user.name} <span className="text-xs text-gray-500">Admin</span>
          </span>
          <Link to="/" className="text-gray-600 hover:text-black">
            Terem
          </Link>
          <Link to="/add-table" className="text-gray-600 hover:text-black">
            Asztal hozzáadása
          </Link>
          <Link
            to="/incoming-bookings"
            className="text-gray-600 hover:text-black"
          >
            Beérkezett foglalások
          </Link>
          <button
            onClick={handleLogout}
            className="ml-auto text-gray-600 hover:text-black"
          >
            Kijelentkezés
          </button>
        </>
      )}
    </nav>
  );
}
