import ProviderAppointment from "@/components/ProviderAppointment";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [appointments, setAppointments] = useState();
  const [apiLoading, setApiLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  async function getAppointmentsAsProvider() {
    try {
      const response = await axiosPrivate.get("/api/appointments/provider");
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setApiLoading(false);
    }
  }

  async function acceptAppointment(id) {
    try {
      await axiosPrivate.patch(`/api/appointments/${id}`, {
        status: "ACCEPTED",
      });
      getAppointmentsAsProvider();
    } catch (error) {
      console.error(error);
    }
  }

  async function cancelAppointment(id) {
    try {
      await axiosPrivate.patch(`/api/appointments/${id}`, {
        status: "CANCELLED",
      });
      getAppointmentsAsProvider();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAppointmentsAsProvider();
  }, []);

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
      <Button
        variant="link"
        className="justify-start h-0 p-0"
        onClick={() => navigate(-1)}
      >
        Retour
      </Button>
      <Tabs defaultValue="today" className="space-y-4">
        <TabsContent value="today">
          <h1 className="text-3xl font-semibold">
            Mes rendez-vous de la journée
          </h1>
        </TabsContent>
        <TabsContent value="incoming">
          <h1 className="text-3xl font-semibold">Mes demandes en attente</h1>
        </TabsContent>
        <div className="flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="incoming">À venir</TabsTrigger>
          </TabsList>
          <Link to="/salon">
            <Settings size={24} className="text-primary" />
          </Link>
        </div>
        <TabsContent value="today" className="space-y-4">
          {appointments?.todaysAppointments.length ? (
            <>
              <p className="text-muted">
                Vous avez {appointments?.todaysAppointments.length} rendez-vous
                aujourd'hui.
              </p>
              {appointments.todaysAppointments
                .filter((appointment) => appointment.status === "ACCEPTED")
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((appointment) => (
                  <ProviderAppointment
                    key={appointment.id}
                    appointment={appointment}
                    cancelAppointment={cancelAppointment}
                    today={true}
                  />
                ))}
              <div className="divider divider-start text-muted">
                Mes rendez-vous passés
              </div>
              {appointments.todaysAppointments
                .filter((appointment) => appointment.status === "COMPLETED")
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((appointment) => (
                  <ProviderAppointment
                    key={appointment.id}
                    appointment={appointment}
                    past={true}
                    today={true}
                  />
                ))}
            </>
          ) : (
            <p className="text-muted">
              {" "}
              Vous n'avez aucun rendez-vous aujourd'hui.
            </p>
          )}
        </TabsContent>
        <TabsContent value="incoming">
          {appointments?.futureAppointments.length ? (
            <>
              <p className="text-muted">
                Vous avez {appointments?.futureAppointments.length} demandes en
                attente
              </p>
              {appointments.futureAppointments.map((appointment) => (
                <ProviderAppointment
                  key={appointment.id}
                  appointment={appointment}
                  acceptAppointment={acceptAppointment}
                  cancelAppointment={cancelAppointment}
                />
              ))}
            </>
          ) : (
            <p className="text-muted">Vous n'avez aucune demande en attente.</p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
