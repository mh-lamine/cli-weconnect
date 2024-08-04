import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const [provider, setProvider] = useState();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getProvider = async () => {
      try {
        const response = await axiosPrivate.get("/users");
        setProvider(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getProvider();
  }, []);

  return (
    <div>
      {provider && JSON.stringify(provider)}
      <Button asChild>
        <Link to="/salon">Tableau de bord</Link>
      </Button>
      <Button asChild>
        <Link to="/">accueil</Link>
      </Button>
    </div>
  );
}
