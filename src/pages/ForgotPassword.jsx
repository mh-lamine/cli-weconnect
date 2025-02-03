import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const sendNewPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/forgot-password", {
        phoneNumber,
      });
      localStorage.setItem("resetToken", data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-medium">
        Recevez votre lien de réinitialisation par SMS
      </h1>
      <form onSubmit={sendNewPassword} className="space-y-2">
        <div>
          <Label>Numéro de téléphone</Label>
          <Input
            type="tel"
            placeholder="Numéro de téléphone"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Envoyer le lien"}
        </Button>
      </form>
    </main>
  );
}
