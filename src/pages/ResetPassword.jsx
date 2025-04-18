import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { EyeOff, Loader2 } from "lucide-react";

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tokenAlreadyUsed, setTokenAlreadyUsed] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe sont différents");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      toast.error(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/reset-password", { token, newPassword });
      toast.success(
        "Nouveau mot de passe enregistré, redirection vers la page de connexion..."
      );
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      if (err.response.status === 403) {
        toast.error("Le lien de réinitialisation a déjà été utilisé");
      }
      if (err.response.status === 500) {
        toast.error("Le lien de réinitialisation a expiré");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4`">
      <h1 className="text-2xl font-medium">
        Entrez votre nouveau mot de passe
      </h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <Label>Nouveau mot de passe</Label>
          <div className="relative flex items-center">
            <Input
              type={showPassword ? "text" : "password"}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <EyeOff
              className="w-6 h-6 ml-auto absolute right-3 text-primary"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <div>
          <Label>Confirmer le nouveau mot de passe</Label>
          <Input
            type={showPassword ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Réintialiser le mot de passe"
          )}
        </Button>
      </form>
    </main>
  );
}
