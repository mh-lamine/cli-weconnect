import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    !auth?.accessToken ? verifyRefreshToken() : setLoading(false);
  }, []);

  return !persist ? <Outlet /> : loading ? <Loader /> : <Outlet />;
};

export default PersistLogin;

const Loader = () => {
  return (
    <div className="bg-light h-screen grid place-items-center">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
};
