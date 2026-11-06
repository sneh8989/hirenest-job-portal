import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Briefcase, User, Building2, Mail, Lock, Phone, Globe, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "recruiter" ? "recruiter" : "applicant";

  const [role, setRole] = useState<"applicant" | "recruiter">(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Applicant specific
  const [headline, setHeadline] = useState("");
  const [skillsText, setSkillsText] = useState("");

  // Recruiter specific
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { registerApplicant, registerRecruiter } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(false);

    try {
      if (role === "applicant") {
        const skillsArray = skillsText
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        await registerApplicant({
          full_name: fullName,
          email,
          password,
          phone: phone || undefined,
          headline: headline || undefined,
          skills: skillsArray,
        });
        navigate("/applicant/dashboard");
      } else {
        await registerRecruiter({
          full_name: fullName,
          email,
          password,
          company_name: companyName,
          job_title: jobTitle || undefined,
          department: department || undefined,
          company_industry: companyIndustry || undefined,
          company_website: companyWebsite || undefined,
        });
        navigate("/recruiter/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Please check inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-brand-teal">
            Hire<span className="text-brand-green">Nest</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
          Create your account
        </h2>
        <p className="text-xs text-brand-slate">
          Get started with personalized recommendations or publish openings.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-brand-border shadow-card space-y-6">
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 p-1 bg-brand-ivory rounded-xl border border-brand-border">
            <button
              type="button"
              onClick={() => setRole("applicant")}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                role === "applicant"
                  ? "bg-white text-brand-teal shadow-sm border border-brand-border"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Job Seeker
            </button>

            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                role === "recruiter"
                  ? "bg-white text-brand-teal shadow-sm border border-brand-border"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Employer
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                  Password (min 6)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
                />
              </div>
            </div>

            {/* Applicant Specific Fields */}
            {role === "applicant" && (
              <>
                <div>
                  <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer | React, TypeScript"
                    className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                    Core Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="React, TypeScript, Python, PostgreSQL"
                    className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
                  />
                </div>
              </>
            )}

            {/* Recruiter Specific Fields */}
            {role === "recruiter" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. TechPulse Innovations"
                      className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                      Your Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Lead Talent Acquisition"
                      className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={companyIndustry}
                      onChange={(e) => setCompanyIndustry(e.target.value)}
                      placeholder="Software, Logistics, Fintech"
                      className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
                    />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full">
              Complete Registration
            </Button>
          </form>

          <div className="text-center text-xs text-brand-slate pt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-green font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
