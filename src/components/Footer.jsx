import { Link } from "react-router-dom";
import logoWhite from "../assets/holidaze-logo-white.svg";

function Footer() {
  return (
    <footer className="bg-navy mt-20">
      <div className="px-4 md:px-10 pt-12 pb-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-20">
        <div className="col-span-2 md:col-span-1">
          <img src={logoWhite} alt="Holidaze" className="h-8 mb-4" />
          <p className="text-sm text-white/45 leading-relaxed">
            Find your perfect stay in Norway and beyond.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-medium text-white/45 uppercase tracking-widest mb-4">
            Explore
          </h4>
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="text-sm text-white/65 hover:text-white transition-colors"
            >
              Venues
            </Link>
            <Link
              to="/register"
              className="text-sm text-white/65 hover:text-white transition-colors"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="text-sm text-white/65 hover:text-white transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-white/45 uppercase tracking-widest mb-4">
            Venue Managers
          </h4>
          <div className="flex flex-col gap-3">
            <Link
              to="/register"
              className="text-sm text-white/65 hover:text-white transition-colors"
            >
              Register as manager
            </Link>
            <Link
              to="/manager"
              className="text-sm text-white/65 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/manager"
              className="text-sm text-white/65 hover:text-white transition-colors"
            >
              View bookings
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-white/45 uppercase tracking-widest mb-4">
            Get in touch
          </h4>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-white/65">support@holidaze.no</p>
            <p className="text-sm text-white/65">Oslo, Norway</p>
            <p className="text-sm text-white/65">Mon–Fri 9am–5pm</p>
          </div>
        </div>
      </div>

      <div className="mx-4 md:mx-10 border-t border-white/10"></div>

      <div className="px-4 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-xs text-white/35">
          © 2026 Holidaze. All rights reserved.
        </p>
        <p className="text-xs text-white/35">Made with love in Norway</p>
      </div>
    </footer>
  );
}

export default Footer;
