import { JobApplication, ApplicationStatus, FilterStatus } from "../types";

const ALL_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const statusStyles: Record<ApplicationStatus, { active: string; dot: string }> = {
  Applied: {
    active: "border-sky-200 bg-sky-100 text-sky-600",
    dot: "bg-sky-300",
  },
  "Phone Screen": {
    active: "border-orange-200 bg-orange-100 text-orange-500",
    dot: "bg-orange-300",
  },
  Interview: {
    active: "border-violet-200 bg-violet-100 text-violet-500",
    dot: "bg-violet-300",
  },
  Offer: {
    active: "border-emerald-200 bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-300",
  },
  Rejected: {
    active: "border-rose-200 bg-rose-100 text-rose-500",
    dot: "bg-rose-300",
  },
  Withdrawn: {
    active: "border-stone-200 bg-stone-100 text-stone-500",
    dot: "bg-stone-300",
  },
};

interface StatsRowProps {
  applications: JobApplication[];
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export default function StatsRow({ applications, activeFilter, onFilterChange }: StatsRowProps) {
  const total = applications.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {/* Total card */}
      <button
        onClick={() => onFilterChange("All")}
        className={`flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-all hover:shadow-sm cursor-pointer ${
          activeFilter === "All"
            ? "border-violet-200 bg-violet-100 shadow-sm"
            : "border-violet-100 bg-white hover:border-violet-200"
        }`}
      >
        <span
          className={`text-2xl font-bold ${
            activeFilter === "All" ? "text-violet-600" : "text-slate-700"
          }`}
        >
          {total}
        </span>
        <span
          className={`text-xs font-medium ${
            activeFilter === "All" ? "text-violet-500" : "text-slate-400"
          }`}
        >
          Total
        </span>
      </button>

      {/* Per-status cards */}
      {ALL_STATUSES.map((status) => {
        const count = applications.filter((a) => a.status === status).length;
        const styles = statusStyles[status];
        const isActive = activeFilter === status;

        return (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-all hover:shadow-sm cursor-pointer ${
              isActive
                ? `${styles.active} shadow-sm`
                : "border-violet-100 bg-white hover:border-violet-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  isActive ? styles.dot : "bg-violet-200"
                }`}
              />
              <span
                className={`text-2xl font-bold leading-none ${isActive ? "" : "text-slate-700"}`}
              >
                {count}
              </span>
            </div>
            <span className={`text-xs font-medium ${isActive ? "" : "text-slate-400"}`}>
              {status}
            </span>
          </button>
        );
      })}
    </div>
  );
}
