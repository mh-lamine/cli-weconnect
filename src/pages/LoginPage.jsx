import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleLogin } from "@/actions/authActions";
import { Loader2 } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const { setAuth } = useAuth();
  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || { pathname: "/" };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { accessToken, isProvider } = await handleLogin(
        credentials,
        "login"
      );
      setAuth({ ...credentials, accessToken, isProvider });
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response.status === 401) {
        setError("Numéro de téléphone ou mot de passe incorrect");
      } else {
        setError("Une erreur est survenue, veuillez réessayer plus tard");
      }
    }
    setLoading(false);
  };
  return (
    <div className="text-center space-y-2 w-4/5 max-w-[500px]">
      <h1 className="text-3xl font-semibold">Se connecter</h1>
      <form className="space-y-2 py-2">
        <Input
          name="phoneNumber"
          type="tel"
          placeholder="Numéro de téléphone"
          onChange={handleChange}
          onClick={() => setError("")}
        />
        <Input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          onClick={() => setError("")}
        />
      </form>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button onClick={handleSubmit} disabled={loading && true}>
        {loading ? <Loader2 className="animate-spin" /> : "Se connecter"}
      </Button>
      <Button asChild variant="link" className="block">
        <Link to={"/register"}>Créer un compter</Link>
      </Button>
    </div>
  );
}
