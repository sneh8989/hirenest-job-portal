import React, { useState, useEffect } from "react";
import { History, Shield, Filter, Search } from "lucide-react";
import { adminApi } from "../../services/api";
import type { AuditLog } from "../../types";
import { Card } from "../../components/common/Card";

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi.getAuditLogs(100).then((data) => {
      setLogs(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      !searchTerm ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.user_email && l.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.details && l.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
            Security & System Audit Logs
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Tamper-evident record of administrative moderation, user lifecycle events, and security access.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter audit logs..."
            className="w-full text-xs p-2 rounded-lg border border-brand-border bg-white focus-ring"
          />
        </div>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-xs text-brand-muted">Loading audit records...</Card>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-ivory text-brand-slate uppercase font-bold text-[10px] border-b border-brand-border">
                <tr>
                  <th className="px-5 py-3">Timestamp (UTC)</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Initiating User</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-5 py-3">Details</th>
                  <th className="px-4 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-ivory/50">
                    <td className="px-5 py-3 text-brand-muted whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    <td className="px-4 py-3 font-bold text-brand-teal whitespace-nowrap">
                      {log.action}
                    </td>

                    <td className="px-4 py-3 text-brand-slate whitespace-nowrap font-sans">
                      {log.user_email || "System"}
                    </td>

                    <td className="px-4 py-3 text-brand-muted whitespace-nowrap">
                      {log.resource_type} {log.resource_id ? `#${log.resource_id}` : ""}
                    </td>

                    <td className="px-5 py-3 text-brand-text font-sans max-w-xs truncate">
                      {log.details || "-"}
                    </td>

                    <td className="px-4 py-3 text-brand-muted whitespace-nowrap">
                      {log.ip_address || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
