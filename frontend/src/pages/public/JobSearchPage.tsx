import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Filter,
  X,
  Briefcase,
  Building2,
  DollarSign,
  Calendar,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { jobsApi } from "../../services/api";
import type { Job } from "../../types";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { CardSkeleton } from "../../components/common/Skeleton";
import { EmptyState } from "../../components/common/EmptyState";

export const JobSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states initialized from URL params
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [workArrangement, setWorkArrangement] = useState(searchParams.get("work_arrangement") || "all");
  const [employmentType, setEmploymentType] = useState(searchParams.get("employment_type") || "all");
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get("experience_level") || "all");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "latest");
  const [minSalary, setMinSalary] = useState(searchParams.get("min_salary") || "");

  const [categoriesList, setCategoriesList] = useState<{ category: string; count: number }[]>([]);

  useEffect(() => {
    jobsApi.getCategories().then(setCategoriesList).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, any> = {
          page,
          size: 9,
          sort_by: sortBy,
        };
        if (q) params.q = q;
        if (location) params.location = location;
        if (workArrangement !== "all") params.work_arrangement = workArrangement;
        if (employmentType !== "all") params.employment_type = employmentType;
        if (experienceLevel !== "all") params.experience_level = experienceLevel;
        if (category !== "all") params.category = category;
        if (minSalary) params.min_salary = parseInt(minSalary, 10);

        const res = await jobsApi.listJobs(params);
        setJobs(res.items || []);
        setTotal(res.total || 0);
        setTotalPages(res.pages || 1);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [q, location, workArrangement, employmentType, experienceLevel, category, sortBy, minSalary, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearAllFilters = () => {
    setQ("");
    setLocation("");
    setWorkArrangement("all");
    setEmploymentType("all");
    setExperienceLevel("all");
    setCategory("all");
    setMinSalary("");
    setSortBy("latest");
    setPage(1);
    setSearchParams({});
  };

  const activeFilterCount =
    (q ? 1 : 0) +
    (location ? 1 : 0) +
    (workArrangement !== "all" ? 1 : 0) +
    (employmentType !== "all" ? 1 : 0) +
    (experienceLevel !== "all" ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (minSalary ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-teal tracking-tight">
            Explore Open Vacancies
          </h1>
          <p className="text-sm text-brand-slate mt-1">
            Search verified opportunities across high-impact product and engineering teams.
          </p>
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-2.5 rounded-2xl border border-brand-border shadow-subtle flex flex-col sm:flex-row gap-2"
        >
          <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-brand-border">
            <Search className="w-4 h-4 text-brand-muted" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, skill, or keyword..."
              className="w-full text-sm placeholder:text-brand-muted focus:outline-none"
            />
          </div>

          <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-brand-border">
            <MapPin className="w-4 h-4 text-brand-muted" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, region, or 'Remote'..."
              className="w-full text-sm placeholder:text-brand-muted focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" size="md">
            Filter Jobs
          </Button>
        </form>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="bg-white rounded-2xl border border-brand-border p-5 space-y-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-green" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text">
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-brand-orange hover:underline font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Work Arrangement */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">
              Work Arrangement
            </label>
            <div className="space-y-1.5">
              {[
                { id: "all", label: "All Arrangements" },
                { id: "Remote", label: "Remote Only" },
                { id: "Hybrid", label: "Hybrid" },
                { id: "On-site", label: "On-site" },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 text-xs text-brand-text cursor-pointer">
                  <input
                    type="radio"
                    name="arrangement"
                    checked={workArrangement === opt.id}
                    onChange={() => {
                      setWorkArrangement(opt.id);
                      setPage(1);
                    }}
                    className="text-brand-green focus:ring-brand-green h-3.5 w-3.5"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-brand-border bg-brand-ivory text-brand-text focus-ring"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => {
                setExperienceLevel(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-brand-border bg-brand-ivory text-brand-text focus-ring"
            >
              <option value="all">Any Experience Level</option>
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">
              Employment Type
            </label>
            <select
              value={employmentType}
              onChange={(e) => {
                setEmploymentType(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-brand-border bg-brand-ivory text-brand-text focus-ring"
            >
              <option value="all">Any Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Min Salary Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">
              Min Annual Salary ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 100000"
              value={minSalary}
              onChange={(e) => {
                setMinSalary(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg border border-brand-border bg-brand-ivory text-brand-text focus-ring"
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Status bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-brand-border gap-2">
            <span className="text-xs font-semibold text-brand-slate">
              Showing {jobs.length} of {total} open vacancies
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-brand-muted">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="text-xs bg-white border border-brand-border rounded-md px-2 py-1 text-brand-text font-medium focus-ring"
              >
                <option value="latest">Latest Published</option>
                <option value="salary_desc">Highest Salary</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Jobs Listing */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No vacancies match your criteria"
              description="Try broadening your search term or clearing active filters to see more opportunities."
              actionText="Clear All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  hoverable
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-brand-ivory border border-brand-border flex items-center justify-center font-bold text-brand-teal text-sm">
                          {job.company?.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-brand-text hover:text-brand-green transition-colors line-clamp-1">
                            {job.title}
                          </h3>
                          <p className="text-xs text-brand-muted font-medium">
                            {job.company?.name} • {job.location}
                          </p>
                        </div>
                      </div>
                      <Badge variant={job.work_arrangement === "Remote" ? "published" : "neutral"} size="sm">
                        {job.work_arrangement}
                      </Badge>
                    </div>

                    <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1">
                      {job.skills_required?.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-ivory text-brand-slate border border-brand-border"
                        >
                          {s}
                        </span>
                      ))}
                      {(job.skills_required?.length || 0) > 3 && (
                        <span className="text-[10px] text-brand-muted self-center">
                          +{job.skills_required.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-brand-border flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-teal">
                      {job.min_salary && job.max_salary
                        ? `$${(job.min_salary / 1000).toFixed(0)}k - $${(job.max_salary / 1000).toFixed(0)}k`
                        : "Competitive"}
                    </span>
                    <span className="text-brand-green font-medium flex items-center gap-1">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-brand-slate font-medium px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
