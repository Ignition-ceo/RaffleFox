import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Dev bypass via URL param ?dev=1
const getDevBypass = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("dev") === "1";

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, adminProfile, loading, isAdmin, authDisabled } = useAuth();
  const location = useLocation();
  const devBypass = getDevBypass();

  // Bypass all auth checks when disabled or dev param present
  if (authDisabled || devBypass) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Require admin access
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this area.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
