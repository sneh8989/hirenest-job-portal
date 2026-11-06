import React, { useState, useEffect } from "react";
import { Building2, Globe, MapPin, Users, ShieldCheck, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { recruitersApi, companiesApi } from "../../services/api";
import type { Company } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export const CompanyProfilePage: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [size, setSize] = useState("51-200");
  const [headquarters, setHeadquarters] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Verification Request Modal
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [businessRegNo, setBusinessRegNo] = useState("");
  const [verifyWebsite, setVerifyWebsite] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  const fetchCompany = async () => {
    setIsLoading(true);
    try {
      const data = await recruitersApi.getCompany();
      setCompany(data);
      setName(data.name || "");
      setDescription(data.description || "");
      setIndustry(data.industry || "");
      setWebsite(data.website || "");
      setSize(data.size || "51-200");
      setHeadquarters(data.headquarters || "");
      setContactEmail(data.contact_email || "");
      setVerifyWebsite(data.website || "");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await recruitersApi.updateCompany({
        name,
        description,
        industry,
        website,
        size,
        headquarters,
        contact_email: contactEmail,
      });
      setCompany(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setIsVerifying(true);
    try {
      await companiesApi.requestVerification(company.id, {
        business_reg_no: businessRegNo,
        website: verifyWebsite,
      });
      setVerifySuccess(true);
      setTimeout(() => {
        setVerifyModalOpen(false);
        setVerifySuccess(false);
        fetchCompany();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            Company Profile & Branding
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Maintain public corporate information, verify legitimacy, and display trust marks to applicants.
          </p>
        </div>

        {company?.is_verified ? (
          <Badge variant="verified" size="md">
            Verified Company Entity
          </Badge>
        ) : (
          <Button
            variant="orange"
            size="sm"
            onClick={() => setVerifyModalOpen(true)}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Request Official Verification
          </Button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Corporate Information
            </h3>
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Changes saved
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Registered Company Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Company Description & Mission
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Primary Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Company Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Headquarters
              </label>
              <input
                type="text"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                placeholder="City, State"
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Company Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
              >
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="500+">500+ Employees</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
              Save Company Profile
            </Button>
          </div>
        </Card>
      </form>

      {/* VERIFICATION MODAL */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Submit Company Verification Request"
        description="Provide official business registry information to earn verified employer status."
        maxWidth="md"
      >
        {verifySuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-brand-green mx-auto" />
            <p className="text-xs font-bold text-brand-text">Verification submitted.</p>
            <p className="text-[11px] text-brand-muted">
              Platform administrators will verify your credentials.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRequestVerification} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Business Registration / Tax ID Number *
              </label>
              <input
                type="text"
                required
                value={businessRegNo}
                onChange={(e) => setBusinessRegNo(e.target.value)}
                placeholder="e.g. CA-CORP-2024-991201"
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Official Corporate Domain URL *
              </label>
              <input
                type="url"
                required
                value={verifyWebsite}
                onChange={(e) => setVerifyWebsite(e.target.value)}
                placeholder="https://company.com"
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-brand-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setVerifyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="orange" size="sm" isLoading={isVerifying}>
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
