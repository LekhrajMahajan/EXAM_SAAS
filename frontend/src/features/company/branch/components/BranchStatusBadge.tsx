import { cn } from "@/utils/cn";

interface BranchStatusBadgeProps {
  status: "ACTIVE" | "INACTIVE";
}

export const BranchStatusBadge = ({ status }: BranchStatusBadgeProps) => {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        isActive
          ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};
