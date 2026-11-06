import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import {
  PublicLayout,
  ApplicantLayout,
  RecruiterLayout,
  AdminLayout,
} from "./components/layout/Layouts";

// Public Pages
import { LandingPage } from "./pages/public/LandingPage";
import { JobSearchPage } from "./pages/public/JobSearchPage";
import { JobDetailsPage } from "./pages/public/JobDetailsPage";
import { CompaniesPage } from "./pages/public/CompaniesPage";
import { CompanyDetailsPage } from "./pages/public/CompanyDetailsPage";
import { CareerResourcesPage } from "./pages/public/CareerResourcesPage";
import { AboutPage } from "./pages/public/AboutPage";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";

// Applicant Pages
import { ApplicantDashboard } from "./pages/applicant/ApplicantDashboard";
import { MyApplicationsPage } from "./pages/applicant/MyApplicationsPage";
import { SavedJobsPage } from "./pages/applicant/SavedJobsPage";
import { ApplicantProfilePage } from "./pages/applicant/ApplicantProfilePage";
import { ResumeManagerPage } from "./pages/applicant/ResumeManagerPage";
import { SkillGapPage } from "./pages/applicant/SkillGapPage";
import { JobAlertsPage } from "./pages/applicant/JobAlertsPage";
import { ApplicantInterviewsPage } from "./pages/applicant/ApplicantInterviewsPage";
import { ApplicantSettingsPage } from "./pages/applicant/ApplicantSettingsPage";

// Recruiter Pages
import { RecruiterDashboard } from "./pages/recruiter/RecruiterDashboard";
import { MyJobsPage } from "./pages/recruiter/MyJobsPage";
import { JobFormPage } from "./pages/recruiter/JobFormPage";
import { ApplicantsManagementPage } from "./pages/recruiter/ApplicantsManagementPage";
import { HiringPipelinePage } from "./pages/recruiter/HiringPipelinePage";
import { RecruiterInterviewsPage } from "./pages/recruiter/RecruiterInterviewsPage";
import { CompanyProfilePage } from "./pages/recruiter/CompanyProfilePage";
import { RecruiterAnalyticsPage } from "./pages/recruiter/RecruiterAnalyticsPage";
import { RecruiterTrainingPage } from "./pages/recruiter/RecruiterTrainingPage";
import { RecruiterFeedbackPage } from "./pages/recruiter/RecruiterFeedbackPage";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ManageUsersPage } from "./pages/admin/ManageUsersPage";
import { RecruiterVerificationPage } from "./pages/admin/RecruiterVerificationPage";
import { JobListingsModerationPage } from "./pages/admin/JobListingsModerationPage";
import { ReportedContentPage } from "./pages/admin/ReportedContentPage";
import { AdminApplicationsPage } from "./pages/admin/AdminApplicationsPage";
import { AuditLogsPage } from "./pages/admin/AuditLogsPage";
import { AdminFeedbackPage } from "./pages/admin/AdminFeedbackPage";
import { AdminPaymentsPage } from "./pages/admin/AdminPaymentsPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<JobSearchPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/companies/:id" element={<CompanyDetailsPage />} />
              <Route path="/resources" element={<CareerResourcesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/feedback" element={<RecruiterFeedbackPage />} />
            </Route>

            {/* AUTH ROUTES */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* APPLICANT PANEL ROUTES */}
            <Route
              path="/applicant"
              element={
                <ProtectedRoute allowedRoles={["applicant"]}>
                  <ApplicantLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/applicant/dashboard" replace />} />
              <Route path="dashboard" element={<ApplicantDashboard />} />
              <Route path="applications" element={<MyApplicationsPage />} />
              <Route path="saved-jobs" element={<SavedJobsPage />} />
              <Route path="profile" element={<ApplicantProfilePage />} />
              <Route path="resume" element={<ResumeManagerPage />} />
              <Route path="skill-gap" element={<SkillGapPage />} />
              <Route path="alerts" element={<JobAlertsPage />} />
              <Route path="interviews" element={<ApplicantInterviewsPage />} />
              <Route path="settings" element={<ApplicantSettingsPage />} />
            </Route>

            {/* RECRUITER PANEL ROUTES */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                  <RecruiterLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="jobs" element={<MyJobsPage />} />
              <Route path="jobs/new" element={<JobFormPage />} />
              <Route path="jobs/edit/:id" element={<JobFormPage />} />
              <Route path="applicants" element={<ApplicantsManagementPage />} />
              <Route path="pipeline" element={<HiringPipelinePage />} />
              <Route path="interviews" element={<RecruiterInterviewsPage />} />
              <Route path="company" element={<CompanyProfilePage />} />
              <Route path="analytics" element={<RecruiterAnalyticsPage />} />
              <Route path="training" element={<RecruiterTrainingPage />} />
              <Route path="feedback" element={<RecruiterFeedbackPage />} />
              <Route path="settings" element={<ApplicantSettingsPage />} />
            </Route>

            {/* ADMIN PANEL ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsersPage />} />
              <Route path="verifications" element={<RecruiterVerificationPage />} />
              <Route path="jobs" element={<JobListingsModerationPage />} />
              <Route path="reports" element={<ReportedContentPage />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="feedback" element={<AdminFeedbackPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* CATCH ALL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
