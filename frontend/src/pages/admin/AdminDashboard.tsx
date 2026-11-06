import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle2,
  Building2,
  History
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { AdminMetrics } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { CardSkeleton } from "../../components/common/Skeleton";

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.getMetrics().then((data) => {
      setMetrics(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-teal tracking-tight">
            Platform Operations & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-1">
            System-wide user governance, corporate credential verification, and moderation queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/verifications">
            <Button variant="outline" size="md">
              Verifications ({metrics?.pending_verifications || 0})
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="orange" size="md">
              Moderation Queue ({metrics?.pending_reports || 0})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-brand-teal" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-teal">
            {isLoading ? "..." : metrics?.total_users || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">
            {metrics?.total_applicants} Applicants • {metrics?.total_recruiters} Recruiters
          </span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Verified Companies</span>
            <ShieldCheck className="w-4 h-4 text-brand-green" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-green">
            {isLoading ? "..." : metrics?.verified_companies || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">
            Out of {metrics?.total_companies} total registered
          </span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Active Vacancies</span>
            <Briefcase className="w-4 h-4 text-brand-teal" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-teal">
            {isLoading ? "..." : metrics?.active_jobs || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">
            {metrics?.total_applications} Submissions processed
          </span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Pending Alerts</span>
            <AlertTriangle className="w-4 h-4 text-brand-orange" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-orange">
            {isLoading ? "..." : (metrics?.pending_reports || 0) + (metrics?.pending_verifications || 0)}
          </p>
          <span className="text-[11px] text-brand-muted block">
            Reports & Verifications
          </span>
        </Card>
      </div>

      {/* Main Grid: Pending Moderation & Recent User Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Quick Actions & System Health */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-brand-teal tracking-tight">
            Moderation Priorities
          </h2>

          <Card className="space-y-3">
            <div
              onClick={() => navigate("/admin/verifications")}
              className="p-3 bg-brand-ivory rounded-xl border border-brand-border flex items-center justify-between hover:border-brand-green cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-brand-text">Company Verification Queue</h4>
                  <p className="text-[11px] text-brand-muted">
                    {metrics?.pending_verifications} pending corporate review
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted" />
            </div>

            <div
              onClick={() => navigate("/admin/reports")}
              className="p-3 bg-brand-ivory rounded-xl border border-brand-border flex items-center justify-between hover:border-brand-green cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-brand-orange" />
                <div>
                  <h4 className="text-xs font-bold text-brand-text">Content Moderation Reports</h4>
                  <p className="text-[11px] text-brand-muted">
                    {metrics?.pending_reports} user-reported postings
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted" />
            </div>

            <div
              onClick={() => navigate("/admin/audit-logs")}
              className="p-3 bg-brand-ivory rounded-xl border border-brand-border flex items-center justify-between hover:border-brand-green cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-brand-teal" />
                <div>
                  <h4 className="text-xs font-bold text-brand-text">Security & Audit Log Trail</h4>
                  <p className="text-[11px] text-brand-muted">
                    Review administrative events & logins
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted" />
            </div>
          </Card>
        </div>

        {/* Right: Recent Registered Users */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-teal tracking-tight">
              Recent User Registrations
            </h2>
            <Link to="/admin/users" className="text-xs text-brand-green font-semibold hover:underline">
              Manage All Users →
            </Link>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-ivory text-brand-slate uppercase font-bold text-[10px] border-b border-brand-border">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {metrics?.recent_users?.map((u) => (
                    <tr key={u.id} className="hover:bg-brand-ivory/50">
                      <td className="px-4 py-3 font-semibold text-brand-text">
                        {u.full_name}
                      </td>
                      <td className="px-4 py-3 text-brand-muted">{u.email}</td>
                      <td className="px-3 py-3">
                        <span className="capitalize font-medium text-brand-slate">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={u.is_active ? "published" : "rejected"} size="sm">
                          {u.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
