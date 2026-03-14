import { ApplicationStatus } from "../types";

const statusConfig: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  Applied: {
    bg: "bg-sky-50",
    text: "text-sky-600",
    dot: "bg-sky-300",
  },
  "Phone Screen": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-300",
  },
  Interview: {
    bg: "bg-indigo-50",
    text: "text-indigo-500",
    dot: "bg-indigo-300",
  },
  Offer: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    dot: "bg-teal-300",
  },
  Rejected: {
    bg: "bg-rose-50",
    text: "text-rose-400",
    dot: "bg-rose-300",
  },
  Withdrawn: {
    bg: "bg-stone-100",
    text: "text-stone-400",
    dot: "bg-stone-300",
  },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
