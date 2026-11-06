import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, ShieldCheck, Sparkles, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-brand-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-teal">
                Hire<span className="text-brand-green">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-brand-slate max-w-sm leading-relaxed">
              Your next opportunity starts here. HireNest connects verified employers with ambitious professionals through transparent skill matching and human-first hiring workflows.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-muted">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>Role-Based Security & Verified Recruiter Audits</span>
            </div>
          </div>

          {/* Column 1: Job Seekers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text mb-3">
              Job Seekers
            </h4>
            <ul className="space-y-2 text-sm text-brand-slate">
              <li>
                <Link to="/jobs" className="hover:text-brand-green transition-colors">
                  Explore Vacancies
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-brand-green transition-colors">
                  Verified Employers
                </Link>
              </li>
              <li>
                <Link to="/applicant/skill-gap" className="hover:text-brand-green transition-colors">
                  Skill Gap Analyzer
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-brand-green transition-colors">
                  Interview Preparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Employers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text mb-3">
              Employers
            </h4>
            <ul className="space-y-2 text-sm text-brand-slate">
              <li>
                <Link to="/register?role=recruiter" className="hover:text-brand-green transition-colors">
                  Post a Vacancy
                </Link>
              </li>
              <li>
                <Link to="/recruiter/pipeline" className="hover:text-brand-green transition-colors">
                  Kanban Hiring Pipeline
                </Link>
              </li>
              <li>
                <Link to="/recruiter/company" className="hover:text-brand-green transition-colors">
                  Employer Branding
                </Link>
              </li>
              <li>
                <Link to="/recruiter/training" className="hover:text-brand-green transition-colors">
                  Hiring Playbook
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-brand-slate">
              <li>
                <Link to="/about" className="hover:text-brand-green transition-colors">
                  About HireNest
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-brand-green transition-colors">
                  Platform Feedback
                </Link>
              </li>
              <li>
                <span className="text-xs text-brand-muted">
                  Development Seed Database
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>© {new Date().getFullYear()} HireNest Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>WCAG 2.2 AA Aligned</span>
            <span>Deterministic AI Baseline</span>
            <span>Windows Compatible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
