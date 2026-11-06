import axios from "axios";
import type {
  User,
  Job,
  Application,
  ApplicantProfile,
  Company,
  Interview,
  Notification,
  SavedJob,
  JobAlert,
  AIMatchResult,
  SkillGapResult,
  AdminMetrics,
  UserReport,
  AuditLog,
  PlatformFeedback
} from "../types";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("hirenest_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for session expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes("/api/auth/login")) {
      // Clear expired credentials
      localStorage.removeItem("hirenest_token");
      localStorage.removeItem("hirenest_user");
    }
    return Promise.reject(error);
  }
);

// ----------------- AUTH API -----------------
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post("/api/auth/login", { email, password });
    return res.data;
  },
  registerApplicant: async (data: any) => {
    const res = await apiClient.post("/api/auth/register/applicant", data);
    return res.data;
  },
  registerRecruiter: async (data: any) => {
    const res = await apiClient.post("/api/auth/register/recruiter", data);
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await apiClient.get("/api/auth/me");
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await apiClient.post("/api/auth/forgot-password", { email });
    return res.data;
  },
  resetPassword: async (token: string, new_password: string) => {
    const res = await apiClient.post("/api/auth/reset-password", { token, new_password });
    return res.data;
  },
  changePassword: async (old_password: string, new_password: string) => {
    const res = await apiClient.post("/api/auth/change-password", { old_password, new_password });
    return res.data;
  },
};

// ----------------- JOBS API -----------------
export const jobsApi = {
  listJobs: async (params: Record<string, any> = {}) => {
    const res = await apiClient.get("/api/jobs", { params });
    return res.data;
  },
  getJob: async (id: number): Promise<Job> => {
    const res = await apiClient.get(`/api/jobs/${id}`);
    return res.data;
  },
  getCategories: async (): Promise<{ category: string; count: number }[]> => {
    const res = await apiClient.get("/api/jobs/categories");
    return res.data;
  },
  createJob: async (jobData: any): Promise<Job> => {
    const res = await apiClient.post("/api/jobs", jobData);
    return res.data;
  },
  updateJob: async (id: number, jobData: any): Promise<Job> => {
    const res = await apiClient.put(`/api/jobs/${id}`, jobData);
    return res.data;
  },
  deleteJob: async (id: number) => {
    const res = await apiClient.delete(`/api/jobs/${id}`);
    return res.data;
  },
  reportJob: async (id: number, reason: string, details?: string) => {
    const res = await apiClient.post(`/api/jobs/${id}/report`, { reason, details });
    return res.data;
  },
};

// ----------------- APPLICATIONS API -----------------
export const applicationsApi = {
  apply: async (data: { job_id: number; resume_url?: string; cover_letter?: string; applicant_notes?: string }) => {
    const res = await apiClient.post("/api/applications", data);
    return res.data;
  },
  getMyApplications: async (): Promise<Application[]> => {
    const res = await apiClient.get("/api/applications/my");
    return res.data;
  },
  getJobApplications: async (jobId: number): Promise<Application[]> => {
    const res = await apiClient.get(`/api/applications/job/${jobId}`);
    return res.data;
  },
  getApplication: async (id: number): Promise<Application> => {
    const res = await apiClient.get(`/api/applications/${id}`);
    return res.data;
  },
  updateStatus: async (id: number, status: string, notes?: string): Promise<Application> => {
    const res = await apiClient.patch(`/api/applications/${id}/status`, { status, notes });
    return res.data;
  },
  withdraw: async (id: number) => {
    const res = await apiClient.post(`/api/applications/${id}/withdraw`);
    return res.data;
  },
};

// ----------------- APPLICANT API -----------------
export const applicantsApi = {
  getProfile: async (): Promise<ApplicantProfile> => {
    const res = await apiClient.get("/api/applicant/profile");
    return res.data;
  },
  updateProfile: async (data: any): Promise<ApplicantProfile> => {
    const res = await apiClient.put("/api/applicant/profile", data);
    return res.data;
  },
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/api/applicant/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  getDashboardMetrics: async () => {
    const res = await apiClient.get("/api/applicant/dashboard-metrics");
    return res.data;
  },
  getSavedJobs: async (): Promise<SavedJob[]> => {
    const res = await apiClient.get("/api/applicant/saved-jobs");
    return res.data;
  },
  toggleSaveJob: async (jobId: number) => {
    const res = await apiClient.post(`/api/applicant/saved-jobs/${jobId}`);
    return res.data;
  },
  removeSavedJob: async (jobId: number) => {
    const res = await apiClient.delete(`/api/applicant/saved-jobs/${jobId}`);
    return res.data;
  },
  getAlerts: async (): Promise<JobAlert[]> => {
    const res = await apiClient.get("/api/applicant/alerts");
    return res.data;
  },
  createAlert: async (data: any): Promise<JobAlert> => {
    const res = await apiClient.post("/api/applicant/alerts", data);
    return res.data;
  },
  deleteAlert: async (id: number) => {
    const res = await apiClient.delete(`/api/applicant/alerts/${id}`);
    return res.data;
  },
};

// ----------------- RECRUITER API -----------------
export const recruitersApi = {
  getDashboardMetrics: async () => {
    const res = await apiClient.get("/api/recruiter/dashboard-metrics");
    return res.data;
  },
  getJobs: async () => {
    const res = await apiClient.get("/api/recruiter/jobs");
    return res.data;
  },
  getCompany: async (): Promise<Company> => {
    const res = await apiClient.get("/api/recruiter/company");
    return res.data;
  },
  updateCompany: async (data: any): Promise<Company> => {
    const res = await apiClient.put("/api/recruiter/company", data);
    return res.data;
  },
  getPipeline: async (jobId: number) => {
    const res = await apiClient.get(`/api/recruiter/pipeline/${jobId}`);
    return res.data;
  },
};

// ----------------- COMPANIES API -----------------
export const companiesApi = {
  getCompanies: async (params: { q?: string; industry?: string } = {}): Promise<Company[]> => {
    const res = await apiClient.get("/api/companies", { params });
    return res.data;
  },
  getCompany: async (id: number) => {
    const res = await apiClient.get(`/api/companies/${id}`);
    return res.data;
  },
  requestVerification: async (companyId: number, data: { business_reg_no: string; website?: string }) => {
    const res = await apiClient.post(`/api/companies/${companyId}/request-verification`, null, {
      params: data,
    });
    return res.data;
  },
};

// ----------------- INTERVIEWS API -----------------
export const interviewsApi = {
  schedule: async (data: any): Promise<Interview> => {
    const res = await apiClient.post("/api/interviews", data);
    return res.data;
  },
  getMyInterviews: async (): Promise<Interview[]> => {
    const res = await apiClient.get("/api/interviews/my");
    return res.data;
  },
  respond: async (id: number, action: "accept" | "decline"): Promise<Interview> => {
    const res = await apiClient.patch(`/api/interviews/${id}/respond`, null, {
      params: { action },
    });
    return res.data;
  },
  updateStatus: async (id: number, data: { status?: string; feedback?: string; rating?: number }): Promise<Interview> => {
    const res = await apiClient.patch(`/api/interviews/${id}/status`, data);
    return res.data;
  },
};

// ----------------- NOTIFICATIONS API -----------------
export const notificationsApi = {
  getNotifications: async (): Promise<{ unread_count: number; items: Notification[] }> => {
    const res = await apiClient.get("/api/notifications");
    return res.data;
  },
  markRead: async (id: number) => {
    const res = await apiClient.patch(`/api/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await apiClient.patch("/api/notifications/read-all");
    return res.data;
  },
};

// ----------------- AI API -----------------
export const aiApi = {
  getMatchScore: async (jobId: number, applicantId?: number): Promise<AIMatchResult> => {
    const res = await apiClient.post("/api/ai/match-score", {
      job_id: jobId,
      applicant_id: applicantId,
    });
    return res.data;
  },
  getSkillGap: async (jobId: number): Promise<SkillGapResult> => {
    const res = await apiClient.post("/api/ai/skill-gap", { job_id: jobId });
    return res.data;
  },
  getRecommendations: async (limit: number = 6): Promise<{ job: Job; match_score: number; recommendation_reason: string }[]> => {
    const res = await apiClient.get("/api/ai/recommendations", { params: { limit } });
    return res.data;
  },
};

// ----------------- ADMIN API -----------------
export const adminApi = {
  getMetrics: async (): Promise<AdminMetrics> => {
    const res = await apiClient.get("/api/admin/metrics");
    return res.data;
  },
  getUsers: async (params: any = {}) => {
    const res = await apiClient.get("/api/admin/users", { params });
    return res.data;
  },
  toggleUserStatus: async (userId: number, isActive: boolean, reason?: string) => {
    const res = await apiClient.patch(`/api/admin/users/${userId}/status`, null, {
      params: { is_active: isActive, reason },
    });
    return res.data;
  },
  getVerifications: async (status: string = "pending") => {
    const res = await apiClient.get("/api/admin/verifications", { params: { status } });
    return res.data;
  },
  processVerification: async (requestId: number, status: "verified" | "rejected", verification_notes?: string) => {
    const res = await apiClient.patch(`/api/admin/verifications/${requestId}`, {
      status,
      verification_notes,
    });
    return res.data;
  },
  getReports: async (status: string = "pending"): Promise<UserReport[]> => {
    const res = await apiClient.get("/api/admin/reports", { params: { status } });
    return res.data;
  },
  resolveReport: async (reportId: number, data: { status: string; moderation_notes: string; take_down_job?: boolean }) => {
    const res = await apiClient.patch(`/api/admin/reports/${reportId}/resolve`, data);
    return res.data;
  },
  getAuditLogs: async (limit: number = 50, action?: string): Promise<AuditLog[]> => {
    const res = await apiClient.get("/api/admin/audit-logs", { params: { limit, action } });
    return res.data;
  },
  getJobs: async (status?: string): Promise<Job[]> => {
    const res = await apiClient.get("/api/admin/jobs", { params: { status } });
    return res.data;
  },
  moderateJob: async (jobId: number, action: "hide" | "restore", reason?: string) => {
    const res = await apiClient.patch(`/api/admin/jobs/${jobId}/moderate`, null, {
      params: { action, reason },
    });
    return res.data;
  },
};

// ----------------- FEEDBACK API -----------------
export const feedbackApi = {
  submit: async (category: string, message: string, rating: number = 5): Promise<PlatformFeedback> => {
    const res = await apiClient.post("/api/feedback", { category, message, rating });
    return res.data;
  },
  getAll: async (): Promise<PlatformFeedback[]> => {
    const res = await apiClient.get("/api/feedback");
    return res.data;
  },
};
