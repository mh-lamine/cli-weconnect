import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import { OneYearFromNow } from "@/utils/dateManagement";
import {
  getProviderAvailableTimeSlots,
  getSalonAvailableTimeSlots,
} from "@/actions/providerActions";
import axiosPrivate from "@/api/axiosPrivate";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import MemberCard from "../MemberCard";

export default function ModalBooking({
  service,
  availabilities,
  specialAvailabilities,
  autoAccept,
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [salonAvailableTimeSlots, setSalonAvailableTimeSlots] = useState();
  const [timeSlotSelected, setTimeSlotSelected] = useState({
    date: null,
    startTime: "",
  });
  const [selectedMember, setSelectedMember] = useState();
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formattedAvailabilities =
    availabilities && formatAvailabilitiesByDayOfWeek(availabilities);

  const isSpecialDay = (date) => {
    const formattedDate = DateTime.fromJSDate(date).toISODate();
    return specialAvailabilities.some(
      (special) => special.date === formattedDate
    );
  };

  const isDayOff = (date) => {
    const formattedDate = DateTime.fromJSDate(date).setLocale("en");
    const dayOfWeek = formattedDate.weekdayLong.toUpperCase();
    return (
      (formattedDate.toISODate() < DateTime.now().toISODate() ||
        formattedDate > OneYearFromNow ||
        !formattedAvailabilities[dayOfWeek]) &&
      !isSpecialDay(date)
    );
  };

  async function handleCreateAppointment() {
    if (!timeSlotSelected.date || !timeSlotSelected.startTime) {
      toast.error("Sélectionnez un créneau pour réserver votre rendez-vous.");
      setLoading(false);
      return;
    }

    if (salonAvailableTimeSlots && !selectedMember) {
      toast.error("Sélectionnez un membre pour réserver votre rendez-vous.");
      setLoading(false);
      return;
    }

    const appointmentDate = `${DateTime.fromJSDate(
      timeSlotSelected.date
    ).toISODate()}T${timeSlotSelected.startTime}`;

    const appointment = {
      date: appointmentDate,
      duration: service.duration,
      status: autoAccept ? "ACCEPTED" : "PENDING",
      serviceId: service.id,
      proId: service.proId,
      salonId: service.salonId,
      memberId: selectedMember?.memberId,
    };

    try {
      setLoading(true);
      await axiosPrivate.post("/api/appointments", appointment);
      toast.success(
        `Votre rendez-vous a été créé avec succès.
        Retrouvez tous vos rendez-vous sur votre espace personnel.\nÀ très bientôt ! 🚀`
      );
      setOpen(false);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Connectez-vous pour réserver un rendez-vous.");
        return;
      }
      toast.error("Une erreur est survenue, veuillez contacter le support.");
      console.error(error);
    } finally {
      setLoading(false);
    }
    setDate(null);
    setTimeSlotSelected({ date: null, startTime: "" });
  }

  useEffect(() => {
    setTimeSlotSelected({ date: null, startTime: "" });
    setSelectedMember();
    if (!date) return;
    async function fetchAvailableTimeSlots() {
      setLoadingTimeSlots(true);
      const { proId, salonId } = service;
      const formattedDate = DateTime.fromJSDate(date).toISODate();
      const serviceDuration = service.duration;
      if (proId) {
        try {
          const data = await getProviderAvailableTimeSlots(
            proId,
            formattedDate,
            serviceDuration
          );
          setAvailableTimeSlots(data);
        } catch (error) {
          toast.error(error);
        } finally {
          setLoadingTimeSlots(false);
        }
      }
      if (salonId) {
        try {
          const data = await getSalonAvailableTimeSlots(
            salonId,
            formattedDate,
            service
          );

          setSalonAvailableTimeSlots(data);
        } catch (error) {
          toast.error(error);
        } finally {
          setLoadingTimeSlots(false);
        }
      }
    }
    fetchAvailableTimeSlots();
  }, [date]);

  const SkeletonList = Array.from({ length: 8 });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Réserver</Button>
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
            {!date ? null : loadingTimeSlots ? (
              <div className="flex flex-wrap gap-2">
                {SkeletonList.map((_, index) => (
                  <Skeleton key={index} className="w-[65px] aspect-video" />
                ))}
              </div>
            ) : availableTimeSlots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableTimeSlots.map((slot, index) => (
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
            ) : salonAvailableTimeSlots?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {salonAvailableTimeSlots.map(
                  (member) =>
                    !!member.availableSlots.length && (
                      <MemberCard
                        key={member.memberId}
                        member={member}
                        selectedMember={selectedMember}
                        setSelectedMember={setSelectedMember}
                        setTimeSlotSelected={setTimeSlotSelected}
                      />
                    )
                )}
              </div>
            ) : (
              <p> Aucune disponibilité pour ce jour.</p>
            )}
            {selectedMember && (
              <div className="flex flex-wrap gap-2">
                {selectedMember.availableSlots.map((slot, index) => (
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
          </Popover>
          <DialogFooter className="sm:justify-start">
            <div className="w-full flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setDate(null);
                  setTimeSlotSelected({ date: null, startTime: "" });
                }}
              >
                Annuler
              </Button>
              <Button disabled={loading} onClick={handleCreateAppointment}>
                {loading ? <Loader2 className="animate-spin" /> : "Réserver"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Réserver</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
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
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isDayOff}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
            {!date ? null : loadingTimeSlots ? (
              <div className="flex flex-wrap gap-2">
                {SkeletonList.map((_, index) => (
                  <Skeleton key={index} className="w-[65px] aspect-video" />
                ))}
              </div>
            ) : availableTimeSlots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableTimeSlots.map((slot, index) => (
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
            ) : salonAvailableTimeSlots?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {salonAvailableTimeSlots.map(
                  (member) =>
                    !!member.availableSlots.length && (
                      <MemberCard
                        key={member.memberId}
                        member={member}
                        selectedMember={selectedMember}
                        setSelectedMember={setSelectedMember}
                        setTimeSlotSelected={setTimeSlotSelected}
                      />
                    )
                )}
              </div>
            ) : (
              <p> Aucune disponibilité pour ce jour.</p>
            )}
            {selectedMember && (
              <div className="flex flex-wrap gap-2">
                {selectedMember.availableSlots.map((slot, index) => (
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
          <div className="space-y-2">
            <Button
              disabled={loading}
              onClick={handleCreateAppointment}
              className="w-full"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Réserver"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setOpen(false);
                setDate(null);
                setTimeSlotSelected({ date: null, startTime: "" });
              }}
            >
              Annuler
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
