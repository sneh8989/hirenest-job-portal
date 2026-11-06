import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Code,
  Clock,
  ArrowRight,
  Briefcase,
  Layers,
  ChevronRight
} from "lucide-react";
import { jobsApi, aiApi } from "../../services/api";
import type { Job, SkillGapResult } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const SkillGapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get("job_id");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(
    initialJobId ? parseInt(initialJobId, 10) : null
  );
  const [analysis, setAnalysis] = useState<SkillGapResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Load available published jobs to select from
  useEffect(() => {
    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        const res = await jobsApi.listJobs({ size: 20 });
        setJobs(res.items || []);
        if (!selectedJobId && res.items?.length > 0) {
          setSelectedJobId(res.items[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Run skill gap analysis whenever selectedJobId changes
  useEffect(() => {
    if (!selectedJobId) return;

    const runAnalysis = async () => {
      setIsLoading(true);
      try {
        const result = await aiApi.getSkillGap(selectedJobId);
        setAnalysis(result);
      } catch (err) {
        console.error("Skill gap analysis failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    runAnalysis();
  }, [selectedJobId]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint text-brand-minttext text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
          <span>Deterministic Technical Ontology Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-teal tracking-tight">
          AI Skill Gap Analyzer & Learning Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
          Compare your recorded profile competencies against specific job requirements. Identify missing prerequisites and follow a prioritized technical learning roadmap.
        </p>
      </div>

      {/* Target Job Selector Card */}
      <Card className="p-5 space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-brand-teal block">
          Target Job Vacancy to Analyze
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedJobId || ""}
            onChange={(e) => setSelectedJobId(parseInt(e.target.value, 10))}
            className="flex-1 text-xs p-3 rounded-xl border border-brand-border bg-brand-ivory text-brand-text font-medium focus-ring"
            disabled={jobsLoading}
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} — {j.company?.name} ({j.work_arrangement})
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Analysis Results Display */}
      {isLoading ? (
        <Card className="p-12 text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-3 border-brand-green border-t-transparent rounded-full mx-auto" />
          <p className="text-xs font-semibold text-brand-teal">
            Synthesizing skill matrices and curriculum dependencies...
          </p>
        </Card>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Match Score & Summary Banner */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                Overall Match
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-brand-teal">
                  {analysis.overall_match_percentage}%
                </span>
                <span className="text-xs text-brand-green font-semibold">
                  {analysis.overall_match_percentage >= 75
                    ? "Strong Candidate"
                    : analysis.overall_match_percentage >= 50
                    ? "Moderate Alignment"
                    : "Targeted Ramp-Up Needed"}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mt-2">
                <div
                  className="h-full bg-brand-green rounded-full transition-all duration-500"
                  style={{ width: `${analysis.overall_match_percentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-brand-border md:pl-6 pt-4 md:pt-0">
              <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                Estimated Ramp-Up Time
              </span>
              <p className="text-sm font-bold text-brand-text">
                {analysis.estimated_time_to_ready}
              </p>
              <span className="text-[11px] text-brand-muted">
                Based on active skill gap size
              </span>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-brand-border md:pl-6 pt-4 md:pt-0">
              <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                Analysis Engine
              </span>
              <p className="text-xs font-medium text-brand-teal">
                {analysis.provider}
              </p>
              <span className="text-[10px] text-brand-muted block">
                Explainable, transparent rules
              </span>
            </div>
          </div>

          {/* Skills Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Possessed Skills */}
            <Card className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text">
                  Demonstrated Competencies ({analysis.skills_possessed.length})
                </h3>
              </div>
              <p className="text-xs text-brand-muted">
                Skills found in your profile that satisfy the job's stated requirements.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.skills_possessed.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-mint text-brand-minttext border border-[#BDE6D2]"
                  >
                    ✓ {s}
                  </span>
                ))}
                {analysis.skills_possessed.length === 0 && (
                  <span className="text-xs text-brand-muted italic">None yet recorded.</span>
                )}
              </div>
            </Card>

            {/* Skills to Acquire */}
            <Card className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
                <AlertCircle className="w-4 h-4 text-brand-orange" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text">
                  Skills to Acquire or Emphasize ({analysis.skills_to_acquire.length})
                </h3>
              </div>
              <p className="text-xs text-brand-muted">
                Requirements missing from your profile. Prioritized below in your study roadmap.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.skills_to_acquire.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-brand-orange border border-orange-200"
                  >
                    ! {s}
                  </span>
                ))}
                {analysis.skills_to_acquire.length === 0 && (
                  <span className="text-xs text-emerald-700 font-medium">
                    You satisfy 100% of recorded skill requirements!
                  </span>
                )}
              </div>
            </Card>
          </div>

          {/* Prioritized Learning Roadmap */}
          {analysis.learning_roadmap && analysis.learning_roadmap.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-brand-teal tracking-tight">
                    Actionable Learning Roadmap
                  </h3>
                  <p className="text-xs text-brand-muted">
                    Curated resources and recommended project architectures to close each gap.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {analysis.learning_roadmap.map((task, idx) => (
                  <Card key={idx} className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-ivory border border-brand-border flex items-center justify-center font-bold text-brand-teal text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-brand-text">
                            Learn & Apply: {task.skill}
                          </h4>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              task.priority === "High"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {task.priority} Priority Requirement
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-brand-green" /> Recommended Curated Resources
                      </span>
                      <ul className="space-y-1 pl-5 list-disc text-xs text-brand-slate">
                        {task.learning_resources.map((res, rIdx) => (
                          <li key={rIdx}>{res}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Project */}
                    <div className="bg-brand-ivory p-3.5 rounded-xl border border-brand-border space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-brand-orange" /> Portfolio Project Idea
                      </span>
                      <p className="text-xs text-brand-slate leading-relaxed">
                        {task.recommended_project}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
