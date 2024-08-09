import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLogout from "@/hooks/useLogout";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Account = () => {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    async function getProvider() {
      try {
        const response = await axiosPrivate.get("/users");
        setUser(response.data);
      } catch (error) {
        setError(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
      setLoading(false);
    }
    getProvider();
  }, []);

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
  }

  if (error) {
    return <Error />;
  }
  return (
    <main className="flex flex-1 flex-col w-full max-w-screen-md mx-auto">
      <div>Account</div>
      {user.isProvider && (
        <Button asChild>
          <Link to="/dashboard">Tableau de bord</Link>
        </Button>
      )}
      <Button variant="destructive" onClick={handleLogout}>
        Se déconnecter
      </Button>
    </main>
  );
};

export default Account;
