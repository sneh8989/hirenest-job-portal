import React, { useState } from "react";
import { Lock, CheckCircle2, Shield } from "lucide-react";
import { authApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const ApplicantSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword(oldPassword, newPassword);
      setMessage("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Manage your credentials and security preferences.
        </p>
      </div>

      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Account Information
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-2 border-b border-brand-border">
            <span className="text-brand-muted">Email Address</span>
            <span className="font-semibold text-brand-text">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-brand-border">
            <span className="text-brand-muted">Role</span>
            <span className="font-semibold text-brand-text capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-brand-muted">Status</span>
            <span className="font-semibold text-emerald-700">Active & Verified</span>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Update Password
        </h3>

        {message && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {message}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              New Password (min 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
