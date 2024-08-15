import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalonAvailabilities = () => {
  const daysOfWeek = {
    Lundi: "Monday",
    Mardi: "Tuesday",
    Mercredi: "Wednesday",
    Jeudi: "Thursday",
    Vendredi: "Friday",
    Samedi: "Saturday",
    Dimanche: "Sunday",
  };

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
      <h1 className="text-3xl font-semibold">Mes disponibilités</h1>
      {Object.entries(daysOfWeek).map(([dayFR, dayEN]) => (
        <Availability key={dayEN} dayOfWeek={dayFR} />
      ))}
    </main>
  );
};

export default SalonAvailabilities;

const Availability = ({
  dayOfWeek,
  addAvailability,
  setNewAvailabilities,
  removeAvailability,
  startTime="10:00",
}) => {
  return (
    <section className="flex">
      <span className="text-xl font-medium flex-1">{dayOfWeek}</span>
      <div className="space-y-2 flex-2">
        <div className="flex gap-4">
          <Input type="time" defaultValue={startTime} />
          <div className="divider divider-horizontal m-0"></div>
          <Input type="time" />
          <Button variant="outline">
            <MinusCircle className="text-destructive" />
          </Button>
        </div>
        <div className="flex gap-4">
          <Input type="time" />
          <div className="divider divider-horizontal m-0"></div>
          <Input type="time" />
          <Button variant="outline">
            <MinusCircle className="text-destructive" />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 justify-end">
        <Button >
          <PlusCircle />
        </Button>
      </div>
    </section>
  );
};
