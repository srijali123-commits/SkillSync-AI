
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  ArrowUpRight,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === "/";
  const isUpload = location.pathname === "/upload";

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="relative z-50 w-full border-b border-indigo-100/60 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex min-w-0 items-center gap-3"
        >
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-indigo-200/60 transition-transform duration-300 group-hover:scale-105">
            <Sparkles size={21} strokeWidth={2.2} />

            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-[3px] border-white bg-emerald-400" />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
              SkillSync{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="text-[11px] font-medium tracking-wide text-slate-500">
              Career Intelligence Platform
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/"
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              isHome
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
            }`}
          >
            Home
          </Link>

          {isHome && (
            <a
              href="#features"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-indigo-600"
            >
              Features
            </a>
          )}

          <Link
            to="/upload"
            className={`group ml-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 ${
              isUpload ? "ring-2 ring-indigo-200 ring-offset-2" : ""
            }`}
          >
            Analyze Resume
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="skillsync-mobile-menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600 md:hidden"
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && (
        <div
          id="skillsync-mobile-menu"
          className="border-t border-indigo-100 bg-white px-6 pb-5 pt-3 shadow-lg md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                isHome
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>

            {isHome && (
              <a
                href="#features"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Features
              </a>
            )}

            <Link
              to="/upload"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-md shadow-indigo-100"
            >
              Analyze Resume
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
