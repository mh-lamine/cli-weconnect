import { Outlet, useNavigate } from "react-router-dom";
import RandomQuotes from "@/components/RandomQuotes";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

const AuthLayout = () => {
  const navigate = useNavigate();
  return (
    <main className="w-screen min-h-screen flex flex-col lg:flex-row bg-primary-500 text-dark">
      <div className="relative p-4 lg:w-1/2 max-w-[500px] mx-auto lg:h-screen grid place-items-center">
        <RandomQuotes />
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="absolute bottom-10 left-10 lg:flex items-center gap-4 text-white hidden"
        >
          <MoveLeft />
          Retourner à l'accueil
        </Button>
      </div>
      <div className="py-4 bg-light flex-1 lg:flex-none lg:w-1/2 grid place-items-center rounded-t-3xl lg:rounded-3xl lg:m-4">
        <div className="w-full lg:shadow-none grid place-items-center">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
