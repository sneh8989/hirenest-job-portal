import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  Clock,
  Compass,
  FileCheck
} from "lucide-react";
import { jobsApi, companiesApi } from "../../services/api";
import type { Job, Company } from "../../types";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { CardSkeleton } from "../../components/common/Skeleton";

export const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [jobsRes, catRes, compRes] = await Promise.all([
          jobsApi.listJobs({ size: 6 }),
          jobsApi.getCategories(),
          companiesApi.getCompanies({}),
        ]);
        setFeaturedJobs(jobsRes.items || []);
        setCategories(catRes || []);
        setCompanies((compRes || []).slice(0, 4));
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (locationTerm.trim()) params.set("location", locationTerm.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-8 md:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint text-brand-minttext text-xs font-semibold tracking-wide border border-[#BDE6D2]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Employers & Intelligent Skill Matching</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-teal tracking-tight leading-[1.15]">
                Find the Right Job, <span className="text-brand-green">Faster.</span>
              </h1>

              <p className="text-base sm:text-lg text-brand-slate max-w-xl leading-relaxed">
                Discover opportunities that match your skills, connect directly with hiring managers, and take the next intentional step in your career.
              </p>

              {/* Live Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-card border border-brand-border flex flex-col sm:flex-row gap-2 max-w-2xl"
              >
                <div className="flex-1 flex items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-brand-border">
                  <Search className="w-5 h-5 text-brand-muted flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Job title, skill, or keyword..."
                    className="w-full text-sm text-brand-text placeholder:text-brand-muted focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
                  <MapPin className="w-5 h-5 text-brand-muted flex-shrink-0" />
                  <input
                    type="text"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    placeholder="Location or 'Remote'..."
                    className="w-full text-sm text-brand-text placeholder:text-brand-muted focus:outline-none"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" className="sm:px-6">
                  Search Jobs
                </Button>
              </form>

              {/* Popular Category Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-brand-slate pt-1">
                <span className="font-medium text-brand-muted">Popular:</span>
                {["Engineering", "Remote", "Design", "AI & Data Science", "Fintech"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/jobs?q=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-full bg-white border border-brand-border hover:border-brand-green hover:text-brand-green transition-colors text-xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Hero Feature Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-2xl border border-brand-border shadow-elevated p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-mint text-brand-minttext flex items-center justify-center font-bold text-xs">
                      AI
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-text">Skill Gap Analyzer</h4>
                      <p className="text-[11px] text-brand-muted">Deterministic Match Technology</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-brand-mint text-brand-minttext text-[10px] font-bold">
                    94.5% Match
                  </span>
                </div>

                {/* Match bar demo */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-brand-slate">Applicant: Alex Rivera</span>
                    <span className="text-brand-green font-semibold">High Technical Fit</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: "94.5%" }} />
                  </div>
                </div>

                {/* Matching skills pills */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium text-brand-muted uppercase tracking-wider">
                    Demonstrated Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker"].map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded bg-brand-ivory text-brand-teal text-[11px] font-medium border border-brand-border"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verified employer banner */}
                <div className="bg-brand-ivory rounded-xl p-3 border border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-teal" />
                    <span className="text-xs font-semibold text-brand-text">TechPulse Innovations</span>
                  </div>
                  <Badge variant="verified" size="sm">
                    Verified
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED VACANCIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-teal tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-sm text-brand-slate mt-1">
              Curated positions from verified employers actively interviewing this week.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Openings
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <Card
                key={job.id}
                hoverable
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-ivory border border-brand-border flex items-center justify-center font-bold text-brand-teal text-sm">
                      {job.company?.name?.charAt(0) || "C"}
                    </div>
                    <Badge variant={job.work_arrangement === "Remote" ? "published" : "neutral"} size="sm">
                      {job.work_arrangement}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-brand-text hover:text-brand-green transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-brand-muted mt-0.5 font-medium">
                      {job.company?.name} • {job.location}
                    </p>
                  </div>

                  <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-brand-border flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-teal">
                    {job.min_salary && job.max_salary
                      ? `$${(job.min_salary / 1000).toFixed(0)}k - $${(job.max_salary / 1000).toFixed(0)}k`
                      : "Competitive Salary"}
                  </span>
                  <span className="text-xs text-brand-green font-medium flex items-center gap-1 group">
                    Apply <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="bg-white py-14 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-teal tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm text-brand-slate mt-1">
              Find vacancies organized by specialism and career track.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.category}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.category)}`)}
                className="bg-brand-ivory hover:bg-brand-mint/40 rounded-xl p-4 border border-brand-border hover:border-[#BDE6D2] cursor-pointer transition-all duration-150 flex flex-col justify-between h-28"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-brand-border flex items-center justify-center text-brand-green">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-text truncate">
                    {cat.category}
                  </h4>
                  <p className="text-[11px] text-brand-muted mt-0.5 font-medium">
                    {cat.count} {cat.count === 1 ? "vacancy" : "vacancies"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED COMPANIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-teal tracking-tight">
              Verified Hiring Partners
            </h2>
            <p className="text-sm text-brand-slate mt-1">
              Companies vetted for legitimate corporate registration and clear hiring standards.
            </p>
          </div>
          <Link to="/companies">
            <Button variant="outline" size="sm">
              All Companies
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {companies.map((comp) => (
            <Card
              key={comp.id}
              hoverable
              onClick={() => navigate(`/companies/${comp.id}`)}
              className="cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-brand-teal text-white flex items-center justify-center font-bold text-lg">
                  {comp.name.charAt(0)}
                </div>
                {comp.is_verified && (
                  <Badge variant="verified" size="sm">
                    Verified
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-brand-text truncate">{comp.name}</h3>
                <p className="text-xs text-brand-muted truncate">{comp.industry || "Technology"}</p>
              </div>
              <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed">
                {comp.description || "Leading innovator hiring technical talent."}
              </p>
              <div className="text-[11px] text-brand-muted pt-2 border-t border-brand-border flex justify-between">
                <span>{comp.headquarters || "USA"}</span>
                <span>{comp.size || "50-200"} Employees</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. HOW HIRENESST WORKS */}
      <section className="bg-brand-teal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Transparent Workflows
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              How HireNest Works
            </h2>
            <p className="text-sm text-gray-300">
              A cohesive career platform engineered to eliminate hiring friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold">Build Your Profile & Resume</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Document verified skills, work experience, and career preferences. Upload PDF/DOCX resumes securely with encryption.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold">AI Skill Gap & Match Insights</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Receive instant match breakdowns before applying. Uncover exact missing skills alongside targeted learning resources.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#DDF3E8] text-brand-darkgreen flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold">Track & Interview Live</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Follow your application timeline from submission to offer. Accept interview invitations with meeting links inside the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-brand-border p-8 md:p-12 text-center shadow-card space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-brand-ivory text-brand-green">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-teal tracking-tight">
              Ready to take the next step in your career?
            </h2>
            <p className="text-sm text-brand-slate">
              Join thousands of professionals finding genuine opportunities and forward-thinking companies every day.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" size="lg">
                Browse Open Roles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
