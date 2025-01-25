import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, MoveLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="w-screen min-h-screen flex flex-col bg-light text-dark">
      <header className="relative p-8 h-screen text-center md:text-left flex flex-col justify-center md:flex-row items-center w-full gap-4 max-w-screen-2xl mx-auto">
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
        <img src="/phones_landing.png" className="md:w-1/2" />
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="absolute bottom-10 left-10 flex items-center gap-4 text-primary"
        >
          <MoveLeft />
          Retourner à l'accueil
        </Button>
      </header>
      <main id="discover">
        <Tabs
          defaultValue="pro"
          className="space-y-8 w-full md:hidden mx-auto p-8"
        >
          <div className="divider before:bg-primary after:bg-primary">
            <h2 className="text-2xl font-semibold md:text-4xl text-center">
              Nos formules
            </h2>
          </div>
          <div className="text-center">
            <TabsList>
              <TabsTrigger value="essential">Essentiel</TabsTrigger>
              <TabsTrigger value="pro" className="flex gap-2">
                Pro{" "}
                <span>
                  <Crown size={20} />
                </span>
              </TabsTrigger>
              <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
            </TabsList>
          </div>
          <div className="max-w-screen-sm mx-auto">
            <TabsContent
              value="essential"
              className="space-y-4 bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-lg"
            >
              <div>
                <h2 className="text-xl font-semibold">WeConnect Essentiel</h2>
                <p className="text-muted">
                  Pour les prestataires qui démarrent ou qui ont peu de clients.
                </p>
              </div>
              <ul className="space-y-4">
                <li>Gestion des rendez-vous</li>
                <li>Gestion des prestations (jusqu’a 4 prestations)</li>
                <li>Gestion des disponibilités hebdomadaires</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/subscribe?plan=essential">Choisir</Link>
              </Button>
            </TabsContent>
            <TabsContent
              value="pro"
              className="space-y-4 bg-primary-100 p-8 rounded-lg"
            >
              <div>
                <h2 className="text-xl font-semibold">WeConnect Pro</h2>
                <p className="text-muted">
                  Pour les prestataires qui souhaitent passer au niveau
                  supérieur.
                </p>
              </div>
              <ul className="space-y-4">
                <p className="text-primary">
                  Inclut les fonctionnalités du plan Essentiel, plus :
                </p>
                <li>Prestations illimitées</li>
                <li>Gestion des disponibilités sur des journées précises</li>
                <li>Notifications des demandes rendez-vous par SMS</li>
                <li>Validation automatique des demandes de rendez-vous</li>
                <li>TPE pour les paiements sur place</li>
                <li>Paiement en ligne + acompte</li>
                <li>Ajout de photos du salon</li>
                <li>Avis clients</li>
                <li>Statistiques d’activité</li>
                <li>Support</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/subscribe?plan=pro">Choisir</Link>
              </Button>
            </TabsContent>
            <TabsContent
              value="entreprise"
              className="space-y-4 bg-gradient-to-l from-primary-200 to-primary-100 p-8 rounded-lg"
            >
              <div>
                <h2 className="text-xl font-semibold">WeConnect Entreprise</h2>
                <p className="text-muted">
                  Pour les salons de plusieurs employés qui recherchent une
                  solution de gestion complète.
                </p>
              </div>
              <ul className="space-y-4">
                <p className="text-primary">
                  Inclut les fonctionnalités du plan Pro, plus :
                </p>
                <li>Ajout de membres affiliés</li>
                <li>Gestion des disponibilités par membre</li>
                <li>Gestion des disponibilités par prestation</li>
                <li>Acomptes personnalisés par prestation</li>
                <li>Support prioritaire</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/subscribe?plan=enterprise">Choisir</Link>
              </Button>
            </TabsContent>
          </div>
        </Tabs>
        <section className="hidden md:block w-full md:max-w-screen-2xl mx-auto p-8 min-h-screen">
          <div className="divider before:bg-primary after:bg-primary">
            <h2 className="text-2xl font-semibold md:text-4xl text-center">
              Nos formules
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4">
            <div className="flex flex-col gap-4 bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-l-2xl rounded-r-sm">
              <div>
                <h2 className="text-xl font-semibold">WeConnect Essentiel</h2>
                <p className="text-muted">
                  Pour les prestataires qui démarrent ou qui ont peu de clients.
                </p>
              </div>
              <ul className="space-y-4">
                <li>Gestion des rendez-vous</li>
                <li>Gestion des prestations (jusqu’a 4 prestations)</li>
                <li>Gestion des disponibilités hebdomadaires</li>
              </ul>
              <Button asChild className="mt-auto">
                <Link to="/subscribe?plan=essential">Choisir</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-4 bg-primary-100 p-8 rounded-sm">
              <div>
                <h2 className="text-xl font-semibold">WeConnect Pro</h2>
                <p className="text-muted">
                  Pour les prestataires qui souhaitent passer au niveau
                  supérieur.
                </p>
              </div>
              <ul className="space-y-4">
                <p className="text-primary">
                  Inclut les fonctionnalités du plan Essentiel, plus :
                </p>
                <li>Prestations illimitées</li>
                <li>Gestion des disponibilités sur des journées précises</li>
                <li>Notifications des demandes rendez-vous par SMS</li>
                <li>Validation automatique des demandes de rendez-vous</li>
                <li>TPE pour les paiements sur place</li>
                <li>Paiement en ligne + acompte</li>
                <li>Ajout de photos du salon</li>
                <li>Avis clients</li>
                <li>Statistiques d’activité</li>
                <li>Support</li>
              </ul>
              <Button asChild className="mt-auto">
                <Link to="/subscribe?plan=pro">Choisir</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-4 bg-gradient-to-l from-primary-200 to-primary-100 p-8 rounded-r-2xl rounded-l-sm">
              <div>
                <h2 className="text-xl font-semibold">WeConnect Entreprise</h2>
                <p className="text-muted">
                  Pour les salons de plusieurs employés qui recherchent une
                  solution de gestion complète.
                </p>
              </div>
              <ul className="space-y-4">
                <p className="text-primary">
                  Inclut les fonctionnalités du plan Pro, plus :
                </p>
                <li>Ajout de membres affiliés</li>
                <li>Gestion des disponibilités par membre</li>
                <li>Gestion des disponibilités par prestation</li>
                <li>Acomptes personnalisés par prestation</li>
                <li>Support prioritaire</li>
              </ul>
              <Button asChild className="mt-auto">
                <Link to="/subscribe?plan=enterprise">Choisir</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
