import React from "react";
import { CreditCard, AlertCircle, CheckCircle2, Shield, ArrowUpRight } from "lucide-react";
import { Card } from "../../components/common/Card";

export const AdminPaymentsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Billing & Payments Management
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Employer subscription tiers, invoice logs, and payment gateway configuration.
        </p>
      </div>

      {/* Demonstration Notice */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Demonstration Module — Gateway Integration Pending</span>
          <p>
            This module represents the HireNest billing architecture. Live card processing connects via external merchant gateways (such as Stripe or LemonSqueezy) when production credentials are configured. No actual financial transactions are processed in this local environment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="space-y-2">
          <span className="text-[11px] font-bold text-brand-muted uppercase">Plan Tier: Starter</span>
          <p className="text-xl font-bold text-brand-text">Free</p>
          <span className="text-xs text-brand-slate block">Up to 3 active published vacancies</span>
        </Card>

        <Card className="space-y-2 border-brand-green/30">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-brand-green uppercase">Plan Tier: Growth</span>
            <span className="text-[10px] bg-brand-mint text-brand-minttext font-bold px-2 py-0.5 rounded-full">Popular</span>
          </div>
          <p className="text-xl font-bold text-brand-teal">$199 / mo</p>
          <span className="text-xs text-brand-slate block">Unlimited jobs & AI Match Scoring</span>
        </Card>

        <Card className="space-y-2">
          <span className="text-[11px] font-bold text-brand-muted uppercase">Plan Tier: Enterprise</span>
          <p className="text-xl font-bold text-brand-text">Custom</p>
          <span className="text-xs text-brand-slate block">Dedicated talent pipelines & custom ATS integrations</span>
        </Card>
      </div>

      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Payment Gateway Settings
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-2 border-b border-brand-border">
            <div>
              <span className="font-semibold text-brand-text block">Stripe API Connector</span>
              <span className="text-brand-muted">Requires STRIPE_SECRET_KEY in backend/.env</span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Pending Configuration
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <div>
              <span className="font-semibold text-brand-text block">Automated Tax & Invoicing</span>
              <span className="text-brand-muted">Generates PDF invoice receipts for verified employers</span>
            </div>
            <span className="text-[11px] font-bold text-brand-slate bg-gray-100 px-2.5 py-1 rounded-full">
              Demo Mode Active
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
