
import {
  Download,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowDownToLine,
  Info,
} from "lucide-react";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeSkills(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;

      if (item && typeof item === "object") {
        return item.name || item.skill || item.title || "";
      }

      return "";
    })
    .filter(Boolean);
}

function DownloadReport({ analysis }) {
  const hasAnalysis =
    analysis &&
    typeof analysis === "object" &&
    Object.keys(analysis).length > 0;

  const downloadReport = () => {
    if (!hasAnalysis) return;

    const role =
      analysis.target_role ||
      analysis.targetRole ||
      "Not selected";

    const resume = analysis.resume || {};
    const github = analysis.github || {};
    const leetcode = analysis.leetcode || {};
    const readinessData = analysis.readiness || {};
    const skillGap = analysis.skill_gap || {};

    const resumeScore = toNumber(
      resume.score ?? resume.resume_score
    );

    const githubAvailable = github.available === true;
    const leetcodeAvailable = leetcode.available === true;

    const githubScore = githubAvailable
      ? toNumber(github.score ?? github.github_score)
      : null;

    const leetcodeScore = leetcodeAvailable
      ? toNumber(leetcode.score ?? leetcode.leetcode_score)
      : null;

    const readiness = toNumber(
      readinessData.overall_score ??
      readinessData.score ??
      analysis.readiness_score
    );

    const confidence = toNumber(
      readinessData.confidence ??
      analysis.confidence
    );

    const detectedSkills = normalizeSkills(
      skillGap.detected_skills ??
      analysis.detected_skills
    );

    const missingSkills = normalizeSkills(
      skillGap.missing_skills ??
      analysis.missing_skills
    );

    const recommendations = Array.isArray(
      analysis.recommendations
    )
      ? analysis.recommendations
      : [];

    const generatedDate = new Date().toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    const skillTags = detectedSkills.length
      ? detectedSkills
          .map(
            (skill) =>
              `<span class="skill-tag">${escapeHtml(skill)}</span>`
          )
          .join("")
      : '<p class="empty-text">No detected skills available.</p>';

    const missingSkillItems = missingSkills.length
      ? missingSkills
          .map(
            (skill) =>
              `<li>${escapeHtml(skill)}</li>`
          )
          .join("")
      : "<li>No current skill gaps reported.</li>";

    const recommendationItems = recommendations.length
      ? recommendations
          .map((item, index) => {
            const title =
              typeof item === "string"
                ? item
                : item?.title ||
                  item?.skill ||
                  "Recommendation";

            const action =
              typeof item === "string"
                ? ""
                : item?.action || item?.reason || "";

            const priority =
              typeof item === "object"
                ? item?.priority || ""
                : "";

            return `
              <div class="recommendation">
                <div class="recommendation-number">
                  ${String(index + 1).padStart(2, "0")}
                </div>
                <div class="recommendation-content">
                  <h3>${escapeHtml(title)}</h3>
                  ${
                    priority
                      ? `<span class="priority">${escapeHtml(priority)}</span>`
                      : ""
                  }
                  ${
                    action
                      ? `<p>${escapeHtml(action)}</p>`
                      : ""
                  }
                </div>
              </div>
            `;
          })
          .join("")
      : '<p class="empty-text">No recommendations available in the current analysis.</p>';

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SkillSync AI Career Readiness Report</title>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: #f8faff;
  color: #1e293b;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}

.report {
  max-width: 940px;
  margin: 40px auto;
  padding: 0 24px 40px;
}

.report-header {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  padding: 40px;
  background: linear-gradient(135deg, #4338ca, #7c3aed);
  color: #ffffff;
}

.brand {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  opacity: 0.9;
}

.report-header h1 {
  margin: 16px 0 10px;
  font-size: 30px;
  line-height: 1.25;
}

.report-header p {
  margin: 0;
  font-size: 14px;
  color: #e0e7ff;
}

.report-meta {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-pill {
  padding: 8px 14px;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 30px;
  background: rgba(255,255,255,0.12);
  font-size: 12px;
}

.section {
  margin-top: 25px;
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e8eaf5;
  border-radius: 20px;
}

.section h2 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 20px;
}

.section-subtitle {
  margin: 0 0 22px;
  color: #64748b;
  font-size: 13px;
}

.readiness {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}

.readiness-number {
  font-size: 48px;
  line-height: 1;
  font-weight: 800;
  color: #4f46e5;
}

.readiness-number span {
  font-size: 20px;
  font-weight: 500;
  color: #94a3b8;
}

.readiness-description {
  font-size: 13px;
  color: #64748b;
}

.progress-track {
  margin-top: 22px;
  height: 12px;
  background: #e0e7ff;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 22px;
}

.score-card {
  padding: 18px;
  border: 1px solid #e8eaf5;
  border-radius: 14px;
  background: #fafbff;
}

.score-label {
  font-size: 12px;
  color: #64748b;
}

.score-value {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 800;
  color: #312e81;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: inline-block;
  padding: 7px 13px;
  border: 1px solid #c7d2fe;
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 12px;
  font-weight: 600;
}

ul {
  margin: 14px 0 0;
  padding-left: 22px;
}

li {
  padding: 5px 0;
  font-size: 14px;
  color: #475569;
}

.recommendation {
  display: flex;
  gap: 15px;
  padding: 18px;
  margin-top: 12px;
  border: 1px solid #e8eaf5;
  border-radius: 14px;
  background: #fafbff;
  break-inside: avoid;
}

.recommendation-number {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 800;
}

.recommendation-content h3 {
  margin: 0;
  color: #1e293b;
  font-size: 15px;
}

.recommendation-content p {
  margin: 8px 0 0;
  font-size: 13px;
  color: #64748b;
}

.priority {
  display: inline-block;
  margin-top: 7px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  font-size: 11px;
  font-weight: 700;
}

.formula {
  padding: 18px;
  border-radius: 14px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}

.empty-text {
  color: #94a3b8;
  font-size: 13px;
}

.footer {
  margin-top: 30px;
  padding: 20px 0;
  border-top: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 650px) {
  .report-header {
    padding: 28px;
  }

  .report-header h1 {
    font-size: 24px;
  }

  .score-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section {
    padding: 22px;
  }
}

@media print {
  body {
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .report {
    margin: 0 auto;
    padding: 0;
  }

  .report-header {
    border-radius: 0;
  }

  .section {
    break-inside: avoid;
    box-shadow: none;
  }

  .score-card,
  .recommendation {
    break-inside: avoid;
  }
}
</style>
</head>

<body>
<div class="report">

  <header class="report-header">
    <div class="brand">✦ SKILLSYNC AI</div>

    <h1>Career Readiness Report</h1>

    <p>
      Your personalized career intelligence and skill gap analysis
    </p>

    <div class="report-meta">
      <span class="meta-pill">
        Target Role: ${escapeHtml(role)}
      </span>

      <span class="meta-pill">
        Generated: ${escapeHtml(generatedDate)}
      </span>
    </div>
  </header>

  <section class="section">
    <h2>Career Readiness Overview</h2>

    <p class="section-subtitle">
      Overall readiness based on your current career analysis.
    </p>

    <div class="readiness">
      <div class="readiness-number">
        ${readiness.toFixed(1)}
        <span>/100</span>
      </div>

      <div class="readiness-description">
        Career Readiness Score
      </div>
    </div>

    <div class="progress-track">
      <div
        class="progress-fill"
        style="width:${Math.min(100, Math.max(0, readiness))}%"
      ></div>
    </div>

    <div class="score-grid">
      <div class="score-card">
        <div class="score-label">Resume Quality</div>
        <div class="score-value">
          ${resumeScore.toFixed(1)}/20
        </div>
      </div>

      <div class="score-card">
        <div class="score-label">GitHub</div>
        <div class="score-value">
          ${
            githubScore === null
              ? "N/A"
              : `${githubScore.toFixed(1)}/20`
          }
        </div>
      </div>

      <div class="score-card">
        <div class="score-label">LeetCode</div>
        <div class="score-value">
          ${
            leetcodeScore === null
              ? "N/A"
              : `${leetcodeScore.toFixed(1)}/20`
          }
        </div>
      </div>

      <div class="score-card">
        <div class="score-label">Confidence</div>
        <div class="score-value">
          ${confidence.toFixed(0)}%
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <h2>Detected Skills</h2>

    <p class="section-subtitle">
      Technical skills identified in your resume.
    </p>

    <div class="skill-tags">
      ${skillTags}
    </div>
  </section>

  <section class="section">
    <h2>Skill Gaps</h2>

    <p class="section-subtitle">
      Skills identified as missing for your selected target role.
    </p>

    <ul>
      ${missingSkillItems}
    </ul>
  </section>

  <section class="section">
    <h2>Personalized Recommendations</h2>

    <p class="section-subtitle">
      Suggested actions based on your current career profile.
    </p>

    ${recommendationItems}
  </section>

  <section class="section">
    <h2>Readiness Scoring Formula</h2>

    <p class="section-subtitle">
      Weighted components used in the career readiness assessment.
    </p>

    <div class="formula">
      Role Skills 40% + GitHub 20% +
      LeetCode 20% + Resume Quality 20%
    </div>
  </section>

  <footer class="footer">
    Generated by SkillSync AI
    <br>
    AI-Powered Career Readiness and Skill Gap Analysis Platform
    <br>
    This assessment provides guidance, not a guarantee of employment.
  </footer>

</div>
</body>
</html>`;

    const blob = new Blob([html], {
      type: "text/html;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "SkillSync_AI_Career_Report.html";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <section className="mt-10">
      <div className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)]">

        {/* DECORATIVE GLOW */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT CONTENT */}
          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
              <FileText size={23} />
            </div>

            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                <Sparkles size={13} />
                Career Intelligence Report
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Download Report
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Download a professionally formatted,
                self-contained HTML report of your
                current career analysis.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={14} />
                  Offline Viewable
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                  <ShieldCheck size={14} />
                  Career Analysis
                </span>
              </div>
            </div>
          </div>

          {/* DOWNLOAD BUTTON */}
          <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">

            <button
              type="button"
              onClick={downloadReport}
              disabled={!hasAnalysis}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/50 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Download size={18} />
              Download Report
              <ArrowDownToLine size={16} />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Info size={13} />
              HTML format • Open in any browser
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DownloadReport;
