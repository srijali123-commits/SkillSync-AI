
import {
  TrendingUp,
  Flag,
  CheckCircle2,
  FileText,
  BookOpen,
  Trophy,
  Sparkles,
  Target,
  ArrowUpRight,
  Info,
} from "lucide-react";

function CareerProgress({ score = 0 }) {
  const numericScore = Number(score);

  const safeScore = Number.isFinite(numericScore)
    ? Math.min(100, Math.max(0, numericScore))
    : 0;

  const stages = [
    {
      label: "Profile Setup",
      description: "Career profile initialized",
      completed: true,
      icon: Flag,
    },
    {
      label: "Resume Analysis",
      description: "Resume insights generated",
      completed: true,
      icon: FileText,
    },
    {
      label: "Skill Development",
      description: "Reach 50 readiness points",
      completed: safeScore >= 50,
      icon: BookOpen,
    },
    {
      label: "Career Ready",
      description: "Reach 80 readiness points",
      completed: safeScore >= 80,
      icon: Trophy,
    },
  ];

  const completedCount = stages.filter(
    (stage) => stage.completed
  ).length;

  const getProgressStatus = () => {
    if (safeScore >= 80) {
      return {
        title: "Career Readiness Milestone Achieved!",
        description:
          "Your current readiness score has reached the career-ready milestone. Continue strengthening your skills and building practical experience.",
        color: "text-emerald-700",
        bg: "bg-emerald-50/70",
        border: "border-emerald-100",
        icon: Trophy,
      };
    }

    if (safeScore >= 50) {
      return {
        title: "You're Making Strong Progress",
        description:
          "You've reached the skill development milestone. Focus on your remaining skill gaps and continue improving your career profile.",
        color: "text-indigo-700",
        bg: "bg-indigo-50/70",
        border: "border-indigo-100",
        icon: TrendingUp,
      };
    }

    return {
      title: "Your Career Journey Is Underway",
      description:
        "Build relevant technical skills, strengthen your projects, and improve your profile to reach the next career readiness milestone.",
      color: "text-indigo-700",
      bg: "bg-indigo-50/70",
      border: "border-indigo-100",
      icon: Target,
    };
  };

  const status = getProgressStatus();
  const StatusIcon = status.icon;

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)]">

      {/* DECORATIVE GLOW */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative p-6 sm:p-8">

        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <TrendingUp size={23} />
            </div>

            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                <Sparkles size={13} />
                Growth Tracking
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Career Progress
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Visualize your journey toward career readiness
                and track your important milestones.
              </p>
            </div>
          </div>

          {/* MILESTONE COUNTER */}
          <div className="inline-flex shrink-0 self-start items-center gap-3 rounded-2xl border border-indigo-100 bg-[#fafbff] px-4 py-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Flag size={19} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500">
                Milestones Reached
              </p>

              <p className="mt-1 text-xl font-extrabold text-indigo-600">
                {completedCount}
                <span className="text-sm font-medium text-slate-400">
                  /4
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* READINESS PROGRESS */}
        <div className="mt-8 rounded-2xl border border-indigo-100 bg-[#fafbff] p-5 sm:p-6">

          <div className="flex flex-wrap items-end justify-between gap-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Overall Career Readiness
              </p>

              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                {Math.round(safeScore)}
                <span className="ml-1 text-base font-medium text-slate-400">
                  /100
                </span>
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
              <TrendingUp size={14} />
              {Math.round(safeScore)}% Readiness
            </div>
          </div>

          <div
            className="mt-5 h-3 overflow-hidden rounded-full bg-indigo-100"
            role="progressbar"
            aria-label="Career readiness"
            aria-valuenow={safeScore}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${safeScore}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[11px] font-medium text-slate-400">
            <span>Getting Started</span>
            <span>Career Ready</span>
          </div>
        </div>

        {/* MILESTONE JOURNEY */}
        <div className="mt-9">

          <div className="mb-6 flex items-center justify-between gap-3">

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Your Career Milestones
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Progress through four stages of career preparation
              </p>
            </div>

            <ArrowUpRight
              size={18}
              className="shrink-0 text-indigo-400"
            />
          </div>

          <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4">

            {/* DESKTOP CONNECTOR */}
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-slate-100 md:block" />

            {stages.map((stage, index) => {
              const Icon = stage.icon;

              return (
                <div
                  key={stage.label}
                  className="relative flex flex-col items-center text-center"
                >

                  {/* MILESTONE ICON */}
                  <div
                    className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white shadow-sm transition-all duration-300 ${
                      stage.completed
                        ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {stage.completed ? (
                      <CheckCircle2 size={23} />
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>

                  {/* STEP NUMBER */}
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>

                  {/* STAGE NAME */}
                  <h4
                    className={`mt-1 text-sm font-bold leading-5 ${
                      stage.completed
                        ? "text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {stage.label}
                  </h4>

                  {/* DESCRIPTION */}
                  <p className="mt-2 max-w-[170px] text-xs leading-5 text-slate-500">
                    {stage.description}
                  </p>

                  {/* STATUS BADGE */}
                  <span
                    className={`mt-3 rounded-full px-3 py-1 text-[10px] font-bold ${
                      stage.completed
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {stage.completed ? "Completed" : "Upcoming"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PROGRESS INSIGHT */}
        <div
          className={`mt-9 flex items-start gap-3 rounded-2xl border p-5 ${status.bg} ${status.border}`}
        >

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80">
            <StatusIcon
              size={20}
              className={status.color}
            />
          </div>

          <div>
            <h3 className={`text-sm font-bold ${status.color}`}>
              {status.title}
            </h3>

            <p className="mt-2 text-xs leading-6 text-slate-600">
              {status.description}
            </p>
          </div>
        </div>

        {/* FOOTNOTE */}
        <div className="mt-6 flex items-start gap-2 border-t border-slate-100 pt-5">

          <Info
            size={15}
            className="mt-0.5 shrink-0 text-slate-400"
          />

          <p className="text-xs leading-5 text-slate-500">
            Career milestones are estimated using your
            current readiness score. Reaching a milestone
            represents progress in this assessment, not a
            guarantee of internship or job placement.
          </p>
        </div>
      </div>
    </section>
  );
}

export default CareerProgress;
