import { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

import AuthLayout from "./layouts/AuthLayout";
import ClientLayout from "./layouts/ClientLayout";
import ProviderLayout from "./layouts/ProviderLayout";

import useAuth from "./hooks/useAuth";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Account from "./pages/Account";
import ProviderPage from "./pages/ProviderPage";
import ErrorPage from "./pages/ErrorPage";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Salon = lazy(() => import("./pages/Salon"));
const SalonInformations = lazy(() => import("./pages/SalonInformations"));
const SalonAvailabilities = lazy(() => import("./pages/SalonAvailabilities"));
const SalonServices = lazy(() => import("./pages/SalonServices"));

export default function App() {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axiosPrivate.get("/api/users");
        setAuth({ isProvider: response.data.isProvider });
      } catch (error) {
        console.error(error);
      }
    }
    getUser();
  }, []);

  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="provider/:providerId" element={<ProviderPage />} />
      </Route>

      {/* auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* protected routes */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route element={<ClientLayout />}>
            <Route path="account" element={<Account />} />
          </Route>
          <Route element={<ProviderLayout />}>
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<div>Chargement...</div>}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="salon"
              element={
                <Suspense fallback={<div>Chargement...</div>}>
                  <Salon />
                </Suspense>
              }
            />
            <Route
              path="salon/informations"
              element={
                <Suspense fallback={<div>Chargement...</div>}>
                  <SalonInformations />
                </Suspense>
              }
            />
            <Route
              path="salon/availabilities"
              element={
                <Suspense fallback={<div>Chargement...</div>}>
                  <SalonAvailabilities />
                </Suspense>
              }
            />
            <Route
              path="salon/services"
              element={
                <Suspense fallback={<div>Chargement...</div>}>
                  <SalonServices />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>

      {/* error routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
