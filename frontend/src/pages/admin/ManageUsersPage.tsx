import React, { useState, useEffect } from "react";
import { Users, Search, Shield, Ban, CheckCircle2, Filter } from "lucide-react";
import { adminApi } from "../../services/api";
import type { User } from "../../types";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { CardSkeleton } from "../../components/common/Skeleton";

export const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        size: 15,
      };
      if (searchTerm) params.q = searchTerm;
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.is_active = statusFilter === "active";

      const data = await adminApi.getUsers(params);
      setUsers(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, roleFilter, statusFilter]);

  const handleToggleStatus = async (user: User) => {
    const actionName = user.is_active ? "suspend" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${actionName} ${user.email}?`)) {
      return;
    }
    try {
      await adminApi.toggleUserStatus(user.id, !user.is_active, `Admin action: ${actionName}`);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-teal tracking-tight">
          User Account Management
        </h1>
        <p className="text-xs text-brand-slate mt-1">
          Supervise user accounts, inspect permissions, and enforce safety actions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full text-xs p-2 rounded-lg border border-brand-border focus-ring"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs p-2 rounded-lg border border-brand-border bg-white text-brand-text focus-ring"
          >
            <option value="all">All Roles</option>
            <option value="applicant">Applicants</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 rounded-lg border border-brand-border bg-white text-brand-text focus-ring"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      {isLoading ? (
        <Card className="p-8 text-center text-xs text-brand-muted">Loading user accounts...</Card>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-ivory text-brand-slate uppercase font-bold text-[10px] border-b border-brand-border">
                <tr>
                  <th className="px-5 py-3.5">User Details</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Account Status</th>
                  <th className="px-4 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-brand-ivory/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-brand-text">{u.full_name}</div>
                      <div className="text-[11px] text-brand-muted">{u.email}</div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="capitalize font-semibold text-brand-teal">
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant={u.is_active ? "published" : "rejected"} size="sm">
                        {u.is_active ? "Active" : "Suspended"}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 text-brand-muted">
                      {new Date(u.created_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4 text-right">
                      {u.role !== "admin" ? (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`text-xs font-semibold hover:underline ${
                            u.is_active ? "text-rose-600" : "text-brand-green"
                          }`}
                        >
                          {u.is_active ? "Suspend Account" : "Reactivate"}
                        </button>
                      ) : (
                        <span className="text-[10px] text-brand-muted italic">Protected Admin</span>
                      )}
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
