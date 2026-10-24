
import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Send,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Target,
  Code2,
  ArrowRight,
  RotateCcw,
  Info,
  Zap,
  BarChart3,
} from "lucide-react";

const MAX_READINESS = 100;
const MAX_LEETCODE_SCORE = 20;

const ROLE_SKILLS = {
  "Software Engineer": [
    "Programming", "Data Structures", "Algorithms",
    "Git", "Problem Solving",
  ],
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "Git",
  ],
  "Backend Developer": [
    "Python", "Java", "APIs", "Databases", "Git",
  ],
  "Full Stack Developer": [
    "JavaScript", "React", "Node.js", "Databases", "APIs",
  ],
  "AI/ML Engineer": [
    "Python", "Machine Learning", "Data Structures",
    "NumPy", "TensorFlow",
  ],
  "Data Scientist": [
    "Python", "SQL", "Statistics", "Pandas",
    "Machine Learning",
  ],
  "DevOps Engineer": [
    "Linux", "Git", "Docker", "Cloud", "CI/CD",
  ],
  "Android Developer": [
    "Java", "Kotlin", "Android Studio", "APIs", "Git",
  ],
};

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, toNumber(value)));
}

function firstNumber(...values) {
  for (const value of values) {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return 0;
}

function getObject(value) {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? value
    : {};
}

function getArray(value) {
  return Array.isArray(value) ? value : [];
}

function readSavedAnalysis() {
  for (const key of [
    "analysisData",
    "analysis",
    "dashboardData",
    "skillSyncAnalysis",
  ]) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return parsed;
      }
    } catch (error) {
      console.warn(
        `Could not read localStorage key "${key}":`,
        error
      );
    }
  }

  return {};
}

function getAnalysisData() {
  const root = getObject(readSavedAnalysis());

  const analysis = getObject(
    root.analysis || root.data || root
  );

  const readiness = getObject(
    analysis.readiness || analysis.career_readiness
  );

  const github = getObject(
    analysis.github ||
    analysis.github_data ||
    analysis.github_stats
  );

  const leetcode = getObject(
    analysis.leetcode ||
    analysis.leetCode ||
    analysis.leetcode_data ||
    analysis.leet_code
  );

  const resume = getObject(
    analysis.resume ||
    analysis.resume_analysis ||
    analysis.resumeAnalysis
  );

  const roleMatching = getObject(
    analysis.role_matching ||
    analysis.roleMatching ||
    analysis.role_match
  );

  const skillGap = getObject(
    analysis.skill_gap || analysis.skillGap
  );

  const easy = firstNumber(
    leetcode.easy,
    leetcode.easy_solved,
    leetcode.easySolved,
    leetcode.easy_count
  );

  const medium = firstNumber(
    leetcode.medium,
    leetcode.medium_solved,
    leetcode.mediumSolved,
    leetcode.medium_count
  );

  const hard = firstNumber(
    leetcode.hard,
    leetcode.hard_solved,
    leetcode.hardSolved,
    leetcode.hard_count
  );

  const totalSolved = Math.max(
    easy + medium + hard,
    firstNumber(
      leetcode.total_solved,
      leetcode.totalSolved,
      leetcode.solved,
      leetcode.total,
      leetcode.total_questions_solved
    )
  );

  return {
    raw: analysis,

    targetRole:
      analysis.target_role ||
      analysis.targetRole ||
      localStorage.getItem("targetRole") ||
      "Software Engineer",

    currentReadiness: clamp(
      firstNumber(
        readiness.overall_score,
        readiness.score,
        analysis.readiness_score,
        analysis.overall_score,
        analysis.career_readiness_score
      )
    ),

    github: {
      ...github,
      score: firstNumber(
        github.score,
        github.github_score
      ),
    },

    resume: {
      ...resume,
      score: firstNumber(
        resume.score,
        resume.resume_score
      ),
    },

    leetcode: {
      ...leetcode,
      easy,
      medium,
      hard,
      totalSolved,
      score: clamp(
        firstNumber(
          leetcode.score,
          leetcode.leetcode_score
        ),
        0,
        MAX_LEETCODE_SCORE
      ),
      available: leetcode.available === true,
    },

    roleMatching,
    skillGap,
  };
}

// Estimated scoring formula retained from original code.
function calculateLeetCodeScore(easy, medium, hard) {
  easy = Math.max(0, toNumber(easy));
  medium = Math.max(0, toNumber(medium));
  hard = Math.max(0, toNumber(hard));

  const total = easy + medium + hard;

  if (total === 0) return 0;

  const easyPoints = Math.min(5, easy / 20);
  const mediumPoints = Math.min(7, medium / 15);
  const hardPoints = Math.min(5, hard / 8);

  const depthPoints = Math.min(
    3,
    (medium / total) * 1.5 +
    (hard / total) * 1.5
  );

  return Number(
    Math.min(
      MAX_LEETCODE_SCORE,
      easyPoints +
      mediumPoints +
      hardPoints +
      depthPoints
    ).toFixed(1)
  );
}

function parseLeetCodeTarget(prompt, currentSolved) {
  const text = prompt.toLowerCase().trim();

  if (
    !/\bleet\s*code\b|\bquestions?\b|\bproblems?\b/.test(
      text
    )
  ) {
    return null;
  }

  const patterns = [
    /(?:solve|solved|complete|completed|do|finish|reach|reached|target)\s+(?:a\s+total\s+of\s+)?(\d+)\s*(?:more\s+|additional\s+)?(?:leetcode\s*)?(?:questions?|problems?)/i,
    /(?:total\s+of|total\s+becomes|total\s+to|up\s+to)\s+(\d+)\s*(?:solved\s*)?(?:leetcode\s*)?(?:questions?|problems?)/i,
    /(?:leetcode|questions?|problems?)\s*(?:to\s*)?(\d+)/i,
    /(\d+)\s*(?:more\s+|additional\s+)?(?:leetcode\s*)?(?:questions?|problems?)/i,
  ];

  let match = null;

  for (const pattern of patterns) {
    match = text.match(pattern);
    if (match) break;
  }

  if (!match) return null;

  const amount = Number(match[1]);

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return null;
  }

  const explicitlyAdditional =
    /\b(more|additional|extra|another)\b/.test(text);

  const explicitlyTotal =
    /\b(reach|reached|target|total|altogether|in total|up to)\b/.test(
      text
    );

  const isTotal =
    explicitlyTotal && !explicitlyAdditional;

  return {
    amount,
    mode: isTotal ? "total" : "additional",
    targetSolved: isTotal
      ? amount
      : currentSolved + amount,
  };
}

function normalizeSkillList(value) {
  return getArray(value)
    .map((item) => {
      if (typeof item === "string") return item;

      if (item && typeof item === "object") {
        return (
          item.name ||
          item.skill ||
          item.title ||
          ""
        );
      }

      return "";
    })
    .filter(Boolean);
}

function calculateRoleProjection(data, prompt) {
  const roleSkills =
    ROLE_SKILLS[data.targetRole] || [];

  const detected = normalizeSkillList(
    data.skillGap.detected_skills ||
    data.roleMatching.detected_skills
  );

  const missing = normalizeSkillList(
    data.skillGap.missing_skills ||
    data.roleMatching.missing_skills
  );

  const currentMatch = clamp(
    firstNumber(
      data.roleMatching.match_percentage,
      data.roleMatching.matchPercentage,
      data.skillGap.match_percentage,
      data.raw.role_match_percentage
    )
  );

  const mentionedSkills = missing.filter((skill) =>
    prompt.toLowerCase().includes(skill.toLowerCase())
  );

  if (!roleSkills.length || !mentionedSkills.length) {
    return {
      currentMatch,
      projectedMatch: currentMatch,
      mentionedSkills: [],
      changed: false,
    };
  }

  const allSkills = new Set(
    [...detected, ...mentionedSkills].map(
      (skill) => skill.toLowerCase()
    )
  );

  const matchedCount = roleSkills.filter(
    (skill) => allSkills.has(skill.toLowerCase())
  ).length;

  const projectedMatch = Math.max(
    currentMatch,
    clamp(
      (matchedCount / roleSkills.length) * 100
    )
  );

  return {
    currentMatch,
    projectedMatch: Number(projectedMatch.toFixed(1)),
    mentionedSkills,
    changed: projectedMatch > currentMatch,
  };
}

function projectLeetCode(data, parsedTarget) {
  const leetcode = data.leetcode;

  const currentEasy = leetcode.easy;
  const currentMedium = leetcode.medium;
  const currentHard = leetcode.hard;

  const difficultyTotal =
    currentEasy + currentMedium + currentHard;

  const currentSolved = Math.max(
    leetcode.totalSolved,
    difficultyTotal
  );

  const currentScore = leetcode.score;

  const targetSolved =
    parsedTarget?.targetSolved ?? currentSolved;

  if (!parsedTarget || targetSolved <= currentSolved) {
    return {
      currentSolved,
      targetSolved,
      currentScore,
      projectedScore: currentScore,
      changed: false,
      estimated: false,
    };
  }

  const ratios =
    difficultyTotal > 0
      ? {
          easy: currentEasy / difficultyTotal,
          medium: currentMedium / difficultyTotal,
          hard: currentHard / difficultyTotal,
        }
      : {
          easy: 0.4,
          medium: 0.45,
          hard: 0.15,
        };

  const additionalQuestions =
    targetSolved - currentSolved;

  const unclassified = Math.max(
    0,
    currentSolved - difficultyTotal
  );

  const extraCount =
    additionalQuestions + unclassified;

  const extraEasy = Math.round(
    extraCount * ratios.easy
  );

  const extraMedium = Math.round(
    extraCount * ratios.medium
  );

  const extraHard = Math.max(
    0,
    extraCount - extraEasy - extraMedium
  );

  const projectedEasy = currentEasy + extraEasy;
  const projectedMedium = currentMedium + extraMedium;
  const projectedHard = currentHard + extraHard;

  const baselineEasy =
    currentEasy +
    Math.round(unclassified * ratios.easy);

  const baselineMedium =
    currentMedium +
    Math.round(unclassified * ratios.medium);

  const baselineHard =
    currentHard +
    Math.max(
      0,
      unclassified -
      Math.round(unclassified * ratios.easy) -
      Math.round(unclassified * ratios.medium)
    );

  const modelBaseline = calculateLeetCodeScore(
    baselineEasy,
    baselineMedium,
    baselineHard
  );

  const modelProjection = calculateLeetCodeScore(
    projectedEasy,
    projectedMedium,
    projectedHard
  );

  const projectedScore = clamp(
    Number(
      (
        currentScore +
        Math.max(
          0,
          modelProjection - modelBaseline
        )
      ).toFixed(1)
    ),
    0,
    MAX_LEETCODE_SCORE
  );

  return {
    currentSolved,
    targetSolved,
    currentScore,
    projectedScore,
    changed: true,
    estimated:
      difficultyTotal === 0 || unclassified > 0,
  };
}

function formatScore(value) {
  const number = toNumber(value);
  return Number.isInteger(number)
    ? String(number)
    : number.toFixed(1);
}

function ComparisonCard({
  title,
  icon: Icon,
  before,
  after,
  suffix = "",
  description,
}) {
  const beforeValue = toNumber(before);
  const afterValue = toNumber(after);
  const delta = afterValue - beforeValue;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={18} />
        </div>

        <p className="text-sm font-bold text-slate-900">
          {title}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-medium text-slate-400">
            Current
          </p>
          <p className="mt-1 text-xl font-extrabold text-slate-700">
            {formatScore(before)}
            {suffix}
          </p>
        </div>

        <ArrowRight
          size={20}
          className="text-indigo-400"
        />

        <div className="rounded-xl bg-indigo-50 px-4 py-3">
          <p className="text-[11px] font-medium text-indigo-500">
            Projected
          </p>
          <p className="mt-1 text-xl font-extrabold text-indigo-700">
            {formatScore(after)}
            {suffix}
          </p>
        </div>
      </div>

      <p
        className={`mt-4 text-xs font-bold ${
          delta > 0
            ? "text-emerald-600"
            : delta < 0
            ? "text-rose-600"
            : "text-slate-500"
        }`}
      >
        {delta > 0 ? "+" : ""}
        {formatScore(delta)}
        {suffix} change
      </p>

      {description && (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function WhatIfSimulator() {
  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const examples = [
    "What if I solve 20 LeetCode questions?",
    "What if I reach 100 solved LeetCode questions?",
  ];

  function handleSimulation() {
    if (!scenario.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const data = getAnalysisData();

      if (!Object.keys(data.raw).length) {
        throw new Error(
          "No saved analysis found. Upload and analyze your resume first."
        );
      }

      const parsedTarget = parseLeetCodeTarget(
        scenario,
        data.leetcode.totalSolved
      );

      if (
        parsedTarget &&
        data.leetcode.available !== true
      ) {
        throw new Error(
          "LeetCode data is unavailable. Refresh your LeetCode profile before simulating questions."
        );
      }

      const leetcodeProjection = projectLeetCode(
        data,
        parsedTarget
      );

      const roleProjection = calculateRoleProjection(
        data,
        scenario
      );

      const currentReadiness = data.currentReadiness;

      const leetcodeDelta =
        leetcodeProjection.projectedScore -
        leetcodeProjection.currentScore;

      const roleDelta =
        (
          roleProjection.projectedMatch -
          roleProjection.currentMatch
        ) * 0.4;

      const projectedReadiness = clamp(
        Number(
          (
            currentReadiness +
            leetcodeDelta +
            roleDelta
          ).toFixed(1)
        ),
        0,
        MAX_READINESS
      );

      const improvement = Number(
        (
          projectedReadiness - currentReadiness
        ).toFixed(1)
      );

      let message =
        "No measurable change was detected. Try specifying additional LeetCode questions or a missing skill for your target role.";

      if (parsedTarget) {
        if (
          parsedTarget.targetSolved <=
          leetcodeProjection.currentSolved
        ) {
          message =
            `Your saved profile reports ${leetcodeProjection.currentSolved} solved questions. ` +
            "A target total must be greater than this to show an increase.";
        } else {
          message =
            parsedTarget.mode === "additional"
              ? `Added ${parsedTarget.amount} hypothetical questions: ${leetcodeProjection.currentSolved} → ${leetcodeProjection.targetSolved} total solved. `
              : `Target total: ${leetcodeProjection.targetSolved} solved questions. `;

          message +=
            `Estimated LeetCode score: ${leetcodeProjection.currentScore}/20 → ${leetcodeProjection.projectedScore}/20. `;

          message += leetcodeProjection.estimated
            ? "Difficulty distribution is estimated because saved breakdown data is incomplete. "
            : "New questions are estimated using your existing easy/medium/hard distribution. ";

          message +=
            "This is a hypothetical projection, not a live LeetCode result.";

          if (improvement === 0) {
            message +=
              " The scoring rubric produces no measurable readiness increase for this change.";
          }
        }
      }

      if (roleProjection.mentionedSkills.length > 0) {
        message +=
          ` Role-related missing skills mentioned: ${roleProjection.mentionedSkills.join(", ")}. ` +
          "Role-match improvement is estimated.";
      }

      setResult({
        currentReadiness,
        projectedReadiness,
        improvement,

        currentSolved:
          leetcodeProjection.currentSolved,

        targetSolved:
          leetcodeProjection.targetSolved,

        currentLeetCodeScore:
          leetcodeProjection.currentScore,

        projectedLeetCodeScore:
          leetcodeProjection.projectedScore,

        currentRoleMatch:
          roleProjection.currentMatch,

        projectedRoleMatch:
          roleProjection.projectedMatch,

        mentionedSkills:
          roleProjection.mentionedSkills,

        hasLeetCodeScenario: Boolean(parsedTarget),

        message,
      });
    } catch (error) {
      console.error(
        "What-If Simulator failed:",
        error
      );

      setResult({
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    } finally {
      setLoading(false);
    }
  }

  function resetSimulation() {
    setScenario("");
    setResult(null);
  }

  return (
    <section className="mt-10">
      <div className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)]">

        {/* BACKGROUND GLOW */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />

        <div className="relative p-6 sm:p-8">

          {/* HEADER */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
                <Sparkles size={23} />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                  <Zap size={13} />
                  Career Forecasting
                </div>

                <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  What-If Career Simulator
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Explore how a specific improvement could
                  change your current role readiness.
                </p>
              </div>
            </div>

            <div className="inline-flex shrink-0 self-start items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
              <BarChart3 size={15} />
              Predictive Insights
            </div>
          </div>

          {/* SIMULATOR CONTENT */}
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">

            {/* LEFT PANEL */}
            <div className="rounded-2xl border border-slate-100 bg-[#fafbff] p-5 sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Lightbulb size={20} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Create Your Scenario
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Describe a hypothetical career improvement
                  </p>
                </div>
              </div>

              <label
                htmlFor="career-scenario"
                className="mt-7 block text-sm font-bold text-slate-800"
              >
                Describe a career scenario
              </label>

              <div className="relative mt-3">
                <textarea
                  id="career-scenario"
                  value={scenario}
                  onChange={(event) =>
                    setScenario(event.target.value)
                  }
                  placeholder="What if I solve 20 LeetCode questions?"
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-indigo-100 bg-white px-4 py-4 pr-12 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />

                <Lightbulb
                  size={19}
                  className="pointer-events-none absolute bottom-5 right-4 text-indigo-300"
                />
              </div>

              {/* EXAMPLE PROMPTS */}
              <div className="mt-5">

                <p className="mb-3 text-xs font-bold text-slate-500">
                  Try an example
                </p>

                <div className="flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => {
                        setScenario(example);
                        setResult(null);
                      }}
                      className="rounded-xl border border-indigo-100 bg-white px-3 py-2 text-left text-xs font-medium leading-5 text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      {example}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  You can also describe learning a skill
                  identified as missing for your target role.
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-7 flex flex-wrap items-center gap-3">

                <button
                  type="button"
                  onClick={handleSimulation}
                  disabled={loading || !scenario.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/50 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <TrendingUp
                      size={18}
                      className="animate-pulse"
                    />
                  ) : (
                    <Send size={17} />
                  )}

                  {loading
                    ? "Calculating..."
                    : "Simulate Scenario"}
                </button>

                {(scenario || result) && (
                  <button
                    type="button"
                    onClick={resetSimulation}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/50 p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Simulation Result
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Transparent projected impact
                  </p>
                </div>
              </div>

              {/* INITIAL STATE */}
              {!result && (
                <div className="mt-6 flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-white/80 px-6 py-10 text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                    <Sparkles size={30} />
                  </div>

                  <h4 className="mt-5 text-base font-bold text-slate-900">
                    Ready to Explore Your Possibilities?
                  </h4>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                    Enter a scenario and run the simulation
                    to see how your readiness score might change.
                  </p>
                </div>
              )}

              {/* ERROR */}
              {result?.error && (
                <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-5">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <AlertCircle size={20} />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-rose-700">
                        Simulation Failed
                      </h4>

                      <p className="mt-2 break-words text-sm leading-6 text-rose-600">
                        {result.error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUCCESSFUL RESULT */}
              {result && !result.error && (
                <div className="mt-6 space-y-4">

                  {/* READINESS COMPARISON */}
                  <ComparisonCard
                    title="Career Readiness"
                    icon={TrendingUp}
                    before={result.currentReadiness}
                    after={result.projectedReadiness}
                    suffix="/100"
                    description="Estimated overall readiness after the hypothetical change."
                  />

                  {/* IMPROVEMENT SUMMARY */}
                  <div
                    className={`flex items-start gap-3 rounded-2xl border p-4 ${
                      result.improvement > 0
                        ? "border-emerald-100 bg-emerald-50/70"
                        : "border-slate-100 bg-white"
                    }`}
                  >

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        result.improvement > 0
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {result.improvement > 0 ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Info size={20} />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {result.improvement > 0
                          ? "Projected Improvement"
                          : "No Measurable Improvement"}
                      </p>

                      <p
                        className={`mt-1 text-xl font-extrabold ${
                          result.improvement > 0
                            ? "text-emerald-600"
                            : "text-slate-600"
                        }`}
                      >
                        {result.improvement > 0 ? "+" : ""}
                        {formatScore(result.improvement)} points
                      </p>
                    </div>
                  </div>

                  {/* LEETCODE PROJECTION */}
                  {result.hasLeetCodeScenario &&
                    result.targetSolved >
                      result.currentSolved && (
                      <ComparisonCard
                        title="LeetCode Score Projection"
                        icon={Code2}
                        before={result.currentLeetCodeScore}
                        after={result.projectedLeetCodeScore}
                        suffix="/20"
                        description={`${result.currentSolved} → ${result.targetSolved} total solved questions`}
                      />
                    )}

                  {/* ROLE MATCH PROJECTION */}
                  {Math.abs(
                    result.projectedRoleMatch -
                    result.currentRoleMatch
                  ) > 0.01 && (
                    <div className="space-y-3">

                      <ComparisonCard
                        title="Target Role Match"
                        icon={Target}
                        before={result.currentRoleMatch}
                        after={result.projectedRoleMatch}
                        suffix="%"
                      />

                      {result.mentionedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {result.mentionedSkills.map(
                            (skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700"
                              >
                                <CheckCircle2 size={13} />
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* EXPLANATION */}
                  <div className="rounded-2xl border border-indigo-100 bg-white p-5">

                    <div className="flex items-center gap-2">
                      <Lightbulb
                        size={18}
                        className="text-indigo-600"
                      />

                      <h4 className="text-sm font-bold text-slate-900">
                        Simulation Insights
                      </h4>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {result.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTNOTE */}
          <div className="mt-7 flex items-start gap-2 border-t border-slate-100 pt-5">

            <Info
              size={15}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              Simulations are hypothetical estimates based on
              your saved career analysis. Actual readiness
              scores may differ after your profile is
              reanalyzed. Simulated improvements do not
              modify your saved profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatIfSimulator;
