
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

import {
  FileText,
  BrainCircuit,
  BarChart3,
  CheckCircle2,
  Github,
  Code2,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";

const steps = [
  {
    title: "Reading Your Resume",
    description: "Preparing your career profile",
    icon: FileText,
  },
  {
    title: "Extracting Your Skills",
    description: "Identifying skills and experience",
    icon: BrainCircuit,
  },
  {
    title: "Fetching GitHub & LeetCode Data",
    description: "Analyzing your coding profiles",
    icon: Github,
  },
  {
    title: "Preparing Career Insights",
    description: "Generating your readiness analysis",
    icon: BarChart3,
  },
];

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function Loading() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const updateStep = (nextStep, nextProgress) => {
      if (cancelled) return;
      setStep(nextStep);
      setProgress(nextProgress);
    };

    const runAnalysis = async () => {
      try {
        // STEP 1 — READING RESUME
        updateStep(0, 12);
        await wait(700);

        if (cancelled) return;

        const resumeText =
          localStorage.getItem("resumeText") || "";

        const githubUsername =
          localStorage.getItem("githubUsername") || "";

        const leetcodeUsername =
          localStorage.getItem("leetcodeUsername") || "";

        const targetRole =
          localStorage.getItem("targetRole") ||
          "Software Engineer";

        // STEP 2 — EXTRACTING SKILLS
        updateStep(1, 35);
        await wait(700);

        if (cancelled) return;

        // STEP 3 — FETCH GITHUB AND LEETCODE DATA
        updateStep(2, 60);

        // Preserve existing backend API request
        const response = await fetch(
          "http://127.0.0.1:5000/api/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resumeText,
              githubUsername,
              leetcodeUsername,
              targetRole,
            }),
            signal: controller.signal,
          }
        );

        let data;

        try {
          data = await response.json();
        } catch {
          throw new Error(
            "Backend returned an invalid response."
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
            data.error ||
            "Career analysis failed."
          );
        }

        if (cancelled) return;

        // STEP 4 — PREPARING CAREER ANALYSIS
        updateStep(3, 88);
        await wait(700);

        if (cancelled) return;

        // SAVE COMPLETE ANALYSIS DATA
        localStorage.setItem(
          "analysisData",
          JSON.stringify(data)
        );

        localStorage.setItem(
          "targetRole",
          data.target_role || targetRole
        );

        localStorage.setItem(
          "readinessScore",
          String(
            data.readiness_score ??
            data.readiness?.overall_score ??
            0
          )
        );

        localStorage.setItem(
          "readinessLevel",
          data.readiness_level ||
          data.readiness?.level ||
          ""
        );

        localStorage.setItem(
          "requiredSkills",
          JSON.stringify(data.required_skills || [])
        );

        localStorage.setItem(
          "detectedSkills",
          JSON.stringify(data.detected_skills || [])
        );

        localStorage.setItem(
          "missingSkills",
          JSON.stringify(data.missing_skills || [])
        );

        // SAVE RESUME TEXT IF RETURNED
        if (
          data.resumeText ||
          data.resume_text ||
          data.text
        ) {
          localStorage.setItem(
            "resumeText",
            data.resumeText ||
            data.resume_text ||
            data.text
          );
        }

        // SAVE GITHUB DATA
        if (data.github) {
          localStorage.setItem(
            "githubData",
            JSON.stringify(data.github)
          );
        }

        // SAVE LEETCODE DATA
        if (data.leetcode) {
          localStorage.setItem(
            "leetcodeData",
            JSON.stringify(data.leetcode)
          );
        }

        updateStep(4, 100);

        await wait(400);

        if (!cancelled) {
          navigate("/dashboard");
        }

      } catch (err) {
        if (cancelled || err.name === "AbortError") {
          return;
        }

        console.error("Analysis error:", err);

        setError(
          err.message ||
          "Something went wrong during analysis."
        );
      }
    };

    runAnalysis();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [navigate]);

  return (
    <>
      <Navbar />

      <main className="relative isolate flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#fafbff] px-5 py-14 sm:px-6">

        {/* Background glows */}
        <div className="pointer-events-none absolute -top-40 right-[-150px] h-[500px] w-[500px] rounded-full bg-violet-200/40 blur-[110px]" />

        <div className="pointer-events-none absolute -bottom-40 left-[-150px] h-[450px] w-[450px] rounded-full bg-sky-100/70 blur-[100px]" />

        {/* Dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(#c7d2fe 0.8px, transparent 0.8px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative w-full max-w-2xl">

          {/* Top badge */}
          <div className="mb-7 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm">
              <Sparkles size={16} />
              SkillSync AI Career Intelligence
            </div>
          </div>

          {/* Main card */}
          <div className="overflow-hidden rounded-[30px] border border-white bg-white/95 p-7 shadow-[0_25px_80px_-25px_rgba(79,70,229,0.22)] backdrop-blur-xl sm:p-10">

            {/* Header */}
            <div className="text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 animate-pulse rounded-[26px] bg-indigo-200/60 blur-xl" />

                <div className="relative flex h-17 w-17 items-center justify-center rounded-[22px] bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                  <BrainCircuit size={32} />
                </div>
              </div>

              <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {error
                  ? "Analysis Interrupted"
                  : progress === 100
                  ? "Your Insights Are Ready!"
                  : "Analyzing Your Career"}
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
                {error
                  ? "We couldn't complete your career analysis."
                  : "We're bringing together your skills, projects, and coding achievements to build your career insights."}
              </p>
            </div>

            {/* Circular progress */}
            {!error && (
              <div className="mt-9 flex flex-col items-center">
                <div
                  role="progressbar"
                  aria-label="Career analysis progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  className="relative flex h-40 w-40 items-center justify-center rounded-full transition-all duration-700"
                  style={{
                    background: `conic-gradient(#4f46e5 0% ${progress}%, #e9eaf5 ${progress}% 100%)`,
                  }}
                >
                  <div className="flex h-[132px] w-[132px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                      {progress}%
                    </span>

                    <span className="mt-1 text-xs font-medium text-slate-500">
                      {progress === 100
                        ? "Complete"
                        : "Processing"}
                    </span>
                  </div>
                </div>

                <p
                  aria-live="polite"
                  className="mt-5 flex items-center gap-2 text-sm font-medium text-indigo-600"
                >
                  {progress === 100 ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {progress === 100
                    ? "Analysis completed successfully"
                    : steps[Math.min(step, 3)].title}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Progress reflects analysis stages
                </p>
              </div>
            )}

            {/* Analysis steps */}
            {!error && (
              <div className="mt-9 space-y-3">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  const completed = index < step;
                  const active = index === step;

                  return (
                    <div
                      key={item.title}
                      className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                        completed
                          ? "border-emerald-100 bg-emerald-50/50"
                          : active
                          ? "border-indigo-200 bg-indigo-50/70"
                          : "border-slate-100 bg-slate-50/60"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          completed
                            ? "bg-emerald-100 text-emerald-600"
                            : active
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-white text-slate-400"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={22} />
                        ) : (
                          <Icon size={22} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold ${
                            active
                              ? "text-indigo-700"
                              : "text-slate-800"
                          }`}
                        >
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {completed
                            ? "Completed"
                            : active
                            ? item.description
                            : "Waiting"}
                        </p>
                      </div>

                      {active && (
                        <LoaderCircle
                          size={18}
                          className="shrink-0 animate-spin text-indigo-500"
                        />
                      )}

                      {completed && (
                        <CheckCircle2
                          size={18}
                          className="shrink-0 text-emerald-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center"
              >
                <p className="text-sm font-medium leading-6 text-rose-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/upload")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50"
                >
                  <ArrowLeft size={17} />
                  Back to Upload
                </button>
              </div>
            )}

            {/* Footer note */}
            {!error && (
              <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
                <ShieldCheck
                  size={16}
                  className="shrink-0 text-indigo-500"
                />

                Your career analysis is being prepared
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Loading;
