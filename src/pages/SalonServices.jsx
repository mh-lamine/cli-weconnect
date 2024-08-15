import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SalonServices = () => {
    const navigate = useNavigate();
  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col space-y-4">
      <Button
        variant="link"
        className="justify-start h-0 p-0"
        onClick={() => navigate(-1)}
      >
        Retour
      </Button>
      <h1 className="text-3xl font-semibold">Mes prestations</h1>
    </main>
  );
};

export default SalonServices;
