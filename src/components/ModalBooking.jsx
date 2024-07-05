import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {


  formatAppointments,
  formatAvailabilitiesByDayOfWeek,
  formatDateForClient,
  getAvailableTimeRanges,

} from "@/utils/formatting";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Tag from "./Tag";
import { DateTime } from "luxon";

export default function ModalBooking({
  service,
  availabilities,
  appointments,
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [dailyStartTime, setDailyStartTime] = useState();
  const [dailyEndTime, setDailyEndTime] = useState();
  const [fullDayName, setFullDayName] = useState();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const formattedAvailabilities =
    formatAvailabilitiesByDayOfWeek(availabilities);

  function handleSelectDate(selectedDate) {
    setDate(selectedDate);
    if (!selectedDate) return;
    const dayOfWeek = DateTime.fromJSDate(selectedDate)
      .toFormat("EEEE")
      .toUpperCase();
    setFullDayName(dayOfWeek);
    setDailyStartTime(formattedAvailabilities[dayOfWeek].startTime);
    setDailyEndTime(formattedAvailabilities[dayOfWeek].endTime);
  }

  useEffect(() => {
    if (!date) return;
    const availableTimeRanges = getAvailableTimeRanges(
      fullDayName,
      dailyStartTime,
      dailyEndTime,
      formattedAppointments
    );
    // availableTimeRanges.forEach((interval) => {
    //   const startTime = convertToHhmm(interval.start.toISO());
    //   const endTime = convertToHhmm(interval.end.toISO());
    //   console.log(`Available time range: ${startTime} - ${endTime}`);
    // });
    console.log(convertToISOTime("09:00"));
  }, [date]);

  const isDayOff = (date) => {
    const dayOfWeek = DateTime.fromJSDate(date).toFormat("EEEE").toUpperCase();
    return (
      date < new Date() ||
      date > OneYearFromNow() ||
      !formattedAvailabilities[dayOfWeek]
    );
  };

  const formattedAppointments = formatAppointments(appointments);

  // const timeSlots = (formattedAvailabilities) => {
  //   const timeSlots = [];
  //   let startTime = convertToHhmm(formattedAvailabilities.MONDAY.startTime);
  //   const endTime = convertToHhmm(formattedAvailabilities.MONDAY.endTime);

  //   while (startTime < endTime) {
  //     timeSlots.push(
  //       `${startTime}-${addDurationToHHMM(startTime, service.duration)}`
  //     );
  //     startTime = addDurationToHHMM(startTime, service.duration);
  //   }

  //   return timeSlots;
  // };

  function OneYearFromNow() {
    const currentDate = new Date();

    const dateOneYearFromNow = new Date(currentDate);
    dateOneYearFromNow.setFullYear(currentDate.getFullYear() + 1);

    return dateOneYearFromNow;
  }

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
                  formatDateForClient(date)
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
            {date && (
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Tag name="14h00" />
                </Button>
                <Button asChild>
                  <Tag name="15h00" />
                </Button>
                <Button asChild>
                  <Tag name="16h30" />
                </Button>
                <Button asChild>
                  <Tag name="18h00" />
                </Button>
              </div>
            )}
          </Popover>
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
        <div className="px-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {date ? (
                  formatDateForClient(date)
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
              />
            </PopoverContent>
          </Popover>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
