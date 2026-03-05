// src/router.tsx
import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./layouts/RootLayout";

import { Home } from "./pages/Home";
import { FeaturesPage } from "./pages/FeaturesPage";
import { PricingPage } from "./pages/PricingPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFound } from "./pages/NotFound";

// ✅ Nuevas páginas legales
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { CookiesPage } from "./pages/CookiesPage";

import MiPlan from "./pages/MiPlan";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { VerifyResetCode } from "./pages/VerifyResetCode";
import { ChangePassword } from "./pages/ChangePassword";
import { SelectPlan } from "./pages/SelectPlan";
import { Verification } from "./pages/Verification";
import Settings from "./pages/Settings";
import Inicio from "@/app/pages/Inicio";
import Profile from "@/app/pages/Profile";
import Dashboard from "@/app/pages/Dashboard";

import RequireActivePlan from "@/app/components/RequireActivePlan";
import Devices from "@/app/pages/Devices";
import Alerts from "./pages/Alerts";
import Reports from "@/app/pages/Reports";

import { AboutPage } from "@/app/pages/AboutPage";
import { BlogPage } from "@/app/pages/BlogPage";
import { CareersPage } from "@/app/pages/CareersPage";
import { PartnersPage } from "@/app/pages/PartnersPage";
import { HelpCenterPage } from "./pages/HelpCenterPage";
import { CommunityPage } from "./pages/CommunityPage";
import { StatusPage } from "./pages/StatusPage";
import { SecurityPage } from "./pages/SecurityPage";

export const router = createBrowserRouter([
  // Auth / flujo sin layout
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/verification", Component: Verification },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/verify-reset-code", Component: VerifyResetCode },
  { path: "/change-password", Component: ChangePassword },
  { path: "/select-plan", Component: SelectPlan },
  { path: "/profile", Component: Profile },
  { path: "/mi-plan", Component: MiPlan },
  { path: "/inicio", Component: Inicio },
  { path: "/settings", Component: Settings },
  { path: "about", Component: AboutPage },
  { path: "blog", Component: BlogPage },
  { path: "careers", Component: CareersPage },
  { path: "partners", Component: PartnersPage },
  { path: "help", Component: HelpCenterPage },
  { path: "community", Component: CommunityPage },
  { path: "status", Component: StatusPage },
  { path: "security", Component: SecurityPage },

  {
    path: "/devices",
    element: (
      <RequireActivePlan>
        <Devices />
      </RequireActivePlan>
    ),
  },
  {
    path: "/alerts",
    element: (
      <RequireActivePlan>
        <Alerts />
      </RequireActivePlan>
    ),
  },
  {
    path: "/reports",
    element: (
      <RequireActivePlan>
        <Reports />
      </RequireActivePlan>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RequireActivePlan>
        <Dashboard />
      </RequireActivePlan>
    ),
  },

  // Rutas principales con RootLayout
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, Component: Home },
      { path: "features", Component: FeaturesPage },
      { path: "pricing", Component: PricingPage },
      { path: "contact", Component: ContactPage },

      // ✅ NUEVAS RUTAS LEGALES
      { path: "privacy", Component: PrivacyPage },
      { path: "terms", Component: TermsPage },
      { path: "cookies", Component: CookiesPage },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
