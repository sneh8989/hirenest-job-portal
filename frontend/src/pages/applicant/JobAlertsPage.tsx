import React, { useState, useEffect } from "react";
import { Bell, Plus, Trash2, CheckCircle2, Clock, MapPin, Tag } from "lucide-react";
import { applicantsApi } from "../../services/api";
import type { JobAlert } from "../../types";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";

export const JobAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("weekly");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await applicantsApi.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await applicantsApi.createAlert({
        title,
        keywords,
        location,
        category,
        frequency,
      });
      setIsModalOpen(false);
      setTitle("");
      setKeywords("");
      setLocation("");
      await fetchAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await applicantsApi.deleteAlert(id);
      setAlerts(alerts.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            Job Search Alerts
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Configure automated notifications whenever new vacancies match your criteria.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Job Alert
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-xs text-brand-muted">
          Loading active search alerts...
        </Card>
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6" />}
          title="No job alerts active"
          description="Create customized keyword and location alerts to receive instant notifications."
          actionText="Create Alert"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-brand-text">{alert.title}</h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand-ivory text-brand-teal border border-brand-border">
                    {alert.frequency}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                  {alert.keywords && <span>Keywords: {alert.keywords}</span>}
                  {alert.location && <span>Location: {alert.location}</span>}
                  {alert.category && <span>Category: {alert.category}</span>}
                </div>
              </div>

              <button
                onClick={() => handleDelete(alert.id)}
                className="text-brand-muted hover:text-rose-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE ALERT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Job Search Alert"
        description="Receive targeted notifications as soon as matching openings are published."
        maxWidth="md"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Alert Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Remote React Engineer"
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Keywords or Skills
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. TypeScript, Python, Tailwind"
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote, Chicago"
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
              >
                <option value="weekly">Weekly Digest</option>
                <option value="daily">Daily Notification</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
