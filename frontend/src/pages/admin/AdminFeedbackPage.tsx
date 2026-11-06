import React, { useState, useEffect } from "react";
import { MessageSquare, Star } from "lucide-react";
import { feedbackApi } from "../../services/api";
import type { PlatformFeedback } from "../../types";
import { Card } from "../../components/common/Card";

export const AdminFeedbackPage: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<PlatformFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    feedbackApi.getAll().then((data) => {
      setFeedbackList(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          Platform Feedback & Inquiries
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Review community feedback and user satisfaction ratings.
        </p>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-xs text-brand-muted">Loading feedback entries...</Card>
      ) : feedbackList.length === 0 ? (
        <Card className="p-8 text-center text-xs text-brand-muted">No feedback recorded yet.</Card>
      ) : (
        <div className="space-y-3">
          {feedbackList.map((item) => (
            <Card key={item.id} className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-text">{item.user_name || "User"}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-ivory text-brand-teal border border-brand-border capitalize">
                    {item.category.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-brand-orange">
                  ★ {item.rating}/5
                </div>
              </div>
              <p className="text-xs text-brand-slate leading-relaxed">{item.message}</p>
              <span className="text-[10px] text-brand-muted block pt-1">
                Submitted on {new Date(item.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
