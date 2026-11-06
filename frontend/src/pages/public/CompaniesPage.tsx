import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, MapPin, Users, Globe, ArrowRight } from "lucide-react";
import { companiesApi } from "../../services/api";
import type { Company } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { CardSkeleton } from "../../components/common/Skeleton";

export const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const data = await companiesApi.getCompanies({
          q: searchTerm || undefined,
          industry: industryFilter !== "all" ? industryFilter : undefined,
        });
        setCompanies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [searchTerm, industryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-teal tracking-tight">
          Verified Employer Directory
        </h1>
        <p className="text-sm text-brand-slate mt-1">
          Explore organizations committed to verified hiring standards and career growth.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-brand-border shadow-subtle">
          <Search className="w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company by name..."
            className="w-full text-xs text-brand-text placeholder:text-brand-muted focus:outline-none"
          />
        </div>

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="text-xs p-2.5 bg-white rounded-xl border border-brand-border text-brand-text focus-ring shadow-subtle"
        >
          <option value="all">All Industries</option>
          <option value="Software & Cloud Infrastructure">Software & Cloud</option>
          <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
          <option value="Fintech & Banking">Fintech & Banking</option>
          <option value="DevOps & Platform Engineering">DevOps & Platforms</option>
          <option value="Healthcare & Telemedicine">Healthcare</option>
        </select>
      </div>

      {/* Companies grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((comp) => (
            <Card
              key={comp.id}
              hoverable
              onClick={() => navigate(`/companies/${comp.id}`)}
              className="cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal text-white flex items-center justify-center font-bold text-lg">
                    {comp.name.charAt(0)}
                  </div>
                  {comp.is_verified ? (
                    <Badge variant="verified" size="sm">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="pending" size="sm">
                      Pending
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-brand-text hover:text-brand-green transition-colors">
                    {comp.name}
                  </h3>
                  <p className="text-xs text-brand-muted font-medium mt-0.5">
                    {comp.industry || "Technology"}
                  </p>
                </div>

                <p className="text-xs text-brand-slate line-clamp-3 leading-relaxed">
                  {comp.description || "Leading innovator hiring across high-impact teams."}
                </p>
              </div>

              <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {comp.headquarters || "USA"}
                </span>
                <span className="text-brand-green font-medium flex items-center gap-1">
                  View Profile <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
