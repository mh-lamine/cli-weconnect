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
      <div className="flex flex-col md:flex-row md:gap-4">
        <Button
          variant="link"
          className={`w-fit p-0 h-min ${past && "text-muted"}`}
        >
          <a href={`tel:${appointment.provider.phoneNumber}`}>
            {appointment.provider.phoneNumber.replace(/(\d{2})(?=\d)/g, "$1 ")}
          </a>
        </Button>
        <Button
          variant="link"
          className={`w-fit p-0 h-min ${past && "text-muted"}`}
        >
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(
              appointment.provider.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {appointment.provider.address}
          </a>
        </Button>
      </div>
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
