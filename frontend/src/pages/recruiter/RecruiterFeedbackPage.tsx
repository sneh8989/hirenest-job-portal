import React, { useState } from "react";
import { MessageSquare, CheckCircle2, Star } from "lucide-react";
import { feedbackApi } from "../../services/api";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const RecruiterFeedbackPage: React.FC = () => {
  const [category, setCategory] = useState("recruiter_tools");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await feedbackApi.submit(category, message, rating);
      setSuccess(true);
      setMessage("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Recruiter Platform Feedback
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Share suggestions, feature requests, or report usability hurdles to the engineering team.
        </p>
      </div>

      <Card className="space-y-4">
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Thank you. Your feedback has been sent to our product administrators.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Feedback Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white focus-ring"
            >
              <option value="recruiter_tools">Recruitment & Kanban Tools</option>
              <option value="candidate_matching">Candidate Match Quality</option>
              <option value="platform_usability">Navigation & Interface</option>
              <option value="feature_request">New Feature Suggestion</option>
              <option value="bug_report">Issue or Bug Report</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg border text-xs font-bold transition-colors ${
                    rating >= star
                      ? "bg-brand-mint border-[#BDE6D2] text-brand-minttext"
                      : "bg-white border-brand-border text-brand-muted"
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Your Feedback & Notes *
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What worked well, or what could be improved for your hiring workflow?..."
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              Submit Feedback
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
