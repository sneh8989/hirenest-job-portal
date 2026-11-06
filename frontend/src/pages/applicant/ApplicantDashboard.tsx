import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  Calendar,
  Bookmark,
  Sparkles,
  ArrowRight,
  User,
  Clock,
  Building2,
  MapPin,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { applicantsApi, aiApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Skeleton } from "../../components/common/Skeleton";

export const ApplicantDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const [metricsData, recsData] = await Promise.all([
          applicantsApi.getDashboardMetrics(),
          aiApi.getRecommendations(4),
        ]);
        setMetrics(metricsData);
        setRecommendations(recsData);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome & Profile Status Banner */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-brand-green uppercase tracking-wider">
            Applicant Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-teal tracking-tight">
            Welcome back, {user?.full_name?.split(" ")[0]}
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate">
            Track active submissions, evaluate role fit, and respond to interview invitations.
          </p>
        </div>

        {/* Profile Completion Meter */}
        <div className="bg-brand-ivory p-4 rounded-xl border border-brand-border min-w-[240px] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-brand-teal">Profile Strength</span>
            <span className="font-extrabold text-brand-green">
              {metrics?.profile_completion || 30}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-brand-green rounded-full transition-all duration-500"
              style={{ width: `${metrics?.profile_completion || 30}%` }}
            />
          </div>
          <Link
            to="/applicant/profile"
            className="text-[11px] text-brand-muted hover:text-brand-green font-medium flex items-center justify-between pt-1"
          >
            <span>Complete profile skills</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Total Submissions</span>
            <FileText className="w-4 h-4 text-brand-slate" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-teal">
            {isLoading ? <Skeleton className="w-12 h-8" /> : metrics?.total_applications || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">Across all employers</span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-brand-green" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-green">
            {isLoading ? <Skeleton className="w-12 h-8" /> : metrics?.shortlisted_applications || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">Advancing to next stage</span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Interviews</span>
            <Calendar className="w-4 h-4 text-brand-orange" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-orange">
            {isLoading ? <Skeleton className="w-12 h-8" /> : metrics?.upcoming_interviews || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">Scheduled & active</span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider">Saved Vacancies</span>
            <Bookmark className="w-4 h-4 text-brand-teal" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-teal">
            {isLoading ? <Skeleton className="w-12 h-8" /> : metrics?.saved_jobs_count || 0}
          </p>
          <span className="text-[11px] text-brand-muted block">In your watchlist</span>
        </Card>
      </div>

      {/* Main Grid: Recommended Jobs vs Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recommended Jobs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-brand-teal tracking-tight">
                Recommended For You
              </h2>
              <p className="text-xs text-brand-muted">
                Matched automatically with your recorded skills and preferences.
              </p>
            </div>
            <Link to="/jobs">
              <Button variant="outline" size="sm">
                Explore More
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
            ) : recommendations.length === 0 ? (
              <Card className="p-8 text-center text-xs text-brand-muted">
                Add skills to your profile to generate intelligent recommendations.
              </Card>
            ) : (
              recommendations.map((rec) => (
                <Card
                  key={rec.job.id}
                  hoverable
                  onClick={() => navigate(`/jobs/${rec.job.id}`)}
                  className="cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-ivory border border-brand-border flex items-center justify-center font-bold text-brand-teal text-sm">
                        {rec.job.company?.name?.charAt(0) || "C"}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-brand-text hover:text-brand-green transition-colors">
                          {rec.job.title}
                        </h3>
                        <p className="text-xs text-brand-muted">
                          {rec.job.company?.name} • {rec.job.location} ({rec.job.work_arrangement})
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-brand-mint text-brand-minttext text-[11px] font-bold">
                        {Math.round(rec.match_score)}% Match
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-brand-border">
                    <span className="text-[11px] text-brand-muted">
                      {rec.recommendation_reason}
                    </span>
                    <span className="text-brand-green font-medium flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Application Activity */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-teal tracking-tight">
              Recent Application Activity
            </h2>
            <Link to="/applicant/applications" className="text-xs text-brand-green font-semibold hover:underline">
              All Applications
            </Link>
          </div>

          <Card className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : !metrics?.recent_applications || metrics.recent_applications.length === 0 ? (
              <div className="text-center py-8 text-xs text-brand-muted">
                No job applications submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-brand-border">
                {metrics.recent_applications.map((app: any) => (
                  <div key={app.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-brand-text line-clamp-1">
                        {app.job_title}
                      </h4>
                      <Badge variant={app.status} size="sm">
                        {app.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-brand-muted">
                      <span>{app.company_name}</span>
                      <span>
                        Applied {new Date(app.applied_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick AI Skill Gap Teaser Card */}
          <Card className="bg-brand-teal text-white border-none space-y-3 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Skill Gap Analyzer
              </h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Targeting a specific role? Analyze your delta against job requirements and generate a prioritized learning roadmap.
            </p>
            <Link to="/applicant/skill-gap">
              <Button variant="orange" size="sm" className="w-full">
                Launch Analyzer
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
