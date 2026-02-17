import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { Home } from "./pages/Home";
import { FeaturesPage } from "./pages/FeaturesPage";
import { PricingPage } from "./pages/PricingPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { VerifyResetCode } from "./pages/VerifyResetCode";
import { ChangePassword } from "./pages/ChangePassword";
import { SelectPlan } from "./pages/SelectPlan"; // ← Nueva importación
import { Verification } from "./pages/Verification"; // ← Nueva importación

export const router = createBrowserRouter([
  
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/verify-reset-code", Component: VerifyResetCode },
  { path: "/change-password", Component: ChangePassword },
  { path: "/select-plan", Component: SelectPlan }, // ← Ruta agregada
  { path: "/verification", Component: Verification }, // ← Ruta agregada
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "features", Component: FeaturesPage },
      { path: "pricing", Component: PricingPage },
      { path: "contact", Component: ContactPage },
      { path: "*", Component: NotFound },
    ],
  },
]);