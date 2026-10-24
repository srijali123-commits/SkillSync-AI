import {
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

function DashboardHeader({ targetRole }) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <LayoutDashboard
            size={28}
            className="text-indigo-600"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Career Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Track your career readiness and skill development.
          </p>
        </div>
      </div>

      {targetRole && (
        <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
          <Sparkles size={17} />
          {targetRole}
        </div>
      )}
    </div>
  );
}

export default DashboardHeader;