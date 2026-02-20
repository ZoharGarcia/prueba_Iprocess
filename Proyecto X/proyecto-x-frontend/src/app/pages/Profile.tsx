// src/pages/Profile.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: string;

  // ✅ Típico de Laravel (ajusta si tu backend usa otro nombre)
  email_verified_at?: string | null;
  // Alternativa por si tu backend envía boolean:
  email_verified?: boolean;
}

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const token =
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token");

  const [user, setUser] = useState<User | null>(null);

  // ============================
  // Form perfil
  // ============================
  const [formData, setFormData] = useState({ name: "", phone: "" });

  // ============================
  // Form password
  // ============================
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // ============================
  // UI messages generales
  // ============================
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ============================
  // ✅ Verificación de correo
  // ============================
  const [code, setCode] = useState("");
  const [uiSuccess, setUiSuccess] = useState<string | null>(null);
  const [uiError, setUiError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const apiBase = useMemo(() => getApiBaseUrl(), []);

  const isEmailVerified = useMemo(() => {
    if (!user) return false;
    if (typeof user.email_verified === "boolean") return user.email_verified;
    return Boolean(user.email_verified_at);
  }, [user]);

  // Auto-ocultar mensajes de éxito después de 6s
  useEffect(() => {
    if (uiSuccess) {
      const t = setTimeout(() => setUiSuccess(null), 6000);
      return () => clearTimeout(t);
    }
  }, [uiSuccess]);

  // ============================
  // ✅ Botón atrás
  // ============================
  const handleGoBack = () => {
    // Si no hay historial, cae al home
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  // ============================
  // Fetch profile
  // ============================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBase}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
        setFormData({
          name: data.user?.name || "",
          phone: data.user?.phone || "",
        });
      } catch {
        setError("No se pudo cargar el perfil");
      }
    };

    fetchProfile();
  }, [token, logout, navigate, apiBase]);

  // ============================
  // Update profile
  // ============================
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch(`${apiBase}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      setSuccess("Perfil actualizado correctamente");
    } catch (err: any) {
      setError(err.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Change password
  // ============================
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch(`${apiBase}/api/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Contraseña actualizada. Cerrando sesión...");
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Delete account
  // ============================
  const handleDeleteAccount = async () => {
    if (!confirm("¿Seguro que deseas eliminar tu cuenta?")) return;

    try {
      const res = await fetch(`${apiBase}/api/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error();

      logout();
      navigate("/");
    } catch {
      setError("No se pudo eliminar la cuenta");
    }
  };

  // ============================
  // Manual logout button
  // ============================
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ============================
  // ✅ Verificar código
  // ============================
  async function handleVerifyEmailCode() {
    if (code.trim().length !== 6 || !/^\d+$/.test(code)) {
      setUiError("Ingresa un código válido de 6 dígitos numéricos");
      return;
    }
    if (!user?.email) {
      setUiError("No se encontró el correo electrónico asociado.");
      return;
    }

    setVerifyLoading(true);
    setUiError(null);
    setUiSuccess(null);

    try {
      const res = await fetch(`${apiBase}/verify-email-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email.trim(),
          code: code.trim(),
        }),
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        let errorMsg = data.message || "Código inválido o expirado";

        if (res.status === 404) {
          errorMsg = "No encontramos una cuenta con ese correo electrónico";
        } else if (res.status === 422) {
          errorMsg = data.message || "El código es incorrecto o ha expirado";
        } else if (res.status === 500) {
          errorMsg = "Error en el servidor. Intenta nuevamente en unos minutos";
        }

        setUiError(errorMsg);
        return;
      }

      setUiSuccess("¡Correo verificado correctamente!");
      setCode("");

      // Refrescar perfil (para que desaparezca la Card)
      try {
        const profileRes = await fetch(`${apiBase}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData.user);
        }
      } catch {
        // Silencioso
      }
    } catch (err) {
      console.error("Error al verificar código:", err);
      setUiError("Error de conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setVerifyLoading(false);
    }
  }

  // ============================
  // ✅ Reenviar código
  // ============================
  async function handleResendVerificationCode() {
    if (!user?.email) {
      setUiError("No se encontró el correo electrónico asociado.");
      return;
    }

    setResendLoading(true);
    setUiError(null);
    setUiSuccess(null);

    try {
      const res = await fetch(`${apiBase}/resend-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email.trim() }),
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        let errorMsg = data.message || "No se pudo reenviar el código";

        if (res.status === 404) {
          errorMsg = "No encontramos una cuenta registrada con ese correo";
        } else if (res.status === 422) {
          errorMsg =
            data.message || "El correo ya está verificado o la solicitud es inválida";
        } else if (res.status === 429) {
          errorMsg =
            "Demasiados intentos. Espera unos minutos antes de volver a intentarlo";
        } else if (res.status >= 500) {
          errorMsg = "Error temporal en el servidor. Intenta de nuevo más tarde";
        }

        setUiError(errorMsg);
        return;
      }

      setUiSuccess(
        data.message ||
          "¡Código reenviado correctamente! Revisa tu bandeja de entrada y la carpeta de spam."
      );
    } catch (err) {
      console.error("Error al reenviar código:", err);
      setUiError("No pudimos conectar con el servidor. Verifica tu conexión.");
    } finally {
      setResendLoading(false);
    }
  }

  if (!user) return <div className="p-8 text-center">Cargando perfil...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Encabezado interno */}
<div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold">Mi Perfil</h1>

  <div className="flex gap-3">
    <Button variant="outline" type="button" onClick={handleGoBack}>
      Atrás
    </Button>

    <Button variant="outline" onClick={handleLogout}>
      Cerrar sesión
    </Button>
  </div>
</div>



      {/* Mensajes generales */}
      {success && (
        <div className="mb-6 p-4 rounded bg-green-50 text-green-800 border border-green-200">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded bg-red-50 text-red-800 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Información personal */}
        <Card>
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
            <CardDescription>Actualiza tus datos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>

              <div>
                <Label>Nombre</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cambiar contraseña */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar contraseña</CardTitle>
            <CardDescription>Usa una contraseña segura</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                type="password"
                placeholder="Contraseña actual"
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current_password: e.target.value,
                  })
                }
              />
              <Input
                type="password"
                placeholder="Nueva contraseña"
                value={passwordData.password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    password: e.target.value,
                  })
                }
              />
              <Input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={passwordData.password_confirmation}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    password_confirmation: e.target.value,
                  })
                }
              />

              <Button variant="destructive" type="submit" disabled={loading}>
                {loading ? "Procesando..." : "Cambiar contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ✅ Verificación de correo (solo si NO está verificado) */}
        {!isEmailVerified && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Verifica tu correo</CardTitle>
              <CardDescription>
                Enviamos un código de 6 dígitos a <strong>{user.email}</strong>.
                Ingrésalo para activar tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uiSuccess && (
                <div className="p-4 rounded bg-green-50 text-green-800 border border-green-200">
                  {uiSuccess}
                </div>
              )}
              {uiError && (
                <div className="p-4 rounded bg-red-50 text-red-800 border border-red-200">
                  {uiError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="verify_code">Código de verificación</Label>
                <Input
                  id="verify_code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  disabled={verifyLoading || resendLoading}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={handleVerifyEmailCode}
                  disabled={
                    verifyLoading || resendLoading || code.length !== 6 || !user.email
                  }
                >
                  {verifyLoading ? "Verificando..." : "Verificar código"}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={handleResendVerificationCode}
                  disabled={resendLoading || verifyLoading || !user.email}
                >
                  {resendLoading ? "Enviando..." : "Reenviar código"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Zona peligrosa */}
      <Card className="mt-8 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Zona de peligro</CardTitle>
          <CardDescription>Eliminar cuenta permanentemente</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Eliminar mi cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
