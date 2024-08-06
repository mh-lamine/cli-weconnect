import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import useLogout from "@/hooks/useLogout";
import useAuth from "@/hooks/useAuth";

export default function Header() {
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  
  return (
    <div className="navbar text-primary-800 bg-light shadow-sm px-8">
      <div className="flex-1 justify-between">
        <Link to={"/"} className="text-xl font-semibold">
          WeConnect
        </Link>

        {auth ? (
          <Button onClick={handleLogout}>Déconnexion</Button>
        ) : (
          <Button asChild variant={"ghost"}>
            <Link to={"login"}>
              <span className="px-2">Connexion</span>
              <User />
            </Link>
          </Button>
        )}

        <Link to="dashboard">Tableau de bord</Link>
      </div>
    </div>
  );
}
