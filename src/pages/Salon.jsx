import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PHONE_NUMBER_REGEX =
  /^(?:(?:\+|00)33\s?[1-9](?:[\s.-]?\d{2}){4}|0[1-9](?:[\s.-]?\d{2}){4})$/;

const EMAIL_REGEX =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
export default function Salon() {
  const [provider, setProvider] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const [edit, setEdit] = useState(false);
  const [providerInfos, setProviderInfos] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  async function getProvider() {
    try {
      const response = await axiosPrivate.get("/users");
      setProvider(response.data);
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    getProvider();
  }, []);

  const handleChange = (e) => {
    setProviderInfos({ ...providerInfos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    if (
      providerInfos.phoneNumber &&
      !PHONE_NUMBER_REGEX.test(providerInfos.phoneNumber)
    ) {
      setEditError("Le numéro de téléphone n'est pas valide");
      setEditLoading(false);
      return;
    }
    if (providerInfos.email && !EMAIL_REGEX.test(providerInfos.email)) {
      setEditError("L'adresse email n'est pas valide");
      setEditLoading(false);
      return;
    }
    const hasChanges = Object.keys(providerInfos).some(
      (key) => providerInfos[key] !== provider[key]
    );

    if (!hasChanges) {
      setEdit(false);
      setEditLoading(false);
      return;
    }
    try {
      await axiosPrivate.patch("/users", providerInfos);
      await getProvider();
    } catch (error) {
      if (!error.response) {
        setEditError("Une erreur est survenue, veuillez réessayer plus tard");
      } else {
        setEditError(error.response.data.message);
      }
    }
    setEdit(false);
    setEditLoading(false);
  };

  const clearInfos = () => {
    setProviderInfos({});
    document
      .querySelector("#provider-infos-section")
      .querySelectorAll("input")
      .forEach((input) => {
        if (providerInfos[input.name]) {
          input.value = provider.phoneNumber;
          return;
        }
        input.value = "";
      });
  };

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
  }

  if (error) {
    return <Error errMsg={error} />;
  }

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col space-y-4">
      <h1 className="text-3xl font-semibold">Mon salon</h1>
      <section id="provider-infos-section" className="space-y-2">
        <h2 className="text-2xl font-medium">Mes informations</h2>
        <div>
          <Label htmlFor="phoneNumber">Numero de telephone</Label>
          <Input
            disabled={!edit}
            name="phoneNumber"
            type="tel"
            value={!edit ? provider.phoneNumber : undefined}
            onChange={handleChange}
            className="text-lg"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            disabled={!edit}
            name="email"
            type="email"
            value={!edit ? provider.email : undefined}
            onChange={handleChange}
            className="text-lg"
          />
        </div>
        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input
            disabled={!edit}
            name="address"
            type="text"
            value={!edit ? provider.address : undefined}
            onChange={handleChange}
            className="text-lg"
          />
        </div>
        <div>
          <Label htmlFor="providerName">Nom du salon</Label>
          <Input
            disabled={!edit}
            name="providerName"
            type="text"
            value={!edit ? provider.providerName : undefined}
            onChange={handleChange}
            className="text-lg"
          />
        </div>
        <div>
          <Label htmlFor="autoAccept">Confirmation directe</Label>
          <div
            className={`${
              edit ? "bg-white" : "bg-white/50"
            } rounded-md px-3 py-2 space-y-4`}
          >
            <div className="flex items-center justify-between">
              <p className={!edit ? "text-muted" : ""}>
                Choisissez ou non d'accepter automatiquement les demandes de
                rendez-vous.
              </p>
              <Switch
                id="autoAccept"
                disabled={!edit}
                checked={
                  providerInfos.autoAcceptAppointments ||
                  provider.autoAcceptAppointments
                }
                onCheckedChange={(checked) =>
                  setProviderInfos({
                    ...providerInfos,
                    autoAcceptAppointments: checked,
                  })
                }
              />
            </div>
            <p className={`text-muted ${!edit && "hidden"}`}>
              Si vous choisissez de ne pas accepter automatiquement les demandes
              de rendez-vous, elles auront le status <b>En attente</b> tant que
              vous ne les aurez pas confirmées ou refusées.
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="vacancyMode" className="text-destructive">
            Mode vacances
          </Label>
          <div
            className={`${
              edit ? "bg-white" : "bg-white/50"
            } rounded-md px-3 py-2 space-y-4`}
          >
            <div className="flex items-center justify-between">
              <p className={!edit ? "text-muted" : "text-destructive"}>
                Passez en mode vacances pour ne plus recevoir de demandes de
                rendez-vous.
              </p>
              <Switch
                id="vacancyMode"
                disabled={!edit}
                checked={
                  providerInfos.isInVacancyMode || provider.isInVacancyMode
                }
                onCheckedChange={(checked) =>
                  setProviderInfos({
                    ...providerInfos,
                    isInVacancyMode: checked,
                  })
                }
                className="data-[state=checked]:bg-destructive"
              />
            </div>
            <p className={`text-muted ${!edit && "hidden"}`}>
              En cas de fermerture temporaire de votre salon, vous pouvez
              activer le mode vacances pour ne plus recevoir de demandes de
              rendez-vous pendant un certain temps.
            </p>
          </div>
        </div>
        {editError && setTimeout(() => setEditError(null), 3000) && (
          <p className="text-destructive text-sm">{editError}</p>
        )}
        {edit ? (
          <>
            <Button onClick={handleSubmit} disabled={editLoading && true}>
              {editLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
            <Button
              variant="outline"
              className="block"
              onClick={() => {
                setEdit(false);
                clearInfos();
              }}
            >
              Annuler les modifications
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => setEdit(true)}>
            Modifier mes informations
          </Button>
        )}
      </section>
    </main>
  );
}
