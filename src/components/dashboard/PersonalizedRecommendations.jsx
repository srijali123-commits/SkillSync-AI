
import { useEffect, useState } from "react";

import {
  Sparkles,
  Target,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
  Lightbulb,
  ListChecks,
  Info,
  Zap,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000";

function PersonalizedRecommendations({ analysis }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!analysis || Object.keys(analysis).length === 0) {
      setRecommendations([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function fetchRecommendations() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/recommendations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ analysis }),
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to generate personalized recommendations."
          );
        }

        if (!active) return;

        setRecommendations(
          Array.isArray(data?.recommendations)
            ? data.recommendations
            : []
        );
      } catch (err) {
        if (!active || err?.name === "AbortError") {
          return;
        }

        console.error(
          "Personalized recommendation error:",
          err
        );

        setRecommendations([]);

        setError(
          err?.message ||
            "Unable to load personalized recommendations."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchRecommendations();

    return () => {
      active = false;
      controller.abort();
    };
  }, [analysis, retryCount]);

  function getPriorityConfig(priority) {
    const value = String(priority || "").toLowerCase();

    if (value.includes("critical")) {
      return {
        badge: "border-rose-100 bg-rose-50 text-rose-700",
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
        accent: "from-rose-400 to-pink-500",
        dot: "bg-rose-500",
      };
    }

    if (value.includes("important") || value.includes("high")) {
      return {
        badge: "border-amber-100 bg-amber-50 text-amber-700",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        accent: "from-amber-400 to-orange-500",
        dot: "bg-amber-500",
      };
    }

    return {
      badge: "border-indigo-100 bg-indigo-50 text-indigo-700",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      accent: "from-indigo-500 to-violet-500",
      dot: "bg-indigo-500",
    };
  }

  const criticalCount = recommendations.filter((item) =>
    String(item?.priority || "")
      .toLowerCase()
      .includes("critical")
  ).length;

  const importantCount = recommendations.filter((item) => {
    const priority = String(item?.priority || "").toLowerCase();

    return (
      priority.includes("important") ||
      priority.includes("high")
    );
  }).length;

  const handleRetry = () => {
    setRetryCount((previous) => previous + 1);
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)]">

      {/* DECORATIVE GLOW */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative p-6 sm:p-8">

        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <Sparkles size={23} />
            </div>

            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                <Zap size={13} />
                Career Intelligence
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Personalized Recommendations
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Discover actionable improvements based on
                your target role, resume, and identified
                skill gaps.
              </p>
            </div>
          </div>

          {!loading && !error && recommendations.length > 0 && (
            <div className="inline-flex shrink-0 self-start items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
              <ListChecks size={15} />
              {recommendations.length}{" "}
              {recommendations.length === 1
                ? "Recommendation"
                : "Recommendations"}
            </div>
          )}
        </div>

        {/* SUMMARY */}
        {!loading && !error && recommendations.length > 0 && (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">

            <SummaryCard
              label="Suggested Actions"
              value={recommendations.length}
              icon={ListChecks}
              bg="bg-indigo-50"
              color="text-indigo-600"
            />

            <SummaryCard
              label="Critical Priority"
              value={criticalCount}
              icon={AlertTriangle}
              bg="bg-rose-50"
              color="text-rose-600"
            />

            <SummaryCard
              label="Important Priority"
              value={importantCount}
              icon={Target}
              bg="bg-amber-50"
              color="text-amber-600"
            />
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div
            className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white px-6 py-12 text-center"
            role="status"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <RefreshCw
                size={28}
                className="animate-spin text-indigo-600"
              />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-900">
              Preparing Your Career Recommendations
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Analyzing your current career profile and
              identifying meaningful next steps.
            </p>

            <div className="mx-auto mt-6 flex max-w-sm flex-wrap justify-center gap-2">
              <div className="h-7 w-24 animate-pulse rounded-full bg-indigo-100" />
              <div className="h-7 w-32 animate-pulse rounded-full bg-violet-100" />
              <div className="h-7 w-20 animate-pulse rounded-full bg-indigo-100" />
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50/60 p-6">

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-rose-800">
                  Unable to Load Recommendations
                </h3>

                <p className="mt-2 text-sm leading-6 text-rose-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-50"
                >
                  <RefreshCw size={15} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          !error &&
          recommendations.length === 0 && (
            <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-6 py-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={26} />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                No Immediate Recommendations
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No additional improvement actions were
                generated from the current analysis.
              </p>
            </div>
          )}

        {/* RECOMMENDATIONS */}
        {!loading &&
          !error &&
          recommendations.length > 0 && (
            <div className="mt-7 grid gap-5 lg:grid-cols-2">

              {recommendations.map((recommendation, index) => {
                const priority =
                  recommendation?.priority || "Important";

                const priorityConfig =
                  getPriorityConfig(priority);

                const title =
                  recommendation?.title ||
                  `Improve ${
                    recommendation?.skill || "this area"
                  }`;

                return (
                  <div
                    key={`${recommendation?.skill || "recommendation"}-${index}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-[#fafbff] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/50"
                  >

                    {/* TOP ACCENT */}
                    <div
                      className={`h-1 bg-gradient-to-r ${priorityConfig.accent}`}
                    />

                    <div className="flex flex-1 flex-col p-5 sm:p-6">

                      {/* TITLE ROW */}
                      <div className="flex flex-wrap items-start justify-between gap-3">

                        <div className="flex min-w-0 flex-1 items-start gap-3">

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${priorityConfig.iconBg} ${priorityConfig.iconColor}`}
                          >
                            <Target size={19} />
                          </div>

                          <div className="min-w-0">

                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Action {String(index + 1).padStart(2, "0")}
                            </p>

                            <h3 className="text-base font-bold leading-6 text-slate-900">
                              {title}
                            </h3>

                            {recommendation?.skill && (
                              <p className="mt-1.5 text-xs font-medium text-slate-500">
                                Skill: {recommendation.skill}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${priorityConfig.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${priorityConfig.dot}`}
                          />
                          {priority}
                        </span>
                      </div>

                      {/* WHY THIS MATTERS */}
                      {recommendation?.reason && (
                        <div className="mt-6">

                          <div className="flex items-center gap-2">
                            <Lightbulb
                              size={17}
                              className="text-amber-500"
                            />

                            <h4 className="text-sm font-bold text-slate-800">
                              Why This Matters
                            </h4>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {recommendation.reason}
                          </p>
                        </div>
                      )}

                      {/* RECOMMENDED ACTION */}
                      {recommendation?.action && (
                        <div className="mt-5 rounded-xl border border-indigo-100 bg-white/80 p-4">

                          <div className="flex items-center gap-2">
                            <BookOpen
                              size={17}
                              className="text-indigo-600"
                            />

                            <h4 className="text-sm font-bold text-slate-800">
                              Recommended Action
                            </h4>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {recommendation.action}
                          </p>
                        </div>
                      )}

                      {/* CARD FOOTER */}
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5">

                        <span className="text-xs font-medium text-slate-400">
                          Career improvement step
                        </span>

                        <ArrowUpRight
                          size={17}
                          className="text-slate-300 transition-colors group-hover:text-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        {/* FOOTNOTE */}
        <div className="mt-8 flex items-start gap-2 border-t border-slate-100 pt-5">

          <Info
            size={15}
            className="mt-0.5 shrink-0 text-slate-400"
          />

          <p className="text-xs leading-5 text-slate-500">
            Recommendations are generated from your current
            career analysis. They may change when you update
            your resume, refresh your coding profiles, or
            select a different target role.
          </p>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  bg,
  color,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[#fafbff] p-4">

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}
      >
        <Icon size={20} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-xl font-extrabold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

export default PersonalizedRecommendations;
