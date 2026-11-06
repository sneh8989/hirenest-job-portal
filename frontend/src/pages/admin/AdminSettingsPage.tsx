import React from "react";
import { Settings, Shield, Database, Cpu, Lock } from "lucide-react";
import { Card } from "../../components/common/Card";

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Platform Configuration & System Health
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Review core environmental configurations and security parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-brand-green">
            <Database className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Database Engine</span>
          </div>
          <p className="text-sm font-bold text-brand-text">SQLAlchemy 2.0 Relational Core</p>
          <span className="text-xs text-brand-muted block">Target: PostgreSQL • Dev: SQLite Persistent</span>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-brand-orange">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Service Provider</span>
          </div>
          <p className="text-sm font-bold text-brand-text">Deterministic Skill Ontology Engine</p>
          <span className="text-xs text-brand-muted block">Optional External LLM hooks configured in backend/.env</span>
        </Card>
      </div>

      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Security Specifications
        </h3>
        <div className="space-y-2.5 text-xs text-brand-slate">
          <div className="flex justify-between py-2 border-b border-brand-border">
            <span className="font-medium">Password Hashing</span>
            <span className="font-semibold text-brand-text">PBKDF2-HMAC-SHA256 (100,000 rounds)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-brand-border">
            <span className="font-medium">Token Lifespan</span>
            <span className="font-semibold text-brand-text">1440 Minutes (24 Hours)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-brand-border">
            <span className="font-medium">Max Resume File Size</span>
            <span className="font-semibold text-brand-text">10 Megabytes</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Audit Logging Status</span>
            <span className="font-semibold text-emerald-700">Active & Tamper-Evident</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
