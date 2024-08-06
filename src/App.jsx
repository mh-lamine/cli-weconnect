import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import ClientLayout from "./layouts/ClientLayout";
import ProviderLayout from "./layouts/ProviderLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import ProviderPage from "./pages/ProviderPage";
import RegisterPage from "./pages/RegisterPage";
import ErrorPage from "./pages/ErrorPage";
import Unauthorized from "./pages/Unauthorized";
import AuthLayout from "./layouts/AuthLayout";
import useAuth from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import PersistLogin from "./components/PersistLogin";

export default function App() {
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
          <Route element={<ProviderLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Route>

      {/* error routes */}
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
