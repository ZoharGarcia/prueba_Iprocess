import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  company_id?: number | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setSession: (token: string, user?: User | null) => void; // ✅ nuevo
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getToken(): string | null {
  return (
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token")
  );
}

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);

  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  function setSession(nextToken: string, nextUser: User | null = null) {
    setToken(nextToken);
    if (nextUser) setUser(nextUser);
    setLoading(!nextUser); // si no pasas user, queda "validando"
  }

  function logout(): void {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    setUser(null);
    setToken(null);
    setLoading(false);
  }

  async function refreshUser(): Promise<void> {
    const storedToken = getToken();

    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${getApiBaseUrl()}/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Invalid session");

      const data: User = await res.json();

      setUser(data);
      setToken(storedToken);
    } catch (error) {
      console.error("Session invalid:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ opcional: si el token cambia en otra pestaña
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "auth_token") return;
      refreshUser();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        logout,
        refreshUser,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
