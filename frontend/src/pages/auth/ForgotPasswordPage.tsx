import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { authApi } from "../../services/api";
import { Button } from "../../components/common/Button";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devToken, setDevToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setIsSubmitted(true);
      if (res.dev_reset_token) {
        setDevToken(res.dev_reset_token);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
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
          Reset your password
        </h2>
        <p className="text-xs text-brand-slate">
          Enter your email to receive recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-brand-border shadow-card space-y-6">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-brand-mint text-brand-green rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-brand-text">Check your inbox</h3>
              <p className="text-xs text-brand-slate leading-relaxed">
                If an account exists for <span className="font-semibold text-brand-text">{email}</span>, password reset instructions have been generated.
              </p>
              {devToken && (
                <div className="p-3 bg-brand-ivory border border-brand-border rounded-lg text-[11px] text-brand-teal break-all text-left">
                  <span className="font-bold block">Development Token:</span>
                  {devToken}
                </div>
              )}
              <Link to="/login" className="block text-xs text-brand-green font-semibold hover:underline pt-2">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-slate uppercase tracking-wider block mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-brand-border focus-ring"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full">
                Send Instructions
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-brand-muted hover:text-brand-text inline-flex items-center gap-1 font-medium">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
