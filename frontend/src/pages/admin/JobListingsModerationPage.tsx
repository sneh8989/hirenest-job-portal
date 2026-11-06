import React, { useState, useEffect } from "react";
import { Briefcase, Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react";
import { adminApi } from "../../services/api";
import type { Job } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const JobListingsModerationPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getJobs();
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

  const handleModerate = async (jobId: number, action: "hide" | "restore") => {
    const reason = prompt(`Reason for ${action}ing this job posting:`, "Policy compliance check");
    if (reason === null) return;
    try {
      await adminApi.moderateJob(jobId, action, reason);
      await fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Job Listings Moderation
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Review published and reported listings across the platform. Hide or reinstate vacancies.
        </p>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-xs text-brand-muted">Loading job directory...</Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={job.status} size="sm">
                    {job.status.toUpperCase()}
                  </Badge>
                  {job.is_moderated && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                      FLAGGED & MODERATED
                    </span>
                  )}
                  <span className="text-xs text-brand-muted font-medium">
                    {job.company?.name} • {job.location} ({job.work_arrangement})
                  </span>
                </div>

                <h3 className="text-sm font-bold text-brand-text">
                  {job.title}
                </h3>

                <p className="text-xs text-brand-slate line-clamp-2">
                  {job.description}
                </p>

                {job.moderation_reason && (
                  <p className="text-xs text-rose-700 italic pt-1">
                    Moderation Note: {job.moderation_reason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {job.is_moderated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-brand-green"
                    onClick={() => handleModerate(job.id, "restore")}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Restore Listing
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => handleModerate(job.id, "hide")}
                    leftIcon={<EyeOff className="w-3.5 h-3.5" />}
                  >
                    Take Down & Hide
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
