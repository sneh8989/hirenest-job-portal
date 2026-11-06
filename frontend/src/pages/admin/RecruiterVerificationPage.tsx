import React, { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, XCircle, Globe, Building2, ExternalLink } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { Modal } from "../../components/common/Modal";

export const RecruiterVerificationPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);

  // Action Modal
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [decision, setDecision] = useState<"verified" | "rejected">("verified");
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getVerifications(statusFilter);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    setIsProcessing(true);
    try {
      await adminApi.processVerification(selectedReq.id, decision, adminNotes);
      setActionModalOpen(false);
      setAdminNotes("");
      await fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            Recruiter & Company Verification
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Review corporate filings and domain legitimacy before awarding the verified badge.
          </p>
        </div>

        <div className="flex gap-2">
          {["pending", "verified", "rejected", "all"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? "bg-brand-green text-white shadow-sm"
                  : "text-brand-slate hover:bg-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-xs text-brand-muted">
          Loading verification submissions...
        </Card>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-6 h-6" />}
          title={`No ${statusFilter} verification requests`}
          description="Verification requests submitted by hiring organizations will queue here."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={req.status === "verified" ? "published" : req.status === "rejected" ? "rejected" : "pending"} size="sm">
                    {req.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-brand-muted font-medium">
                    Requested on {new Date(req.submitted_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-brand-text">
                    {req.company_name}
                  </h3>
                  <p className="text-xs text-brand-muted">
                    Industry: {req.industry || "Technology"} • Submitter: {req.requester_name} ({req.requester_email})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-brand-slate pt-1">
                  <span className="font-semibold text-brand-teal">
                    Reg No: <span className="font-mono">{req.business_reg_no}</span>
                  </span>
                  {req.website && (
                    <a
                      href={req.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-green hover:underline flex items-center gap-1 font-medium"
                    >
                      <Globe className="w-3.5 h-3.5" /> Domain Verification
                    </a>
                  )}
                </div>

                {req.admin_notes && (
                  <p className="text-xs text-brand-slate italic pt-1">
                    Admin Notes: {req.admin_notes}
                  </p>
                )}
              </div>

              {req.status === "pending" && (
                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => {
                      setSelectedReq(req);
                      setDecision("rejected");
                      setActionModalOpen(true);
                    }}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedReq(req);
                      setDecision("verified");
                      setActionModalOpen(true);
                    }}
                  >
                    Approve & Verify
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* PROCESS VERIFICATION MODAL */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={`${decision === "verified" ? "Approve" : "Reject"} Verification Request`}
        description={`Organization: ${selectedReq?.company_name}`}
        maxWidth="md"
      >
        <form onSubmit={handleProcessSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
              Audit & Verification Notes
            </label>
            <textarea
              rows={3}
              required
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Verified registration via Secretary of State database..."
              className="w-full text-xs p-2.5 rounded-lg border border-brand-border focus-ring"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-brand-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={decision === "verified" ? "primary" : "danger"}
              size="sm"
              isLoading={isProcessing}
            >
              Confirm {decision === "verified" ? "Approval" : "Rejection"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
