
import {
  Lightbulb,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

function ProfileImprovement({ missingSkills = [] }) {
  const validSkills = Array.isArray(missingSkills)
    ? missingSkills.filter(
        (skill) =>
          typeof skill === "string" &&
          skill.trim().length > 0
      )
    : [];

  const defaultRecommendations = [
    "Build practical projects",
    "Improve core programming skills",
    "Strengthen technical fundamentals",
  ];

  const skillRecommendations = validSkills
    .slice(0, 3)
    .map((skill) => `Improve your ${skill} skills`);

  // Always display three recommendations.
  // Fill remaining positions with general improvement advice.
  const recommendations = [
    ...skillRecommendations,
    ...defaultRecommendations,
  ].slice(0, 3);

  return (
    <section className="mt-10">
      <div className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white p-6 shadow-[0_12px_45px_-20px_rgba(79,70,229,0.16)] sm:p-8">

        {/* DECORATIVE BACKGROUND */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-100/40 blur-3xl" />

        {/* HEADER */}
        <div className="relative flex items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60">
            <Lightbulb size={23} />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600">
              <Sparkles size={12} />
              Career Growth
            </div>

            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Profile Improvement
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Focus on these areas to improve your profile.
            </p>
          </div>
        </div>

        {/* RECOMMENDATION CARDS */}
        <div className="relative mt-7 grid gap-4 md:grid-cols-3">

          {recommendations.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-[#fafbff] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/50"
            >

              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ArrowUpRight size={20} />
                </div>

                <span className="text-xs font-bold text-indigo-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-5 text-base font-semibold leading-7 text-slate-900">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProfileImprovement;
