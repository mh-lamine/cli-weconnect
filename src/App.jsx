import { Routes, Route } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

import AuthLayout from "./layouts/AuthLayout";
import Layout from "./layouts/Layout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Account from "./pages/Account";
import ProviderPage from "./pages/ProviderPage";
import ErrorPage from "./pages/ErrorPage";
import logo from "/weconnect-no-bg.svg";
import { Toaster } from "sonner";
import { AlertCircle, CheckCircle } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import SubscribePage from "./pages/SubscribePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            <Route index element={<HomePage />} />
            <Route path="provider/:providerId" element={<ProviderPage />} />
          </Route>
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route path="info" element={<LandingPage />} />

        {/* auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="subscribe" element={<SubscribePage />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="account" element={<Account />} />
            </Route>
          </Route>
        </Route>

        {/* error routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Toaster
        position="top-right"
        icons={{
          success: <CheckCircle />,
          error: <AlertCircle />,
        }}
        toastOptions={{
          style: {
            display: "flex",
            gap: "2em",
            whiteSpace: "pre-line",
          },
          classNames: {
            error: "bg-destructive text-light",
            success: "bg-success text-light",
          },
        }}
        data-testid="toaster"
      />
    </>
  );
}

const PageLoader = () => (
  <div className="w-screen h-screen grid place-items-center bg-light">
    <img src={logo} alt="Logo" className="w-20 h-20 animate-spin" />
  </div>
);
