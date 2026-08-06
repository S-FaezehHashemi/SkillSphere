import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import { useAuth } from "../hooks/useAuth";
import { getFieldError, parseApiErrors } from "../utils/authErrors";
import { logActivity } from "../utils/activityLog";

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function validateClient(): string | null {
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim()) return "Email is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== passwordConfirm) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const clientError = validateClient();
    if (clientError) {
      setError(clientError);
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.trim(),
        full_name: fullName.trim(),
        password,
        password_confirm: passwordConfirm,
      });
      logActivity({
        type: "register",
        message: `Account created for ${email.trim()}`,
      });
      navigate("/login", {
        replace: true,
        state: { registered: true, email: email.trim() },
      });
    } catch (err) {
      const parsed = parseApiErrors(err);
      setError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    await loginWithGoogle();
    navigate("/", { replace: true });
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join SkillSphere and start sharing your projects"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-accent hover:text-accent-muted"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-gray-700 dark:bg-surface-elevated dark:text-white"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-gray-700 dark:bg-surface-elevated dark:text-white"
            placeholder="you@example.com"
          />
          {getFieldError(fieldErrors, "email") && (
            <p className="mt-1 text-xs text-red-400">
              {getFieldError(fieldErrors, "email")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-gray-700 dark:bg-surface-elevated dark:text-white"
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="passwordConfirm"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Confirm password
          </label>
          <input
            id="passwordConfirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-gray-700 dark:bg-surface-elevated dark:text-white"
            placeholder="Repeat password"
          />
          {getFieldError(fieldErrors, "password_confirm") && (
            <p className="mt-1 text-xs text-red-400">
              {getFieldError(fieldErrors, "password_confirm")}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400 dark:bg-surface-card">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleLoginButton onSuccess={handleGoogleLogin} disabled={loading} />
    </AuthLayout>
  );
}
