import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, FileText, Code2, Users } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const CareerResourcesPage: React.FC = () => {
  const guides = [
    {
      title: "Mastering the AI Skill Gap Analyzer",
      description: "How to read your skill gap roadmap, prioritize high-value technologies, and prepare targeted portfolio projects.",
      category: "Tool Guide",
      readTime: "4 min read",
      link: "/applicant/skill-gap",
    },
    {
      title: "Full-Stack Interview Blueprint",
      description: "A comprehensive checklist covering system design principles, RESTful API contracts, and practical database indexing strategies.",
      category: "Interview Prep",
      readTime: "7 min read",
      link: "/jobs",
    },
    {
      title: "Writing Resumes for Modern ATS & Human Hiring Teams",
      description: "Structuring measurable achievements, eliminating visual clutter, and aligning skill keywords with genuine competency.",
      category: "Resume Strategy",
      readTime: "5 min read",
      link: "/applicant/resume",
    },
    {
      title: "Remote Work Negotiation & Compensation Benchmarking",
      description: "Navigating geographic salary tiers, equity grants, and balancing flexibility with sustainable career progression.",
      category: "Career Growth",
      readTime: "6 min read",
      link: "/jobs",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-12">
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
          Knowledge Base
        </span>
        <h1 className="text-3xl font-extrabold text-brand-teal tracking-tight">
          Career Resources & Interview Guides
        </h1>
        <p className="text-sm text-brand-slate leading-relaxed">
          Actionable blueprints, interview strategies, and skill benchmarking created to help you advance your career with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide, idx) => (
          <Card key={idx} hoverable className="space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-green uppercase tracking-wider">
                  {guide.category}
                </span>
                <span className="text-brand-muted">{guide.readTime}</span>
              </div>
              <h3 className="text-base font-bold text-brand-text">
                {guide.title}
              </h3>
              <p className="text-xs text-brand-slate leading-relaxed">
                {guide.description}
              </p>
            </div>
            <Link
              to={guide.link}
              className="inline-flex items-center gap-1.5 text-xs text-brand-teal font-semibold hover:text-brand-green transition-colors pt-2 border-t border-brand-border"
            >
              Explore Guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
