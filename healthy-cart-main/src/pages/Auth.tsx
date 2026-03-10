import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GrainAccent = ({ className }: { className: string }) => (
  <svg viewBox="0 0 180 180" aria-hidden="true" className={className}>
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M86 152c9-28 12-58 10-101" />
      <path d="M116 152c8-35 8-71 1-116" />
      <path d="M78 78c-13-18-30-31-50-39" />
      <path d="M101 70c-7-21-20-38-39-50" />
      <path d="M124 77c5-23 17-42 34-58" />
      <path d="M139 98c13-19 24-39 32-62" />
      <ellipse cx="52" cy="52" rx="8" ry="18" transform="rotate(-46 52 52)" />
      <ellipse cx="40" cy="69" rx="8" ry="18" transform="rotate(-56 40 69)" />
      <ellipse cx="31" cy="89" rx="8" ry="18" transform="rotate(-66 31 89)" />
      <ellipse cx="73" cy="32" rx="8" ry="18" transform="rotate(-28 73 32)" />
      <ellipse cx="88" cy="50" rx="8" ry="18" transform="rotate(-18 88 50)" />
      <ellipse cx="122" cy="38" rx="8" ry="18" transform="rotate(22 122 38)" />
      <ellipse cx="132" cy="58" rx="8" ry="18" transform="rotate(30 132 58)" />
      <ellipse cx="141" cy="80" rx="8" ry="18" transform="rotate(38 141 80)" />
      <ellipse cx="148" cy="102" rx="8" ry="18" transform="rotate(46 148 102)" />
      <ellipse cx="15" cy="111" rx="5" ry="9" transform="rotate(-72 15 111)" />
      <ellipse cx="28" cy="104" rx="5" ry="9" transform="rotate(-60 28 104)" />
      <ellipse cx="42" cy="99" rx="5" ry="9" transform="rotate(-48 42 99)" />
      <ellipse cx="56" cy="95" rx="5" ry="9" transform="rotate(-36 56 95)" />
    </g>
  </svg>
);

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged in successfully.");
      }
      setSubmitting(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setSubmitting(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created successfully.");
    }

    setSubmitting(false);
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background: [
          "radial-gradient(circle at 7% 10%, hsl(29 82% 60% / 0.26), transparent 17%)",
          "radial-gradient(circle at 22% 44%, hsl(231 70% 64% / 0.12), transparent 23%)",
          "radial-gradient(circle at 90% 86%, hsl(233 86% 68% / 0.14), transparent 16%)",
          "linear-gradient(135deg, hsl(229 42% 22%) 0%, hsl(231 55% 16%) 44%, hsl(233 66% 10%) 100%)",
        ].join(", "),
      }}
    >
      <section className="container mx-auto px-6 pb-16 pt-24 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-[760px]">
          <div className="max-w-[520px] md:ml-4">
            <p
              className="font-sans-pro text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: "hsl(38 48% 76% / 0.84)" }}
            >
              Millet Pro - Account
            </p>
            <h1
              className="mt-3 font-display text-[clamp(2.3rem,4vw,3.6rem)] font-semibold leading-[1.03]"
              style={{ color: "hsl(42 26% 95%)", letterSpacing: "-0.04em" }}
            >
              {isLogin ? "Sign in to continue." : "Create your account."}
            </h1>
            <p
              className="mt-4 max-w-[540px] font-sans-pro text-[15px] leading-[1.85]"
              style={{ color: "hsl(221 18% 83% / 0.84)" }}
            >
              {isLogin
                ? "Access your account to manage orders, continue checkout, and keep your Millet Pro activity in one place."
                : "Create an account to continue checkout faster and keep your Millet Pro activity in one place."}
            </p>
          </div>

          <div
            className="relative mx-auto mt-8 max-w-[620px] overflow-hidden rounded-[30px] border-2 px-6 py-6 md:px-6 md:py-6"
            style={{
              background: "linear-gradient(180deg, hsl(42 23% 94%) 0%, hsl(40 18% 92%) 100%)",
              borderColor: "hsl(34 33% 62%)",
              boxShadow:
                "0 28px 78px hsl(232 55% 7% / 0.36), 0 1px 0 hsl(42 45% 98% / 0.9) inset, 0 0 0 1px hsl(34 38% 73% / 0.35)",
            }}
          >
            <div className="relative z-10 w-full">
              <h2 className="font-display text-[1.95rem] font-semibold" style={{ color: "hsl(231 28% 16%)" }}>
                {isLogin ? "Access Your Account" : "Create Your Account"}
              </h2>

              <div
                className="mt-4 inline-flex rounded-full border p-1"
                style={{ background: "hsl(39 18% 88%)", borderColor: "hsl(220 10% 79%)" }}
              >
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200"
                  style={{
                    background: isLogin ? "hsl(229 43% 22%)" : "transparent",
                    color: isLogin ? "hsl(42 24% 96%)" : "hsl(231 18% 34%)",
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200"
                  style={{
                    background: !isLogin ? "hsl(229 43% 22%)" : "transparent",
                    color: !isLogin ? "hsl(42 24% 96%)" : "hsl(231 18% 34%)",
                  }}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="font-sans-pro text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{ color: "hsl(223 10% 42% / 0.92)" }}
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(223_10%_52%)]" />
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        required={!isLogin}
                        className="h-11 rounded-[14px] border-[hsl(220_12%_78%)] bg-[hsl(40_18%_96%)] pl-11 text-[15px] text-[hsl(231_28%_16%)] placeholder:text-[hsl(223_10%_60%)]"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-sans-pro text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "hsl(223 10% 42% / 0.92)" }}
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(223_10%_52%)]" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="h-11 rounded-[14px] border-[hsl(220_12%_78%)] bg-[hsl(40_18%_96%)] pl-11 text-[15px] text-[hsl(231_28%_16%)] placeholder:text-[hsl(223_10%_60%)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-sans-pro text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "hsl(223 10% 42% / 0.92)" }}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(223_10%_52%)]" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="h-11 rounded-[14px] border-[hsl(220_12%_78%)] bg-[hsl(40_18%_96%)] pl-11 pr-28 text-[15px] text-[hsl(231_28%_16%)] placeholder:text-[hsl(223_10%_60%)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors hover:bg-black/5"
                      style={{ color: "hsl(223 12% 42%)" }}
                    >
                      {showPassword ? "Hide" : "Show/Hide"}
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div
                  className="flex flex-col gap-2 rounded-[14px] border px-4 py-3 text-sm md:flex-row md:items-center md:justify-between"
                  style={{
                    background: "hsl(40 12% 88%)",
                    borderColor: "hsl(220 10% 80%)",
                    color: "hsl(231 18% 28%)",
                  }}
                >
                  <span className="font-sans-pro">
                    {isLogin
                      ? "Use the email and password you created during signup to continue."
                      : "Create a secure password with at least 6 characters."}
                  </span>
                  <button
                    type="button"
                    onClick={() => toast.message("Forgot password flow is not wired yet.")}
                    className="w-fit font-medium transition-colors hover:opacity-80"
                    style={{ color: "hsl(37 40% 42%)" }}
                  >
                    {isLogin ? "Forgot Password?" : "Need help?"}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-full text-[14px] font-semibold"
                  disabled={submitting}
                  style={{
                    background: "linear-gradient(135deg, hsl(32 88% 55%) 0%, hsl(44 86% 61%) 100%)",
                    color: "hsl(230 34% 14%)",
                    boxShadow: "0 10px 24px hsl(31 55% 25% / 0.18)",
                  }}
                >
                  {submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="font-sans-pro text-sm" style={{ color: "hsl(223 12% 42% / 0.9)" }}>
                  {isLogin ? "Not a member?" : "Already a member?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-semibold underline underline-offset-2 transition-colors hover:opacity-80"
                    style={{ color: "hsl(231 42% 24%)" }}
                  >
                    {isLogin ? "Join now!" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Auth;
