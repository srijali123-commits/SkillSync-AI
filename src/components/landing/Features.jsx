
import { Link } from "react-router-dom";
import {
  FileText,
  Target,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  UploadCloud,
  BrainCircuit,
  Route,
  CheckCircle2,
  Github,
  Code2,
} from "lucide-react";

function Features() {
  const features = [
    {
      title: "Smart Resume Analysis",
      description:
        "Transform your resume into meaningful insights. Discover your technical skills, strengths, and opportunities for improvement.",
      icon: FileText,
      gradient: "from-indigo-500 to-blue-500",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      number: "01",
    },
    {
      title: "Intelligent Skill Gap",
      description:
        "Compare your existing skills with your dream career role and discover exactly which skills you need to develop.",
      icon: Target,
      gradient: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      number: "02",
    },
    {
      title: "Career Readiness Score",
      description:
        "Understand your career readiness through a personalized score based on your resume, projects, GitHub, and coding performance.",
      icon: BarChart3,
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      number: "03",
    },
    {
      title: "AI Career Insights",
      description:
        "Receive personalized improvement suggestions and explore potential outcomes with the interactive What-If Career Simulator.",
      icon: Sparkles,
      gradient: "from-fuchsia-500 to-pink-500",
      iconBg: "bg-fuchsia-50",
      iconColor: "text-fuchsia-600",
      number: "04",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Resume",
      description:
        "Start with your resume and optionally connect your GitHub and LeetCode profiles.",
      icon: UploadCloud,
    },
    {
      number: "02",
      title: "Analyze Your Profile",
      description:
        "SkillSync AI evaluates your skills, coding activity, projects, and career readiness.",
      icon: BrainCircuit,
    },
    {
      number: "03",
      title: "Discover Your Roadmap",
      description:
        "Explore skill gaps, personalized recommendations, and career improvement scenarios.",
      icon: Route,
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-white py-20 sm:py-24"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-50/70 blur-3xl" />

      <div className="pointer-events-none absolute -left-40 bottom-20 h-96 w-96 rounded-full bg-violet-50/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* SECTION HEADING */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-4 py-2 text-sm font-semibold text-indigo-600">
            <Sparkles size={15} />
            Powerful Platform Features
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[44px] lg:leading-tight">
            Everything you need to
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              {" "}build your future
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            From understanding your current strengths to planning
            your next career move, SkillSync AI brings your
            professional growth into one intelligent platform.
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-100 bg-white p-7 shadow-[0_8px_35px_-18px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-2 hover:border-indigo-100 hover:shadow-[0_20px_55px_-20px_rgba(79,70,229,0.22)]"
              >
                {/* Gradient top accent */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon
                      size={27}
                      strokeWidth={1.9}
                      className={feature.iconColor}
                    />
                  </div>

                  <span className="text-sm font-bold text-slate-200 transition-colors group-hover:text-indigo-200">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-bold leading-snug text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-7 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs font-semibold text-indigo-600">
                  <CheckCircle2 size={16} />
                  Included in SkillSync AI
                </div>
              </div>
            );
          })}
        </div>

        {/* INTEGRATIONS STRIP */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-6 py-5">
          <span className="text-sm font-medium text-slate-500">
            Analyze your career using
          </span>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText size={19} className="text-indigo-600" />
            Resume
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Github size={19} />
            GitHub
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Code2 size={19} className="text-amber-600" />
            LeetCode
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-24">

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
              Simple Process
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your career clarity in
              <span className="text-indigo-600">
                {" "}3 simple steps
              </span>
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Go from a scattered career profile to actionable
              insights in just a few steps.
            </p>
          </div>

          <div className="relative mt-12 grid gap-6 md:grid-cols-3">

            {/* Connecting line on desktop */}
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-indigo-100 md:block" />

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-[24px] border border-slate-100 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-100">
                    <Icon size={30} strokeWidth={1.8} />
                  </div>

                  <span className="mt-5 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                    STEP {step.number}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="relative mt-20 overflow-hidden rounded-[30px] bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-7 py-12 text-center text-white shadow-xl shadow-indigo-200/50 sm:px-12 sm:py-14">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full border border-white/20" />
          <div className="pointer-events-none absolute -right-12 -bottom-28 h-72 w-72 rounded-full border border-white/20" />

          <div className="relative z-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Sparkles size={25} />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to discover your potential?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-indigo-100">
              Understand where you stand today and discover
              the skills that can move your career forward.
            </p>

            <Link
              to="/upload"
              className="group mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-indigo-600 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-50 hover:shadow-xl"
            >
              Start Your Career Analysis

              <ArrowRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
