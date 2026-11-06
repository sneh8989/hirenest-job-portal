import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Building2, MapPin, Trash2, ArrowRight } from "lucide-react";
import { applicantsApi } from "../../services/api";
import type { SavedJob } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { CardSkeleton } from "../../components/common/Skeleton";
import { EmptyState } from "../../components/common/EmptyState";

export const SavedJobsPage: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSaved = async () => {
    setIsLoading(true);
    try {
      const data = await applicantsApi.getSavedJobs();
      setSavedJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (jobId: number) => {
    try {
      await applicantsApi.removeSavedJob(jobId);
      setSavedJobs((prev) => prev.filter((s) => s.job_id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Saved Vacancies
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Review positions saved for later application.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          title="No saved vacancies"
          description="Explore current job openings and click 'Save Job' to monitor roles here."
          actionText="Explore Jobs"
          onAction={() => navigate("/jobs")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between space-y-4 p-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-brand-ivory border border-brand-border flex items-center justify-center font-bold text-brand-teal text-sm">
                    {item.job?.company?.name?.charAt(0) || "C"}
                  </div>
                  <Badge variant={item.job?.work_arrangement === "Remote" ? "published" : "neutral"} size="sm">
                    {item.job?.work_arrangement || "On-site"}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-brand-text line-clamp-1">
                    {item.job?.title}
                  </h3>
                  <p className="text-xs text-brand-muted font-medium mt-0.5">
                    {item.job?.company?.name} • {item.job?.location}
                  </p>
                </div>

                <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed">
                  {item.job?.description}
                </p>
              </div>

              <div className="pt-3 border-t border-brand-border flex items-center justify-between">
                <button
                  onClick={() => handleRemove(item.job_id)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/jobs/${item.job_id}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Details & Apply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
