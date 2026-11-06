import React from "react";
import { ShieldCheck, Users, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/common/Card";

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
          About HireNest
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-teal tracking-tight">
          Your Next Opportunity Starts Here.
        </h1>
        <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
          HireNest was built with an editorial commitment to clarity, verification, and human-centred technology. We believe recruitment should be transparent, verifiable, and free of generic noise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-ivory text-brand-green flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-teal">Verified Employers</h3>
          <p className="text-xs text-brand-slate leading-relaxed">
            Every hiring organisation on HireNest undergoes credential audits. We verify corporate filings and official communications before granting recruiter posting privileges.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-mint text-brand-minttext flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-teal">Deterministic AI Engine</h3>
          <p className="text-xs text-brand-slate leading-relaxed">
            Our match engine prioritizes transparent, explainable skill ontologies over opaque black-box scoring. Applicants see exact skill overlaps and tailored learning paths.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-ivory text-brand-orange flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-brand-teal">Human-First Workflow</h3>
          <p className="text-xs text-brand-slate leading-relaxed">
            Automated tools never reject candidates autonomously. Final decisions remain firmly in the hands of hiring teams, supported by clear application timelines.
          </p>
        </Card>
      </div>
    </div>
  );
};
