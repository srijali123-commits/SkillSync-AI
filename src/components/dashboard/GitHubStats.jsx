
import { useState } from "react";
import {
  Github,
  User,
  BookOpen,
  Users,
  UserPlus,
  Code2,
  ChevronDown,
  ChevronUp,
  Activity,
  Star,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  GitFork,
  ExternalLink,
  Info,
} from "lucide-react";

function GitHubStats({ github }) {
  const [expanded, setExpanded] = useState(false);

  const data = github || {};

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
    data.login ||
    data.github_username ||
    data.githubUsername ||
    "";

  const publicRepos = toNumber(
    data.public_repos ?? data.publicRepos
  );

  const followers = toNumber(data.followers);
  const following = toNumber(data.following);

  const score = Math.min(
    20,
    Math.max(0, toNumber(data.score))
  );

  const percentage = (score / 20) * 100;

  const languages = data.languages || [];

  const languageList = Array.isArray(languages)
    ? languages
    : typeof languages === "object" && languages !== null
    ? Object.keys(languages)
    : [];

  const breakdown = Array.isArray(data.score_breakdown)
    ? data.score_breakdown
    : Array.isArray(data.scoreBreakdown)
    ? data.scoreBreakdown
    : [];

  const repos = Array.isArray(data.repositories)
    ? data.repositories
    : Array.isArray(data.repos)
    ? data.repos
    : [];

  const activity = Array.isArray(data.recent_activity)
    ? data.recent_activity
    : Array.isArray(data.recentActivity)
    ? data.recentActivity
    : [];

  // A username alone does not verify successful API data.
  const isAvailable =
    data.available === false
      ? false
      : data.available === true ||
        (data.available == null &&
          (publicRepos > 0 ||
            followers > 0 ||
            following > 0 ||
            score > 0 ||
            repos.length > 0 ||
            breakdown.length > 0));

  const errorMessage =
    data.error ||
    data.message ||
    (username
      ? "GitHub statistics could not be retrieved. Please verify your username and check the backend API."
      : "GitHub username was not provided.");

  const profileUrl = username
    ? `https://github.com/${encodeURIComponent(username)}`
    : "";

  const circumference = 2 * Math.PI * 40;

  const getScoreStatus = () => {
    if (percentage >= 85) return "Excellent";
    if (percentage >= 70) return "Strong";
    if (percentage >= 55) return "Developing";
    return "Needs Improvement";
  };

  const stats = [
    {
      label: "Username",
      value: username || "Not available",
      icon: User,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      label: "Public Repositories",
      value: formatNumber(publicRepos),
      icon: BookOpen,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Followers",
      value: formatNumber(followers),
      icon: Users,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Following",
      value: formatNumber(following),
      icon: UserPlus,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
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
              <Github size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                GitHub Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {username
                  ? `Unable to load GitHub statistics for ${username}.`
                  : "GitHub profile data was not provided."}
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
                  ? "GitHub Data Unavailable"
                  : "GitHub Profile Not Connected"}
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
              No verified GitHub statistics are available.
              Missing profile data is not treated as zero
              development activity.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)]">

      {/* DECORATIVE BACKGROUND */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative p-6 sm:p-8">

        {/* HEADER */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <Github size={23} />
            </div>

            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                <Sparkles size={13} />
                Developer Intelligence
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                GitHub Profile
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Explore your repositories, development
                activity, and programming experience.
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

          {/* GITHUB SCORE */}
          <div className="flex items-center gap-5 self-start rounded-2xl border border-indigo-100 bg-[#fafbff] px-5 py-4 lg:self-auto">

            <div>
              <p className="text-xs font-semibold text-slate-500">
                GitHub Score
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
                aria-label={`GitHub score ${Math.round(percentage)} percent`}
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
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group min-w-0 rounded-2xl border border-slate-100 bg-[#fafbff] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-md sm:p-5"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon size={19} />
                </div>

                <p className="mt-4 text-xs font-semibold text-slate-500">
                  {stat.label}
                </p>

                <p
                  className="mt-2 truncate text-xl font-extrabold text-slate-900 sm:text-2xl"
                  title={String(stat.value)}
                >
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* PROGRAMMING LANGUAGES */}
        {languageList.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-6">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Code2 size={19} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Programming Languages
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Languages identified from your GitHub data
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {languageList.map((language, index) => {
                const label =
                  typeof language === "string"
                    ? language
                    : language?.name ||
                      language?.language ||
                      "";

                if (!label) return null;

                return (
                  <span
                    key={`${label}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* DETAILED ANALYSIS */}
        {(breakdown.length > 0 ||
          repos.length > 0 ||
          activity.length > 0) && (
          <div className="mt-8 border-t border-slate-100 pt-6">

            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-[#fafbff] px-5 py-4 text-left transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Activity size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {expanded
                      ? "Hide Detailed GitHub Analysis"
                      : "Explore Detailed GitHub Analysis"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    View score breakdown, repositories,
                    and recent development activity.
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
              <div className="mt-6 space-y-8">

                {/* SCORE BREAKDOWN */}
                {breakdown.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      GitHub Score Breakdown
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      How your development signals contribute
                      to the GitHub score.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
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
                            key={`${item?.label || item?.category || "score"}-${index}`}
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
                  </div>
                )}

                {/* TOP REPOSITORIES */}
                {repos.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Top Repositories
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Repositories returned by your GitHub analysis
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {repos.slice(0, 5).map((repo, index) => (
                        <div
                          key={repo.id || repo.name || index}
                          className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition-all duration-300 hover:border-indigo-100 hover:bg-white hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                              <BookOpen
                                size={17}
                                className="shrink-0 text-indigo-600"
                              />

                              <p className="truncate text-sm font-bold text-slate-900">
                                {repo.name || "Unnamed repository"}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                              {repo.language || "Not specified"}
                            </span>
                          </div>

                          <p className="mt-3 text-xs leading-6 text-slate-500">
                            {repo.description ||
                              "No description provided."}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-200/70 pt-4 text-xs font-medium text-slate-600">
                            <span className="flex items-center gap-1.5">
                              <Star size={14} className="text-amber-500" />
                              {formatNumber(
                                repo.stargazers_count ?? repo.stars
                              )}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <GitFork size={14} className="text-indigo-500" />
                              {formatNumber(
                                repo.forks_count ?? repo.forks
                              )}
                            </span>

                            {typeof repo.html_url === "string" &&
                              /^https:\/\/github\.com\//i.test(
                                repo.html_url
                              ) && (
                                <a
                                  href={repo.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-auto inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
                                >
                                  View Repo
                                  <ExternalLink size={13} />
                                </a>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* RECENT ACTIVITY */}
                {activity.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Recent Public Activity
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Recent events available from your GitHub profile
                    </p>

                    <div className="mt-4 space-y-3">
                      {activity.slice(0, 5).map((event, index) => (
                        <div
                          key={`${event.type || "event"}-${index}`}
                          className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Activity size={17} />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {event.type || "GitHub activity"}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {typeof event.repo === "string"
                                ? event.repo
                                : event.repo?.name ||
                                  "Public GitHub activity"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
            GitHub statistics reflect the profile information
            retrieved during your latest successful analysis.
            Repository activity and score values may change
            when your profile is refreshed.
          </p>
        </div>
      </div>
    </section>
  );
}

export default GitHubStats;
