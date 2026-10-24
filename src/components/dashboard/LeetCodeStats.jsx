
import { useState } from "react";

import {
  Code2,
  User,
  Trophy,
  CircleCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Info,
  BarChart3,
  Target,
} from "lucide-react";

function LeetCodeStats({ leetcode }) {
  const [expanded, setExpanded] = useState(false);

  const data = leetcode || {};

  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const formatNumber = (value) =>
    toNumber(value).toLocaleString();

  const formatScore = (value) => {
    const number = Math.round(toNumber(value) * 10) / 10;

    return Number.isInteger(number)
      ? String(number)
      : number.toFixed(1);
  };

  const username =
    data.username ||
    data.user_name ||
    data.leetcode_username ||
    data.leetcodeUsername ||
    "";

  const total = toNumber(
    data.total_solved ??
      data.totalSolved ??
      data.total_problems_solved ??
      data.solved
  );

  const easy = toNumber(
    data.easy_solved ?? data.easy
  );

  const medium = toNumber(
    data.medium_solved ?? data.medium
  );

  const hard = toNumber(
    data.hard_solved ?? data.hard
  );

  const ranking =
    data.ranking ??
    data.rank ??
    data.global_ranking ??
    null;

  const score = Math.min(
    20,
    Math.max(0, toNumber(data.score))
  );

  const percentage = (score / 20) * 100;

  const breakdown = Array.isArray(data.score_breakdown)
    ? data.score_breakdown
    : Array.isArray(data.scoreBreakdown)
    ? data.scoreBreakdown
    : [];

  // A username alone does not confirm valid API data.
  // Explicit backend failures take priority.
  const isAvailable =
    data.available === false
      ? false
      : data.available === true ||
        (data.available == null &&
          (total > 0 ||
            easy > 0 ||
            medium > 0 ||
            hard > 0 ||
            score > 0 ||
            breakdown.length > 0));

  const errorMessage =
    data.error ||
    data.message ||
    (username
      ? "LeetCode statistics could not be retrieved. Please verify your username and check the backend API."
      : "LeetCode username was not provided.");

  const profileUrl = username
    ? `https://leetcode.com/u/${encodeURIComponent(username)}/`
    : "";

  const getScoreStatus = () => {
    if (percentage >= 85) return "Excellent";
    if (percentage >= 70) return "Strong";
    if (percentage >= 55) return "Developing";
    return "Needs Improvement";
  };

  const circumference = 2 * Math.PI * 40;

  const rankingDisplay =
    ranking !== null &&
    ranking !== undefined &&
    ranking !== ""
      ? typeof ranking === "number"
        ? ranking.toLocaleString()
        : String(ranking)
      : "Not available";

  const difficultyData = [
    {
      label: "Easy",
      value: easy,
      color: "text-emerald-600",
      iconBg: "bg-emerald-100",
      bg: "bg-emerald-50/60",
      border: "border-emerald-100",
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      label: "Medium",
      value: medium,
      color: "text-amber-600",
      iconBg: "bg-amber-100",
      bg: "bg-amber-50/60",
      border: "border-amber-100",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      label: "Hard",
      value: hard,
      color: "text-rose-600",
      iconBg: "bg-rose-100",
      bg: "bg-rose-50/60",
      border: "border-rose-100",
      gradient: "from-rose-400 to-pink-500",
    },
  ];

  // UNAVAILABLE PROFILE
  if (!isAvailable) {
    return (
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="relative">
          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Code2 size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                LeetCode Profile
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {username
                  ? `Unable to load statistics for ${username}.`
                  : "LeetCode profile data was not provided."}
              </p>
            </div>
          </div>

          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-bold text-slate-900">
                {username
                  ? "LeetCode Data Unavailable"
                  : "LeetCode Profile Not Connected"}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {errorMessage}
              </p>

              {username && (
                <p className="mt-3 text-xs font-medium text-slate-500">
                  Username: {username}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2">
            <Info
              size={15}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              No verified LeetCode statistics are available.
              Missing profile data is not treated as zero
              solved problems.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)]">

      {/* DECORATIVE GLOW */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative p-6 sm:p-8">

        {/* HEADER */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <Code2 size={23} />
            </div>

            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                <Sparkles size={13} />
                Coding Intelligence
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                LeetCode Profile
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Track coding practice, problem-solving
                performance, and difficulty distribution.
              </p>

              {username && (
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  @{username}
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* SCORE INDICATOR */}
          <div className="flex items-center gap-5 self-start rounded-2xl border border-indigo-100 bg-[#fafbff] px-5 py-4 lg:self-auto">

            <div>
              <p className="text-xs font-semibold text-slate-500">
                LeetCode Score
              </p>

              <p className="mt-1 text-3xl font-extrabold text-indigo-600">
                {formatScore(score)}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  /20
                </span>
              </p>

              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                <CheckCircle2 size={12} />
                {getScoreStatus()}
              </div>
            </div>

            <div className="relative h-20 w-20 shrink-0">

              <svg
                viewBox="0 0 100 100"
                className="h-20 w-20 -rotate-90"
                role="img"
                aria-label={`LeetCode score ${Math.round(percentage)} percent`}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e9eaf5"
                  strokeWidth="9"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference * (1 - percentage / 100)
                  }
                  className="transition-all duration-700"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-extrabold text-slate-900">
                  {Math.round(percentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE STATISTICS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <StatCard
            icon={User}
            label="Username"
            value={username || "Not available"}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />

          <StatCard
            icon={CircleCheck}
            label="Total Problems Solved"
            value={formatNumber(total)}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            icon={Trophy}
            label="Global Ranking"
            value={rankingDisplay}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>

        {/* DIFFICULTY DISTRIBUTION */}
        <div className="mt-8 border-t border-slate-100 pt-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BarChart3 size={19} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Problems Solved by Difficulty
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Your solved problems across three difficulty levels
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            {difficultyData.map((item) => {
              const share =
                total > 0
                  ? Math.min(
                      100,
                      Math.max(0, (item.value / total) * 100)
                    )
                  : 0;

              return (
                <div
                  key={item.label}
                  className={`rounded-2xl border ${item.border} ${item.bg} p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
                >

                  <div className="flex items-center justify-between">

                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} ${item.color}`}>
                      <Target size={19} />
                    </div>

                    <span className={`text-xs font-bold ${item.color}`}>
                      {Math.round(share)}%
                    </span>
                  </div>

                  <p className={`mt-4 text-sm font-bold ${item.color}`}>
                    {item.label}
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-slate-900">
                    {formatNumber(item.value)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Problems solved
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700`}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3">
            <p className="text-xs leading-5 text-indigo-700">
              Difficulty percentages show the proportion of
              your solved problems in each category, not
              the percentage of all LeetCode problems completed.
            </p>
          </div>
        </div>

        {/* SCORE BREAKDOWN */}
        {breakdown.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-6">

            <button
              type="button"
              onClick={() => setExpanded((previous) => !previous)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-[#fafbff] px-5 py-4 text-left transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/60"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Info size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {expanded
                      ? "Hide Detailed LeetCode Analysis"
                      : "Explore Detailed LeetCode Analysis"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Understand how coding performance
                    contributes to your LeetCode score.
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

            {expanded && (
              <div className="mt-5 grid gap-4 md:grid-cols-2">

                {breakdown.map((item, index) => {
                  const value = toNumber(item?.score);

                  const max = toNumber(
                    item?.max ?? item?.max_score
                  );

                  const progress =
                    max > 0
                      ? Math.min(
                          100,
                          Math.max(0, (value / max) * 100)
                        )
                      : 0;

                  return (
                    <div
                      key={`${item?.label || "score"}-${index}`}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {item?.label ||
                              item?.category ||
                              "Score"}
                          </p>

                          {item?.details && (
                            <p className="mt-1.5 text-xs leading-5 text-slate-500">
                              {item.details}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 text-sm font-bold text-indigo-600">
                          {formatScore(value)}
                          <span className="font-medium text-slate-400">
                            /{formatScore(max)}
                          </span>
                        </span>
                      </div>

                      {max > 0 && (
                        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* FOOTNOTE */}
        <div className="mt-7 flex items-start gap-2 border-t border-slate-100 pt-5">

          <Info
            size={15}
            className="mt-0.5 shrink-0 text-slate-400"
          />

          <p className="text-xs leading-5 text-slate-500">
            LeetCode statistics are based on the latest
            successfully retrieved profile information.
            Scores and solved-problem counts may change
            when your profile is refreshed.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}) {
  return (
    <div className="group min-w-0 rounded-2xl border border-slate-100 bg-[#fafbff] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-md">

      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        <Icon size={20} />
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p
        className="mt-2 truncate text-xl font-extrabold text-slate-900 sm:text-2xl"
        title={String(value)}
      >
        {value}
      </p>
    </div>
  );
}

export default LeetCodeStats;
