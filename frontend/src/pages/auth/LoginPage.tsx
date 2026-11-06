import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Lock, Mail, ArrowRight, Shield, User, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (user.role === "applicant") navigate("/applicant/dashboard");
        else if (user.role === "recruiter") navigate("/recruiter/dashboard");
        else if (user.role === "admin") navigate("/admin/dashboard");
        else navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-brand-teal">
            Hire<span className="text-brand-green">Nest</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-brand-slate">
          Sign in to access your personal dashboard and applications.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-brand-border shadow-card space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-brand-border focus-ring"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-brand-green hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-brand-border focus-ring"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full">
              Sign In to HireNest
            </Button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-4 border-t border-brand-border space-y-2">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block text-center">
              Quick One-Click Demo Logins
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("alex.dev@gmail.com", "Applicant@123")}
                className="p-2 rounded-lg border border-brand-border bg-brand-ivory hover:border-brand-green hover:bg-brand-mint/20 text-center transition-colors"
              >
                <User className="w-3.5 h-3.5 mx-auto text-brand-green mb-1" />
                <span className="block text-[10px] font-bold text-brand-text truncate">Applicant</span>
                <span className="block text-[9px] text-brand-muted">Alex Rivera</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount("sarah.recruiter@techpulse.io", "Recruiter@123")}
                className="p-2 rounded-lg border border-brand-border bg-brand-ivory hover:border-brand-green hover:bg-brand-mint/20 text-center transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 mx-auto text-brand-teal mb-1" />
                <span className="block text-[10px] font-bold text-brand-text truncate">Recruiter</span>
                <span className="block text-[9px] text-brand-muted">Sarah Jenkins</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount("admin@hirenest.com", "Admin@123")}
                className="p-2 rounded-lg border border-brand-border bg-brand-ivory hover:border-brand-green hover:bg-brand-mint/20 text-center transition-colors"
              >
                <Shield className="w-3.5 h-3.5 mx-auto text-brand-orange mb-1" />
                <span className="block text-[10px] font-bold text-brand-text truncate">Admin</span>
                <span className="block text-[9px] text-brand-muted">Eleanor Vance</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-brand-slate pt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-green font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
