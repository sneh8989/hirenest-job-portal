import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  Bookmark,
  User,
  FileCheck,
  Sparkles,
  Bell,
  Calendar,
  Settings,
  Briefcase,
  Users,
  GitPullRequest,
  BarChart2,
  Building2,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  CreditCard,
  History,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface SidebarProps {
  role: "applicant" | "recruiter" | "admin";
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen = true, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const applicantItems: NavItem[] = [
    { label: "Dashboard", path: "/applicant/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Find Jobs", path: "/jobs", icon: <Search className="w-4 h-4" /> },
    { label: "My Applications", path: "/applicant/applications", icon: <FileText className="w-4 h-4" /> },
    { label: "Saved Jobs", path: "/applicant/saved-jobs", icon: <Bookmark className="w-4 h-4" /> },
    { label: "My Profile", path: "/applicant/profile", icon: <User className="w-4 h-4" /> },
    { label: "Resume", path: "/applicant/resume", icon: <FileCheck className="w-4 h-4" /> },
    { label: "Skill Gap Analyzer", path: "/applicant/skill-gap", icon: <Sparkles className="w-4 h-4 text-brand-orange" /> },
    { label: "Job Alerts", path: "/applicant/alerts", icon: <Bell className="w-4 h-4" /> },
    { label: "Interviews", path: "/applicant/interviews", icon: <Calendar className="w-4 h-4" /> },
    { label: "Settings", path: "/applicant/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const recruiterItems: NavItem[] = [
    { label: "Overview", path: "/recruiter/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "My Jobs", path: "/recruiter/jobs", icon: <Briefcase className="w-4 h-4" /> },
    { label: "Applicants", path: "/recruiter/applicants", icon: <Users className="w-4 h-4" /> },
    { label: "Hiring Pipeline", path: "/recruiter/pipeline", icon: <GitPullRequest className="w-4 h-4" /> },
    { label: "Interviews", path: "/recruiter/interviews", icon: <Calendar className="w-4 h-4" /> },
    { label: "Analytics", path: "/recruiter/analytics", icon: <BarChart2 className="w-4 h-4" /> },
    { label: "Company Profile", path: "/recruiter/company", icon: <Building2 className="w-4 h-4" /> },
    { label: "Training Resources", path: "/recruiter/training", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Feedback", path: "/recruiter/feedback", icon: <MessageSquare className="w-4 h-4" /> },
    { label: "Settings", path: "/recruiter/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const adminItems: NavItem[] = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Manage Users", path: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { label: "Recruiter Verification", path: "/admin/verifications", icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
    { label: "Job Listings", path: "/admin/jobs", icon: <Briefcase className="w-4 h-4" /> },
    { label: "Reported Content", path: "/admin/reports", icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
    { label: "Applications", path: "/admin/applications", icon: <FileText className="w-4 h-4" /> },
    { label: "Feedback", path: "/admin/feedback", icon: <MessageSquare className="w-4 h-4" /> },
    { label: "Payments", path: "/admin/payments", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Audit Logs", path: "/admin/audit-logs", icon: <History className="w-4 h-4" /> },
    { label: "Settings", path: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const items =
    role === "applicant"
      ? applicantItems
      : role === "recruiter"
      ? recruiterItems
      : adminItems;

  const roleTitle =
    role === "applicant"
      ? "Applicant Workspace"
      : role === "recruiter"
      ? "Recruiter Portal"
      : "Admin Console";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-brand-border flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Workspace Header */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-teal uppercase tracking-wider">
              {roleTitle}
            </p>
            <p className="text-xs text-brand-muted truncate max-w-[180px]">
              {user?.full_name}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-brand-muted hover:text-brand-text rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  active
                    ? "bg-brand-green text-white shadow-sm"
                    : "text-brand-slate hover:text-brand-text hover:bg-brand-ivory"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? "text-white" : "text-brand-slate"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-brand-ivory text-brand-green border border-brand-border"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Workspace Footer status indicator */}
        <div className="p-3 border-t border-brand-border bg-brand-ivory/50">
          <div className="flex items-center gap-2 text-[11px] text-brand-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Platform Services Live</span>
          </div>
        </div>
      </aside>
    </>
  );
};
