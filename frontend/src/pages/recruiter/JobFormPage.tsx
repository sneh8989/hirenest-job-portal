import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { jobsApi } from "../../services/api";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const JobFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [location, setLocation] = useState("San Francisco, CA");
  const [workArrangement, setWorkArrangement] = useState("Remote");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [experienceLevel, setExperienceLevel] = useState("Senior");
  const [minSalary, setMinSalary] = useState<number | "">(120000);
  const [maxSalary, setMaxSalary] = useState<number | "">(150000);
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("published");

  // Responsibilities & Requirements lists
  const [responsibilities, setResponsibilities] = useState<string[]>([
    "Architect and deliver reliable technical services.",
  ]);
  const [requirements, setRequirements] = useState<string[]>([
    "4+ years of professional engineering experience.",
  ]);

  // Skills
  const [skillsRequired, setSkillsRequired] = useState<string[]>(["React", "TypeScript"]);
  const [newRequiredSkill, setNewRequiredSkill] = useState("");

  const [skillsPreferred, setSkillsPreferred] = useState<string[]>(["Docker"]);
  const [newPreferredSkill, setNewPreferredSkill] = useState("");

  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && id) {
      jobsApi.getJob(parseInt(id, 10)).then((job) => {
        setTitle(job.title);
        setDepartment(job.department || "");
        setCategory(job.category);
        setLocation(job.location);
        setWorkArrangement(job.work_arrangement);
        setEmploymentType(job.employment_type);
        setExperienceLevel(job.experience_level);
        setMinSalary(job.min_salary || "");
        setMaxSalary(job.max_salary || "");
        setCurrency(job.currency);
        setDescription(job.description);
        setStatus(job.status);
        setResponsibilities(job.responsibilities || []);
        setRequirements(job.requirements || []);
        setSkillsRequired(job.skills_required || []);
        setSkillsPreferred(job.skills_preferred || []);
        if (job.deadline) setDeadline(job.deadline.split("T")[0]);
      }).catch(console.error);
    }
  }, [isEdit, id]);

  const handleAddResponsibility = () => setResponsibilities([...responsibilities, ""]);
  const handleRemoveResponsibility = (idx: number) =>
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));

  const handleAddRequirement = () => setRequirements([...requirements, ""]);
  const handleRemoveRequirement = (idx: number) =>
    setRequirements(requirements.filter((_, i) => i !== idx));

  const handleAddRequiredSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRequiredSkill.trim() && !skillsRequired.includes(newRequiredSkill.trim())) {
      setSkillsRequired([...skillsRequired, newRequiredSkill.trim()]);
      setNewRequiredSkill("");
    }
  };

  const handleAddPreferredSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPreferredSkill.trim() && !skillsPreferred.includes(newPreferredSkill.trim())) {
      setSkillsPreferred([...skillsPreferred, newPreferredSkill.trim()]);
      setNewPreferredSkill("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const payload: any = {
      title,
      department: department || undefined,
      category,
      location,
      work_arrangement: workArrangement,
      employment_type: employmentType,
      experience_level: experienceLevel,
      min_salary: minSalary ? Number(minSalary) : undefined,
      max_salary: maxSalary ? Number(maxSalary) : undefined,
      currency,
      description,
      responsibilities: responsibilities.filter((r) => r.trim().length > 0),
      requirements: requirements.filter((r) => r.trim().length > 0),
      skills_required: skillsRequired,
      skills_preferred: skillsPreferred,
      status,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    };

    try {
      if (isEdit && id) {
        await jobsApi.updateJob(parseInt(id, 10), payload);
      } else {
        await jobsApi.createJob(payload);
      }
      navigate("/recruiter/jobs");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save job vacancy.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/recruiter/jobs")}
        className="inline-flex items-center gap-1.5 text-xs text-brand-slate hover:text-brand-text font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          {isEdit ? "Edit Job Vacancy" : "Create New Job Vacancy"}
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Specify role requirements, technical skill criteria, and work arrangement details.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Details */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Position Overview
          </h3>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="DevOps">DevOps</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Core Infrastructure"
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Chicago, IL or Remote"
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Work Arrangement *
              </label>
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Employment Type *
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Experience Tier *
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
              >
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Min Annual Salary ($)
              </label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value ? Number(e.target.value) : "")}
                placeholder="100000"
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Max Annual Salary ($)
              </label>
              <input
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value ? Number(e.target.value) : "")}
                placeholder="140000"
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>
          </div>
        </Card>

        {/* Description & Requirements */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Role Description & Specifications
          </h3>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Job Description *
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of the team, product missions, and goals..."
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          {/* Responsibilities list builder */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">
                Key Responsibilities
              </label>
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
            <div className="space-y-2">
              {responsibilities.map((resp, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => {
                      const updated = [...responsibilities];
                      updated[idx] = e.target.value;
                      setResponsibilities(updated);
                    }}
                    placeholder="e.g. Lead architecture reviews and mentor engineers..."
                    className="flex-1 text-xs p-2 rounded border border-brand-border bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(idx)}
                    className="text-brand-muted hover:text-rose-600 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements list builder */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">
                Qualifications & Requirements
              </label>
              <button
                type="button"
                onClick={handleAddRequirement}
                className="text-xs text-brand-green font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => {
                      const updated = [...requirements];
                      updated[idx] = e.target.value;
                      setRequirements(updated);
                    }}
                    placeholder="e.g. 5+ years building distributed backends in Python or Go..."
                    className="flex-1 text-xs p-2 rounded border border-brand-border bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    className="text-brand-muted hover:text-rose-600 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Skills Tag Configuration for AI Match */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            AI Skill Criteria
          </h3>

          {/* Core Required Skills */}
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Required Core Skills (70% AI Scoring Weight)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRequiredSkill}
                onChange={(e) => setNewRequiredSkill(e.target.value)}
                placeholder="Type skill tag (e.g. React, PostgreSQL)..."
                className="flex-1 text-xs p-2 rounded border border-brand-border"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddRequiredSkill}>
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillsRequired.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-ivory text-brand-teal border border-brand-border flex items-center gap-1"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => setSkillsRequired(skillsRequired.filter((item) => item !== s))}
                    className="text-brand-muted hover:text-rose-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Preferred Skills (30% AI Scoring Weight)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPreferredSkill}
                onChange={(e) => setNewPreferredSkill(e.target.value)}
                placeholder="Type preferred tag (e.g. Redis, AWS)..."
                className="flex-1 text-xs p-2 rounded border border-brand-border"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddPreferredSkill}>
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillsPreferred.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-brand-slate border border-gray-200 flex items-center gap-1"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => setSkillsPreferred(skillsPreferred.filter((item) => item !== s))}
                    className="text-brand-muted hover:text-rose-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Publishing Options & Deadline */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Publishing Status & Deadline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Posting Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
              >
                <option value="published">Published (Visible immediately)</option>
                <option value="draft">Draft (Private)</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
              />
            </div>
          </div>
        </Card>

        {/* Save actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate("/recruiter/jobs")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isEdit ? "Update Vacancy" : "Save and Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
};
