import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  Bell,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { Button } from "./Button";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "applicant") return "/applicant/dashboard";
    if (user.role === "recruiter") return "/recruiter/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/";
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-brand-green flex items-center justify-center text-white shadow-sm group-hover:bg-brand-darkgreen transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-brand-teal">
                  Hire<span className="text-brand-green">Nest</span>
                </span>
                <span className="text-[10px] text-brand-muted tracking-wider uppercase -mt-1 font-medium hidden sm:inline">
                  Opportunities
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/jobs"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive("/jobs")
                    ? "text-brand-green bg-brand-ivory"
                    : "text-brand-slate hover:text-brand-text hover:bg-gray-50"
                }`}
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive("/companies")
                    ? "text-brand-green bg-brand-ivory"
                    : "text-brand-slate hover:text-brand-text hover:bg-gray-50"
                }`}
              >
                Companies
              </Link>
              <Link
                to="/resources"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive("/resources")
                    ? "text-brand-green bg-brand-ivory"
                    : "text-brand-slate hover:text-brand-text hover:bg-gray-50"
                }`}
              >
                Career Resources
              </Link>
              <Link
                to="/about"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive("/about")
                    ? "text-brand-green bg-brand-ivory"
                    : "text-brand-slate hover:text-brand-text hover:bg-gray-50"
                }`}
              >
                About
              </Link>
            </nav>
          </div>

          {/* Right Header Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserMenuOpen(false);
                    }}
                    className="relative p-2 text-brand-slate hover:text-brand-text hover:bg-brand-ivory rounded-lg transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-elevated border border-brand-border py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-brand-border">
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand-slate">
                          Notifications ({unreadCount})
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead()}
                            className="text-xs text-brand-green hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-brand-muted">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id);
                                if (n.link) {
                                  navigate(n.link);
                                  setNotifDropdownOpen(false);
                                }
                              }}
                              className={`px-4 py-3 hover:bg-brand-ivory cursor-pointer transition-colors ${
                                !n.is_read ? "bg-brand-mint/20" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-semibold text-brand-text">
                                  {n.title}
                                </p>
                                {!n.is_read && (
                                  <span className="w-2 h-2 rounded-full bg-brand-green flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {new Date(n.created_at).toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Panel Button */}
                <Link to={getDashboardPath()}>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<LayoutDashboard className="w-4 h-4 text-brand-green" />}
                    className="hidden sm:inline-flex"
                  >
                    {user?.role === "applicant"
                      ? "Applicant Portal"
                      : user?.role === "recruiter"
                      ? "Recruiter Portal"
                      : "Admin Console"}
                  </Button>
                </Link>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-brand-ivory text-brand-text transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user?.full_name?.charAt(0) || "U"}
                    </div>
                    <span className="text-xs font-medium hidden md:inline text-brand-text max-w-[120px] truncate">
                      {user?.full_name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-brand-muted" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-brand-border py-2 z-50">
                      <div className="px-4 py-2 border-b border-brand-border">
                        <p className="text-xs font-semibold text-brand-text truncate">
                          {user?.full_name}
                        </p>
                        <p className="text-[11px] text-brand-muted truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-brand-ivory text-brand-teal border border-brand-border">
                          {user?.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-brand-text hover:bg-brand-ivory"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-muted" />
                          Dashboard
                        </Link>
                        {user?.role === "applicant" && (
                          <Link
                            to="/applicant/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-brand-text hover:bg-brand-ivory"
                          >
                            <UserIcon className="w-4 h-4 text-brand-muted" />
                            My Profile & Resume
                          </Link>
                        )}
                        {user?.role === "recruiter" && (
                          <Link
                            to="/recruiter/company"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-brand-text hover:bg-brand-ivory"
                          >
                            <Building2 className="w-4 h-4 text-brand-muted" />
                            Company Profile
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-brand-border pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-brand-slate hover:text-brand-text rounded-lg hover:bg-brand-ivory"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-border bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-brand-slate hover:bg-brand-ivory"
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-brand-slate hover:bg-brand-ivory"
          >
            Companies
          </Link>
          <Link
            to="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-brand-slate hover:bg-brand-ivory"
          >
            Career Resources
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-brand-slate hover:bg-brand-ivory"
          >
            About HireNest
          </Link>
          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-brand-green bg-brand-ivory"
            >
              Go to Workspace Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
