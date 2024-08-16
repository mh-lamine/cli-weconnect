import Error from "@/components/Error";
import ModalAddAvailability from "@/components/ModalAddAvailability";
import ModalRemoveAvailability from "@/components/ModalRemoveAvailability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2, MinusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SalonAvailabilities = () => {
  const daysOfWeek = {
    Lundi: "MONDAY",
    Mardi: "TUESDAY",
    Mercredi: "WEDNESDAY",
    Jeudi: "THURSDAY",
    Vendredi: "FRIDAY",
    Samedi: "SATURDAY",
    Dimanche: "SUNDAY",
  };

  const [availabilities, setAvailabilities] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getAvailabilities();
  }, []);

  async function getAvailabilities() {
    try {
      const response = await axiosPrivate.get("/api/availabilities");
      setAvailabilities(formatAvailabilities(response.data));
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setLoading(false);
  }

  async function createAvailability(availability) {
    await axiosPrivate.post("/api/availabilities", availability);
    getAvailabilities();
  }

  async function removeAvailability(id) {
    await axiosPrivate.delete(`/api/availabilities/${id}`);
    getAvailabilities();
  }

  function formatAvailabilities(availabilities) {
    const formatted = {};

    availabilities?.forEach(({ id, dayOfWeek, startTime, endTime }) => {
      if (!formatted[dayOfWeek]) {
        formatted[dayOfWeek] = [];
      }

      formatted[dayOfWeek].push({
        id,
        start: startTime,
        end: endTime,
      });
    });

    return formatted;
  }

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
  }

  if (error) {
    return <Error />;
  }

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
      {Object.entries(daysOfWeek).map(([dayFR, dayEN], i) => (
        <div key={i}>
          <DailyAvailability
            dayFR={dayFR}
            dayEN={dayEN}
            availabilities={availabilities[dayEN]}
            createAvailability={createAvailability}
            removeAvailability={removeAvailability}
          />
          {i !== Object.entries(daysOfWeek).length - 1 && (
            <div className="divider w-1/2 mx-auto" />
          )}
        </div>
      ))}
    </main>
  );
};

export default SalonAvailabilities;

const DailyAvailability = ({
  dayFR,
  dayEN,
  availabilities,
  createAvailability,
  removeAvailability,
}) => {
  return (
    <section
      className={`flex flex-col sm:flex-row gap-4 ${
        !availabilities?.length && "text-muted sm:items-center"
      }`}
    >
      <span className="text-xl font-medium sm:flex-1">{dayFR}</span>
      {availabilities?.length ? (
        <div className="space-y-2 sm:flex-2">
          {availabilities?.map(({ id, start, end }, i) => {
            return (
              <div key={i} className="flex gap-4">
                <Input
                  disabled
                  type="time"
                  defaultValue={start}
                  className="!opacity-100"
                />
                <div className="divider divider-horizontal m-0"></div>
                <Input
                  disabled
                  type="time"
                  defaultValue={end}
                  className="!opacity-100"
                />
                <ModalRemoveAvailability
                  id={id}
                  removeAvailability={removeAvailability}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="sm:flex-2">Fermé</div>
      )}
      <div className="flex sm:flex-1 justify-end">
        <ModalAddAvailability
          dayOfWeek={dayEN}
          createAvailability={createAvailability}
        />
      </div>
    </section>
  );
};
