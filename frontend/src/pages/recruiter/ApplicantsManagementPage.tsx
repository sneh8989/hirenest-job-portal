import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2,
  Filter,
  Download,
  ExternalLink
} from "lucide-react";
import { recruitersApi, applicationsApi, API_BASE_URL } from "../../services/api";
import type { Application } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { CardSkeleton } from "../../components/common/Skeleton";
import { EmptyState } from "../../components/common/EmptyState";
import { Modal } from "../../components/common/Modal";

export const ApplicantsManagementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get("job_id");
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId || "all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status Change Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeApp, setActiveApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState("under_review");
  const [statusNotes, setStatusNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    recruitersApi.getJobs().then(setJobs).catch(console.error);
  }, []);

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
      if (selectedJobId !== "all") {
        const data = await applicationsApi.getJobApplications(parseInt(selectedJobId, 10));
        setApplications(data);
      } else {
        // Fetch for first job or aggregated
        const allJobs = await recruitersApi.getJobs();
        if (allJobs.length > 0) {
          const firstJobApps = await applicationsApi.getJobApplications(allJobs[0].id);
          setApplications(firstJobApps);
        } else {
          setApplications([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [selectedJobId]);

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp) return;
    setIsUpdatingStatus(true);
    try {
      await applicationsApi.updateStatus(activeApp.id, newStatus, statusNotes);
      setStatusModalOpen(false);
      setStatusNotes("");
      await fetchApplicants();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredApps =
    statusFilter === "all"
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            Candidate Management
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Review applicant qualifications, verify AI fit ratings, and transition candidate pipeline stages.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/recruiter/pipeline")}
        >
          Open Kanban Pipeline View
        </Button>
      </div>

      {/* Filter and selector bar */}
      <Card className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-brand-slate whitespace-nowrap">
            Job Vacancy:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setSearchParams(e.target.value !== "all" ? { job_id: e.target.value } : {});
            }}
            className="text-xs p-2 rounded-lg border border-brand-border bg-white text-brand-text font-medium w-full sm:w-72 focus-ring"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.applicant_count} applicants)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-brand-slate whitespace-nowrap">
            Status Stage:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 rounded-lg border border-brand-border bg-white text-brand-text font-medium w-full sm:w-44 focus-ring"
          >
            <option value="all">All Stages</option>
            <option value="applied">Applied</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview_scheduled">Interview</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Candidates Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No candidates found"
          description="Candidates who apply for this vacancy will appear here with instant AI fit calculations."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-ivory text-brand-slate font-bold uppercase tracking-wider text-[10px] border-b border-brand-border">
                <tr>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-4 py-3.5">AI Match</th>
                  <th className="px-4 py-3.5">Applied Date</th>
                  <th className="px-4 py-3.5">Stage</th>
                  <th className="px-4 py-3.5">Resume</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-brand-text">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-brand-ivory/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-brand-text">
                        {app.applicant?.full_name || "Candidate"}
                      </div>
                      <div className="text-[11px] text-brand-muted">
                        {app.applicant?.email}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {app.ai_match_score ? (
                        <span className="px-2 py-0.5 rounded-full bg-brand-mint text-brand-minttext text-[11px] font-bold">
                          {Math.round(app.ai_match_score)}% Fit
                        </span>
                      ) : (
                        <span className="text-brand-muted text-[11px]">N/A</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-brand-muted">
                      {new Date(app.created_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant={app.status} size="sm">
                        {app.status.replace("_", " ")}
                      </Badge>
                    </td>

                    <td className="px-4 py-4">
                      {app.resume_url ? (
                        <a
                          href={`${API_BASE_URL}${app.resume_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-green font-semibold hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Resume
                        </a>
                      ) : (
                        <span className="text-[11px] text-brand-muted">No file</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveApp(app);
                          setNewStatus(app.status);
                          setStatusModalOpen(true);
                        }}
                        className="text-xs text-brand-teal font-semibold hover:underline"
                      >
                        Change Stage
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/recruiter/interviews?app_id=${app.id}&job_id=${app.job_id}&applicant_id=${app.applicant_id}`)
                        }
                        className="text-xs text-brand-green font-semibold hover:underline"
                      >
                        Interview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Candidate Stage"
        description={`Candidate: ${activeApp?.applicant?.full_name}`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Select Pipeline Stage
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
            >
              <option value="applied">Applied (Submitted)</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="selected">Selected (Offer / Hire)</option>
              <option value="rejected">Rejected (Archived)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Hiring Notes (Visible to team & timeline)
            </label>
            <textarea
              rows={3}
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="e.g. Strong technical match, advancing to technical panel round..."
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-brand-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingStatus}>
              Save Transition
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
