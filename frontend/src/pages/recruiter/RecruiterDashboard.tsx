import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Plus,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Building2,
  Clock
} from "lucide-react";
import { recruitersApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Skeleton } from "../../components/common/Skeleton";

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const data = await recruitersApi.getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-brand-green uppercase tracking-wider">
            Recruiter Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-teal tracking-tight">
            Talent Acquisition Overview
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-1">
            Manage vacancies, evaluate AI candidate alignment, and progress your hiring pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/recruiter/pipeline">
            <Button variant="outline" size="md">
              Kanban Board
            </Button>
          </Link>
          <Link to="/recruiter/jobs/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Create Vacancy
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Active Openings</span>
            <Briefcase className="w-4 h-4 text-brand-teal" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-teal">
            {isLoading ? <Skeleton className="w-12 h-8" /> : metrics?.active_jobs || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">Live on public portal</span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Total Candidates</span>
            <Users className="w-4 h-4 text-brand-green" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-green">
            {isLoading ? <Skeleton className="w-12 h-8" /> : metrics?.total_applicants || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">Received across all roles</span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-brand-orange" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-orange">
            {isLoading ? <Skeleton className="w-12 h-8" /> : metrics?.shortlisted || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">Qualified talent</span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Interviews</span>
            <Calendar className="w-4 h-4 text-brand-teal" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-teal">
            {isLoading ? <Skeleton className="w-12 h-8" /> : metrics?.interviews_scheduled || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">Scheduled & active</span>
        </Card>
      </div>

      {/* Main Grid: Pipeline Distribution & Applicants by Job */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Stage Distribution */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-teal tracking-tight">
              Hiring Funnel Distribution
            </h2>
            <Link to="/recruiter/pipeline" className="text-xs text-brand-green font-semibold hover:underline">
              Open Kanban Pipeline →
            </Link>
          </div>

          <Card className="p-6 space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : metrics?.stage_distribution ? (
              <div className="space-y-3">
                {Object.entries(metrics.stage_distribution).map(([stage, count]: any) => {
                  const maxCount = Math.max(1, metrics.total_applicants || 1);
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={stage} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-brand-text capitalize">
                          {stage.replace("_", " ")}
                        </span>
                        <span className="text-brand-teal">{count} candidates</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-brand-green rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-brand-muted text-center py-4">No application activity recorded yet.</p>
            )}
          </Card>

          {/* Applicants by Job Overview */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-brand-teal tracking-tight">
              Applicants by Active Vacancy
            </h3>
            <div className="space-y-2">
              {metrics?.applicants_by_job?.map((item: any) => (
                <div
                  key={item.job_id}
                  onClick={() => navigate(`/recruiter/applicants?job_id=${item.job_id}`)}
                  className="bg-white p-3 rounded-xl border border-brand-border flex items-center justify-between hover:border-brand-green cursor-pointer transition-colors"
                >
                  <span className="text-xs font-bold text-brand-text truncate">
                    {item.job_title}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-ivory text-brand-teal border border-brand-border">
                    {item.applicant_count} applicants
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent Applicants Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-teal tracking-tight">
              Recent Submissions
            </h2>
            <Link to="/recruiter/applicants" className="text-xs text-brand-green font-semibold hover:underline">
              View All
            </Link>
          </div>

          <Card className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !metrics?.recent_applications || metrics.recent_applications.length === 0 ? (
              <p className="text-xs text-brand-muted text-center py-8">
                No candidate submissions received yet.
              </p>
            ) : (
              <div className="divide-y divide-brand-border">
                {metrics.recent_applications.map((app: any) => (
                  <div key={app.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-brand-text truncate">
                        {app.candidate_name}
                      </h4>
                      {app.ai_match_score && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-mint text-brand-minttext">
                          {Math.round(app.ai_match_score)}% AI Fit
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-brand-muted truncate">
                      Applied for {app.job_title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-brand-slate pt-0.5">
                      <Badge variant={app.status} size="sm">
                        {app.status.replace("_", " ")}
                      </Badge>
                      <span>
                        {new Date(app.applied_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
