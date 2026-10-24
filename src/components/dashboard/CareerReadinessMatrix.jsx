
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Target,
  Github,
  Code2,
  FileText,
  CheckCircle2,
  Sparkles,
  BarChart3,
} from "lucide-react";

const cleanScore = (value) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.round(number * 10) / 10
    : 0;
};

const clampScore = (value, max) =>
  Math.min(max, Math.max(0, cleanScore(value)));

const hasNumber = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  Number.isFinite(Number(value));

const formatScore = (value) => {
  const number = cleanScore(value);
  return Number.isInteger(number)
    ? String(number)
    : number.toFixed(1);
};

const getStatus = (percentage) => {
  if (percentage >= 80) return "Strong";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Developing";
  return "Needs Improvement";
};

function CareerReadinessMatrix({
  readiness,
  readinessScore,
  totalScore,
  skillScore = 0,
  githubScore = 0,
  leetcodeScore = 0,
  resumeScore = 0,
  resumeBreakdown = [],
}) {
  const [expanded, setExpanded] = useState(false);

  const roleSkills = clampScore(skillScore, 40);
  const github = clampScore(githubScore, 20);
  const leetcode = clampScore(leetcodeScore, 20);
  const resume = clampScore(resumeScore, 20);

  const calculatedScore = cleanScore(
    roleSkills + github + leetcode + resume
  );

  // Prefer the backend's overall readiness score,
  // including a legitimate score of zero.
  const suppliedScore = [
    readinessScore,
    totalScore,
    readiness?.overall_score,
    readiness?.score,
  ].find(hasNumber);

  const overallScore = hasNumber(suppliedScore)
    ? clampScore(suppliedScore, 100)
    : clampScore(calculatedScore, 100);

  const overallStatus =
    overallScore >= 80
      ? "Excellent"
      : overallScore >= 60
      ? "Good"
      : overallScore >= 40
      ? "Developing"
      : "Needs Improvement";

  const matrix = [
    {
      title: "Role-Specific Skills",
      shortTitle: "Role Skills",
      score: roleSkills,
      max: 40,
      icon: Target,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      bar: "from-indigo-500 to-violet-500",
      description:
        "How closely your detected technical skills align with the requirements of your selected career role.",
    },
    {
      title: "GitHub Profile & Development",
      shortTitle: "GitHub",
      score: github,
      max: 20,
      icon: Github,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-800",
      bar: "from-slate-600 to-indigo-500",
      description:
        "Your repository activity, development experience, and available GitHub profile signals.",
    },
    {
      title: "LeetCode Problem-Solving",
      shortTitle: "LeetCode",
      score: leetcode,
      max: 20,
      icon: Code2,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      bar: "from-amber-400 to-orange-500",
      description:
        "Your coding practice, solved problems, and problem-solving performance.",
    },
    {
      title: "Resume/Profile Quality",
      shortTitle: "Resume",
      score: resume,
      max: 20,
      icon: FileText,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      bar: "from-emerald-400 to-teal-500",
      description:
        "The quality, completeness, and supporting evidence presented in your resume.",
    },
  ];

  const safeResumeBreakdown = Array.isArray(resumeBreakdown)
    ? resumeBreakdown
    : [];

  return (
    <div className="relative overflow-hidden bg-white">

      {/* SOFT DECORATIVE BACKGROUND */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative p-6 sm:p-8">

        {/* HEADER */}
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <BarChart3 size={23} />
            </div>

            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                <Sparkles size={12} />
                Readiness Engine
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Career Readiness Score
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Understand how your skills, development
                activity, coding practice, and resume
                contribute to your career readiness.
              </p>
            </div>
          </div>

          {/* OVERALL SCORE */}
          <div className="flex items-center justify-center gap-5 rounded-2xl border border-indigo-100 bg-[#fafbff] px-5 py-4 sm:justify-start">

            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Overall Score
              </p>

              <div className="mt-1 flex items-baseline justify-end gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-indigo-600">
                  {formatScore(overallScore)}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  /100
                </span>
              </div>

              <p className="mt-1 text-xs font-semibold text-indigo-600">
                {overallStatus}
              </p>
            </div>

            {/* CIRCULAR PROGRESS */}
            <div
              className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(
                  #6366f1 0% ${overallScore}%,
                  #e9eaf5 ${overallScore}% 100%
                )`,
              }}
              role="progressbar"
              aria-label="Overall career readiness"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={overallScore}
            >
              <div className="flex h-[65px] w-[65px] flex-col items-center justify-center rounded-full bg-white">
                <span className="text-sm font-extrabold text-slate-900">
                  {Math.round(overallScore)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOUR COMPONENT SUMMARY */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {matrix.map((item) => {
            const Icon = item.icon;
            const percentage =
              item.max > 0
                ? (item.score / item.max) * 100
                : 0;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-[#fafbff] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon size={19} />
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400">
                    {Math.round(percentage)}%
                  </span>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  {item.shortTitle}
                </p>

                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {formatScore(item.score)}
                  <span className="ml-1 text-xs font-semibold text-slate-400">
                    /{item.max}
                  </span>
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200/70">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.bar} transition-all duration-700`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* EXPLANATION */}
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
          <Info
            size={19}
            className="mt-0.5 shrink-0 text-indigo-600"
          />

          <div>
            <h3 className="text-sm font-bold text-indigo-900">
              How is your readiness calculated?
            </h3>

            <p className="mt-1 text-sm leading-6 text-indigo-700">
              Your Career Readiness Score combines four
              weighted dimensions: role-specific skills
              (40 points), GitHub development activity
              (20 points), LeetCode problem-solving
              (20 points), and resume quality (20 points).
            </p>
          </div>
        </div>

        {/* EXPAND BUTTON */}
        <button
          type="button"
          onClick={() => setExpanded((previous) => !previous)}
          aria-expanded={expanded}
          className="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-white px-4 py-4 text-left transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/50 sm:px-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Info size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {expanded
                  ? "Hide Detailed Breakdown"
                  : "Explore Detailed Breakdown"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                See how each component contributes to
                your overall score.
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            {expanded ? (
              <ChevronUp size={19} />
            ) : (
              <ChevronDown size={19} />
            )}
          </div>
        </button>
      </div>

      {/* EXPANDED BREAKDOWN */}
      {expanded && (
        <div className="border-t border-indigo-100 bg-[#fafbff] px-6 py-8 sm:px-8">

          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Detailed Score Breakdown
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your readiness is distributed across
              four weighted components.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {matrix.map((item) => {
              const Icon = item.icon;
              const percentage =
                item.max > 0
                  ? (item.score / item.max) * 100
                  : 0;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                      >
                        <Icon size={20} />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold leading-5 text-slate-900">
                          {item.title}
                        </h4>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {getStatus(percentage)}
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {formatScore(item.score)}
                      <span className="font-medium text-slate-400">
                        /{item.max}
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">
                      Component Performance
                    </span>
                    <span className="font-bold text-slate-700">
                      {Math.round(percentage)}%
                    </span>
                  </div>

                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.bar} transition-all duration-700`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  {/* OPTIONAL RESUME BREAKDOWN */}
                  {item.shortTitle === "Resume" &&
                    safeResumeBreakdown.length > 0 && (
                      <div className="mt-5 border-t border-slate-100 pt-5">
                        <p className="mb-4 text-xs font-bold text-slate-700">
                          Resume Quality Breakdown
                        </p>

                        <div className="space-y-3">
                          {safeResumeBreakdown.map((detail, index) => {
                            const detailScore = cleanScore(
                              detail?.score
                            );

                            const detailMax = Math.max(
                              0,
                              cleanScore(
                                detail?.max ??
                                detail?.max_score
                              )
                            );

                            const detailPercentage =
                              detailMax > 0
                                ? Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      (detailScore / detailMax) * 100
                                    )
                                  )
                                : 0;

                            return (
                              <div
                                key={`${detail?.label || "resume"}-${index}`}
                                className="rounded-xl bg-slate-50 p-3"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-xs font-medium text-slate-600">
                                    {detail?.label ||
                                      detail?.name ||
                                      `Component ${index + 1}`}
                                  </span>

                                  <span className="shrink-0 text-xs font-bold text-slate-800">
                                    {formatScore(detailScore)}/
                                    {formatScore(detailMax)}
                                  </span>
                                </div>

                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                    style={{
                                      width: `${detailPercentage}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          {/* TOTAL */}
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Total Career Readiness
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    Combined score from the readiness engine
                  </p>
                </div>
              </div>

              <div>
                <span className="text-3xl font-extrabold text-indigo-600">
                  {formatScore(overallScore)}
                </span>
                <span className="ml-1 text-sm text-slate-400">
                  /100
                </span>
              </div>
            </div>

            {/* FORMULA */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-600">
              {matrix.map((item, index) => (
                <div
                  key={item.shortTitle}
                  className="flex items-center gap-2"
                >
                  {index > 0 && (
                    <span className="font-bold text-slate-400">
                      +
                    </span>
                  )}

                  <span className="rounded-lg bg-slate-50 px-3 py-2 font-medium">
                    {item.shortTitle}: {formatScore(item.score)}
                  </span>
                </div>
              ))}

              <span className="font-bold text-slate-400">
                =
              </span>

              <span className="rounded-lg bg-indigo-50 px-3 py-2 font-bold text-indigo-600">
                {formatScore(calculatedScore)}/100
              </span>
            </div>

            {Math.abs(calculatedScore - overallScore) > 0.1 && (
              <p className="mt-3 text-xs leading-5 text-slate-500">
                The backend-reported overall score differs
                from the displayed component sum. The
                reported score is shown above.
              </p>
            )}
          </div>

          {/* DATA NOTE */}
          <div className="mt-5 flex items-start gap-2">
            <Info
              size={15}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              GitHub and LeetCode contributions depend on
              available external profile data. A missing
              profile should not automatically be interpreted
              as poor performance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CareerReadinessMatrix;
