import { cn } from "@/lib/utils";

type StatusType = "live" | "active" | "low" | "medium" | "high" | "draft";

interface StatusPillProps {
  status: StatusType;
  label?: string;
}

const statusStyles: Record<StatusType, string> = {
  live: "status-pill-live",
  active: "status-pill-active",
  low: "status-pill-low",
  medium: "status-pill-medium",
  high: "status-pill-high",
  draft: "status-pill-draft",
};

const defaultLabels: Record<StatusType, string> = {
  live: "Live",
  active: "Active",
  low: "Low",
  medium: "Medium",
  high: "High",
  draft: "Draft",
};

export function StatusPill({ status, label }: StatusPillProps) {
  return (
    <span className={cn("status-pill", statusStyles[status])}>
      {label || defaultLabels[status]}
    </span>
  );
}
