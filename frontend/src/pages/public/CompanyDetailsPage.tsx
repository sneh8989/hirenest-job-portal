import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Mail,
  ArrowLeft,
  ArrowRight,
  Briefcase
} from "lucide-react";
import { companiesApi } from "../../services/api";
import type { Company, Job } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await companiesApi.getCompany(parseInt(id, 10));
        setCompany(data.company);
        setJobs(data.jobs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-brand-green border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-brand-text">Company not found</h2>
        <Button variant="primary" onClick={() => navigate("/companies")}>
          Return to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-brand-slate hover:text-brand-text font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to companies
      </button>

      {/* Profile Banner */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-teal text-white flex items-center justify-center font-bold text-2xl">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
                  {company.name}
                </h1>
                {company.is_verified && (
                  <Badge variant="verified" size="sm">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-brand-muted font-medium mt-0.5">
                {company.industry || "Technology"}
              </p>
            </div>
          </div>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-brand-green font-semibold hover:underline"
            >
              <Globe className="w-4 h-4" /> {company.website.replace("https://", "")}
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-brand-border text-xs">
          <div>
            <span className="text-brand-muted block font-medium">Headquarters</span>
            <span className="font-semibold text-brand-text">{company.headquarters || "USA"}</span>
          </div>
          <div>
            <span className="text-brand-muted block font-medium">Company Size</span>
            <span className="font-semibold text-brand-text">{company.size || "50-200"} Employees</span>
          </div>
          <div>
            <span className="text-brand-muted block font-medium">Open Positions</span>
            <span className="font-semibold text-brand-green">{jobs.length} Active</span>
          </div>
          <div>
            <span className="text-brand-muted block font-medium">Contact</span>
            <span className="font-semibold text-brand-text truncate block">{company.contact_email || "careers@company.com"}</span>
          </div>
        </div>
      </div>

      {/* Company Bio */}
      <Card className="space-y-3">
        <h2 className="text-sm font-bold text-brand-teal uppercase tracking-wider">
          Company Overview
        </h2>
        <p className="text-sm text-brand-slate leading-relaxed">
          {company.description || "Leading innovator hiring across high-impact teams."}
        </p>
      </Card>

      {/* Active Jobs by this Company */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-brand-teal tracking-tight">
          Current Openings at {company.name} ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <Card className="text-center py-8 text-xs text-brand-muted">
            There are currently no published openings for this company.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((j) => (
              <Card
                key={j.id}
                hoverable
                onClick={() => navigate(`/jobs/${j.id}`)}
                className="cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-brand-text hover:text-brand-green transition-colors">
                      {j.title}
                    </h3>
                    <Badge variant={j.work_arrangement === "Remote" ? "published" : "neutral"} size="sm">
                      {j.work_arrangement}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-muted">
                    {j.department || "General"} • {j.location} • {j.experience_level}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-teal">
                    {j.min_salary && j.max_salary
                      ? `$${(j.min_salary / 1000).toFixed(0)}k - $${(j.max_salary / 1000).toFixed(0)}k`
                      : "Competitive"}
                  </span>
                  <span className="text-brand-green font-medium flex items-center gap-1">
                    Apply <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
