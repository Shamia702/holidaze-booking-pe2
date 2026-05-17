import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const profile = JSON.parse(localStorage.getItem("profile") || "null");
  const isLoggedIn = !!localStorage.getItem("token");
  const isManager = profile?.venueManager;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/");
  }

  return (
    <nav className="bg-white border-b border-warmgray h-16 flex items-center justify-between px-10">
      <Link to="/" className="font-serif text-2xl">
        <span className="text-coral">holiday</span>
        <span className="text-navy">ze</span>
      </Link>

      <div className="flex gap-8 items-center">
        <Link
          to="/"
          className="text-sm text-navy hover:text-coral transition-colors"
        >
          Venues
        </Link>
        {isLoggedIn && !isManager && (
          <Link
            to="/profile"
            className="text-sm text-navy hover:text-coral transition-colors"
          >
            My Bookings
          </Link>
        )}
        {isLoggedIn && isManager && (
          <Link
            to="/manager"
            className="text-sm text-navy hover:text-coral transition-colors"
          >
            Dashboard
          </Link>
        )}
      </div>

      <div className="flex gap-3 items-center">
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
          <>
            <div className="w-9 h-9 rounded-full bg-coral/20 flex items-center justify-center text-coral font-medium text-sm overflow-hidden">
              {profile?.avatar?.url ? (
                <img
                  src={profile.avatar.url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-sm text-navy font-medium">
              {profile?.name}
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-500 border border-warmgray rounded-lg hover:border-coral hover:text-coral transition-colors"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
