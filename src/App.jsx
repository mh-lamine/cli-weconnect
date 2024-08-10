import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import ClientLayout from "./layouts/ClientLayout";
import ProviderLayout from "./layouts/ProviderLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Salon from "./pages/Salon";
import ProviderPage from "./pages/ProviderPage";
import RegisterPage from "./pages/RegisterPage";
import ErrorPage from "./pages/ErrorPage";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import PersistLogin from "./components/PersistLogin";
import SalonPreferences from "./pages/SalonPreferences";
import Account from "./pages/Account";
import { useEffect } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import useAuth from "./hooks/useAuth";

export default function App() {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axiosPrivate.get("/users");
        setAuth({ ...prev, isProvider: response.data.isProvider });
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="salon" element={<Salon />} />
            <Route path="salon/preferences" element={<SalonPreferences />} />
          </Route>
        </Route>
      </Route>

      {/* error routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
