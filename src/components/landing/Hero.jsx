
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
  BrainCircuit,
  Github,
  Code2,
  ShieldCheck,
  Zap,
} from "lucide-react";

function Hero() {
  const demoSkills = [
    "Python",
    "Machine Learning",
    "React",
    "SQL",
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#fafbff]">
      {/* Soft background glows */}
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[550px] w-[550px] rounded-full bg-violet-200/40 blur-[110px]" />

      <div className="pointer-events-none absolute -bottom-60 -left-32 h-[500px] w-[500px] rounded-full bg-sky-100/70 blur-[100px]" />

      {/* Subtle background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(#c7d2fe 0.8px, transparent 0.8px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 35%, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">

          {/* LEFT SIDE */}
          <div className="relative z-10">

            {/* Top badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm">
              <Sparkles size={16} />

              <span>Your AI-Powered Career Companion</span>

              <span className="ml-1 h-2 w-2 rounded-full bg-emerald-400" />
            </div>

            {/* Main headline */}
            <h1 className="mt-8 max-w-2xl text-5xl font-bold tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[64px] lg:leading-[1.13]">
              Your career,
              <br />

              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                intelligently
              </span>

              <br />
              accelerated.
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Turn your resume, GitHub, and coding achievements
              into a clearer career roadmap. Discover your
              strengths, identify skill gaps, and make every
              step count.
            </p>

            {/* Action buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/upload"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-4 font-semibold text-white shadow-lg shadow-indigo-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-200"
              >
                Analyze My Resume

                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
              >
                Explore Features
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck
                  size={17}
                  className="text-indigo-500"
                />
                No sign-up required
              </span>

              <span className="inline-flex items-center gap-2">
                <Zap
                  size={17}
                  className="text-indigo-500"
                />
                Personalized insights
              </span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">

            {/* Background glow behind preview */}
            <div className="pointer-events-none absolute -inset-5 rounded-[40px] bg-gradient-to-br from-indigo-200/40 via-purple-100/40 to-sky-100/40 blur-2xl" />

            {/* Main dashboard preview */}
            <div className="relative rounded-[28px] border border-white bg-white/95 p-6 shadow-[0_25px_80px_-25px_rgba(79,70,229,0.25)] backdrop-blur-xl sm:p-7">

              {/* Dashboard header */}
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                    <BrainCircuit size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Career Intelligence
                    </h3>

                    <p className="text-xs text-slate-500">
                      AI-powered profile overview
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  Demo Preview
                </span>
              </div>

              {/* Career readiness card */}
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-[#f8f9ff] to-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Career Readiness
                    </p>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                        72
                      </span>

                      <span className="text-xl font-semibold text-slate-400">
                        /100
                      </span>
                    </div>

                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <TrendingUp size={15} />
                      Sample career analysis
                    </p>
                  </div>

                  {/* Circular progress indicator */}
                  <div
                    className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full shadow-sm"
                    style={{
                      background:
                        "conic-gradient(#4f46e5 0% 72%, #e9eaf5 72% 100%)",
                    }}
                  >
                    <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white">
                      <Sparkles
                        size={23}
                        className="text-indigo-600"
                      />

                      <span className="mt-1 text-xs font-bold text-indigo-600">
                        Good
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target role and skill match */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Target size={21} />
                  </div>

                  <p className="text-xs text-slate-500">
                    Target Role
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    AI/ML Engineer
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <CheckCircle2 size={21} />
                  </div>

                  <p className="text-xs text-slate-500">
                    Skill Match
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    8 of 12 skills
                  </p>
                </div>
              </div>

              {/* Detected skills */}
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    Skills Detected
                  </span>

                  <span className="text-xs font-medium text-indigo-600">
                    Sample
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {demoSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-indigo-100 bg-white px-3 py-1.5 text-xs font-medium text-indigo-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating GitHub card — repositioned */}
            <div className="absolute -left-8 -top-6 hidden items-center gap-3 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-xl shadow-indigo-100/70 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 xl:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Github
                  size={21}
                  className="text-slate-800"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  GitHub Analysis
                </p>

                <p className="text-[11px] text-slate-500">
                  Repository insights
                </p>
              </div>
            </div>

            {/* Floating LeetCode card */}
            <div className="absolute -bottom-5 -right-3 hidden items-center gap-3 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-xl shadow-violet-100/70 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 xl:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Code2
                  size={21}
                  className="text-amber-600"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Coding Insights
                </p>

                <p className="text-[11px] text-slate-500">
                  LeetCode performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
