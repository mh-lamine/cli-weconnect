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
import { formatAvailabilitiesByDayOfWeek } from "@/utils/formatting";
import moment from "moment";
import {
  OneYearFromNow,
  getAvailableTimeRanges,
  getAvailableTimeSlots,
} from "@/utils/dateManagment";

export default function ModalBooking({
  service,
  availabilities,
  appointments,
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [dailyStartTime, setDailyStartTime] = useState();
  const [dailyEndTime, setDailyEndTime] = useState();
  const [unixDate, setUnixDate] = useState();
  const [timeSlots, setTimeSlots] = useState();
  const [timeSlotSelected, setTimeSlotSelected] = useState({
    date: "",
    startTime: "",
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formattedAvailabilities =
    formatAvailabilitiesByDayOfWeek(availabilities);

  function handleSelectDate(selectedDate) {
    setDate(selectedDate);
    if (!selectedDate) {
      setTimeSlots();
      setTimeSlotSelected({ date: "", startTime: "" });
      return;
    }
    const dayOfWeek = moment(selectedDate, "ddd MMM DD YYYY HH:mm:ss ZZ")
      .format("dddd")
      .toUpperCase();
    const momentDate = moment(
      selectedDate,
      "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (ZZZ)"
    ).unix();

    setUnixDate(momentDate);
    setDailyStartTime(formattedAvailabilities[dayOfWeek].startTime);
    setDailyEndTime(formattedAvailabilities[dayOfWeek].endTime);
  }

   const isDayOff = (date) => {
     const dayOfWeek = moment(date, "ddd MMM DD YYYY HH:mm:ss ZZ")
       .format("dddd")
       .toUpperCase();
     return (
       date < new Date() ||
       date > OneYearFromNow() ||
       !formattedAvailabilities[dayOfWeek]
     );
   };

  useEffect(() => {
    if (!date) return;

    const availableTimeRanges = getAvailableTimeRanges(
      unixDate,
      dailyStartTime,
      dailyEndTime,
      appointments
    );

    const availableTimeSlots = getAvailableTimeSlots(availableTimeRanges, service);

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
                  <span>{moment(date).format("LL")}</span>
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
                onSelect={(selectedDate) => handleSelectDate(selectedDate)}
                disabled={isDayOff}
                initialFocus
              />
            </PopoverContent>
            {timeSlots && (
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={
                      timeSlotSelected.date == date &&
                      timeSlotSelected.startTime == slot.start
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      timeSlotSelected.date == date &&
                      timeSlotSelected.startTime == slot.start
                        ? setTimeSlotSelected({ date: "", startTime: "" })
                        : setTimeSlotSelected({ date, startTime: slot.start });
                    }}
                  >
                    {slot.start}
                  </Button>
                ))}
              </div>
            )}
          </Popover>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline">Annuler</Button>
                {timeSlotSelected.date && timeSlotSelected.startTime && (
                  <Button>Réserver</Button>
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
                  <span>{moment(date).format("LL")}</span>
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
                onSelect={(selectedDate) => handleSelectDate(selectedDate)}
                disabled={isDayOff}
                initialFocus
              />
            </PopoverContent>
            {date && timeSlots && (
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={
                      timeSlotSelected.date == date &&
                      timeSlotSelected.startTime == slot.start
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      timeSlotSelected.date == date &&
                      timeSlotSelected.startTime == slot.start
                        ? setTimeSlotSelected({ date: "", startTime: "" })
                        : setTimeSlotSelected({ date, startTime: slot.start });
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
                <Button className="w-full">Réserver</Button>
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
