import { BriefcaseBusiness, ChevronDown } from "lucide-react";

function TargetRoleDropdown({ value, onRoleChange }) {
  const roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "AI/ML Engineer",
    "Data Scientist",
    "DevOps Engineer",
    "Android Developer",
  ];

  const handleChange = (event) => {
    const selectedRole = event.target.value;

    onRoleChange(selectedRole);

    if (selectedRole) {
      localStorage.setItem("targetRole", selectedRole);
    } else {
      localStorage.removeItem("targetRole");
    }
  };

  return (
    <section className="mt-8">
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
              <BriefcaseBusiness
                size={21}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Target Role
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Select the career role you want to prepare for.
              </p>
            </div>

          </div>

          <div className="relative w-full md:w-80">

            <select
              value={value}
              onChange={handleChange}
              className="appearance-none w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-11 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 cursor-pointer"
            >
              <option value="">
                Select Target Role
              </option>

              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

          </div>

        </div>

        {value && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3">

            <div className="w-2 h-2 rounded-full bg-indigo-600" />

            <p className="text-sm text-indigo-700">
              Your dashboard is now optimized for{" "}
              <span className="font-semibold">
                {value}
              </span>
              .
            </p>

          </div>
        )}

      </div>
    </section>
  );
}

export default TargetRoleDropdown;