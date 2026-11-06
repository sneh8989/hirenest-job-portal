import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../common/Navbar";
import { Sidebar } from "../common/Sidebar";
import { Menu } from "lucide-react";

export const ApplicantLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar role="applicant" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:pl-64 flex flex-col">
          {/* Mobile subheader with menu button */}
          <div className="lg:hidden bg-white border-b border-brand-border px-4 py-2.5 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-medium text-brand-slate hover:text-brand-text p-1.5 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-4 h-4 text-brand-green" />
              <span>Applicant Menu</span>
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export const RecruiterLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar role="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:pl-64 flex flex-col">
          <div className="lg:hidden bg-white border-b border-brand-border px-4 py-2.5 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-medium text-brand-slate hover:text-brand-text p-1.5 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-4 h-4 text-brand-green" />
              <span>Recruiter Menu</span>
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar role="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:pl-64 flex flex-col">
          <div className="lg:hidden bg-white border-b border-brand-border px-4 py-2.5 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-medium text-brand-slate hover:text-brand-text p-1.5 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-4 h-4 text-brand-green" />
              <span>Admin Menu</span>
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterComponent />
    </div>
  );
};

import { Footer as FooterComponent } from "../common/Footer";
