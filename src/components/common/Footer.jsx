
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  ArrowUpRight,
  FileText,
  Target,
  BarChart3,
  BrainCircuit,
  Heart,
} from "lucide-react";

function Footer() {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const features = [
    { icon: FileText, label: "Resume Analysis" },
    { icon: Target, label: "Skill Gap Analysis" },
    { icon: BarChart3, label: "Career Readiness" },
    { icon: BrainCircuit, label: "What-If Simulator" },
  ];

  const goToFeatures = () => {
    if (location.pathname === "/") {
      document.getElementById("features")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-100 bg-[#fafbff]">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* MAIN FOOTER */}
        <div className="grid gap-12 border-b border-slate-200 pb-12 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND SECTION */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-indigo-200/60 transition-transform duration-300 group-hover:scale-105">
                <Sparkles size={24} strokeWidth={2} />
              </div>

              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                  SkillSync{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    AI
                  </span>
                </h3>

                <p className="text-xs font-medium text-slate-500">
                  Career Intelligence Platform
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
              SkillSync AI is an AI-powered career readiness
              and skill gap analysis platform that helps
              students understand their strengths, identify
              missing skills, and build a clearer path toward
              their career goals.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-sm">
              <Sparkles size={14} />
              Analyze. Improve. Grow.
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Quick Links
            </h4>

            <div className="mt-6 flex flex-col gap-4">
              <Link
                to="/"
                className="w-fit text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
              >
                Home
              </Link>

              {location.pathname === "/" ? (
                <button
                  type="button"
                  onClick={goToFeatures}
                  className="w-fit cursor-pointer text-left text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
                >
                  Platform Features
                </button>
              ) : (
                <Link
                  to="/#features"
                  className="w-fit text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
                >
                  Platform Features
                </Link>
              )}

              <Link
                to="/upload"
                className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
              >
                Analyze Resume
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>

          {/* PLATFORM FEATURES */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Platform Features
            </h4>

            <div className="mt-6 flex flex-col gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-500 shadow-sm">
                      <Icon size={16} />
                    </div>

                    <span>{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between gap-4 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {currentYear} SkillSync AI. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>
              Built to make career planning smarter
            </span>

            <Heart
              size={13}
              className="fill-violet-500 text-violet-500"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
