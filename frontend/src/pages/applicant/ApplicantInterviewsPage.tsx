import React, { useState, useEffect } from "react";
import { Calendar, Clock, Video, MapPin, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { interviewsApi } from "../../services/api";
import type { Interview } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";

export const ApplicantInterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const data = await interviewsApi.getMyInterviews();
      setInterviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleRespond = async (id: number, action: "accept" | "decline") => {
    try {
      await interviewsApi.respond(id, action);
      await fetchInterviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Interview Schedule
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Review upcoming conversations, access secure video links, and manage invitation responses.
        </p>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-xs text-brand-muted">
          Loading interview schedule...
        </Card>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title="No interviews scheduled yet"
          description="When recruiters review and shortlist your submissions, scheduled video or on-site invitations will appear here."
          actionText="View Applications"
          onAction={() => (window.location.href = "/applicant/applications")}
        />
      ) : (
        <div className="space-y-4">
          {interviews.map((item) => (
            <Card key={item.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-brand-border">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.status === "accepted"
                          ? "published"
                          : item.status === "declined"
                          ? "rejected"
                          : item.status === "completed"
                          ? "selected"
                          : "pending"
                      }
                      size="sm"
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-brand-muted font-medium">
                      {item.job?.company?.name}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-brand-text mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-slate font-medium">
                    Position: {item.job?.title}
                  </p>
                </div>

                {/* Date & Time pill */}
                <div className="p-3 bg-brand-ivory rounded-xl border border-brand-border flex items-center gap-3 text-xs">
                  <Calendar className="w-4 h-4 text-brand-green" />
                  <div>
                    <span className="font-bold text-brand-teal block">
                      {item.interview_date}
                    </span>
                    <span className="text-[11px] text-brand-muted block">
                      {item.start_time} ({item.timezone}) • {item.duration_minutes} mins
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {item.instructions && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-brand-slate space-y-1">
                  <span className="font-bold text-brand-teal block">Instructions from Hiring Team:</span>
                  <p>{item.instructions}</p>
                </div>
              )}

              {/* Meeting link and actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div>
                  {item.mode === "online" ? (
                    item.meeting_link ? (
                      <a
                        href={item.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:underline"
                      >
                        <Video className="w-4 h-4" /> Join Video Meeting ({item.meeting_link})
                      </a>
                    ) : (
                      <span className="text-xs text-brand-muted flex items-center gap-1">
                        <Video className="w-4 h-4" /> Video link will be activated prior to call
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-brand-slate flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-brand-orange" /> In-person location: {item.location || "Office"}
                    </span>
                  )}
                </div>

                {/* Respond actions if pending */}
                {item.status === "scheduled" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRespond(item.id, "decline")}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRespond(item.id, "accept")}
                    >
                      Accept Invitation
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
