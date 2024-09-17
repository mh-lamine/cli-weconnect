import ProviderHeader from "@/components/ProviderHeader";
import ModalBooking from "@/components/modal/ModalBooking";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { getProvidersByFilters } from "@/actions/providerActions";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import ModalAction from "@/components/modal/ModalAction";
import { Button } from "@/components/ui/button";

export default function ProviderPage() {
  const { providerId } = useParams();
  const [provider, setProvider] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProvidersByFilters({ id: providerId });
        setProvider(response.data[0]);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (error) return <div className="flex-1">Error: {error}</div>;

  if (provider?.isInVacancyMode) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-3xl font-semibold text-center">
            Votre prestataire est actuellement en vacances ! 🌴
          </h1>
          <p className="text-center">
            Vous pouvez consulter ses informations de contact pour prendre
            rendez-vous ultérieurement
          </p>
          <div className="flex items-center space-x-4">
            <Button asChild>
              <a
                href={`tel:${provider.phoneNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                Appeler
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href={`mailto:${provider.email}`}
                target="_blank"
                rel="noreferrer"
              >
                Envoyer un mail
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full flex-1">
      <header>
        <ProviderHeader
          loading={loading}
          name={provider?.providerName}
          address={provider?.address}
          profilePicture={provider?.profilePicture}
          coverImage={provider?.coverImage}
        />
      </header>
      <div className="px-6 pb-0 max-w-screen-md mx-auto">
        {loading ? (
          <div className="space-y-12">
            <Skeleton className="w-[150px] h-6 mt-8" />
            <div className="flex items-center justify-between">
              <div className="flex gap-8">
                <Skeleton className="w-[50px] h-4 mt-4" />
                <Skeleton className="w-[50px] h-4 mt-4" />
              </div>
              <Skeleton className="w-[100px] h-[40px]" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-8">
                <Skeleton className="w-[50px] h-4 mt-4" />
                <Skeleton className="w-[50px] h-4 mt-4" />
              </div>
              <Skeleton className="w-[100px] h-[40px]" />
            </div>
            <Skeleton className="w-[150px] h-6 mt-8" />
            <Skeleton className="w-[150px] h-6 mt-8" />
          </div>
        ) : (
          <>
            {provider?.bookingTerms && (
              <ModalAction
                defaultOpen={true}
                title="Conditions de réservation"
                description={
                  <p className="whitespace-pre-line">
                    {provider?.bookingTerms}
                  </p>
                }
                actionLabel="J'accepte"
                trigger={"Conditions de réservation"}
                triggerVariant="link"
                cancelText="Fermer"
              />
            )}
            {provider?.providerCategories.map((category, index) => (
              <div key={index}>
                <Services
                  index={index}
                  category={category}
                  services={category.services}
                  availabilities={provider?.availabilities}
                  specialAvailabilities={provider?.specialAvailabilities}
                  autoAccept={provider?.autoAcceptAppointments}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}

function Services({
  index,
  category,
  services,
  availabilities,
  specialAvailabilities,
  autoAccept
}) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={"item-0"}
      className="w-full"
    >
      <AccordionItem value={`item-${index}`}>
        <AccordionTrigger>
          <h2 className="text-2xl font-medium">{category.name}</h2>
        </AccordionTrigger>
        {services.map((service, index) => (
          <AccordionContent
            key={index}
            className="flex items-center justify-between"
          >
            <div className="w-3/4 pt-4 space-y-2">
              <h3 className="text-lg text-left">{service.name}</h3>
              <div className="flex text-sm">
                <p className="text-muted">{service.price}€</p>
                <div className="divider divider-horizontal"></div>
                <p>{service.duration}mn</p>
              </div>
              <p>{service.description}</p>
            </div>
            <ModalBooking
              service={service}
              availabilities={availabilities}
              specialAvailabilities={specialAvailabilities}
              autoAccept={autoAccept}
            />
          </AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
}
