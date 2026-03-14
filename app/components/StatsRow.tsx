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
    active: "border-sky-200 bg-sky-50 text-sky-600",
    dot: "bg-sky-300",
  },
  "Phone Screen": {
    active: "border-amber-200 bg-amber-50 text-amber-600",
    dot: "bg-amber-300",
  },
  Interview: {
    active: "border-indigo-200 bg-indigo-50 text-indigo-500",
    dot: "bg-indigo-300",
  },
  Offer: {
    active: "border-teal-200 bg-teal-50 text-teal-600",
    dot: "bg-teal-300",
  },
  Rejected: {
    active: "border-rose-200 bg-rose-50 text-rose-400",
    dot: "bg-rose-300",
  },
  Withdrawn: {
    active: "border-stone-300 bg-stone-100 text-stone-500",
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
            ? "border-[#0094F7] bg-[#0094F7] shadow-sm"
            : "border-stone-200 bg-white hover:border-[#0094F7]/40"
        }`}
      >
        <span
          className={`text-2xl font-bold ${
            activeFilter === "All" ? "text-white" : "text-stone-800"
          }`}
        >
          {total}
        </span>
        <span
          className={`text-xs font-medium ${
            activeFilter === "All" ? "text-white/70" : "text-stone-400"
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
                : "border-stone-200 bg-white hover:border-[#0094F7]/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  isActive ? styles.dot : "bg-stone-200"
                }`}
              />
              <span
                className={`text-2xl font-bold leading-none ${isActive ? "" : "text-stone-800"}`}
              >
                {count}
              </span>
            </div>
            <span className={`text-xs font-medium ${isActive ? "" : "text-stone-400"}`}>
              {status}
            </span>
          </button>
        );
      })}
    </div>
  );
}
