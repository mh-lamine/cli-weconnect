import ProviderHeader from "@/components/ProviderHeader";
import ModalBooking from "@/components/ModalBooking";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  getProviderAppointments,
  getProviderById,
  getProviderCategories,
} from "@/actions/providerActions";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function ProviderPage() {
  const { providerId } = useParams();
  const [providerData, setProviderData] = useState({
    provider: null,
    categories: [],
    appointments: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      setProviderData((prevState) => ({
        ...prevState,
        loading: true,
        error: null,
      }));

      try {
        const [provider, categories, appointments] = await Promise.all([
          getProviderById(providerId),
          getProviderCategories(providerId),
          getProviderAppointments(providerId),
        ]);

        setProviderData({
          provider,
          categories,
          appointments,
          loading: false,
          error: null,
        });
      } catch (error) {
        setProviderData((prevState) => ({
          ...prevState,
          loading: false,
          error: error.message || "An error occurred while fetching data.",
        }));
      }
    }

    fetchData();
  }, [providerId]);

  const { provider, categories, appointments, loading, error } = providerData;

  if (loading) return <Loader2 className="w-8 h-8 animate-spin flex-1" />;

  if (error) return <div className="flex-1">Error: {error}</div>;

  return (
    <main className="w-full flex-1">
      <header>
        <ProviderHeader
          name={provider.providerName}
          address={provider.address}
        />
      </header>
      <div className="p-6 pb-0 max-w-screen-lg mx-auto">
        {categories.map((category, index) => (
          <div key={index}>
            <Services
              index={index}
              category={category}
              availabilities={provider?.availabilities}
              appointments={appointments}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

function Services({ index, category, availabilities, appointments }) {
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
        {category.services.map((service, index) => (
          <AccordionContent
            key={index}
            className="flex items-center justify-between"
          >
            <div className="pt-4 space-y-2">
              <h3 className="text-lg text-left">{service.name}</h3>
              <div className="flex text-sm">
                <p className="text-muted">{service.price}€</p>
                <div className="divider divider-horizontal"></div>
                <p>{service.duration}mn</p>
              </div>
              <p>{service.description}</p>
            </div>
            <Button asChild className="bg-primary-500 text-light">
              <ModalBooking
                service={service}
                availabilities={availabilities}
                appointments={appointments}
              />
            </Button>
          </AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
}
