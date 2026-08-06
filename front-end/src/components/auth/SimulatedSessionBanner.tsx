import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function SimulatedSessionBanner() {
  const { isSimulatedSession } = useAuth();

  if (!isSimulatedSession) return null;

  return (
    <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
      Google sign-in is simulated for demo purposes. API features require email
      login.{" "}
      <Link to="/login" className="font-medium underline hover:text-amber-100">
        Sign in with email
      </Link>
    </div>
  );
}
