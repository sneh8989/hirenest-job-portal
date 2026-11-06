import React from "react";
import { BookOpen, CheckCircle2, ShieldCheck, Users, HelpCircle } from "lucide-react";
import { Card } from "../../components/common/Card";

export const RecruiterTrainingPage: React.FC = () => {
  const guides = [
    {
      title: "Interpreting HireNest AI Fit Scores",
      description: "How the 70/30 required vs preferred skill weighting functions, avoiding bias, and ensuring final decisions are made by humans.",
    },
    {
      title: "Conducting High-Signal Technical Interviews",
      description: "Standardized rubrics for evaluating code quality, problem breakdown, and collaborative communication.",
    },
    {
      title: "Writing Clear Job Descriptions that Attract Senior Talent",
      description: "Eliminating vague buzzwords, transparent compensation ranges, and structuring specific technological requirements.",
    },
    {
      title: "Candidate Experience & Timeline SLA Standards",
      description: "Maintaining rapid stage transitions, notifying candidates within 5 days, and leaving structured evaluation notes.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Recruitment Playbooks & Standards
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Guidelines and best practices for conducting effective, respectful hiring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((g, i) => (
          <Card key={i} className="space-y-2 p-5">
            <BookOpen className="w-5 h-5 text-brand-green" />
            <h3 className="text-sm font-bold text-brand-teal">{g.title}</h3>
            <p className="text-xs text-brand-slate leading-relaxed">{g.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
