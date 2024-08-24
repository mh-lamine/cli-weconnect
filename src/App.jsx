import { useEffect, lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

import AuthLayout from "./layouts/AuthLayout";
import Layout from "./layouts/Layout";

import useAuth from "./hooks/useAuth";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Account from "./pages/Account";
import ProviderPage from "./pages/ProviderPage";
import ErrorPage from "./pages/ErrorPage";
import { Loader2 } from "lucide-react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Salon = lazy(() => import("./pages/Salon"));
const SalonInformations = lazy(() => import("./pages/SalonInformations"));
const SalonAvailabilities = lazy(() => import("./pages/SalonAvailabilities"));
const SalonServices = lazy(() => import("./pages/SalonServices"));

export default function App() {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axiosPrivate.get("/api/users");
        setAuth((prev) => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Layout />}>
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
          <Route element={<Layout />}>
            <Route path="account" element={<Account />} />
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="salon"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Salon />
                </Suspense>
              }
            />
            <Route
              path="salon/informations"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SalonInformations />
                </Suspense>
              }
            />
            <Route
              path="salon/availabilities"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SalonAvailabilities />
                </Suspense>
              }
            />
            <Route
              path="salon/services"
              element={
                <Suspense fallback={<PageLoader />}>
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

const PageLoader = () => (
  <div className="w-screen h-screen grid place-items-center bg-light">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);
