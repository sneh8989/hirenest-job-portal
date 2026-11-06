import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  Bookmark,
  Share2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  Upload,
  FileText
} from "lucide-react";
import { jobsApi, applicationsApi, applicantsApi, aiApi } from "../../services/api";
import type { Job, AIMatchResult } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Card } from "../../components/common/Card";
import { Modal } from "../../components/common/Modal";

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [aiMatch, setAiMatch] = useState<AIMatchResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applicantNotes, setApplicantNotes] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("misleading");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await jobsApi.getJob(parseInt(id, 10));
        setJob(data);

        // If applicant is logged in, check if saved or applied, and calculate AI score
        if (isAuthenticated && user?.role === "applicant") {
          try {
            // Check saved
            const savedList = await applicantsApi.getSavedJobs();
            setIsSaved(savedList.some((s) => s.job_id === data.id));

            // Check applied
            const myApps = await applicationsApi.getMyApplications();
            setHasApplied(myApps.some((a) => a.job_id === data.id));

            // Calculate AI match score
            setIsAiLoading(true);
            const matchRes = await aiApi.getMatchScore(data.id);
            setAiMatch(matchRes);
          } catch (err) {
            console.error("AI match calculation error:", err);
          } finally {
            setIsAiLoading(false);
          }
        }
      } catch (err) {
        console.error("Failed to load job details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated, user]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!job) return;
    try {
      const res = await applicantsApi.toggleSaveJob(job.id);
      setIsSaved(res.saved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setIsApplying(true);
    setApplyError("");
    try {
      await applicationsApi.apply({
        job_id: job.id,
        cover_letter: coverLetter,
        applicant_notes: applicantNotes,
      });
      setApplySuccess(true);
      setHasApplied(true);
      setTimeout(() => {
        setApplyModalOpen(false);
        setApplySuccess(false);
      }, 2000);
    } catch (err: any) {
      setApplyError(err.response?.data?.detail || "Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    try {
      await jobsApi.reportJob(job.id, reportReason, reportDetails);
      setReportSubmitted(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSubmitted(false);
        setReportDetails("");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-brand-green border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-brand-text">Vacancy not found</h2>
        <p className="text-sm text-brand-muted">The job listing may have expired or been removed.</p>
        <Button variant="primary" onClick={() => navigate("/jobs")}>
          Return to Job Search
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-brand-slate hover:text-brand-text font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      {/* Header Banner Card */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-brand-ivory border border-brand-border flex items-center justify-center font-bold text-brand-teal text-xl">
              {job.company?.name?.charAt(0) || "C"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                  {job.department || job.category}
                </span>
                {job.company?.is_verified && (
                  <Badge variant="verified" size="sm">
                    Verified Employer
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-teal tracking-tight">
                {job.title}
              </h1>
              <p className="text-sm font-medium text-brand-slate">
                <Link to={`/companies/${job.company?.id}`} className="hover:text-brand-green transition-colors">
                  {job.company?.name}
                </Link>{" "}
                • {job.location}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Bookmark className={`w-4 h-4 ${isSaved ? "fill-brand-orange text-brand-orange" : ""}`} />}
              onClick={handleToggleSave}
            >
              {isSaved ? "Saved" : "Save Job"}
            </Button>

            {hasApplied ? (
              <Button variant="secondary" size="md" disabled leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}>
                Applied
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                  } else {
                    setApplyModalOpen(true);
                  }
                }}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-brand-border text-xs">
          <div>
            <span className="text-brand-muted block font-medium">Work Arrangement</span>
            <span className="font-semibold text-brand-text">{job.work_arrangement}</span>
          </div>
          <div>
            <span className="text-brand-muted block font-medium">Employment Type</span>
            <span className="font-semibold text-brand-text">{job.employment_type}</span>
          </div>
          <div>
            <span className="text-brand-muted block font-medium">Experience Level</span>
            <span className="font-semibold text-brand-text">{job.experience_level}</span>
          </div>
          <div>
            <span className="text-brand-muted block font-medium">Offered Compensation</span>
            <span className="font-semibold text-brand-teal">
              {job.min_salary && job.max_salary
                ? `$${(job.min_salary / 1000).toFixed(0)}k - $${(job.max_salary / 1000).toFixed(0)}k ${job.currency}`
                : "Competitive"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Job Details vs Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Job Description and Requirements */}
        <div className="lg:col-span-8 space-y-8">
          {/* Description */}
          <Card className="space-y-4">
            <h2 className="text-base font-bold text-brand-teal uppercase tracking-wider">
              About the Role
            </h2>
            <div className="text-sm text-brand-slate leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </Card>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <Card className="space-y-4">
              <h2 className="text-base font-bold text-brand-teal uppercase tracking-wider">
                Key Responsibilities
              </h2>
              <ul className="space-y-2.5 text-sm text-brand-slate">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <Card className="space-y-4">
              <h2 className="text-base font-bold text-brand-teal uppercase tracking-wider">
                Qualifications & Prerequisites
              </h2>
              <ul className="space-y-2.5 text-sm text-brand-slate">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Skills Required & Preferred */}
          <Card className="space-y-4">
            <h2 className="text-base font-bold text-brand-teal uppercase tracking-wider">
              Technical Skill Profile
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-brand-muted block mb-1.5">
                  Core Required Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills_required?.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-brand-ivory text-brand-teal border border-brand-border"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {job.skills_preferred && job.skills_preferred.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-brand-muted block mb-1.5">
                    Preferred / Secondary Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills_preferred.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-brand-slate border border-gray-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Match Score & Company Overview */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Match Score Card */}
          <Card className="border-brand-green/30 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                  AI Fit Assessment
                </h3>
              </div>
              <span className="text-[10px] text-brand-muted font-medium">Deterministic Baseline</span>
            </div>

            {isAiLoading ? (
              <div className="py-6 flex flex-col items-center gap-2">
                <div className="animate-spin w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full" />
                <span className="text-xs text-brand-muted">Evaluating skill alignment...</span>
              </div>
            ) : aiMatch ? (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-brand-teal">
                    {aiMatch.match_score}%
                  </span>
                  <Badge variant={aiMatch.match_score >= 80 ? "published" : "under_review"} size="sm">
                    {aiMatch.rating_category}
                  </Badge>
                </div>

                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-brand-green rounded-full transition-all duration-500"
                    style={{ width: `${aiMatch.match_score}%` }}
                  />
                </div>

                <p className="text-xs text-brand-slate leading-relaxed">
                  {aiMatch.explanation}
                </p>

                {aiMatch.matching_skills?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-brand-muted block">
                      Matching Skills ({aiMatch.matching_skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {aiMatch.matching_skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-mint text-brand-minttext">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {aiMatch.missing_required_skills?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-brand-muted block">
                      Skills to Review
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {aiMatch.missing_required_skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          ! {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  to={`/applicant/skill-gap?job_id=${job.id}`}
                  className="inline-flex items-center gap-1 text-xs text-brand-green font-semibold hover:underline pt-1"
                >
                  Open Skill Gap Analyzer Roadmap →
                </Link>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-brand-slate">
                <p>
                  Sign in as a Job Seeker to instantly evaluate your profile fit against this role's required skills.
                </p>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In to Check Match
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Company Summary Card */}
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              About {job.company?.name}
            </h3>
            <p className="text-xs text-brand-slate leading-relaxed">
              {job.company?.description || "An innovative organisation dedicated to high-performing product engineering."}
            </p>
            <div className="space-y-2 text-xs pt-2 border-t border-brand-border">
              <div className="flex justify-between">
                <span className="text-brand-muted">Industry</span>
                <span className="font-semibold text-brand-text">{job.company?.industry || "Technology"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Headquarters</span>
                <span className="font-semibold text-brand-text">{job.company?.headquarters || "USA"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Company Size</span>
                <span className="font-semibold text-brand-text">{job.company?.size || "50-200"} Employees</span>
              </div>
            </div>
            {job.company?.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-xs text-brand-green font-medium hover:underline pt-2"
              >
                Visit Company Website ↗
              </a>
            )}
          </Card>

          {/* Report Job Listing */}
          <div className="text-center">
            <button
              onClick={() => setReportModalOpen(true)}
              className="text-[11px] text-brand-muted hover:text-rose-600 transition-colors inline-flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Report suspicious listing
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: APPLICATION SUBMISSION MODAL */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
        description={`Submit your verified credentials to ${job.company?.name}.`}
        maxWidth="lg"
      >
        {applySuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-brand-mint text-brand-green rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-brand-text">Application Submitted!</h4>
            <p className="text-xs text-brand-slate">
              Your application has been received and added to your application tracking timeline.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4">
            {applyError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {applyError}
              </div>
            )}

            <div className="p-3 bg-brand-ivory rounded-xl border border-brand-border space-y-1 text-xs">
              <span className="font-semibold text-brand-teal">Application Profile</span>
              <p className="text-brand-slate">
                Your recorded profile skills, education, and active resume will be submitted to the hiring team.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Custom Cover Letter (Optional)
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Introduce yourself and explain why your experience fits this vacancy..."
                className="w-full text-xs p-3 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Notes for Recruiter (Optional)
              </label>
              <input
                type="text"
                value={applicantNotes}
                onChange={(e) => setApplicantNotes(e.target.value)}
                placeholder="Notice period, availability for interviews, or portfolio links..."
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setApplyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isApplying}>
                Confirm Submission
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 2: REPORT JOB MODAL */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Job Posting"
        description="Help us maintain platform safety by reporting misleading or abusive content."
        maxWidth="md"
      >
        {reportSubmitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-brand-green mx-auto" />
            <p className="text-xs text-brand-text font-semibold">Report received.</p>
            <p className="text-[11px] text-brand-muted">
              Platform moderators will investigate this vacancy.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Reason for reporting
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              >
                <option value="misleading">Misleading or false information</option>
                <option value="spam">Spam or duplicate posting</option>
                <option value="suspicious_listing">Suspicious or fraudulent activity</option>
                <option value="inappropriate">Inappropriate or discriminatory content</option>
                <option value="other">Other policy concern</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Additional Details
              </label>
              <textarea
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Provide specifics to assist moderation review..."
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm">
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
