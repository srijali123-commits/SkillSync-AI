import { useEffect, useState } from "react";
import {
  FileText, AlertCircle, RefreshCw, Sparkles, Target, Brain,
  CheckCircle2, ArrowRight, ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import TargetRoleDropdown from "../components/dashboard/TargetRoleDropdown";
import ScoreCard from "../components/dashboard/ScoreCard";
import SkillCard from "../components/dashboard/SkillCard";
import PerformanceOverview from "../components/dashboard/PerformanceOverview";
import CareerProgress from "../components/dashboard/CareerProgress";
import ProfileImprovement from "../components/dashboard/ProfileImprovement";
import CareerReadinessMatrix from "../components/dashboard/CareerReadinessMatrix";
import GitHubStats from "../components/dashboard/GitHubStats";
import LeetCodeStats from "../components/dashboard/LeetCodeStats";
import ResumeAnalysis from "../components/dashboard/ResumeAnalysis";
import PersonalizedRecommendations from "../components/dashboard/PersonalizedRecommendations";
import DownloadReport from "../components/dashboard/DownloadReport";
import WhatIfSimulator from "../components/dashboard/WhatIfSimulator";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://skillsync-ai-87g8.onrender.com";

const ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "AI/ML Engineer", "Data Scientist",
  "DevOps Engineer", "Android Developer",
];

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [targetRole, setTargetRole] = useState(
    localStorage.getItem("targetRole") || ""
  );
  const [changingRole, setChangingRole] = useState(false);
  const [refreshingProfiles, setRefreshingProfiles] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStoredAnalysis();
    const handleAnalysisUpdate = () => loadStoredAnalysis();
    window.addEventListener("analysisUpdated", handleAnalysisUpdate);
    return () => window.removeEventListener("analysisUpdated", handleAnalysisUpdate);
  }, []);

  function loadStoredAnalysis() {
    const raw = localStorage.getItem("analysisData");
    if (!raw) {
      setAnalysis(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setAnalysis(parsed);
      const storedRole =
        parsed?.target_role || parsed?.targetRole ||
        localStorage.getItem("targetRole") || "";
      if (storedRole && ROLES.includes(storedRole)) {
        setTargetRole(storedRole);
        localStorage.setItem("targetRole", storedRole);
      }
    } catch (err) {
      console.error("Invalid analysisData:", err);
      setAnalysis(null);
      setError("Saved analysis data is invalid. Please analyze your resume again.");
    }
  }

  async function handleRoleChange(newRole) {
    if (!newRole || newRole === targetRole || changingRole || refreshingProfiles) return;

    const resumeText = localStorage.getItem("resumeText") || "";
    if (!resumeText.trim()) {
      setError("Resume text is missing. Please upload your resume again.");
      return;
    }

    const oldAnalysis = analysis || {};
    const oldReadiness = oldAnalysis?.readiness || {};
    const oldResume = oldAnalysis?.resume || {};
    const oldGithub = oldAnalysis?.github || {};
    const oldLeetcode = oldAnalysis?.leetcode || {};
    const oldComponents = Array.isArray(oldReadiness.components) ? oldReadiness.components : [];
    const oldRoleMatching = oldAnalysis?.role_matching || {};

    const oldDetectedSkills = safeArray(
      oldAnalysis?.skill_gap?.detected_skills,
      oldRoleMatching.detected_skills,
      oldAnalysis?.detected_skills,
      safeArrayFromStorage("detectedSkills")
    );
    const oldRequiredSkills = safeArray(
      oldAnalysis?.skill_gap?.required_skills,
      oldRoleMatching.required_skills,
      oldAnalysis?.required_skills,
      safeArrayFromStorage("requiredSkills")
    );
    const oldMissingSkills = safeArray(
      oldAnalysis?.skill_gap?.missing_skills,
      oldRoleMatching.missing_skills,
      oldAnalysis?.missing_skills,
      safeArrayFromStorage("missingSkills")
    );

    const oldGithubScore = oldGithub.available === true ? safeNumber(oldGithub.score) : 0;
    const oldLeetcodeScore = oldLeetcode.available === true ? safeNumber(oldLeetcode.score) : 0;
    const oldResumeScore = safeNumber(oldResume.score);

    setChangingRole(true);
    setError("");
    try {
      const skillResponse = await fetch(`${API_URL}/api/skill-gap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: newRole, target_role: newRole,
          resumeText, resume_text: resumeText,
        }),
      });
      const skillData = await skillResponse.json();
      if (!skillResponse.ok) {
        throw new Error(skillData?.error || "Unable to calculate the skill gap for this role.");
      }

      const requiredSkills = safeArray(
        skillData?.required_skills, skillData?.requiredSkills, oldRequiredSkills
      );
      const detectedSkills = safeArray(
        skillData?.detected_skills, skillData?.detectedSkills, oldDetectedSkills
      );
      const apiMissingSkills = safeArray(skillData?.missing_skills, skillData?.missingSkills);
      const detectedSkillNames = new Set(
        detectedSkills.map(normalizeSkillName).filter(Boolean)
      );
      const missingSkills = apiMissingSkills.length > 0
        ? apiMissingSkills
        : requiredSkills.filter((skill) => {
            const name = normalizeSkillName(skill);
            return name && !detectedSkillNames.has(name);
          });
      const calculatedMatch = requiredSkills.length > 0
        ? ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
        : 0;
      const roleMatchPercentage = clamp(safeNumber(
        skillData?.match_percentage, skillData?.matchPercentage, calculatedMatch
      ));

      const readinessResponse = await fetch(`${API_URL}/api/readiness-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: newRole, target_role: newRole,
          roleMatchPercentage, role_match_percentage: roleMatchPercentage,
          detectedSkills, detected_skills: detectedSkills,
          requiredSkills, required_skills: requiredSkills,
          missingSkills, missing_skills: missingSkills,
          githubScore: oldGithubScore, github_score: oldGithubScore,
          githubAvailable: oldGithub?.available === true,
          github_available: oldGithub?.available === true,
          leetcodeScore: oldLeetcodeScore, leetcode_score: oldLeetcodeScore,
          leetcodeAvailable: oldLeetcode?.available === true,
          leetcode_available: oldLeetcode?.available === true,
          resumeScore: oldResumeScore, resume_score: oldResumeScore,
        }),
      });
      const readinessData = await readinessResponse.json();
      if (!readinessResponse.ok) {
        throw new Error(readinessData?.error || "Unable to recalculate the readiness score.");
      }

      const roleComponentFromBackend = Array.isArray(readinessData?.components)
        ? readinessData.components.find((item) => {
            const text = `${item?.name || ""} ${item?.label || ""}`.toLowerCase();
            return text.includes("role-specific");
          })
        : null;
      const newRoleComponent = {
        name: "Role-Specific Skills", label: "Role-Specific Skills",
        score: Number(roleComponentFromBackend?.score ?? (roleMatchPercentage * 0.4)),
        max: 40, max_score: 40,
      };
      const preservedComponents = oldComponents.map((component) => {
        const text = `${component?.name || ""} ${component?.label || ""}`.toLowerCase();
        return text.includes("role-specific") ? newRoleComponent : component;
      });
      if (!preservedComponents.some((component) =>
        `${component?.name || ""} ${component?.label || ""}`.toLowerCase().includes("role-specific")
      )) {
        preservedComponents.unshift(newRoleComponent);
      }

      const updatedReadiness = {
        ...oldReadiness, ...readinessData,
        overall_score: safeNumber(readinessData?.overall_score, readinessData?.score),
        score: safeNumber(readinessData?.overall_score, readinessData?.score),
        components: preservedComponents,
      };
      const updatedAnalysis = {
        ...oldAnalysis,
        target_role: newRole, targetRole: newRole,
        resume: oldResume, github: oldGithub, leetcode: oldLeetcode,
        role_matching: {
          ...oldRoleMatching, role: newRole,
          required_skills: requiredSkills, detected_skills: detectedSkills,
          missing_skills: missingSkills,
          matched_count: Math.max(0, requiredSkills.length - missingSkills.length),
          required_count: requiredSkills.length,
          match_percentage: roleMatchPercentage,
        },
        skill_gap: {
          ...(oldAnalysis?.skill_gap || {}), role: newRole,
          required_skills: requiredSkills, detected_skills: detectedSkills,
          missing_skills: missingSkills, match_percentage: roleMatchPercentage,
          gaps: skillData?.gaps || oldAnalysis?.skill_gap?.gaps || [],
        },
        required_skills: requiredSkills,
        detected_skills: detectedSkills,
        missing_skills: missingSkills,
        readiness: updatedReadiness,
        readiness_score: updatedReadiness.overall_score,
        readiness_level: updatedReadiness.level || oldReadiness.level || "Not Available",
        confidence: safeNumber(updatedReadiness.confidence, oldReadiness.confidence),
      };

      const previousScore = safeNumber(
        oldReadiness.overall_score, oldReadiness.score,
        localStorage.getItem("readinessScore")
      );
      if (previousScore > 0) {
        localStorage.setItem("previousReadinessScore", String(previousScore));
      }
      if (oldDetectedSkills.length > 0) {
        localStorage.setItem("previousDetectedSkills", JSON.stringify(oldDetectedSkills));
      }
      setTargetRole(newRole);
      setAnalysis(updatedAnalysis);
      localStorage.setItem("targetRole", newRole);
      localStorage.setItem("analysisData", JSON.stringify(updatedAnalysis));
      persistAnalysisValues(updatedAnalysis);
      window.dispatchEvent(new Event("analysisUpdated"));
    } catch (err) {
      console.error("Role change error:", err);
      setError(err?.message || "Could not recalculate the analysis for this role.");
    } finally {
      setChangingRole(false);
    }
  }

  async function refreshProfiles() {
    if (!analysis || refreshingProfiles || changingRole) return;
    const currentGithub = analysis.github || {};
    const currentLeetcode = analysis.leetcode || {};
    const githubUsername = currentGithub.username || analysis.github_username || "";
    const leetcodeUsername = currentLeetcode.username || analysis.leetcode_username || "";
    if (!githubUsername && !leetcodeUsername) {
      setError("No GitHub or LeetCode username is available to refresh.");
      return;
    }
    setRefreshingProfiles(true);
    setError("");
    try {
      const tasks = [];
      for (const [platform, username] of [
        ["github", githubUsername], ["leetcode", leetcodeUsername],
      ]) {
        if (!username) continue;
        tasks.push((async () => {
          const response = await fetch(
            `${API_URL}/api/debug/${platform}/${encodeURIComponent(username)}`
          );
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || `${platform} refresh failed`);
          return { platform, data };
        })());
      }
      const results = await Promise.allSettled(tasks);
      let github = currentGithub;
      let leetcode = currentLeetcode;
      const failures = [];
      for (const result of results) {
        if (result.status === "rejected") {
          failures.push(result.reason?.message || "Profile refresh failed");
          continue;
        }
        const { platform, data } = result.value;
        const previous = platform === "github" ? github : leetcode;
        const updated = data.available === true
          ? data
          : previous.available === true
            ? { ...previous, stale: true, warning: data.error || data.message || "API unavailable" }
            : data;
        if (platform === "github") github = updated;
        else leetcode = updated;
        if (data.available !== true) {
          failures.push(data.error || data.message || `${platform} unavailable`);
        }
      }
      const matchPercentage = safeNumber(
        analysis.role_matching?.match_percentage,
        analysis.skill_gap?.match_percentage
      );
      const response = await fetch(`${API_URL}/api/readiness-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          roleMatchPercentage: matchPercentage,
          role_match_percentage: matchPercentage,
          resumeScore: safeNumber(analysis.resume?.score),
          resume_score: safeNumber(analysis.resume?.score),
          githubScore: github.available === true ? safeNumber(github.score) : 0,
          github_score: github.available === true ? safeNumber(github.score) : 0,
          githubAvailable: github.available === true,
          github_available: github.available === true,
          leetcodeScore: leetcode.available === true ? safeNumber(leetcode.score) : 0,
          leetcode_score: leetcode.available === true ? safeNumber(leetcode.score) : 0,
          leetcodeAvailable: leetcode.available === true,
          leetcode_available: leetcode.available === true,
        }),
      });
      const readinessData = await response.json();
      if (!response.ok) throw new Error(readinessData.error || "Readiness refresh failed");
      const updatedAnalysis = {
        ...analysis, github, leetcode,
        readiness: { ...(analysis.readiness || {}), ...readinessData },
        readiness_score: readinessData.overall_score,
        readiness_level: readinessData.level,
        confidence: readinessData.confidence,
        data_coverage: readinessData.data_coverage,
      };
      localStorage.setItem("analysisData", JSON.stringify(updatedAnalysis));
      persistAnalysisValues(updatedAnalysis);
      setAnalysis(updatedAnalysis);
      window.dispatchEvent(new Event("analysisUpdated"));
      if (failures.length) setError(failures.join(" "));
    } catch (err) {
      console.error("Profile refresh error:", err);
      setError(err.message || "Unable to refresh profiles.");
    } finally {
      setRefreshingProfiles(false);
    }
  }

  if (!analysis) {
    return (
      <>
        <Navbar />
        <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#fafbff] px-6 py-16">
          <div className="pointer-events-none absolute -top-28 right-0 h-80 w-80 rounded-full bg-violet-100 blur-3xl" />
          <div className="relative w-full max-w-md rounded-[30px] border border-indigo-100 bg-white p-9 text-center shadow-[0_20px_65px_-25px_rgba(79,70,229,0.2)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
              <FileText size={29} />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">No analysis data found</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Please upload your resume and run the career analysis first.
            </p>
            {error && (
              <p role="alert" className="mt-5 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
            )}
            <Link to="/upload" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5">
              Analyze My Resume <ArrowRight size={18} />
            </Link>
          </div>
        </main>
      </>
    );
  }

  const resume = analysis?.resume || {};
  const github = analysis?.github || {};
  const leetcodeSource =
    analysis?.leetcode ?? analysis?.leetcode_stats ?? analysis?.leetcodeStats ??
    analysis?.coding_profiles?.leetcode ?? analysis?.codingProfiles?.leetcode ?? {};
  const leetcode = {
    ...leetcodeSource,
    username: leetcodeSource.username ?? leetcodeSource.user_name ?? leetcodeSource.handle ?? "",
    total_solved: leetcodeSource.total_solved ?? leetcodeSource.totalSolved ?? leetcodeSource.solved ?? 0,
    easy: leetcodeSource.easy ?? leetcodeSource.easy_solved ?? leetcodeSource.easySolved ?? 0,
    medium: leetcodeSource.medium ?? leetcodeSource.medium_solved ?? leetcodeSource.mediumSolved ?? 0,
    hard: leetcodeSource.hard ?? leetcodeSource.hard_solved ?? leetcodeSource.hardSolved ?? 0,
    ranking: leetcodeSource.ranking ?? leetcodeSource.rank ?? null,
    score: leetcodeSource.score ?? leetcodeSource.leetcode_score ?? 0,
    score_breakdown: leetcodeSource.score_breakdown ?? leetcodeSource.scoreBreakdown ?? [],
    available: leetcodeSource.available === true,
  };
  const readiness = analysis?.readiness || {};
  const roleMatching = analysis?.role_matching || {};
  const skillGapData = analysis?.skill_gap || {};
  const detectedSkills = safeArray(
    skillGapData.detected_skills, roleMatching.detected_skills,
    analysis.detected_skills, safeArrayFromStorage("detectedSkills")
  );
  const requiredSkills = safeArray(
    skillGapData.required_skills, roleMatching.required_skills,
    analysis.required_skills, safeArrayFromStorage("requiredSkills")
  );
  const storedMissingSkills = safeArray(
    skillGapData.missing_skills, roleMatching.missing_skills,
    analysis.missing_skills, safeArrayFromStorage("missingSkills")
  );
  const detectedSkillNames = new Set(detectedSkills.map(normalizeSkillName).filter(Boolean));
  const calculatedMissingSkills = requiredSkills.filter((skill) => {
    const name = normalizeSkillName(skill);
    return name && !detectedSkillNames.has(name);
  });
  const skillGap = {
    detected: detectedSkills,
    required: requiredSkills,
    missing: requiredSkills.length > 0 ? calculatedMissingSkills : storedMissingSkills,
  };
  const readinessScore = safeNumber(
    readiness.overall_score, readiness.score, analysis.readiness_score,
    localStorage.getItem("readinessScore")
  );
  const readinessLevel =
    readiness.level || analysis.readiness_level ||
    localStorage.getItem("readinessLevel") || "Not Available";
  const confidence = safeNumber(readiness.confidence, analysis.confidence);
  const githubRawScore = github.available === true ? safeNumber(github.score) : 0;
  const leetcodeRawScore = leetcode.available === true ? safeNumber(leetcode.score) : 0;
  const resumeScore = safeNumber(resume.score);
  const githubPercent = github.available ? clamp((githubRawScore / 20) * 100) : 0;
  const leetcodePercent = leetcode.available ? clamp((leetcodeRawScore / 20) * 100) : 0;
  const resumePercent = clamp((resumeScore / 20) * 100);
  const components = Array.isArray(readiness.components) ? readiness.components : [];
  const roleComponent = findComponent(components, "Role-Specific Skills");
  const githubComponent = findComponent(components, "GitHub");
  const leetcodeComponent = findComponent(components, "LeetCode");
  const resumeComponent = findComponent(components, "Resume");

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-[#fafbff] px-4 py-8 sm:px-6 sm:py-10">
        <div className="pointer-events-none absolute -right-48 top-24 h-[550px] w-[550px] rounded-full bg-violet-100/70 blur-[110px]" />
        <div className="pointer-events-none absolute -left-48 top-[900px] h-[450px] w-[450px] rounded-full bg-sky-100/60 blur-[110px]" />
        <div className="relative mx-auto w-full max-w-7xl">
          {/* PREMIUM DASHBOARD HERO */}
          <section className="relative isolate overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-br from-white via-[#f8f9ff] to-violet-50 p-7 shadow-[0_15px_55px_-25px_rgba(79,70,229,0.18)] sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-sky-100/70 blur-3xl" />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={15} /> AI Analysis Complete
                </div>
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[42px]">
                  Your Career{" "}
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Intelligence</span>
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Explore your career readiness, discover your strengths, identify skill gaps,
                  and take the next step toward your professional goals.
                </p>
                <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-100 bg-white px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Target size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Current Target Role</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-900">{targetRole || "Not selected"}</p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-auto lg:min-w-[260px]">
                <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={17} className="text-indigo-600" />
                    <p className="text-sm font-semibold text-slate-800">Explore a Career Role</p>
                  </div>
                  <p className="mb-4 text-xs leading-5 text-slate-500">
                    Select a role to update your career readiness and skill gap analysis.
                  </p>
                  <TargetRoleDropdown value={targetRole} onRoleChange={handleRoleChange} />
                </div>
              </div>
            </div>
          </section>

          {changingRole && (
            <div role="status" className="mt-5 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-sm text-indigo-700 shadow-sm">
              <RefreshCw size={18} className="animate-spin" />
              <span>Recalculating your profile for the selected role...</span>
            </div>
          )}
          {error && !changingRole && (
            <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={refreshProfiles}
              disabled={refreshingProfiles || changingRole}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <RefreshCw size={16} className={refreshingProfiles ? "animate-spin" : ""} />
              {refreshingProfiles ? "Refreshing Profiles..." : "Refresh GitHub & LeetCode"}
            </button>
          </div>

          {/* READINESS + CAREER DNA */}
          <section className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white p-7 shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)] sm:p-8">
              <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-indigo-50 blur-3xl" />
              <div className="relative flex flex-col items-center gap-8 sm:flex-row">
                <div className="relative h-44 w-44 shrink-0">
                  <div className="absolute inset-0 rounded-full bg-indigo-50" />
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                      strokeLinecap="round" strokeDasharray="263.9"
                      strokeDashoffset={263.9 - (263.9 * clamp(readinessScore)) / 100}
                      className="text-indigo-600 transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900">{Number(readinessScore).toFixed(1)}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <Sparkles size={17} className="text-indigo-600" />
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Career Readiness</p>
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">{readinessLevel}</h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                    Your readiness score reflects how closely your current profile aligns
                    with your selected career direction.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                    <InfoPill label="Target Role" value={targetRole || "—"} />
                    <InfoPill label="Confidence" value={`${Number(confidence).toFixed(0)}%`} />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-indigo-100 bg-white p-7 shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Profile Snapshot</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">Career DNA</h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <Brain size={21} className="text-indigo-600" />
                </div>
              </div>
              <div className="mt-7 space-y-5">
                <ProfileBar label="Role Match" value={safeNumber(roleMatching.match_percentage)} />
                <ProfileBar label="Resume Quality" value={resumePercent} />
                <ProfileBar label="GitHub" value={githubPercent} />
                <ProfileBar label="LeetCode" value={leetcodePercent} />
              </div>
            </div>
          </section>

          {/* CORE SCORES */}
          <section className="mt-10">
            <SectionHeading eyebrow="Performance" title="Your Core Scores" description="A quick view of the strongest signals in your current profile." />
            <div className="grid gap-5 md:grid-cols-3">
              <PremiumScoreWrapper>
                <ScoreCard
                  title="Career Readiness" score={readinessScore}
                  description={targetRole ? `Overall readiness for ${targetRole}.` : "Select a target role to calculate your readiness."}
                  breakdown={components}
                />
              </PremiumScoreWrapper>
              <PremiumScoreWrapper>
                <ScoreCard
                  title="GitHub Score" score={githubRawScore} maxScore={20}
                  available={github.available === true}
                  description={github.available
                    ? "Based on repositories, profile quality, technology diversity and development activity."
                    : github.error || github.message || "GitHub data is not available."}
                  breakdown={safeArrayObjects(github.score_breakdown)}
                />
              </PremiumScoreWrapper>
              <PremiumScoreWrapper>
                <ScoreCard
                  title="LeetCode Score" score={leetcodeRawScore} maxScore={20}
                  available={leetcode.available === true}
                  description={leetcode.available
                    ? "Based on solved problems, difficulty depth and problem-solving performance."
                    : leetcode.error || leetcode.message || "LeetCode data is not available."}
                  breakdown={safeArrayObjects(leetcode.score_breakdown)}
                />
              </PremiumScoreWrapper>
            </div>
          </section>

          {/* READINESS BREAKDOWN */}
          <section className="mt-10">
            <SectionHeading eyebrow="Readiness Engine" title="Career Readiness Breakdown" description="See how your different profile signals contribute to your readiness." />
            <div className="overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-sm">
              <CareerReadinessMatrix
                readiness={readiness}
                skillScore={safeNumber(roleComponent?.score)}
                githubScore={safeNumber(githubComponent?.score)}
                leetcodeScore={safeNumber(leetcodeComponent?.score)}
                resumeScore={safeNumber(resumeComponent?.score)}
                totalScore={readinessScore}
                confidence={confidence}
              />
            </div>
          </section>

          <section className="mt-10">
            <PerformanceOverview
              readinessScore={readinessScore} readinessLevel={readinessLevel}
              confidence={confidence} githubScore={githubRawScore}
              leetcodeScore={leetcodeRawScore} resumeScore={resumeScore}
              skillScore={safeNumber(roleComponent?.score)} analysis={analysis}
            />
          </section>

          <section className="mt-10">
            <SectionHeading eyebrow="Resume Intelligence" title="Resume Analysis" description="Understand how effectively your resume communicates your skills and experience." />
            <div className="overflow-hidden rounded-[28px]">
              <ResumeAnalysis data={resume} targetRole={targetRole} />
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading eyebrow="Developer Activity" title="Coding & Development Profile" description="Your GitHub development activity and LeetCode problem-solving profile." />
            <div className="grid items-start gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-[28px]"><GitHubStats github={github} targetRole={targetRole} /></div>
              <div className="overflow-hidden rounded-[28px]"><LeetCodeStats leetcode={leetcode} /></div>
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading eyebrow="Skill Intelligence" title="Skill Gap Analysis" description={`Compare your current capabilities with ${targetRole || "your target role"}.`} />
            <div className="grid gap-5 md:grid-cols-3">
              <SkillCard title="Detected Skills" skills={skillGap.detected} type="detected" />
              <SkillCard title="Required Skills" skills={skillGap.required} type="required" />
              <SkillCard title="Priority Gaps" skills={skillGap.missing} type="missing" targetRole={targetRole} loading={changingRole} />
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading eyebrow="Growth" title="Career Progress" description="Track how your career readiness develops over time." />
            <CareerProgress score={readinessScore} />
          </section>

          <section className="mt-10">
            <ProfileImprovement analysis={analysis} missingSkills={skillGap.missing} />
          </section>

          <section className="mt-10">
            <SectionHeading eyebrow="AI Career Coach" title="Personalized Recommendations" description="Actionable suggestions based on your resume, skills and selected target role." />
            <PersonalizedRecommendations analysis={analysis} />
          </section>

          {/* WHAT-IF SIMULATOR */}
          <section className="mt-10">
            <div className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 shadow-[0_12px_45px_-20px_rgba(79,70,229,0.15)]">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
              <div className="relative">
                <div className="px-7 pb-3 pt-8 sm:px-9">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
                    <Sparkles size={13} /> AI SIMULATION
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">What-If Career Simulator</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                    Explore hypothetical improvements and see their projected effect on your
                    career readiness without modifying your real profile scores.
                  </p>
                </div>
                <WhatIfSimulator />
              </div>
            </div>
          </section>

          {/* DOWNLOAD REPORT — LAST SECTION */}
          <section className="mt-10 pb-12">
            <SectionHeading eyebrow="Career Report" title="Download Your Analysis" description="Save your complete SkillSync AI career analysis for future reference." />
            <div className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_12px_45px_-20px_rgba(79,70,229,0.15)]">
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-50 blur-3xl" />
              <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                    <FileText size={22} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Career Analysis Report</h3>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                      Download your complete SkillSync AI report including career readiness,
                      resume analysis, GitHub, LeetCode, skill gaps, recommendations and What-If insights.
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <ShieldCheck size={15} className="text-indigo-500" /> Your personalized career report
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <DownloadReport analysis={analysis} targetRole={targetRole} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-7">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1.5">
        <Sparkles size={13} className="text-indigo-600" />
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-600">{eyebrow}</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>}
    </div>
  );
}

function PremiumScoreWrapper({ children }) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-indigo-100/70 bg-white shadow-[0_8px_35px_-18px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_55px_-20px_rgba(79,70,229,0.22)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </div>
  );
}

function ProfileBar({ label, value, suffix = "%" }) {
  const safeValue = clamp(safeNumber(value));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className="text-sm font-bold text-slate-900">{Number(safeValue).toFixed(0)}{suffix}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-xl border border-indigo-100/70 bg-[#fafbff] px-3 py-2">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function persistAnalysisValues(data) {
  const readiness = data?.readiness || {};
  const skillGap = data?.skill_gap || {};
  localStorage.setItem("readinessScore", String(data?.readiness_score ?? readiness.overall_score ?? 0));
  localStorage.setItem("readinessLevel", readiness.level || data?.readiness_level || "");
  localStorage.setItem("requiredSkills", JSON.stringify(skillGap.required_skills || data?.required_skills || []));
  localStorage.setItem("detectedSkills", JSON.stringify(skillGap.detected_skills || data?.detected_skills || []));
  localStorage.setItem("missingSkills", JSON.stringify(skillGap.missing_skills || data?.missing_skills || []));
}

function safeArray(...values) {
  for (const value of values) {
    if (Array.isArray(value) && value.length > 0) return value;
  }
  return [];
}

function normalizeSkillName(skill) {
  if (typeof skill === "string") return skill.trim().toLowerCase();
  if (skill && typeof skill === "object") {
    const name = skill.name || skill.skill || skill.title || skill.label;
    return typeof name === "string" ? name.trim().toLowerCase() : "";
  }
  return "";
}

function safeArrayObjects(value) {
  return Array.isArray(value) ? value : [];
}

function safeArrayFromStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function safeNumber(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return 0;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function findComponent(components, keyword) {
  return components.find((item) =>
    `${item?.name || ""} ${item?.label || ""}`.toLowerCase().includes(keyword.toLowerCase())
  );
}

export default Dashboard;
