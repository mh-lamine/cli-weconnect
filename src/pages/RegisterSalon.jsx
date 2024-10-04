import { Button } from "@/components/ui/button";
import { EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import axios from "axios";

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export default function RgisterSalon() {
  const [salonInfos, setSalonInfos] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSalonInfos((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !salonInfos.name ||
      !salonInfos.address ||
      !salonInfos.phoneNumber ||
      !salonInfos.email
    ) {
      toast.error("Veuillez renseigner tous les champs");
      setLoading(false);
      return;
    }

    if (!PASSWORD_REGEX.test(salonInfos.password)) {
      toast.error(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      );
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/auth/salon/register", salonInfos);
      window.location.href = "https://enterprise.weconnect-rdv.fr";
    } catch (error) {
      console.log(error);
      if (error.response.status === 409) {
        toast.error(
          "Un salon existe déjà avec ce numéro de téléphone ou cet email"
        );
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    }
    setLoading(false);
  };

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col">
      <h1 className="text-2xl font-semibold">
        Vous souhaitez enregistrer votre salon ?
      </h1>
      <p className="text-muted">Faisons connaissance</p>
      <form
        className="py-4 space-y-2 text-lg flex flex-col gap-4 max-w-96"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          onChange={handleChange}
          placeholder="Nom du salon"
          id="name"
        />
        <Input
          type="text"
          id="address"
          placeholder="Adresse du salon"
          onChange={handleChange}
        />
        <Input
          type="tel"
          id="phoneNumber"
          placeholder="Numéro de téléphone"
          onChange={handleChange}
        />
        <div className="space-y-2">
          <Input
            type="email"
            id="email"
            placeholder="Adresse email"
            onChange={handleChange}
          />
          <p className="text-xs text-muted">
            Cet email servira d'identifiant de connexion pour vous et les
            membres que vous ajouterez.
          </p>
        </div>
        <div className="relative flex items-center">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            onChange={handleChange}
          />
          <EyeOff
            className="w-6 h-6 ml-auto absolute right-3 text-primary"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        <Button className="text-lg" type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Créer mon salon"}
        </Button>
      </form>
    </main>
  );
}
