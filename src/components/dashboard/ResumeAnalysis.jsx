
import { useState } from "react";

import {
  FileText,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  Target,
  ClipboardCheck,
  ArrowUpRight,
  Info,
} from "lucide-react";

function ResumeAnalysis({ data = {}, targetRole = "" }) {
  const [expanded, setExpanded] = useState(false);

  const breakdown = Array.isArray(data?.breakdown)
    ? data.breakdown
    : [];

  const sections =
    data?.sections && typeof data.sections === "object"
      ? data.sections
      : {};

  const suggestions = Array.isArray(data?.suggestions)
    ? data.suggestions
    : [];

  const rawScore = Number(data?.score);

  const score = Math.min(
    20,
    Math.max(
      0,
      Number.isFinite(rawScore) ? rawScore : 0
    )
  );

  const percentage = (score / 20) * 100;

  const formatScore = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) return "0";

    const rounded = Math.round(number * 10) / 10;

    return Number.isInteger(rounded)
      ? String(rounded)
      : rounded.toFixed(1);
  };

  const sectionRows = [
    ["Education", sections.education],
    [
      "Technical Skills",
      sections.technical_skills || sections.skills,
    ],
    ["Projects", sections.projects],
    ["Certifications", sections.certifications],
    ["Experience / Internship", sections.experience],
    ["Contact", sections.contact],
    ["Summary / Objective", sections.summary],
  ];

  const detectedCount = sectionRows.filter(
    ([, present]) => Boolean(present)
  ).length;

  const totalSections = sectionRows.length;

  const getScoreStatus = () => {
    if (percentage >= 85) return "Excellent";
    if (percentage >= 70) return "Strong";
    if (percentage >= 55) return "Developing";
    return "Needs Improvement";
  };

  const getScoreColor = () => {
    if (percentage >= 85) {
      return {
        text: "text-emerald-600",
        ring: "#10b981",
        badge: "bg-emerald-50 text-emerald-700",
      };
    }

    if (percentage >= 70) {
      return {
        text: "text-indigo-600",
        ring: "#6366f1",
        badge: "bg-indigo-50 text-indigo-700",
      };
    }

    if (percentage >= 55) {
      return {
        text: "text-amber-600",
        ring: "#f59e0b",
        badge: "bg-amber-50 text-amber-700",
      };
    }

    return {
      text: "text-rose-600",
      ring: "#f43f5e",
      badge: "bg-rose-50 text-rose-700",
    };
  };

  const scoreStyle = getScoreColor();

  const circumference = 2 * Math.PI * 40;

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)]">

      {/* DECORATIVE BACKGROUND */}
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative p-6 sm:p-8">

        {/* HEADER */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <FileText size={23} />
            </div>

            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                <Sparkles size={13} />
                Resume Intelligence
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Resume Quality Analysis
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Explore the structure, completeness, and
                supporting evidence in your uploaded resume.
              </p>

              {targetRole && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                  <Target size={13} />
                  {targetRole}
                </div>
              )}
            </div>
          </div>

          {/* SCORE INDICATOR */}
          <div className="flex items-center gap-5 self-start rounded-2xl border border-indigo-100 bg-[#fafbff] px-5 py-4 lg:self-auto">

            <div>
              <p className="text-xs font-semibold text-slate-500">
                Resume Score
              </p>

              <p className={`mt-1 text-3xl font-extrabold ${scoreStyle.text}`}>
                {formatScore(score)}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  /20
                </span>
              </p>

              <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${scoreStyle.badge}`}>
                {getScoreStatus()}
              </span>
            </div>

            <div className="relative h-20 w-20 shrink-0">

              <svg
                viewBox="0 0 100 100"
                className="h-20 w-20 -rotate-90"
                role="img"
                aria-label={`Resume quality ${Math.round(percentage)} percent`}
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
                  stroke={scoreStyle.ring}
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

        {/* SECTION SUMMARY */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/70 px-5 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <ClipboardCheck size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Resume Section Detection
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Sections identified from your uploaded resume
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white px-4 py-2 shadow-sm">
            <span className="text-lg font-extrabold text-indigo-600">
              {detectedCount}
            </span>
            <span className="text-sm font-medium text-slate-400">
              /{totalSections}
            </span>
            <span className="ml-2 text-xs font-semibold text-slate-500">
              Detected
            </span>
          </div>
        </div>

        {/* DETECTED SECTIONS */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {sectionRows.map(([label, present]) => {
            const detected = Boolean(present);

            return (
              <div
                key={label}
                className={`group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                  detected
                    ? "border-emerald-100 bg-emerald-50/50 hover:border-emerald-200"
                    : "border-slate-100 bg-slate-50/70 hover:border-slate-200"
                }`}
              >

                <div className="flex items-start gap-2.5">

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      detected
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-200/70 text-slate-400"
                    }`}
                  >
                    {detected ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <XCircle size={17} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-5 text-slate-800">
                      {label}
                    </p>

                    <p
                      className={`mt-2 text-xs font-semibold ${
                        detected
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      {detected ? "Detected" : "Not detected"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
                      ? "Hide Resume Score Breakdown"
                      : "Explore Resume Score Breakdown"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Understand how individual resume factors
                    contribute to your score.
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
                  const itemScore = Number(item?.score) || 0;

                  const max =
                    Number(item?.max ?? item?.max_score) || 0;

                  const width =
                    max > 0
                      ? Math.min(
                          100,
                          Math.max(0, (itemScore / max) * 100)
                        )
                      : 0;

                  return (
                    <div
                      key={`${item?.label || item?.category || "item"}-${index}`}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
                    >

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {item?.label ||
                              item?.category ||
                              "Component"}
                          </p>

                          {item?.details && (
                            <p className="mt-1.5 text-xs leading-5 text-slate-500">
                              {item.details}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 text-sm font-bold text-indigo-600">
                          {formatScore(itemScore)}
                          <span className="font-medium text-slate-400">
                            /{formatScore(max)}
                          </span>
                        </span>
                      </div>

                      {max > 0 && (
                        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200/80">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                            style={{ width: `${width}%` }}
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

        {/* IMPROVEMENT SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-6">

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Lightbulb size={20} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Resume Improvement Suggestions
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Personalized recommendations to improve
                  your resume's clarity and completeness.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${index}-${String(suggestion)}`}
                  className="group flex items-start gap-3 rounded-2xl border border-indigo-100/70 bg-gradient-to-br from-white to-indigo-50/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Lightbulb size={16} />
                  </div>

                  <p className="flex-1 text-sm leading-6 text-slate-600">
                    {suggestion}
                  </p>

                  <ArrowUpRight
                    size={16}
                    className="mt-0.5 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTNOTE */}
        <div className="mt-7 flex items-start gap-2 border-t border-slate-100 pt-5">
          <Info
            size={15}
            className="mt-0.5 shrink-0 text-slate-400"
          />

          <p className="text-xs leading-5 text-slate-500">
            Section detection and resume scoring are based
            on the content extracted from your uploaded file.
            A section marked as not detected may require
            clearer headings or more recognizable formatting.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ResumeAnalysis;
