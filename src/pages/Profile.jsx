import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Profile() {
  const [provider, setProvider] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function getProvider() {
      try {
        const response = await axiosPrivate.get("/users");
        setProvider(response.data);
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
    <div className="flex flex-col items-center space-y-2">
      <div>
        <p>{provider.phoneNumber}</p>
        <p>{provider.address}</p>
      </div>

      <Button asChild>
        <Link to="/dashboard">Tableau de bord</Link>
      </Button>
      <Button asChild>
        <Link to="/">accueil</Link>
      </Button>
    </div>
  );
}
