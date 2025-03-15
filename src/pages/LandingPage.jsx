import { Button } from "@/components/ui/button";
import {
  CalendarRange,
  CheckCircle2,
  Crown,
  Loader2,
  Rocket,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { FEATURES } from "@/utils/enum";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
  });
  const [contactMethod, setContactMethod] = useState("instagram");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, contact } = formData;

    if (!name || !contact) {
      return toast.error("Veuillez remplir tous les champs");
    }

    try {
      setLoading(true);
      await axios.post("/api/actions/contact-me", formData);
      toast.success(`Merci ${name}, on vous rappelle au plus vite !`);
    } catch (error) {
      console.error(error);
      return toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setFormData({
        name: "",
        contact: "",
      });
    }
  };

  return (
    <div className="w-screen flex flex-col bg-light text-dark">
      <header className="relative h-[calc(100vh-4em)] p-8 text-center md:text-left flex flex-col md:flex-row items-center w-full gap-4 md:gap-4 justify-around max-w-screen-2xl mx-auto">
        <div className="space-y-4 md:space-y-12">
          <h1 className="text-4xl md:text-6xl font-bold">
            Optimisez la gestion de votre emploi du temps
          </h1>
          <p className="text-sm md:text-xl text-muted">
            Simplifiez la prise de rendez-vous et offrez à vos clients une
            expérience de réservation fluide et efficace.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Button asChild size="lg" className="md:text-lg">
              <a
                onClick={() => {
                  document
                    .getElementById("discover")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                Découvrir
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size={"lg"}
              className="md:text-lg"
            >
              <Link to="/subscribe">S'inscrire</Link>
            </Button>
          </div>
        </div>
        <div>
          <img src="/phones_landing_2.png" />
        </div>
      </header>
      <main id="discover" className="pt-16">
        <section className="space-y-4 bg-white p-8">
          <h2 className="text-2xl font-semibold">
            Une solution complète pour les professionnels de beauté et soin
          </h2>
          <ul className="flex flex-col gap-4 text-lg">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-primary" />
              Prise de rendez-vous en ligne
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-primary" />
              Gestion des prestations & disponibilités
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-primary" />
              Notifications en direct par SMS
            </li>
          </ul>
          <p>
            Boostez votre activité avec notre plateforme intuitive et
            performante.
          </p>
        </section>
        <section className="bg-primary-50 p-8">
          <h2 className="text-2xl font-semibold">
            Trouvez la formule qui vous convient
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <p className="flex gap-2 text-primary">
                  Essentiel (le plus simple) <CalendarRange />
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <OfferDetails currentPlan="essential" />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <p className="flex gap-2 text-primary">
                  Pro (le plus populaire) <Crown fill="#b361d4" />
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <p className="pb-4 text-muted">
                  Inclut les fonctionnalités de l'offre Essentiel, plus:
                </p>
                <OfferDetails currentPlan="pro" />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <p className="flex gap-2 text-primary">
                  Entreprise (le plus complet) <Rocket />
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <p className="pb-4 text-muted">
                  Inclut les fonctionnalités de l'offre Pro, plus:
                </p>
                <OfferDetails currentPlan="enterprise" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        <section className="space-y-4 p-8 bg-white">
          <h2 className="text-2xl font-semibold">
            Prêt(e) à réinventer la gestion de votre salon ?
          </h2>
          <p className="text-muted">
            Remplissez le formulaire de contact et notre équipe vous
            recontactera rapidement pour créer votre salon.
          </p>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 border border-light/50 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-semibold">Parlez-nous de vous</h3>
            <div>
              <Label htmlFor="name">Nom du salon</Label>
              <Input
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="contactMethod">Être contacté par</Label>
              <Select
                id="contactMethod"
                defaultValue={contactMethod}
                onValueChange={(value) => setContactMethod(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tel">Téléphone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {contactMethod === "instagram" && (
              <Input
                name="contact"
                type="text"
                value={formData.contact}
                placeholder="@weconnect_off"
                onChange={handleChange}
              />
            )}
            {contactMethod === "tel" && (
              <Input
                name="contact"
                type="tel"
                value={formData.contact}
                placeholder="0600000000"
                onChange={handleChange}
              />
            )}
            {contactMethod === "email" && (
              <Input
                name="contact"
                type="email"
                value={formData.contact}
                placeholder="contact@weconnect-rdv.fr"
                onChange={handleChange}
              />
            )}
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Envoyer"}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}

const OfferDetails = ({ currentPlan }) => (
  <ul className="flex flex-col gap-2">
    {FEATURES.filter((feature) => feature.plan === currentPlan).map(
      (feature, i) => (
        <li index={i} className="flex items-center gap-2">
          <CheckCircle2 className="text-success" />
          {feature.title}
        </li>
      )
    )}
  </ul>
);
