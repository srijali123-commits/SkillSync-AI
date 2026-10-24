
import {
  CheckCircle2,
  ClipboardList,
  AlertTriangle,
  Sparkles,
  Target,
  Loader2,
  ArrowUpRight,
  Info,
} from "lucide-react";

function SkillCard({
  title,
  skills = [],
  type,
  loading = false,
  targetRole = "",
}) {
  const config = {
    detected: {
      icon: CheckCircle2,
      label: "Skills Identified",
      subtitle: "Technical skills found in your resume",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      tagBg: "bg-emerald-50",
      tagText: "text-emerald-700",
      tagBorder: "border-emerald-100",
      accent: "from-emerald-400 to-teal-500",
      countBg: "bg-emerald-50",
      countText: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    required: {
      icon: ClipboardList,
      label: "Role Requirements",
      subtitle: "Skills expected for your target role",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      tagBg: "bg-indigo-50",
      tagText: "text-indigo-700",
      tagBorder: "border-indigo-100",
      accent: "from-indigo-500 to-violet-500",
      countBg: "bg-indigo-50",
      countText: "text-indigo-700",
      dot: "bg-indigo-500",
    },
    missing: {
      icon: AlertTriangle,
      label: "Growth Opportunities",
      subtitle: "Skills to focus on improving",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      tagBg: "bg-amber-50",
      tagText: "text-amber-700",
      tagBorder: "border-amber-100",
      accent: "from-amber-400 to-orange-500",
      countBg: "bg-amber-50",
      countText: "text-amber-700",
      dot: "bg-amber-500",
    },
  };

  const current = config[type] || config.required;
  const Icon = current.icon;

  const skillList = Array.isArray(skills)
    ? skills.filter(
        (skill) =>
          typeof skill === "string" &&
          skill.trim().length > 0
      )
    : [];

  const skillCount = skillList.length;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-indigo-100 bg-white shadow-[0_10px_35px_-20px_rgba(79,70,229,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_-20px_rgba(79,70,229,0.22)]">

      {/* TOP ACCENT */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${current.accent}`}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">

          <div className="flex items-start gap-3">

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${current.iconBg} ${current.iconColor}`}
            >
              <Icon size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {current.label}
              </p>

              <h3 className="mt-1 text-base font-bold leading-6 text-slate-900">
                {title}
              </h3>
            </div>
          </div>

          <ArrowUpRight
            size={17}
            className="shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500"
          />
        </div>

        {/* DESCRIPTION */}
        <p className="mt-4 text-xs leading-5 text-slate-500">
          {current.subtitle}
        </p>

        {/* SKILL COUNT */}
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-[#fafbff] px-4 py-3">

          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${current.dot}`}
            />

            <span className="text-xs font-semibold text-slate-500">
              {loading ? "Analyzing" : "Total Skills"}
            </span>
          </div>

          {loading ? (
            <Loader2
              size={18}
              className="animate-spin text-indigo-500"
            />
          ) : (
            <span
              className={`rounded-lg px-3 py-1 text-sm font-extrabold ${current.countBg} ${current.countText}`}
            >
              {skillCount}
            </span>
          )}
        </div>

        {/* SKILLS CONTENT */}
        <div className="mt-5 flex-1">

          {loading ? (
            <div className="space-y-3">

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2
                  size={16}
                  className="animate-spin text-indigo-500"
                />

                Analyzing skills...
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-8 w-32 animate-pulse rounded-full bg-slate-100" />
                <div className="h-8 w-20 animate-pulse rounded-full bg-slate-100" />
              </div>
            </div>
          ) : skillCount > 0 ? (
            <div className="flex flex-wrap content-start gap-2">

              {skillList.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold leading-4 transition-all duration-200 hover:shadow-sm ${current.tagBg} ${current.tagText} ${current.tagBorder}`}
                >
                  {type === "detected" ? (
                    <CheckCircle2
                      size={13}
                      className="shrink-0"
                    />
                  ) : type === "missing" ? (
                    <Target
                      size={13}
                      className="shrink-0"
                    />
                  ) : (
                    <Sparkles
                      size={13}
                      className="shrink-0"
                    />
                  )}

                  <span className="break-words">
                    {skill}
                  </span>
                </span>
              ))}
            </div>
          ) : type === "missing" && targetRole ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={20}
                  className="shrink-0 text-emerald-600"
                />

                <p className="text-sm font-bold text-emerald-800">
                  All Required Skills Covered!
                </p>
              </div>

              <p className="mt-3 text-xs leading-6 text-emerald-700">
                Your resume demonstrates all the required
                skills for{" "}
                <span className="font-bold">
                  {targetRole}
                </span>
                . Keep strengthening them through projects,
                certifications, and practical experience.
              </p>
            </div>
          ) : type === "detected" ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">

              <div className="flex items-start gap-2">
                <Info
                  size={18}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    No Skills Detected
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    No technical skills were identified
                    in your uploaded resume. Try using
                    clear skill names and a dedicated
                    Technical Skills section.
                  </p>
                </div>
              </div>
            </div>
          ) : type === "required" && !targetRole ? (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">

              <div className="flex items-start gap-2">
                <Target
                  size={18}
                  className="mt-0.5 shrink-0 text-indigo-500"
                />

                <div>
                  <p className="text-sm font-semibold text-indigo-800">
                    Select a Target Role
                  </p>

                  <p className="mt-2 text-xs leading-6 text-indigo-600">
                    Choose your preferred career role
                    to view the skills expected for
                    that position.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">

              <div className="flex items-start gap-2">
                <Info
                  size={18}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <p className="text-xs leading-6 text-slate-500">
                  {type === "missing"
                    ? "Select a target role to view missing skills."
                    : "No skill information is currently available for this role."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-6 border-t border-slate-100 pt-4">

          <div className="flex items-center justify-between gap-2">

            <span className="text-[11px] font-medium text-slate-400">
              {type === "detected"
                ? "Resume skill extraction"
                : type === "required"
                ? "Target-role requirements"
                : "Role-specific skill gap"}
            </span>

            <span
              className={`text-[11px] font-bold ${current.tagText}`}
            >
              {loading
                ? "Processing"
                : `${skillCount} ${skillCount === 1 ? "Skill" : "Skills"}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillCard;
