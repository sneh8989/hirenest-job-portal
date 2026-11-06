import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "applied"
    | "under_review"
    | "shortlisted"
    | "interview_scheduled"
    | "selected"
    | "rejected"
    | "withdrawn"
    | "published"
    | "draft"
    | "closed"
    | "archived"
    | "verified"
    | "pending"
    | "neutral"
    | "orange"
    | "scheduled"
    | "accepted"
    | "declined"
    | "completed"
    | "cancelled";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
}) => {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  const variantMap: Record<string, string> = {
    applied: "bg-blue-50 text-blue-700 border border-blue-200",
    under_review: "bg-amber-50 text-amber-800 border border-amber-200",
    shortlisted: "bg-brand-mint text-brand-minttext border border-[#BDE6D2]",
    interview_scheduled: "bg-purple-50 text-purple-700 border border-purple-200",
    selected: "bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold",
    rejected: "bg-rose-50 text-rose-700 border border-rose-200",
    withdrawn: "bg-gray-100 text-gray-600 border border-gray-200",
    published: "bg-brand-mint text-brand-minttext border border-[#BDE6D2]",
    draft: "bg-amber-50 text-amber-700 border border-amber-200",
    closed: "bg-gray-100 text-gray-600 border border-gray-200",
    archived: "bg-gray-100 text-gray-600 border border-gray-200",
    verified: "bg-brand-mint text-brand-minttext border border-[#BDE6D2]",
    pending: "bg-orange-50 text-orange-700 border border-orange-200",
    scheduled: "bg-purple-50 text-purple-700 border border-purple-200",
    accepted: "bg-brand-mint text-brand-minttext border border-[#BDE6D2]",
    declined: "bg-rose-50 text-rose-700 border border-rose-200",
    completed: "bg-emerald-50 text-emerald-800 border border-emerald-300",
    cancelled: "bg-gray-100 text-gray-600 border border-gray-200",
    neutral: "bg-gray-100 text-brand-slate border border-brand-border",
    orange: "bg-orange-50 text-brand-orange border border-orange-200",
  };

  const selectedClass = variantMap[variant] || variantMap.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${selectedClass} transition-colors`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
};
