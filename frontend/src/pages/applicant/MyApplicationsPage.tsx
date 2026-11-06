import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  Building2,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Ban
} from "lucide-react";
import { applicationsApi } from "../../services/api";
import type { Application } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { CardSkeleton } from "../../components/common/Skeleton";
import { EmptyState } from "../../components/common/EmptyState";

export const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal state
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationsApi.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId: number) => {
    if (!window.confirm("Are you sure you wish to withdraw this job application? This action cannot be reversed.")) {
      return;
    }
    setIsWithdrawing(true);
    try {
      await applicationsApi.withdraw(appId);
      await fetchApplications();
      setDetailModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const filteredApps =
    filterStatus === "all"
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  const statusTabs = [
    { id: "all", label: "All Applications" },
    { id: "applied", label: "Submitted" },
    { id: "under_review", label: "Under Review" },
    { id: "shortlisted", label: "Shortlisted" },
    { id: "interview_scheduled", label: "Interview" },
    { id: "selected", label: "Selected" },
    { id: "rejected", label: "Declined" },
    { id: "withdrawn", label: "Withdrawn" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          My Applications
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Review submission histories, view recruiter feedback, and inspect status transitions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-brand-border">
        {statusTabs.map((tab) => {
          const count =
            tab.id === "all"
              ? applications.length
              : applications.filter((a) => a.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? "bg-brand-green text-white shadow-sm"
                  : "text-brand-slate hover:bg-white hover:text-brand-text"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterStatus === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-brand-slate"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <EmptyState
          title="No applications in this category"
          description="Explore current vacancies and apply directly to matching employers."
          actionText="Find Jobs"
          onAction={() => (window.location.href = "/jobs")}
        />
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <Card
              key={app.id}
              hoverable
              onClick={() => {
                setSelectedApp(app);
                setDetailModalOpen(true);
              }}
              className="cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 p-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={app.status} size="sm">
                    {app.status.replace("_", " ")}
                  </Badge>
                  {app.ai_match_score && (
                    <span className="text-[11px] font-bold text-brand-green bg-brand-mint px-2 py-0.5 rounded-full">
                      {Math.round(app.ai_match_score)}% AI Fit
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-brand-text hover:text-brand-green transition-colors">
                    {app.job?.title || "Role Vacancy"}
                  </h3>
                  <p className="text-xs text-brand-muted font-medium mt-0.5">
                    {app.job?.company?.name} • {app.job?.location} • {app.job?.work_arrangement}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-brand-muted">
                  <span>
                    Applied on{" "}
                    {new Date(app.created_at).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>
                    {app.timeline?.length || 1} timeline event{(app.timeline?.length || 1) > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Button variant="outline" size="sm">
                  View Timeline & Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* APPLICATION DETAILS & TIMELINE MODAL */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedApp?.job?.title || "Application Details"}
        description={`${selectedApp?.job?.company?.name} • Tracking Record`}
        maxWidth="xl"
      >
        {selectedApp && (
          <div className="space-y-6 pt-2">
            {/* Status overview */}
            <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-brand-muted uppercase block">
                  Current Status
                </span>
                <Badge variant={selectedApp.status} size="md">
                  {selectedApp.status.replace("_", " ")}
                </Badge>
              </div>

              {selectedApp.ai_match_score && (
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-brand-muted uppercase block">
                    AI Match Score
                  </span>
                  <span className="text-base font-bold text-brand-teal">
                    {Math.round(selectedApp.ai_match_score)}% Fit
                  </span>
                </div>
              )}
            </div>

            {/* Recruiter feedback notes if provided */}
            {selectedApp.recruiter_notes && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
                <span className="font-bold block">Hiring Team Notes:</span>
                <p>{selectedApp.recruiter_notes}</p>
              </div>
            )}

            {/* Application Timeline Progression */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                Application Timeline
              </h4>
              <div className="border-l-2 border-brand-green/30 ml-3 pl-4 space-y-4 py-1">
                {selectedApp.timeline && selectedApp.timeline.length > 0 ? (
                  selectedApp.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-green absolute -left-[21px] top-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-brand-text capitalize">
                            {event.status.replace("_", " ")}
                          </span>
                          <span className="text-[10px] text-brand-muted">
                            {new Date(event.created_at).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {event.notes && (
                          <p className="text-xs text-brand-slate mt-0.5">{event.notes}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-brand-muted">No timeline events recorded.</p>
                )}
              </div>
            </div>

            {/* Submitted Cover Letter */}
            {selectedApp.cover_letter && (
              <div className="space-y-1.5 pt-2 border-t border-brand-border">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block">
                  Your Cover Letter
                </span>
                <p className="text-xs text-brand-slate whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {selectedApp.cover_letter}
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-4 border-t border-brand-border flex items-center justify-between">
              {selectedApp.status !== "withdrawn" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  leftIcon={<Ban className="w-3.5 h-3.5" />}
                  isLoading={isWithdrawing}
                  onClick={() => handleWithdraw(selectedApp.id)}
                >
                  Withdraw Application
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDetailModalOpen(false)}
                className="ml-auto"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
