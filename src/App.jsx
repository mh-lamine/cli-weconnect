import { useEffect, lazy, useState } from "react";
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
import logo from "/weconnect-no-bg.svg";

const Admin = lazy(() => import("./pages/Admin"));

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
    return (
        <PageLoader />
    );
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
          </Route>
        </Route>
      </Route>

      {/* admin routes */}
      <Route path="admin" element={<Admin />} />

      {/* error routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

const PageLoader = () => (
  <div className="w-screen h-screen grid place-items-center bg-light">
    <img src={logo} alt="Logo" className="w-20 h-20 animate-spin" />
  </div>
);
