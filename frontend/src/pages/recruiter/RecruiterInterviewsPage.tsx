import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Plus,
  CheckCircle2,
  XCircle,
  Star,
  ExternalLink
} from "lucide-react";
import { interviewsApi, applicationsApi, recruitersApi } from "../../services/api";
import type { Interview, Application } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";

export const RecruiterInterviewsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preAppId = searchParams.get("app_id");

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Schedule Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string>(preAppId || "");
  const [title, setTitle] = useState("Technical Assessment Interview");
  const [interviewDate, setInterviewDate] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [duration, setDuration] = useState(45);
  const [timezone, setTimezone] = useState("UTC");
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/new");
  const [location, setLocation] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback Modal
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const data = await interviewsApi.getMyInterviews();
      setInterviews(data);

      // Also fetch recruiter's applications for scheduling dropdown
      const allJobs = await recruitersApi.getJobs();
      let apps: Application[] = [];
      for (const j of allJobs.slice(0, 5)) {
        const jApps = await applicationsApi.getJobApplications(j.id);
        apps = apps.concat(jApps);
      }
      setApplications(apps);
      if (preAppId) setScheduleModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) return;
    setIsSubmitting(true);
    try {
      await interviewsApi.schedule({
        application_id: parseInt(selectedAppId, 10),
        title,
        interview_date: interviewDate,
        start_time: startTime,
        duration_minutes: duration,
        timezone,
        mode,
        meeting_link: mode === "online" ? meetingLink : undefined,
        location: mode === "offline" ? location : undefined,
        instructions,
      });
      setScheduleModalOpen(false);
      await fetchInterviews();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInterview) return;
    setIsCompleting(true);
    try {
      await interviewsApi.updateStatus(activeInterview.id, {
        status: "completed",
        feedback: feedbackText,
        rating,
      });
      setFeedbackModalOpen(false);
      await fetchInterviews();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            Interview Management
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Schedule candidate conversations, provide meeting links, and record evaluation notes.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setScheduleModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Schedule Interview
        </Button>
      </div>

      {/* Interviews list */}
      {isLoading ? (
        <Card className="p-8 text-center text-xs text-brand-muted">
          Loading scheduled interviews...
        </Card>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title="No interviews scheduled"
          description="Select shortlisted candidates from your applicant pool to initiate video or on-site interviews."
          actionText="Schedule Interview"
          onAction={() => setScheduleModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {interviews.map((item) => (
            <Card key={item.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-brand-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === "completed" ? "selected" : item.status} size="sm">
                      {item.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-semibold text-brand-muted">
                      {item.job?.title}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-brand-text">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-slate font-medium">
                    Candidate: {item.applicant?.full_name} ({item.applicant?.email})
                  </p>
                </div>

                <div className="p-3 bg-brand-ivory rounded-xl border border-brand-border flex items-center gap-3 text-xs">
                  <Calendar className="w-4 h-4 text-brand-green" />
                  <div>
                    <span className="font-bold text-brand-teal block">{item.interview_date}</span>
                    <span className="text-[11px] text-brand-muted block">
                      {item.start_time} ({item.timezone}) • {item.duration_minutes} mins
                    </span>
                  </div>
                </div>
              </div>

              {/* Links & actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  {item.mode === "online" ? (
                    <a
                      href={item.meeting_link || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-brand-green hover:underline"
                    >
                      <Video className="w-4 h-4" /> Meeting Link: {item.meeting_link}
                    </a>
                  ) : (
                    <span className="text-brand-slate flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-brand-orange" /> In-person: {item.location}
                    </span>
                  )}
                </div>

                {item.status !== "completed" && item.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveInterview(item);
                      setFeedbackModalOpen(true);
                    }}
                  >
                    Record Completion & Feedback
                  </Button>
                )}
              </div>

              {/* Feedback notes if completed */}
              {item.recruiter_feedback && (
                <div className="p-3 bg-brand-mint/40 rounded-xl border border-[#BDE6D2] text-xs text-brand-teal space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Evaluation Feedback:</span>
                    {item.rating && (
                      <span className="text-[11px] font-bold text-brand-orange">
                        ★ {item.rating}/5 Score
                      </span>
                    )}
                  </div>
                  <p>{item.recruiter_feedback}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Candidate Interview"
        description="Notify the candidate and create synchronized calendar details."
        maxWidth="lg"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Candidate & Vacancy *
            </label>
            <select
              required
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
            >
              <option value="">Select Candidate Application...</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.applicant?.full_name} — {app.job?.title} ({app.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Interview Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Technical System Architecture Panel"
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Time (HH:MM) *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Interview Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
              >
                <option value="online">Online Video Meeting</option>
                <option value="offline">In-Person On-site</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                {mode === "online" ? "Meeting URL" : "Physical Location"}
              </label>
              <input
                type="text"
                value={mode === "online" ? meetingLink : location}
                onChange={(e) =>
                  mode === "online" ? setMeetingLink(e.target.value) : setLocation(e.target.value)
                }
                placeholder={mode === "online" ? "https://meet.google.com/..." : "Room 402, 100 Main St"}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Instructions for Candidate (Optional)
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please bring code samples or prepare to discuss distributed caching tradeoffs..."
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Schedule & Notify Candidate
            </Button>
          </div>
        </form>
      </Modal>

      {/* COMPLETE INTERVIEW MODAL */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title="Record Interview Completion"
        description="Document hiring assessment notes and ratings."
        maxWidth="md"
      >
        <form onSubmit={handleCompleteSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Candidate Rating (1 - 5 Stars)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
            >
              <option value={5}>5 Stars - Exceptional Technical Fit</option>
              <option value={4}>4 Stars - Strong Competency</option>
              <option value={3}>3 Stars - Met Core Requirements</option>
              <option value={2}>2 Stars - Below Target Standard</option>
              <option value={1}>1 Star - Unsatisfactory</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Evaluation Feedback Notes
            </label>
            <textarea
              rows={4}
              required
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Document problem-solving methodology, communication, and recommendation..."
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-brand-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setFeedbackModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isCompleting}>
              Save Completion
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
