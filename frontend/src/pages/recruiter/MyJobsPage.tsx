import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Users,
  Eye,
  Calendar,
  Edit,
  XCircle,
  MoreVertical,
  ArrowRight
} from "lucide-react";
import { recruitersApi, jobsApi } from "../../services/api";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { CardSkeleton } from "../../components/common/Skeleton";
import { EmptyState } from "../../components/common/EmptyState";

export const MyJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await recruitersApi.getJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCloseJob = async (jobId: number) => {
    if (!window.confirm("Are you sure you want to close this job vacancy? It will no longer accept new applications.")) {
      return;
    }
    try {
      await jobsApi.deleteJob(jobId);
      await fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs =
    statusFilter === "all" ? jobs : jobs.filter((j) => j.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            Job Posting Management
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Create, publish, edit, and monitor application volume across your active openings.
          </p>
        </div>

        <Link to="/recruiter/jobs/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Post New Vacancy
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-2">
        {["all", "published", "draft", "closed"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              statusFilter === st
                ? "bg-brand-green text-white shadow-sm"
                : "text-brand-slate hover:bg-white hover:text-brand-text"
            }`}
          >
            {st} ({st === "all" ? jobs.length : jobs.filter((j) => j.status === st).length})
          </button>
        ))}
      </div>

      {/* Jobs Table & Card representation */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No vacancies found"
          description="Create your first job posting to attract verified technical candidates."
          actionText="Create Vacancy"
          onAction={() => navigate("/recruiter/jobs/new")}
        />
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={job.status} size="sm">
                    {job.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-brand-muted font-medium">
                    {job.department || job.category} • {job.work_arrangement}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-brand-text hover:text-brand-green transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {job.location} • {job.employment_type} • {job.experience_level}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-brand-slate pt-1">
                  <span className="flex items-center gap-1 font-semibold text-brand-teal">
                    <Users className="w-3.5 h-3.5 text-brand-green" /> {job.applicant_count} Applicants
                  </span>
                  <span className="flex items-center gap-1 text-brand-muted">
                    <Eye className="w-3.5 h-3.5" /> {job.views_count} Views
                  </span>
                  <span className="text-brand-muted">
                    Posted on {new Date(job.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/recruiter/applicants?job_id=${job.id}`)}
                  leftIcon={<Users className="w-3.5 h-3.5" />}
                >
                  Applicants ({job.applicant_count})
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}
                  leftIcon={<Edit className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>

                {job.status !== "closed" && (
                  <button
                    onClick={() => handleCloseJob(job.id)}
                    className="p-2 text-brand-muted hover:text-rose-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Close vacancy"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
