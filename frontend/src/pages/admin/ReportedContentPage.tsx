import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, Ban } from "lucide-react";
import { adminApi } from "../../services/api";
import type { UserReport } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { Modal } from "../../components/common/Modal";

export const ReportedContentPage: React.FC = () => {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);

  // Resolution Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<UserReport | null>(null);
  const [decision, setDecision] = useState("action_taken");
  const [takeDownJob, setTakeDownJob] = useState(true);
  const [moderationNotes, setModerationNotes] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getReports(statusFilter);
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport) return;
    setIsResolving(true);
    try {
      await adminApi.resolveReport(activeReport.id, {
        status: decision,
        moderation_notes: moderationNotes,
        take_down_job: takeDownJob,
      });
      setModalOpen(false);
      setModerationNotes("");
      await fetchReports();
    } catch (err) {
      console.error(err);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            Reported Content Moderation
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Investigate suspicious listings, scam alerts, and policy infractions.
          </p>
        </div>

        <div className="flex gap-2">
          {["pending", "action_taken", "dismissed", "all"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? "bg-brand-green text-white shadow-sm"
                  : "text-brand-slate hover:bg-white"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-xs text-brand-muted">Loading moderation reports...</Card>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={<ShieldAlert className="w-6 h-6 text-brand-green" />}
          title={`No ${statusFilter} reports`}
          description="Community-reported listings will queue here for administrative investigation."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => (
            <Card key={rep.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-brand-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      Reason: {rep.reason}
                    </span>
                    <Badge variant={rep.status === "pending" ? "pending" : "published"} size="sm">
                      {rep.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-brand-text mt-1">
                    Flagged Vacancy: {rep.reported_job?.title || "Unknown Listing"}
                  </h3>
                  <p className="text-xs text-brand-muted">
                    Employer: {rep.reported_job?.company?.name} • Reported by {rep.reporter?.email || "Anonymous"}
                  </p>
                </div>

                <span className="text-[11px] text-brand-muted">
                  Reported {new Date(rep.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>
              </div>

              {rep.details && (
                <div className="p-3 bg-brand-ivory rounded-lg border border-brand-border text-xs text-brand-slate">
                  <span className="font-bold text-brand-teal block">Reporter Comments:</span>
                  <p>{rep.details}</p>
                </div>
              )}

              {rep.moderation_notes && (
                <p className="text-xs text-brand-muted italic">
                  Moderator Action Note: {rep.moderation_notes}
                </p>
              )}

              {rep.status === "pending" && (
                <div className="pt-2 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveReport(rep);
                      setTakeDownJob(true);
                      setModalOpen(true);
                    }}
                  >
                    Investigate & Resolve
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* RESOLUTION MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resolve Moderation Report"
        description={`Target Listing: ${activeReport?.reported_job?.title}`}
        maxWidth="md"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Moderation Action
            </label>
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
            >
              <option value="action_taken">Action Taken (Policy Violation)</option>
              <option value="dismissed">Dismissed (No Violation Found)</option>
              <option value="investigated">Investigated & Closed</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-brand-text cursor-pointer">
            <input
              type="checkbox"
              checked={takeDownJob}
              onChange={(e) => setTakeDownJob(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
            />
            <span>Take down and remove job listing from public search</span>
          </label>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Moderation Audit Notes *
            </label>
            <textarea
              rows={3}
              required
              value={moderationNotes}
              onChange={(e) => setModerationNotes(e.target.value)}
              placeholder="e.g. Flagged for misleading compensation scheme. Listing closed and recruiter notified."
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-brand-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isResolving}>
              Confirm Resolution
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
