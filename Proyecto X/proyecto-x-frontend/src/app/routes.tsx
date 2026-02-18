// src/router.tsx
import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./layouts/RootLayout";

import { Home } from "./pages/Home";
import { FeaturesPage } from "./pages/FeaturesPage";
import { PricingPage } from "./pages/PricingPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFound } from "./pages/NotFound";

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
  { path: "/devices", element: (<RequireActivePlan> <Devices /> </RequireActivePlan> )},
  { 
    path: "/alerts", 
    element: (
      <RequireActivePlan>
        <Alerts />
      </RequireActivePlan>
    ) 
  },
  { 
    path: "/reports", 
    element: (
      <RequireActivePlan>
        <Reports />
      </RequireActivePlan>
    ) 
  },
  { 
    path: "/dashboard", 
    element: (
      <RequireActivePlan>
        <Dashboard />
      </RequireActivePlan>
    ) 
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
    ],
  },

  { path: "*", element: <NotFound /> },
]);
