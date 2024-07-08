import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatAvailabilitiesByDayOfWeek,
  formatDate,
} from "@/utils/formatting";
import { DateTime } from "luxon";
import { fr } from "date-fns/locale";
import {
  OneYearFromNow,
  getAvailableTimeRanges,
  getAvailableTimeSlots,
} from "@/utils/dateManagement";
import { createAppointment } from "@/actions/providerActions";
import { useToast } from "./ui/use-toast";

export default function ModalBooking({
  service,
  availabilities,
  appointments,
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotSelected, setTimeSlotSelected] = useState({
    date: null,
    startTime: "",
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();

  const formattedAvailabilities =
    formatAvailabilitiesByDayOfWeek(availabilities);

  const isDayOff = (date) => {
    const formattedDate = DateTime.fromJSDate(date).setLocale("en");
    const dayOfWeek = formattedDate.weekdayLong.toUpperCase();
    return (
      formattedDate.toISODate() < DateTime.now().toISODate() ||
      formattedDate > OneYearFromNow ||
      !formattedAvailabilities[dayOfWeek]
    );
  };

  async function handleCreateAppointment() {
    const appointmentDate = `${DateTime.fromJSDate(
      timeSlotSelected.date
    ).toISODate()}T${timeSlotSelected.startTime}`;

    const appointment = {
      date: appointmentDate,
      status: "PENDING",
      serviceId: service.id,
      providerId: service.providerId,
      clientId: "0002",
    };

    try {
      await createAppointment(appointment);
      setTimeSlots((prevSlots) =>
        prevSlots.filter((slot) => slot.start !== timeSlotSelected.startTime)
      );
      toast({
        title: "Créneau réservé !",
        description: `Vous avez rendez-vous le ${formatDate(date)} à ${
          timeSlotSelected.startTime
        }.`,
      });
    } catch (error) {
      toast({
        title: "Erreur de réservation",
        description:
          error.message ||
          "Une erreur est survenue lors de la création de votre rendez-vous. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (!date) return;

    const availableTimeRanges = getAvailableTimeRanges(
      date,
      availabilities,
      appointments
    );

    const availableTimeSlots = getAvailableTimeSlots(
      availableTimeRanges,
      service
    );

    setTimeSlots(availableTimeSlots);
  }, [date]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-primary-500 bg-light text-dark shadow-sm"
          >
            Réserver
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{service.name}</DialogTitle>
            <DialogDescription>{service.description}</DialogDescription>
          </DialogHeader>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {date ? (
                  <span>{formatDate(date)}</span>
                ) : (
                  <span>Choisir une date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isDayOff}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
            {date && timeSlots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={
                      timeSlotSelected.date === date &&
                      timeSlotSelected.startTime === slot.start
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      timeSlotSelected.date === date &&
                      timeSlotSelected.startTime === slot.start
                        ? setTimeSlotSelected({ date: null, startTime: "" })
                        : setTimeSlotSelected({
                            date,
                            startTime: slot.start,
                          });
                    }}
                  >
                    {slot.start}
                  </Button>
                ))}
              </div>
            ) : date ? (
              <span>Aucune disponibilité pour ce jour.</span>
            ) : null}
          </Popover>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline">Annuler</Button>
                {timeSlotSelected.date && timeSlotSelected.startTime && (
                  <Button onClick={handleCreateAppointment}>Réserver</Button>
                )}
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="border-primary-500 bg-light text-dark shadow-sm"
        >
          Réserver
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{service.name}</DrawerTitle>
          <DrawerDescription>{service.description}</DrawerDescription>
        </DrawerHeader>
        <Popover>
          <div className="px-4 space-y-2">
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {date ? (
                  <span>{formatDate(date)}</span>
                ) : (
                  <span>Choisir une date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isDayOff}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
            {date && timeSlots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={
                      timeSlotSelected.date === date &&
                      timeSlotSelected.startTime === slot.start
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      timeSlotSelected.date === date &&
                      timeSlotSelected.startTime === slot.start
                        ? setTimeSlotSelected({ date: null, startTime: "" })
                        : setTimeSlotSelected({
                            date,
                            startTime: slot.start,
                          });
                    }}
                  >
                    {slot.start}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Popover>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <div className="space-y-2">
              {timeSlotSelected.date && timeSlotSelected.startTime && (
                <Button onClick={handleCreateAppointment} className="w-full">
                  Réserver
                </Button>
              )}
              <Button className="w-full" variant="outline">
                Annuler
              </Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
