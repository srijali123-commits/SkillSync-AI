
import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  Info,
  TrendingUp,
  Github,
  Code2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

function ScoreCard({
  title,
  score,
  description,
  icon: Icon,
  breakdown = [],
  maxScore,
  available = true,
}) {
  const [expanded, setExpanded] = useState(false);

  const normalizedTitle = String(title || "").toLowerCase();

  const isGithub = normalizedTitle.includes("github");
  const isLeetcode = normalizedTitle.includes("leetcode");

  const isExternalProfile = isGithub || isLeetcode;

  // Determine maximum score
  const getMaxScore = () => {
    if (maxScore !== undefined && maxScore !== null) {
      return Number(maxScore);
    }

    if (
      isGithub ||
      isLeetcode ||
      normalizedTitle.includes("resume") ||
      normalizedTitle.includes("profile quality")
    ) {
      return 20;
    }

    return 100;
  };

  const cardMaxScore = getMaxScore();

  const rawScore = Number(score);

  const hasValidScore =
    score !== null &&
    score !== undefined &&
    score !== "" &&
    Number.isFinite(rawScore);

  const numericScore = Math.min(
    cardMaxScore,
    Math.max(0, hasValidScore ? rawScore : 0)
  );

  const percentage =
    cardMaxScore > 0
      ? Math.min(
          100,
          Math.max(0, (numericScore / cardMaxScore) * 100)
        )
      : 0;

  // Profile availability is determined by backend,
  // not by whether the numeric score is zero.
  const isUnavailable =
    available === false ||
    (isExternalProfile && available !== true) ||
    !hasValidScore;

  // Select an appropriate icon automatically
  const DefaultIcon = isGithub
    ? Github
    : isLeetcode
    ? Code2
    : Sparkles;

  const CardIcon = Icon || DefaultIcon;

  const getScoreLabel = () => {
    if (isUnavailable) return "Not Available";
    if (percentage >= 85) return "Excellent";
    if (percentage >= 70) return "Strong";
    if (percentage >= 55) return "Developing";
    return "Needs Improvement";
  };

  const getScoreStyles = () => {
    if (isUnavailable) {
      return {
        text: "text-slate-400",
        badge: "bg-slate-100 text-slate-500",
        ring: "#cbd5e1",
        bar: "from-slate-300 to-slate-400",
      };
    }

    if (percentage >= 85) {
      return {
        text: "text-emerald-600",
        badge: "bg-emerald-50 text-emerald-700",
        ring: "#10b981",
        bar: "from-emerald-400 to-emerald-600",
      };
    }

    if (percentage >= 70) {
      return {
        text: "text-indigo-600",
        badge: "bg-indigo-50 text-indigo-700",
        ring: "#6366f1",
        bar: "from-indigo-500 to-violet-500",
      };
    }

    if (percentage >= 55) {
      return {
        text: "text-amber-600",
        badge: "bg-amber-50 text-amber-700",
        ring: "#f59e0b",
        bar: "from-amber-400 to-orange-500",
      };
    }

    return {
      text: "text-rose-600",
      badge: "bg-rose-50 text-rose-700",
      ring: "#f43f5e",
      bar: "from-rose-400 to-rose-500",
    };
  };

  const styles = getScoreStyles();

  const displayScore = isUnavailable
    ? "—"
    : Number.isInteger(numericScore)
    ? numericScore
    : numericScore.toFixed(1);

  const getDescription = () => {
    if (description) return description;

    if (isUnavailable) {
      return "Profile data is currently unavailable.";
    }

    return "Your score is calculated from the available profile information.";
  };

  const safeBreakdown = Array.isArray(breakdown)
    ? breakdown
    : [];

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[26px] bg-white">

      {/* Top decorative glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 transition-transform duration-300 group-hover:scale-105">
              <CardIcon size={23} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {title}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Profile Performance
              </p>
            </div>

          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-indigo-500">
            <TrendingUp size={18} />
          </div>
        </div>

        {/* SCORE SECTION */}
        <div className="mt-7 flex items-center justify-between gap-4">

          <div className="min-w-0">

            <div className="flex items-baseline gap-1.5">

              <span
                className={`text-4xl font-extrabold tracking-tight sm:text-[42px] ${styles.text}`}
              >
                {displayScore}
              </span>

              {!isUnavailable && (
                <span className="text-sm font-semibold text-slate-400">
                  /{cardMaxScore}
                </span>
              )}

            </div>

            <div
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles.badge}`}
            >
              {percentage >= 70 && !isUnavailable ? (
                <CheckCircle2 size={13} />
              ) : (
                <Sparkles size={13} />
              )}

              {getScoreLabel()}
            </div>

          </div>

          {/* CIRCULAR SCORE */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">

            <svg
              viewBox="0 0 100 100"
              className="h-24 w-24 -rotate-90"
              role="img"
              aria-label={
                isUnavailable
                  ? `${title} unavailable`
                  : `${percentage.toFixed(1)} percent`
              }
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#eef2ff"
                strokeWidth="8"
              />

              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={styles.ring}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={
                  2 *
                  Math.PI *
                  40 *
                  (1 - (isUnavailable ? 0 : percentage) / 100)
                }
                className="transition-all duration-700"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-extrabold text-slate-900">
                {isUnavailable
                  ? "N/A"
                  : `${Math.round(percentage)}%`}
              </span>

              <span className="mt-0.5 text-[10px] font-medium text-slate-400">
                Score
              </span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-6 flex-1 text-sm leading-6 text-slate-500">
          {getDescription()}
        </p>

        {/* EXPANDABLE BREAKDOWN */}
        {safeBreakdown.length > 0 && !isUnavailable && (
          <button
            type="button"
            onClick={() => setExpanded((previous) => !previous)}
            aria-expanded={expanded}
            className="mt-6 flex w-full items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm font-semibold text-indigo-700 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50"
          >
            <span className="flex items-center gap-2">
              <Info size={16} />
              Why this score?
            </span>

            {expanded ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
        )}

      </div>

      {/* BREAKDOWN PANEL */}
      {expanded &&
        !isUnavailable &&
        safeBreakdown.length > 0 && (
          <div className="border-t border-indigo-100 bg-[#fafbff] px-6 py-6 sm:px-7">

            <div className="mb-5">
              <h4 className="text-sm font-bold text-slate-900">
                Score Breakdown
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                How each component contributes to your score
              </p>
            </div>

            <div className="space-y-5">
              {safeBreakdown.map((item, index) => {
                const itemScore = Number(item?.score) || 0;

                const itemMax =
                  Number(item?.max ?? item?.max_score) ||
                  cardMaxScore;

                const itemPercentage =
                  itemMax > 0
                    ? Math.min(
                        100,
                        Math.max(
                          0,
                          (itemScore / itemMax) * 100
                        )
                      )
                    : 0;

                const itemLabel =
                  item?.label ||
                  item?.name ||
                  item?.category ||
                  `Component ${index + 1}`;

                return (
                  <div key={`${itemLabel}-${index}`}>

                    <div className="mb-2 flex items-center justify-between gap-3">

                      <span className="text-xs font-medium text-slate-600">
                        {itemLabel}
                      </span>

                      <span className="shrink-0 text-xs font-bold text-slate-800">
                        {itemScore}/{itemMax}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-indigo-100/70">

                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${styles.bar} transition-all duration-700`}
                        style={{
                          width: `${itemPercentage}%`,
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
}

export default ScoreCard;
