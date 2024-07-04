import ProviderHeader from "@/components/ProviderHeader";
import ModalBooking from "@/components/ui/ModalBooking";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { hhmmToISODate, ISODateToHHMM } from "@/utils/stringUtils";
import { useLoaderData } from "react-router-dom";

export default function ProviderPage() {
  const { provider, providerCategories } = useLoaderData();

  return (
    <main className="w-full flex-1">
      <header>
        <ProviderHeader
          name={provider.providerName}
          address={provider.address}
        />
        {providerCategories.map((category, index) => (
          <div key={index} className="p-6 pb-0">
            <Services
              index={index}
              category={category}
              availabilities={provider.availabilities}
            />
          </div>
        ))}
      </header>
    </main>
  );
}

function Services({ index, category, availabilities }) {
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
              {/* <Link to={`${service.id}`}>Choisir</Link> */}
              <ModalBooking service={service} availabilities={availabilities} />
            </Button>
          </AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
}
