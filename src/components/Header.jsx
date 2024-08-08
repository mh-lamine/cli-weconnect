import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";

export default function Header() {

  return (
    <div className="navbar text-primary-800 bg-light shadow-sm px-8">
      <div className="flex-1 justify-between">
        <Link to={"/"} className="text-xl font-semibold">
          WeConnect
        </Link>
        <Button asChild variant={"ghost"}>
          <Link to={"account"}>
            <span className="px-2">Mon Compte</span>
            <User />
          </Link>
        </Button>
      </div>
    </div>
  );
}
