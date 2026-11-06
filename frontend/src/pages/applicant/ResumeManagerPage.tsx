import React, { useState, useEffect } from "react";
import { FileCheck, Upload, Download, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { applicantsApi, API_BASE_URL } from "../../services/api";
import type { ApplicantProfile } from "../../types";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const ResumeManagerPage: React.FC = () => {
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await applicantsApi.getProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "docx", "doc"].includes(ext || "")) {
        setError("Only PDF and Word (.docx, .doc) files are supported.");
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File size cannot exceed 10MB.");
        setSelectedFile(null);
        return;
      }
      setError("");
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError("");
    try {
      await applicantsApi.uploadResume(selectedFile);
      setUploadSuccess(true);
      setSelectedFile(null);
      await fetchProfile();
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Resume Management
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Store your verified resume securely. It will be made available only to employers you apply to.
        </p>
      </div>

      {/* Active Resume Card */}
      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Active Resume
        </h3>

        {profile?.resume_url ? (
          <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-text">
                  {profile.resume_filename || "Curriculum_Vitae.pdf"}
                </p>
                <span className="text-[10px] text-brand-muted">
                  Attached to active job applications
                </span>
              </div>
            </div>

            <a
              href={`${API_BASE_URL}${profile.resume_url}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-brand-green font-semibold hover:underline"
            >
              <Download className="w-4 h-4" /> Download / View
            </a>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-brand-muted bg-gray-50 rounded-xl border border-dashed border-brand-border">
            No resume currently uploaded to your profile.
          </div>
        )}
      </Card>

      {/* Upload New Resume */}
      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Upload New Version
        </h3>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Resume uploaded and verified successfully!
          </div>
        )}

        <div className="border-2 border-dashed border-brand-border rounded-2xl p-8 text-center space-y-3 hover:border-brand-green transition-colors">
          <Upload className="w-8 h-8 text-brand-green mx-auto" />
          <div>
            <label className="cursor-pointer text-xs font-bold text-brand-green hover:underline">
              Choose PDF or Word Document
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-brand-muted mt-1">
              Supports .pdf, .docx up to 10MB
            </p>
          </div>
          {selectedFile && (
            <p className="text-xs font-semibold text-brand-text pt-2">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {selectedFile && (
          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleUpload}
              isLoading={isUploading}
            >
              Confirm and Upload Resume
            </Button>
          </div>
        )}
      </Card>

      {/* Privacy Notice */}
      <div className="flex items-start gap-2.5 p-4 bg-white rounded-xl border border-brand-border text-xs text-brand-muted">
        <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
        <p>
          HireNest encrypts uploaded resumes on disk. Unauthenticated search engines and unverified third parties cannot scrape or access your documents.
        </p>
      </div>
    </div>
  );
};
