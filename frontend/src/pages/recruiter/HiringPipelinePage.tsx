import React, { useState, useEffect } from "react";
import {
  GitPullRequest,
  CheckCircle2,
  Calendar,
  FileText,
  User,
  MoreHorizontal,
  ArrowRight,
  MoveRight
} from "lucide-react";
import { recruitersApi, applicationsApi, API_BASE_URL } from "../../services/api";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

interface CandidateCard {
  id: number;
  applicant_id: number;
  candidate_name: string;
  candidate_email: string;
  headline?: string;
  skills?: string[];
  ai_match_score?: number;
  resume_url?: string;
  applied_at: string;
  notes?: string;
}

export const HiringPipelinePage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [board, setBoard] = useState<Record<string, CandidateCard[]>>({
    applied: [],
    under_review: [],
    shortlisted: [],
    interview_scheduled: [],
    selected: [],
    rejected: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [movingId, setMovingId] = useState<number | null>(null);

  useEffect(() => {
    recruitersApi.getJobs().then((data) => {
      setJobs(data);
      if (data.length > 0) setSelectedJobId(data[0].id);
    }).catch(console.error);
  }, []);

  const fetchBoard = async (jobId: number) => {
    setIsLoading(true);
    try {
      const data = await recruitersApi.getPipeline(jobId);
      setBoard(data.board);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      fetchBoard(selectedJobId);
    }
  }, [selectedJobId]);

  const stages = [
    { id: "applied", label: "Applied", color: "border-blue-300" },
    { id: "under_review", label: "Under Review", color: "border-amber-300" },
    { id: "shortlisted", label: "Shortlisted", color: "border-emerald-300" },
    { id: "interview_scheduled", label: "Interview", color: "border-purple-300" },
    { id: "selected", label: "Selected", color: "border-emerald-500" },
    { id: "rejected", label: "Rejected", color: "border-rose-300" },
  ];

  const handleMoveStage = async (appId: number, targetStage: string) => {
    setMovingId(appId);
    try {
      await applicationsApi.updateStatus(appId, targetStage, `Moved to ${targetStage} via Kanban Pipeline.`);
      if (selectedJobId) await fetchBoard(selectedJobId);
    } catch (err) {
      console.error(err);
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            Hiring Pipeline Board
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Visual Kanban workflow. Move candidate cards between stages to record database timeline events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-brand-slate whitespace-nowrap">
            Active Vacancy:
          </label>
          <select
            value={selectedJobId || ""}
            onChange={(e) => setSelectedJobId(parseInt(e.target.value, 10))}
            className="text-xs p-2.5 rounded-lg border border-brand-border bg-white text-brand-text font-medium min-w-[220px] focus-ring"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.applicant_count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Columns */}
      {isLoading ? (
        <Card className="p-12 text-center text-xs text-brand-muted">
          Loading pipeline candidates...
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
          {stages.map((st) => {
            const cards = board[st.id] || [];
            return (
              <div
                key={st.id}
                className="bg-brand-ivory/80 rounded-2xl border border-brand-border p-3 space-y-3 min-w-[200px]"
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                  <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                    {st.label}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-brand-border text-brand-slate">
                    {cards.length}
                  </span>
                </div>

                {/* Cards list */}
                <div className="space-y-2.5 min-h-[120px]">
                  {cards.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-white p-3.5 rounded-xl border border-brand-border shadow-subtle hover:border-brand-green transition-all space-y-2 relative"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-brand-text line-clamp-1">
                          {candidate.candidate_name}
                        </h4>
                        {candidate.ai_match_score && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-mint text-brand-minttext flex-shrink-0">
                            {Math.round(candidate.ai_match_score)}%
                          </span>
                        )}
                      </div>

                      {candidate.headline && (
                        <p className="text-[11px] text-brand-muted line-clamp-2 leading-tight">
                          {candidate.headline}
                        </p>
                      )}

                      {/* Skills */}
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 2).map((sk) => (
                            <span
                              key={sk}
                              className="text-[9px] px-1.5 py-0.2 rounded bg-brand-ivory text-brand-slate border border-brand-border"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Resume link */}
                      {candidate.resume_url && (
                        <a
                          href={`${API_BASE_URL}${candidate.resume_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-brand-green font-medium hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" /> Resume
                        </a>
                      )}

                      {/* Stage transition buttons */}
                      <div className="pt-2 border-t border-brand-border flex items-center justify-between text-[10px]">
                        <span className="text-brand-muted">Move to:</span>
                        <select
                          disabled={movingId === candidate.id}
                          value={st.id}
                          onChange={(e) => handleMoveStage(candidate.id, e.target.value)}
                          className="text-[10px] p-1 rounded border border-brand-border bg-brand-ivory text-brand-teal font-medium focus:outline-none"
                        >
                          {stages.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {cards.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-brand-muted italic">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
