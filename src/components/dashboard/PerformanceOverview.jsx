
import {
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Github,
  Code2,
  FileText,
} from "lucide-react";

function PerformanceOverview({
  readinessScore = 0,
  readinessLevel,
  confidence,
  githubScore = 0,
  leetcodeScore = 0,
  resumeScore = 0,
  skillScore = 0,
  analysis,
}) {
  const safeNumber = (value) => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const clamp = (value, max = 100) =>
    Math.min(max, Math.max(0, safeNumber(value)));

  const formatScore = (value) => {
    const number = Math.round(safeNumber(value) * 10) / 10;
    return Number.isInteger(number)
      ? String(number)
      : number.toFixed(1);
  };

  const score = clamp(readinessScore);

  const getStatus = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Developing";
    return "Needs Improvement";
  };

  const getPotential = () => {
    if (score >= 80) return "Moderate";
    if (score >= 60) return "Good";
    return "High";
  };

  const profileStatus =
    readinessLevel && readinessLevel !== "Not Available"
      ? readinessLevel
      : getStatus();

  // Prefer the backend's actual coverage value.
  const coverageValue =
    analysis?.data_coverage ??
    analysis?.readiness?.data_coverage;

  const githubAvailable =
    analysis?.github?.available === true;

  const leetcodeAvailable =
    analysis?.leetcode?.available === true;

  const hasAvailabilityInfo =
    analysis?.github?.available !== undefined ||
    analysis?.leetcode?.available !== undefined;

  const coverageLabel = (() => {
    if (typeof coverageValue === "string") {
      const text = coverageValue.trim();
      if (text) return text;
    }

    if (typeof coverageValue === "number" &&
        Number.isFinite(coverageValue)) {
      const percent = coverageValue <= 1
        ? coverageValue * 100
        : coverageValue;

      return `${Math.round(clamp(percent))}%`;
    }

    if (coverageValue &&
        typeof coverageValue === "object") {
      const percentage =
        coverageValue.percentage ??
        coverageValue.percent ??
        coverageValue.score;

      if (
        percentage !== undefined &&
        Number.isFinite(Number(percentage))
      ) {
        const value = Number(percentage);
        return `${Math.round(
          clamp(value <= 1 ? value * 100 : value)
        )}%`;
      }
    }

    if (hasAvailabilityInfo) {
      if (githubAvailable && leetcodeAvailable) {
        return "Good";
      }

      if (githubAvailable || leetcodeAvailable) {
        return "Partial";
      }

      return "Limited";
    }

    return githubScore > 0 || leetcodeScore > 0
      ? "Partial"
      : "Limited";
  })();

  const cards = [
    {
      title: "Current Score",
      value: formatScore(score),
      suffix: "/100",
      description: "Overall career readiness",
      icon: Target,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Profile Status",
      value: profileStatus,
      suffix: "",
      description: "Your current readiness level",
      icon: Activity,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Growth Potential",
      value: getPotential(),
      suffix: "",
      description: "Room for future improvement",
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Data Coverage",
      value: coverageLabel,
      suffix: "",
      description: "Available profile information",
      icon: Award,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const performanceSignals = [
    {
      label: "Role-Specific Skills",
      score: clamp(skillScore, 40),
      max: 40,
      icon: Target,
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      label: "GitHub Development",
      score: clamp(githubScore, 20),
      max: 20,
      icon: Github,
      gradient: "from-slate-600 to-indigo-500",
    },
    {
      label: "LeetCode Problem-Solving",
      score: clamp(leetcodeScore, 20),
      max: 20,
      icon: Code2,
      gradient: "from-amber-400 to-orange-500",
    },
    {
      label: "Resume Quality",
      score: clamp(resumeScore, 20),
      max: 20,
      icon: FileText,
      gradient: "from-emerald-400 to-teal-500",
    },
  ];

  const confidenceValue =
    confidence === null ||
    confidence === undefined ||
    confidence === ""
      ? null
      : clamp(confidence);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white p-6 shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)] sm:p-8">

      {/* DECORATIVE GLOW */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <BarChart3 size={23} />
            </div>

            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                <Sparkles size={13} />
                Performance Analytics
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Performance Overview
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                A clear snapshot of your career readiness
                and profile performance.
              </p>
            </div>
          </div>

          <div className="inline-flex self-start items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
            <CheckCircle2 size={14} />
            Analysis Insights
          </div>
        </div>

        {/* FOUR METRIC CARDS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group rounded-2xl border border-slate-100 bg-[#fafbff] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/50"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
                  >
                    <Icon size={20} />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-slate-300 transition-colors group-hover:text-indigo-500"
                  />
                </div>

                <p className="mt-5 text-xs font-semibold text-slate-500">
                  {card.title}
                </p>

                <p className="mt-2 break-words text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {card.value}

                  {card.suffix && (
                    <span className="ml-1 text-sm font-medium text-slate-400">
                      {card.suffix}
                    </span>
                  )}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CAREER READINESS PROGRESS */}
        <div className="mt-7 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/70 p-5 sm:p-6">

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Overall Career Readiness
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Current readiness toward your selected career role
              </p>
            </div>

            <span className="text-xl font-extrabold text-indigo-600">
              {formatScore(score)}%
            </span>
          </div>

          <div
            className="mt-5 h-3.5 overflow-hidden rounded-full bg-indigo-100/70"
            role="progressbar"
            aria-label="Career readiness progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500">
              Your current readiness level
            </span>

            <span className="text-xs font-bold text-indigo-600">
              {profileStatus}
            </span>
          </div>
        </div>

        {/* PERFORMANCE SIGNALS */}
        <div className="mt-8">

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Performance Signals
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Contribution of each component to your
                career readiness score.
              </p>
            </div>

            {confidenceValue !== null && (
              <div className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                Confidence: {formatScore(confidenceValue)}%
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-x-8 gap-y-6 md:grid-cols-2">
            {performanceSignals.map((signal) => {
              const Icon = signal.icon;

              const percentage =
                signal.max > 0
                  ? (signal.score / signal.max) * 100
                  : 0;

              return (
                <div key={signal.label}>

                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={17}
                        className="text-indigo-500"
                      />

                      <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                        {signal.label}
                      </span>
                    </div>

                    <span className="shrink-0 text-xs font-bold text-slate-800">
                      {formatScore(signal.score)}
                      <span className="font-medium text-slate-400">
                        /{signal.max}
                      </span>
                    </span>
                  </div>

                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={signal.label}
                    aria-valuemin={0}
                    aria-valuemax={signal.max}
                    aria-valuenow={signal.score}
                  >
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${signal.gradient} transition-all duration-700`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTNOTE */}
        <div className="mt-7 flex items-start gap-2 border-t border-slate-100 pt-5">
          <Activity
            size={15}
            className="mt-0.5 shrink-0 text-indigo-500"
          />

          <p className="text-xs leading-5 text-slate-500">
            Performance insights are based on your current
            analysis. Your readiness score can change when
            you update your resume, refresh connected coding
            profiles, or select a different target role.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PerformanceOverview;
