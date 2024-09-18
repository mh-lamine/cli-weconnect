import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import ModalAction from "./modal/ModalAction";

const ClientAppointment = ({
  appointment,
  cancelAppointment,
  past = false,
}) => {
  return (
    <div className={`flex flex-col gap-2 py-2 ${past && "text-muted"}`}>
      <div className="divider divider-start my-0">
        <h2 className="text-xl font-semibold">
          {appointment.provider.providerName}
        </h2>
      </div>
      <ContactMethods provider={appointment.provider} past={past} />
      <h3 className="text-lg">
        Vous avez réservé{" "}
        <span className="font-medium">{appointment.service.name}</span> <br />{" "}
        le{" "}
        <span className="font-medium">
          {new Date(appointment.date)
            .toLocaleDateString("fr-FR", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })
            .toUpperCase()}{" "}
        </span>
        à{" "}
        <span className="font-medium">
          {new Date(appointment.date).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </h3>
      {appointment.status === "PENDING" && (
        <Badge variant="outline" className={past && "bg-muted"}>
          En attente de confirmation
        </Badge>
      )}
      {appointment.status === "ACCEPTED" && (
        <Badge variant="success" className={past && "bg-muted"}>
          Confirmé
        </Badge>
      )}
      {appointment.status === "COMPLETED" && (
        <Badge variant="success" className={past && "bg-muted"}>
          Passé
        </Badge>
      )}
      {appointment.status === "CANCELLED" && (
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
          trigger="Supprimer"
          variant="destructive"
        />
      )}
    </div>
  );
};

export default ClientAppointment;

function ContactMethods({ provider, past }) {
  const { contactMethods, address } = provider;
  return (
    <div className="flex flex-col md:flex-row md:gap-4">
      {contactMethods.phoneNumber && (
        <Button variant="link" className={`w-fit py-0 ${past && "text-muted"}`}>
          <a href={`tel:${contactMethods.phoneNumber}`}>
            {contactMethods.phoneNumber.replace(/(\d{2})(?=\d)/g, "$1 ")}
          </a>
        </Button>
      )}
      {contactMethods.instagram && (
        <Button variant="link" className={`w-fit py-0 ${past && "text-muted"}`}>
          <a
            href={`https://www.instagram.com/${contactMethods.instagram.split("@")[1]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{contactMethods.instagram.split(".com/")[1]}
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
