import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleLogin } from "@/actions/authActions";
import { EyeOff, Loader2 } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function LoginPage() {
  const { setAuth, persist, setPersist } = useAuth();
  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || { pathname: "/" };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePersist = () => {
    setPersist(!persist);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await handleLogin(credentials, "login");
      setAuth(response.data);
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("Numéro de téléphone ou mot de passe incorrect");
      } else {
        toast.error("Une erreur est survenue, veuillez contacter le support");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className="text-center flex flex-col gap-4 w-4/5 max-w-[500px]">
      <h1 className="text-3xl font-semibold">Se connecter</h1>
      <form className="space-y-2 py-2">
        <Input
          name="phoneNumber"
          type="tel"
          placeholder="Numéro de téléphone"
          onChange={handleChange}
        />
        <div className="relative flex items-center">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            onChange={handleChange}
          />
          <EyeOff
            className="w-6 h-6 ml-auto absolute right-3 text-primary"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className="items-top flex items-center pt-2 space-x-2">
          <Checkbox id="terms1" onClick={togglePersist} checked={persist} />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Rester connecté
            </label>
          </div>
        </div>
      </form>
      <Button onClick={handleSubmit} disabled={loading && true}>
        {loading ? <Loader2 className="animate-spin" /> : "Se connecter"}
      </Button>
      <p className="text-muted text-xs font-light ">
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
      <div className="divider mb-0">Pas encore inscrit ?</div>
      <Button asChild variant="outline">
        <Link to={"/register"}>Créer un compter</Link>
      </Button>
    </div>
  );
}
