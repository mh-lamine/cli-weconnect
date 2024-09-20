import axiosPrivate from "@/api/axiosPrivate";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import { Loader2, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const activities = [
  "Coiffure",
  "Esthétique",
  "Barbier",
  "Massage",
  "Manucure",
  "Pédicure",
  "Maquillage",
  "Coaching sportif",
  "Nutrition",
  "Relooking",
];

export default function BecomeProPage() {
  const [providerInfos, setProviderInfos] = useState({});
  const [contactMethods, setContactMethods] = useState({
    phoneNumber: "",
    instagram: "",
    email: "",
  });
  const [selectedContactMethods, setSelectedContactMethods] = useState({
    phoneNumber: false,
    instagram: false,
    email: false,
  });
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const { auth } = useAuth();

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    if (name === "contactMethod") {
      setContactMethods((prev) => ({ ...prev, [id]: value }));
      return;
    }
    setProviderInfos((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelect = (id, value) => {
    if (value === false) {
      setContactMethods((prev) => ({ ...prev, [id]: null }));
    }
    setSelectedContactMethods((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (auth.isProvider) {
      toast(
        "Vous êtes déjà prestataire, mais on apprécie la motivation !"
      );
      setLoading(false);
      return;
    }
    if (!providerInfos.providerName || !providerInfos.address) {
      toast.error("Veuillez renseigner tous les champs");
      setLoading(false);
      return;
    }
    if (tags.length === 0) {
      toast.error("Veuillez sélectionner au moins une activité");
      setLoading(false);
      return;
    }

    try {
      await axiosPrivate.patch("/api/users", {
        isProvider: true,
        ...providerInfos,
        contactMethods,
      });
      window.location.href = "https://pro.weconnect-rdv.fr";
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    }
    setLoading(false);
  };

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col">
      <h1 className="text-2xl font-semibold">
        Vous souhaitez devenir prestataire chez nous ?
      </h1>
      <p className="text-muted">Faisons connaissance</p>
      <form className="py-4 space-y-2" onSubmit={handleSubmit}>
        <p className="text-xl">
          Mon salon s'appelle{" "}
          <input
            type="text"
            onChange={handleChange}
            id="providerName"
            className="bg-transparent border-b border-primary font-medium focus-visible:ring-0 focus:outline-none"
          />
        </p>
        <p className="text-xl">
          Il se situe au{" "}
          <input
            type="text"
            id="address"
            onChange={handleChange}
            className="bg-transparent border-b border-primary font-medium focus-visible:ring-0 focus:outline-none"
          />
        </p>
        <div className="text-xl space-y-4">
          <p>Mes clients peuvent me contacter par :</p>
          <div className="flex gap-4">
            <ContactMethod
              id="phoneNumber"
              label="Téléphone"
              handleSelect={handleSelect}
            />
            <ContactMethod
              id="instagram"
              label="Instagram"
              handleSelect={handleSelect}
            />
            <ContactMethod
              id="email"
              label="Email"
              handleSelect={handleSelect}
            />
          </div>
          <div className="flex flex-col gap-4 max-w-sm">
            {selectedContactMethods.phoneNumber && (
              <input
                type="tel"
                id="phoneNumber"
                name="contactMethod"
                placeholder="Numéro de téléphone"
                onChange={handleChange}
                className="bg-transparent border-b border-primary font-medium focus-visible:ring-0 focus:outline-none"
              />
            )}
            {selectedContactMethods.instagram && (
              <input
                type="text"
                id="instagram"
                name="contactMethod"
                placeholder="Sous la forme @weconnect_off"
                onChange={handleChange}
                className="bg-transparent border-b border-primary font-medium focus-visible:ring-0 focus:outline-none"
              />
            )}
            {selectedContactMethods.email && (
              <input
                type="email"
                id="email"
                name="contactMethod"
                placeholder="Adresse email"
                onChange={handleChange}
                className="bg-transparent border-b border-primary font-medium focus-visible:ring-0 focus:outline-none"
              />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-xl ">Mes principales activités sont</p>
            <Select
              onValueChange={(value) => setTags((prev) => [...prev, value])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {activities.map((activity) => (
                    <SelectItem key={activity} value={activity}>
                      {activity}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tags.map((activity) => (
              <span
                key={activity}
                className="bg-primary-100 text-primary-800 rounded-full px-3 py-1 flex items-center gap-2 w-fit border border-primary"
              >
                {activity}{" "}
                <XCircleIcon
                  className="h-5 w-5"
                  onClick={() =>
                    setTags((prev) => prev.filter((a) => a !== activity))
                  }
                />
              </span>
            ))}
          </div>
        </div>
        <Button className="text-lg" type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Devenir prestataire"
          )}
        </Button>
      </form>
    </main>
  );
}

const ContactMethod = ({ id, label, handleSelect }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox onCheckedChange={(value) => handleSelect(id, value)} id={id} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
};
