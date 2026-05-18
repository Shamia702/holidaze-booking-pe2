import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import logo from "../assets/holidaze-logo.svg"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const profile = JSON.parse(localStorage.getItem("profile") || "null")
  const isLoggedIn = !!localStorage.getItem("token")
  const isManager = profile?.venueManager

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("profile")
    navigate("/")
    setMenuOpen(false)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-warmgray relative z-50">
      <div className="h-16 flex items-center justify-between px-4 md:px-10">

        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="Holidaze" className="h-8" />
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className={`text-sm transition-colors ${
              location.pathname === "/"
                ? "text-coral font-medium"
                : "text-navy hover:text-coral"
            }`}
          >
            Venues
          </Link>
          {isLoggedIn && !isManager && (
            <Link
              to="/profile"
              className={`text-sm transition-colors ${
                location.pathname === "/profile"
                  ? "text-coral font-medium"
                  : "text-navy hover:text-coral"
              }`}
            >
              My Bookings
            </Link>
          )}
          {isLoggedIn && isManager && (
            <Link
              to="/manager"
              className={`text-sm transition-colors ${
                location.pathname === "/manager"
                  ? "text-coral font-medium"
                  : "text-navy hover:text-coral"
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex gap-3 items-center">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-coral border border-coral rounded-lg hover:bg-coral hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-coral rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-500 border border-warmgray rounded-lg hover:border-coral hover:text-coral transition-colors"
            >
              Log out
            </button>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block w-6 h-0.5 bg-navy transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-navy transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-navy transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-warmgray px-4 py-4 flex flex-col gap-3">

          <Link
            to="/"
            onClick={closeMenu}
            className="text-sm text-navy hover:text-coral transition-colors py-2 border-b border-warmgray"
          >
            Venues
          </Link>

          {isLoggedIn && !isManager && (
            <Link
              to="/profile"
              onClick={closeMenu}
              className="text-sm text-navy hover:text-coral transition-colors py-2 border-b border-warmgray"
            >
              My Bookings
            </Link>
          )}

          {isLoggedIn && isManager && (
            <Link
              to="/manager"
              onClick={closeMenu}
              className="text-sm text-navy hover:text-coral transition-colors py-2 border-b border-warmgray"
            >
              Dashboard
            </Link>
          )}

          {!isLoggedIn ? (
            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex-1 text-center px-4 py-2 text-sm font-medium text-coral border border-coral rounded-lg"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-coral rounded-lg"
              >
                Register
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-2 text-sm font-medium text-gray-500 border border-warmgray rounded-lg hover:border-coral hover:text-coral transition-colors mt-2"
            >
              Log out
            </button>
          )}

        </div>
      )}

    </nav>
  )
}

export default Navbar