import LeftArrow from "@/components/svg/LeftArrow";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Salon = () => {
  const navigate = useNavigate();
  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col">
      <Button
        variant="link"
        className="justify-start h-0 p-0"
        onClick={() => navigate(-1)}
      >
        Retour
      </Button>
      <h1 className="text-3xl font-semibold py-4">Mon salon</h1>
      <Link to="informations" className="flex items-center justify-between py-2">
        <h2 className="text-xl font-medium">Informations du salon</h2>
        <div className="rotate-180">
          <LeftArrow size={36} />
        </div>
      </Link>
      <div className="divider my-0"></div>
      <Link to="availabilities" className="flex items-center justify-between py-2">
        <h2 className="text-xl font-medium">Disponibilités</h2>
        <div className="rotate-180">
          <LeftArrow size={36} />
        </div>
      </Link>
      <div className="divider my-0"></div>
      <Link to="services" className="flex items-center justify-between py-2">
        <h2 className="text-xl font-medium">Prestations</h2>
        <div className="rotate-180">
          <LeftArrow size={36} />
        </div>
      </Link>
    </main>
  );
};

export default Salon;
