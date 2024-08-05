import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <h1>Mes prochains rendez-vous</h1>

      <Button asChild>
        <Link to="/profile">Profil</Link>
      </Button>
      <Button asChild>
        <Link to="/">accueil</Link>
      </Button>
    </div>
  );
}
