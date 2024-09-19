import EditableInput from "@/components/EditableInput";
import ClientAppointment from "@/components/ClientAppointment";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLogout from "@/hooks/useLogout";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const PHONE_NUMBER_REGEX =
  /^(?:(?:\+|00)33\s?[1-9](?:[\s.-]?\d{2}){4}|0[1-9](?:[\s.-]?\d{2}){4})$/;

const Account = () => {
  const { auth, setAuth } = useAuth();
  const [appointments, setAppointments] = useState();
  const [userInfos, setUserInfos] = useState();
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState("");
  const logout = useLogout();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  async function getUser() {
    try {
      const response = await axiosPrivate.get("/api/users");
      setAuth((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error(error);
    }
  }

  async function getAppointmentsAsClient() {
    setApiLoading(true);
    try {
      const response = await axiosPrivate.get("/api/appointments/client");
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setApiLoading(false);
    }
  }

  useEffect(() => {
    getAppointmentsAsClient();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setUserInfos({ ...userInfos, [e.target.id]: e.target.value });
  };

  const cancelAppointment = async (id) => {
    try {
      await axiosPrivate.patch(`/api/appointments/${id}`, {
        status: "CANCELLED",
      });
      await getAppointmentsAsClient();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const hasChanges = Object.keys(auth).some(
      (key) => auth[key] !== userInfos[key]
    );

    if (!hasChanges) {
      setUserInfos();
      setLoading(false);
      return;
    }

    for (const info in userInfos) {
      if (userInfos[info] === "") {
        setError("Veuillez renseigner tous les champs");
        setLoading(false);
        return;
      }
    }

    if (
      userInfos.phoneNumber &&
      !PHONE_NUMBER_REGEX.test(userInfos.phoneNumber)
    ) {
      setError("Le numéro de téléphone n'est pas valide");
      setLoading(false);
      return;
    }
    // if (userInfos.email && !EMAIL_REGEX.test(userInfos.email)) {
    //   setError("L'adresse email n'est pas valide");
    //   setLoading(false);
    //   return;
    // }

    try {
      await axiosPrivate.patch("/api/users", userInfos);
      await getUser();
    } catch (error) {
      if (!error.response) {
        setError("Une erreur est survenue, veuillez contacter le support");
      } else {
        setError(error.response.data.message);
      }
    }
    setUserInfos();
    setLoading(false);
  };

  const SkeletonList = Array.from({ length: 1 });

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
      <Button
        variant="link"
        className="justify-start h-0 p-0"
        onClick={() => navigate(-1)}
      >
        Retour
      </Button>
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsContent value="appointments">
          <h1 className="text-3xl font-semibold">Mes prochains rendez-vous</h1>
        </TabsContent>
        <TabsContent value="infos">
          <h1 className="text-3xl font-semibold">
            Mes informations personnelles
          </h1>
        </TabsContent>
        <TabsList>
          <TabsTrigger value="appointments">Mes rendez-vous</TabsTrigger>
          <TabsTrigger value="infos">Mes informations</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments" className="space-y-4">
          {apiLoading ? (
            SkeletonList.map((_, index) => <AppointmentSkeleton key={index} />)
          ) : appointments?.futureAppointments.length ? (
            <>
              <p className="text-muted">
                Vous avez {appointments?.futureAppointments.length} rendez-vous
                à venir
              </p>
              {appointments.futureAppointments
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((appointment) => (
                  <ClientAppointment
                    key={appointment.id}
                    appointment={appointment}
                    cancelAppointment={cancelAppointment}
                  />
                ))}
              <div className="divider divider-start text-muted">
                Mes rendez-vous passés
              </div>
              {appointments.pastAppointments?.length &&
                appointments.pastAppointments
                  .map((appointment) => (
                    <ClientAppointment
                      key={appointment.id}
                      appointment={appointment}
                      past={true}
                    />
                  ))}
            </>
          ) : (
            <p className="text-muted">
              {" "}
              Vous n'avez aucun rendez-vous à venir.
            </p>
          )}
        </TabsContent>
        <TabsContent value="infos">
          <form className="space-y-2">
            <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
              <EditableInput
                id="firstName"
                label="Prénom"
                type="text"
                defaultValue={auth.firstName}
                handleChange={handleChange}
              />
              <EditableInput
                id="lastName"
                label="Nom"
                type="text"
                defaultValue={auth.lastName}
                handleChange={handleChange}
              />
              <EditableInput
                id="phoneNumber"
                label="Téléphone"
                type="tel"
                defaultValue={auth.phoneNumber}
                handleChange={handleChange}
              />
              {/* <EditableInput
                id="email"
                label="Email"
                type="email"
                defaultValue={auth.email}
                handleChange={handleChange}
              /> */}
            </div>
            {error && setTimeout(() => setError(null), 3000) && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            {userInfos && (
              <>
                <Button onClick={handleSubmit} disabled={loading && true}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </Button>
                <Button variant="outline" className="block">
                  Annuler les modifications
                </Button>
              </>
            )}
          </form>
        </TabsContent>
      </Tabs>
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="w-fit mt-auto"
      >
        Se déconnecter
      </Button>
    </main>
  );
};

export default Account;

const AppointmentSkeleton = () => {
  const Skel = () => (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-1/4 h-6" />
      <div className="flex gap-4">
        <Skeleton className="w-[100px] h-2" />
        <Skeleton className="w-[150px] h-2" />
      </div>
      <Skeleton className="w-1/3 h-4" />
      <Skeleton className="w-1/3 h-4" />
      <Skeleton className="w-[100px] h-4" />
      <Skeleton className="w-full h-8" />
    </div>
  );
  return (
    <>
      <Skeleton className="w-1/4 h-2 mb-10" />
      <Skel />
      <Skel />
    </>
  );
};
