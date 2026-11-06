import React, { useState, useEffect } from "react";
import { FileText, Building2, User, CheckCircle2 } from "lucide-react";
import { applicationsApi, API_BASE_URL } from "../../services/api";
import type { Application } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";

export const AdminApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In admin overview, fetch applications or display platform overview
    applicationsApi.getMyApplications().then((data) => {
      setApplications(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Platform Applications Overview
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          System audit of candidate submissions, stage transitions, and AI score records.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border p-6 text-center space-y-3 shadow-subtle">
        <FileText className="w-8 h-8 text-brand-green mx-auto" />
        <h3 className="text-base font-bold text-brand-text">Platform Submission Auditing</h3>
        <p className="text-xs text-brand-slate max-w-md mx-auto leading-relaxed">
          Application records are protected by strict role-based access control. Candidates retain ownership of their resume files, accessible solely by authorized employers.
        </p>
      </div>
    </div>
  );
};
