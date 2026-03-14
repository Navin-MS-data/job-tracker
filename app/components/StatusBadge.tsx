import { ApplicationStatus } from "../types";

const statusConfig: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  Applied: {
    bg: "bg-sky-100",
    text: "text-sky-600",
    dot: "bg-sky-300",
  },
  "Phone Screen": {
    bg: "bg-orange-100",
    text: "text-orange-500",
    dot: "bg-orange-300",
  },
  Interview: {
    bg: "bg-violet-100",
    text: "text-violet-500",
    dot: "bg-violet-300",
  },
  Offer: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    dot: "bg-emerald-300",
  },
  Rejected: {
    bg: "bg-rose-100",
    text: "text-rose-500",
    dot: "bg-rose-300",
  },
  Withdrawn: {
    bg: "bg-stone-100",
    text: "text-stone-500",
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
