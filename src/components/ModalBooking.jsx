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
import { useState } from "react";
import {
  formatDateForClient,
  hhmmToISODate,
  ISODateToHHMM,
} from "@/utils/stringUtils";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ModalBooking({ service, availabilities }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
          <BookingForm />
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
        <BookingForm />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function BookingForm() {
  const [date, setDate] = useState();

  function OneYearFromNow() {
    const currentDate = new Date();

    const dateOneYearFromNow = new Date(currentDate);
    dateOneYearFromNow.setFullYear(currentDate.getFullYear() + 1);

    return dateOneYearFromNow;
  }

  return (
    <div cn className="px-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            {date ? formatDateForClient(date) : <span>Choisir une date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => date < new Date() || date > OneYearFromNow()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
