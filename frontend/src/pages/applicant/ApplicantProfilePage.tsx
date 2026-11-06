import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Briefcase,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  Save,
  Sparkles
} from "lucide-react";
import { applicantsApi } from "../../services/api";
import type { ApplicantProfile, WorkExperience, EducationItem } from "../../types";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const ApplicantProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [preferredType, setPreferredType] = useState("Full-time");
  const [preferredLocation, setPreferredLocation] = useState("Remote");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [experience, setExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await applicantsApi.getProfile();
        setProfile(data);
        setHeadline(data.headline || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setPreferredType(data.preferred_employment_type || "Full-time");
        setPreferredLocation(data.preferred_location || "Remote");
        setExpectedSalary(data.expected_salary || "");
        setSkills(data.skills || []);
        setExperience(data.experience || []);
        setEducation(data.education || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddExperience = () => {
    setExperience([
      ...experience,
      { company: "Company Name", role: "Software Engineer", period: "2022 - Present", description: "Describe contributions and metrics..." },
    ]);
  };

  const handleRemoveExperience = (idx: number) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      { institution: "University Name", degree: "B.S. in Computer Science", year: "2022" },
    ]);
  };

  const handleRemoveEducation = (idx: number) => {
    setEducation(education.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await applicantsApi.updateProfile({
        headline,
        bio,
        location,
        preferred_employment_type: preferredType,
        preferred_location: preferredLocation,
        expected_salary: expectedSalary,
        skills,
        experience,
        education,
      });
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-brand-green border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            My Professional Profile
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Keep your skills and experience up to date for precise AI match recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Changes Saved
            </span>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile
          </Button>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Profile Completion Indicator
          </span>
          <p className="text-xs text-brand-muted">
            Profiles with completed skills and experiences receive 3.5x higher interview match scores.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-brand-green">
            {profile?.profile_completion || 40}%
          </span>
        </div>
      </div>

      {/* Basic Headline & Bio Card */}
      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          General Overview
        </h3>

        <div>
          <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
            Professional Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer | React, Python, Distributed Systems"
            className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
            Bio & Career Summary
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Outline your technical background, career goals, and core engineering strengths..."
            className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Current Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Expected Annual Compensation
            </label>
            <input
              type="text"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              placeholder="e.g. $140,000 - $160,000"
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Preferred Work Arrangement
            </label>
            <select
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Preferred Employment Type
            </label>
            <select
              value={preferredType}
              onChange={(e) => setPreferredType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
            >
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Skills Manager Card */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Technical Competencies & Skills ({skills.length})
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              These tags feed directly into the AI Match Score and Skill Gap Analyzer.
            </p>
          </div>
        </div>

        {/* Add skill input */}
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            placeholder="Type skill name (e.g. React, Docker, FastAPI)..."
            className="flex-1 text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
          />
          <Button type="submit" variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Skill
          </Button>
        </form>

        {/* Current skills badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-ivory text-brand-teal text-xs font-semibold border border-brand-border"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-brand-muted hover:text-rose-600 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
          {skills.length === 0 && (
            <p className="text-xs text-brand-muted italic">No skills listed yet.</p>
          )}
        </div>
      </Card>

      {/* Work Experience Section */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Work Experience
          </h3>
          <Button variant="outline" size="sm" onClick={handleAddExperience} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Role
          </Button>
        </div>

        <div className="space-y-4">
          {experience.map((exp, idx) => (
            <div key={idx} className="p-4 bg-brand-ivory rounded-xl border border-brand-border space-y-3 relative">
              <button
                onClick={() => handleRemoveExperience(idx)}
                className="absolute top-3 right-3 text-brand-muted hover:text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-brand-muted uppercase block">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[idx].company = e.target.value;
                      setExperience(updated);
                    }}
                    className="w-full text-xs p-2 rounded border border-brand-border bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-muted uppercase block">Role Title</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[idx].role = e.target.value;
                      setExperience(updated);
                    }}
                    className="w-full text-xs p-2 rounded border border-brand-border bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-muted uppercase block">Period</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[idx].period = e.target.value;
                      setExperience(updated);
                    }}
                    className="w-full text-xs p-2 rounded border border-brand-border bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-brand-muted uppercase block">Description & Achievements</label>
                <textarea
                  rows={2}
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[idx].description = e.target.value;
                    setExperience(updated);
                  }}
                  className="w-full text-xs p-2 rounded border border-brand-border bg-white"
                />
              </div>
            </div>
          ))}
          {experience.length === 0 && (
            <p className="text-xs text-brand-muted italic">No work experiences listed.</p>
          )}
        </div>
      </Card>

      {/* Education Section */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Education
          </h3>
          <Button variant="outline" size="sm" onClick={handleAddEducation} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Education
          </Button>
        </div>

        <div className="space-y-3">
          {education.map((edu, idx) => (
            <div key={idx} className="p-3 bg-brand-ivory rounded-xl border border-brand-border flex items-center justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[idx].institution = e.target.value;
                    setEducation(updated);
                  }}
                  className="text-xs p-2 rounded border border-brand-border bg-white"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[idx].degree = e.target.value;
                    setEducation(updated);
                  }}
                  className="text-xs p-2 rounded border border-brand-border bg-white"
                />
                <input
                  type="text"
                  placeholder="Graduation Year"
                  value={edu.year}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[idx].year = e.target.value;
                    setEducation(updated);
                  }}
                  className="text-xs p-2 rounded border border-brand-border bg-white"
                />
              </div>
              <button onClick={() => handleRemoveEducation(idx)} className="text-brand-muted hover:text-rose-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {education.length === 0 && (
            <p className="text-xs text-brand-muted italic">No education entries listed.</p>
          )}
        </div>
      </Card>
    </div>
  );
};
