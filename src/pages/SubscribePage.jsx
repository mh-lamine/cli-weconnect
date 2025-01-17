import LeftArrow from "@/components/svg/LeftArrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_NUMBER_REGEX =
  /^(?:(?:\+|00)33\s?[1-9](?:[\s.-]?\d{2}){4}|0[1-9](?:[\s.-]?\d{2}){4})$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const PRO_ENDPOINT = "/api/auth/pro/register";
const PRO_URL = "https://pro.weconnect-rdv.fr/";

const SALON_ENDPOINT = "/api/auth/salon/register";
const SALON_URL = "https://entreprise.weconnect-rdv.fr/";

export default function SubscribePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //retrieve plan from url query
  const plan = new URLSearchParams(window.location.search)
    .get("plan")
    ?.toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerForm = new FormData(e.target);

    const formData = {
      plan: registerForm.get("plan"),
      name: registerForm.get("name"),
      email: registerForm.get("email"),
      phoneNumber: registerForm.get("phoneNumber"),
      address: registerForm.get("address"),
      password: registerForm.get("password"),
    };

    const { plan, name, email, phoneNumber, address, password } = formData;

    if (!plan || !name || !email || !phoneNumber || !address || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      toast.error("L'adresse email n'est pas valide");
      return;
    }

    if (!PHONE_NUMBER_REGEX.test(phoneNumber)) {
      toast.error("Le numéro de téléphone n'est pas valide");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      toast.error(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      );
      return;
    }

    try {
      setLoading(true);

      if (plan === "ESSENTIAL" || plan === "PRO") {
        await axios.post(PRO_ENDPOINT, formData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        window.location.href = PRO_URL;
      }
      if (plan === "ENTERPRISE") {
        await axios.post(SALON_ENDPOINT, formData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        window.location.href = SALON_URL;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 409) {
        toast.error("Cet email est déjà utilisé");
      } else {
        toast.error("Une erreur est survenue, veuillez contacter le support");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:items-center pb-4">
      <header className="relative h-[30vh] bg-[url('/Shot.png')] bg-cover bg-center w-full flex items-end p-4">
        <h1 className="md:hidden text-2xl font-semibold text-white pb-4">
          Parlez-nous de vous !
        </h1>
        <span
          className="absolute top-0 left-0 m-2 p-2 z-10"
          onClick={() => navigate("/info")}
        >
          <LeftArrow theme={"light"} size={36} />
        </span>
      </header>
      <form
        onSubmit={handleSubmit}
        className="z-10 space-y-2 p-4 max-w-screen-lg w-full -mt-4 md:mt-0 bg-white rounded-t-xl"
      >
        <h1 className="hidden md:block text-3xl font-semibold text-center">
          Parlez-nous de vous !
        </h1>
        <div>
          <Label htmlFor="name">Nom du salon</Label>
          <Input id="name" name="name" type="text" />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
          <Input id="phoneNumber" name="phoneNumber" type="tel" />
        </div>
        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" name="address" type="text" />
        </div>
        <div className="divider"></div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="text" autofill="new-password" />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative flex items-center">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
            />
            <EyeOff
              className="w-6 h-6 ml-auto absolute right-3 text-primary"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="plan">Offre</Label>
          <Select id="plan" name="plan" defaultValue={plan}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ESSENTIAL">Essentiel</SelectItem>
                <SelectItem value="PRO">Pro</SelectItem>
                <SelectItem value="ENTERPRISE">Entreprise</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin" /> : "Créer un compte"}
        </Button>
      </form>
      <footer className="px-4 max-w-screen-lg w-full">
        <p className="text-muted text-xs font-light text-center">
          En créant un compte, vous acceptez les{" "}
          <Button asChild variant="link" className="py-0 text-xs">
            <Link>termes et conditions d'utilisation</Link>
          </Button>{" "}
          et la{" "}
          <Button asChild variant="link" className="py-0 text-xs">
            <Link>politique de confidentialité</Link>
          </Button>
          .
        </p>
        <div className="divider">Déjà inscrit ?</div>
        <div className="flex flex-col gap-2 md:gap-4">
          <Button asChild variant="outline" className="w-full">
            <Link to={"https://pro.weconnect-rdv.fr/login"}>
              Se connecter en tant que prestataire
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to={"https://entreprise.weconnect-rdv.fr/login"}>
              Se connecter en tant que salon
            </Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
