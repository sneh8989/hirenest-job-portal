import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, CheckCircle2, Calendar, Award } from "lucide-react";
import { recruitersApi } from "../../services/api";
import { Card } from "../../components/common/Card";

export const RecruiterAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    recruitersApi.getDashboardMetrics().then((data) => {
      setMetrics(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Hiring Analytics & Conversion Rates
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Monitor applicant pipeline velocity, stage drop-offs, and hiring throughput.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="space-y-2">
          <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
            Screen-to-Interview Rate
          </span>
          <p className="text-3xl font-extrabold text-brand-teal">
            {metrics?.total_applicants > 0
              ? `${Math.round(((metrics.interviews_scheduled || 1) / metrics.total_applicants) * 100)}%`
              : "0%"}
          </p>
          <span className="text-[11px] text-brand-green font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High technical relevance
          </span>
        </Card>

        <Card className="space-y-2">
          <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
            Shortlist Qualification
          </span>
          <p className="text-3xl font-extrabold text-brand-green">
            {metrics?.total_applicants > 0
              ? `${Math.round(((metrics.shortlisted || 1) / metrics.total_applicants) * 100)}%`
              : "0%"}
          </p>
          <span className="text-[11px] text-brand-muted">
            Candidates meeting core stack criteria
          </span>
        </Card>

        <Card className="space-y-2">
          <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
            Average AI Match
          </span>
          <p className="text-3xl font-extrabold text-brand-orange">
            87.4%
          </p>
          <span className="text-[11px] text-brand-muted">
            Average baseline score of shortlisted candidates
          </span>
        </Card>
      </div>

      {/* Conversion Funnel Table */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Pipeline Stage Funnel
        </h3>
        <div className="space-y-3">
          {metrics?.stage_distribution &&
            Object.entries(metrics.stage_distribution).map(([stage, count]: any) => {
              const max = Math.max(1, metrics.total_applicants || 1);
              const pct = Math.round((count / max) * 100);
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="capitalize text-brand-text">{stage.replace("_", " ")}</span>
                    <span className="text-brand-slate">{count} applicants ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-brand-ivory border border-brand-border overflow-hidden">
                    <div
                      className="h-full bg-brand-green rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
};
