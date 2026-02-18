import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type MeResponse = {
  is_subscription_active?: boolean | null;
};

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

export default function RequireActivePlan({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const apiBase = useMemo(() => getApiBaseUrl(), []);
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const [checking, setChecking] = useState(true);
  const [isPlanActive, setIsPlanActive] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setChecking(false);
      setIsPlanActive(false);
      return;
    }

    let cancelled = false;

    async function checkPlan() {
      setChecking(true);
      try {
        const res = await fetch(`${apiBase}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout?.();
            navigate("/login", { replace: true });
          }
          return;
        }

        const data = (await res.json()) as MeResponse;
        if (!cancelled) setIsPlanActive(Boolean(data?.is_subscription_active));
      } catch {
        if (!cancelled) setIsPlanActive(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkPlan();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, apiBase, logout, navigate]);

  // auth loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Cargando...</div>
      </div>
    );
  }

  // no auth -> login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // checking plan
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Verificando plan...</div>
      </div>
    );
  }

  // plan inactive -> mi plan
  if (!isPlanActive) {
    return <Navigate to="/mi-plan" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
