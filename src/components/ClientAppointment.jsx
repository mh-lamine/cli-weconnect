import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import ModalAction from "./modal/ModalAction";

const ClientAppointment = ({
  appointment,
  cancelAppointment,
  past = false,
}) => {
  const { pro: provider, salon, service, date, status } = appointment;
  return (
    <div className={`flex flex-col gap-2 py-2 ${past && "text-muted"}`}>
      <div className="divider divider-start my-0">
        <h2 className="text-xl font-semibold">
          {provider?.name || salon?.name}
        </h2>
      </div>
      <ContactMethods provider={provider} salon={salon} past={past} />
      <h3 className="text-lg">
        Vous avez réservé <span className="font-medium">{service.name}</span>{" "}
        <br /> le{" "}
        <span className="font-medium">
          {new Date(date)
            .toLocaleDateString("fr-FR", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })
            .toUpperCase()}{" "}
        </span>
        à{" "}
        <span className="font-medium">
          {new Date(date).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </h3>
      {status === "PENDING" && (
        <Badge variant="outline" className={past && "bg-muted"}>
          En attente de confirmation
        </Badge>
      )}
      {status === "ACCEPTED" && (
        <Badge variant="success" className={past && "bg-muted"}>
          Confirmé
        </Badge>
      )}
      {status === "COMPLETED" && (
        <Badge variant="success" className={past && "bg-muted"}>
          Passé
        </Badge>
      )}
      {status === "CANCELLED" && (
        <Badge variant="destructive" className={past && "bg-muted"}>
          Annulé
        </Badge>
      )}
      {!past && (
        <ModalAction
          id={appointment.id}
          action={cancelAppointment}
          actionLabel="Supprimer"
          title="Supprimer le rendez-vous"
          description="Êtes-vous sûr de vouloir supprimer votre rendez-vous ?"
          successMessage="Rendez-vous supprimé"
          trigger="Supprimer"
          variant="destructive"
        />
      )}
    </div>
  );
};

export default ClientAppointment;

function ContactMethods({ provider, salon, past }) {
  const salonNumber = salon?.phoneNumber || provider?.phoneNumber;
  const address = salon?.address || provider?.address;
  const instagram = provider?.contactMethods?.instagram;
  return (
    <div className="flex flex-col md:flex-row md:gap-4">
      {salonNumber && (
        <Button variant="link" className={`w-fit py-0 ${past && "text-muted"}`}>
          <a href={`tel:${salonNumber}`}>
            {salonNumber.replace(/(\d{2})(?=\d)/g, "$1 ")}
          </a>
        </Button>
      )}
      {instagram && (
        <Button variant="link" className={`w-fit py-0 ${past && "text-muted"}`}>
          <a
            href={`https://www.instagram.com/${instagram.split("@")[1]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {instagram}
          </a>
        </Button>
      )}
      <Button variant="link" className={`w-fit py-0 ${past && "text-muted"}`}>
        <a
          href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {address}
        </a>
      </Button>
    </div>
  );
}
