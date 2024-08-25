import ModalHandleAppointment from "./modal/ModalHandleAppointment";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const ProviderAppointment = ({
  appointment,
  acceptAppointment,
  cancelAppointment,
  today = false,
  past = false,
}) => {
  return (
    <div className={`flex flex-col gap-2 py-2 ${past && "text-muted"}`}>
      <div className="divider divider-start my-0">
        <h2 className="text-xl font-semibold">
          {appointment.client.firstName} {appointment.client.lastName}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row md:gap-4">
        <Button
          variant="link"
          className={`w-fit p-0 h-min ${past && "text-muted"}`}
        >
          <a href={`tel:${appointment.client.phoneNumber}`}>
            {appointment.client.phoneNumber.replace(/(\d{2})(?=\d)/g, "$1 ")}
          </a>
        </Button>
      </div>
      <h3 className="text-lg">
        <span className="font-medium">{appointment.service.name}</span> <br />
        {!today && (
          <>
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
          </>
        )}
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
      <div className="flex justify-between">
        {appointment.status === "PENDING" && (
          <ModalHandleAppointment
            id={appointment.id}
            appointmentAction={acceptAppointment}
            actionText={"Accepter"}
            dialogTitle={"Accepter le rendez-vous"}
            dialogDescription={
              "Êtes-vous sûr de vouloir accepter ce rendez-vous ?"
            }
            buttonText={"Accepter"}
            variant={"success"}
          />
        )}
        {(appointment.status === "PENDING" ||
          appointment.status === "ACCEPTED") && (
          <ModalHandleAppointment
            id={appointment.id}
            appointmentAction={cancelAppointment}
            actionText={"Refuser"}
            dialogTitle={"Refuser le rendez-vous"}
            dialogDescription={
              "Êtes-vous sûr de vouloir refuser ce rendez-vous ?"
            }
            buttonText={"Refuser"}
            variant={"destructive"}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderAppointment;
