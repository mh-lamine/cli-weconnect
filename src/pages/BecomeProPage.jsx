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
  const [providerInfos, setProviderInfos] = useState({
    providerName: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const { auth } = useAuth();

  const handleChange = (e) => {
    setProviderInfos((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!providerInfos.providerName || !providerInfos.address) {
      toast.error("Veuillez renseigner tous les champs");
      return;
    }
    if (tags.length === 0) {
      toast.error("Veuillez sélectionner au moins une activité");
      return;
    }
    try {
      const response = await axiosPrivate.patch("/api/users", {
        isProvider: true,
        ...providerInfos,
      });

      console.log(response.data);
    } catch (error) {
      toast.error(error);
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
            name="providerName"
            className="bg-transparent border-b border-primary font-medium focus-visible:ring-0 focus:outline-none"
          />
        </p>
        <p className="text-xl">
          Il se situe au{" "}
          <input
            type="text"
            name="address"
            onChange={handleChange}
            className="bg-transparent border-b border-primary font-medium focus-visible:ring-0 focus:outline-none"
          />
        </p>
        <p className="text-xl">
          Je suis joignable au{" "}
          <input
            type="tel"
            name="phoneNumber"
            value={auth?.phoneNumber}
            disabled
            onChange={handleChange}
            className="bg-transparent border-b border-primary font-medium focus-visible:ring-0 focus:outline-none text-muted"
          />
        </p>
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
          <div className="flex gap-2">
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
