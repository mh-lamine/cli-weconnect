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
import { useEffect, useMemo, useRef, useState } from "react";
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
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import MemberCard from "../MemberCard";
import useTimeSlots from "@/hooks/useTimeSlots";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import CheckoutForm from "../CheckoutForm";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function BookingWizard({
  step,
  nextStep,
  prevStep,
  service,
  provider,
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [timeSlotSelected, setTimeSlotSelected] = useState({
    date: null,
    startTime: "",
  });
  const [selectedMember, setSelectedMember] = useState();
  const [loading, setLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { loadingTimeSlots, availableTimeSlots, salonAvailableTimeSlots } =
    useTimeSlots(date, service, toast, setTimeSlotSelected, setSelectedMember);
  const {
    availabilities,
    specialAvailabilities,
    autoAccept,
    stripeConnectedAccountId,
  } = provider;

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

  function handleNextStep() {
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

    if (!auth) {
      toast.error("Connectez-vous pour réserver un rendez-vous.");
      return;
    }

    nextStep();
  }

  function handleCancel() {
    setOpen(false);
    setDate(null);
    setTimeSlotSelected({ date: null, startTime: "" });
  }

  async function handleCreateAppointment() {
    setLoading(true);
    if (!auth) {
      toast.error("Connectez-vous pour réserver un rendez-vous.");
      setLoading(false);
      return;
    }

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
      if (error.status === 403) {
        toast.error("Vous devez être connecté pour réserver un rendez-vous.");
      } else if (error.status === 400) {
        toast.error("Selectionnez un créneau pour réserver votre rendez-vous.");
      } else {
        toast.error("Une erreur est survenue, veuillez contacter le support.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
    setDate(null);
    setTimeSlotSelected({ date: null, startTime: "" });
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            isDesktop={isDesktop}
            date={date}
            setDate={setDate}
            isDayOff={isDayOff}
            selectedMember={selectedMember}
            loadingTimeSlots={loadingTimeSlots}
            availableTimeSlots={availableTimeSlots}
            salonAvailableTimeSlots={salonAvailableTimeSlots}
            setSelectedMember={setSelectedMember}
            setTimeSlotSelected={setTimeSlotSelected}
            SkeletonList={SkeletonList}
            timeSlotSelected={timeSlotSelected}
          />
        );
      case 2:
        return (
          <Step2
            service={service}
            stripeConnectedAccountId={stripeConnectedAccountId}
            handlePrevStep={prevStep}
            handleCreateAppointment={handleCreateAppointment}
            loading={loading}
            setLoading={setLoading}
            isDesktop={isDesktop}
          />
        );
    }
  };

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
          <div className="max-h-[50vh] space-y-4 overflow-y-scroll no-scrollbar">
            {renderStepContent()}
          </div>
          {step === 1 && (
            <DialogFooter className="sm:justify-start">
              <div className="w-full flex items-center justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    if (provider.stripeConnectedAccountId) {
                      handleNextStep();
                    } else {
                      handleCreateAppointment();
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Réserver"}
                </Button>
              </div>
            </DialogFooter>
          )}
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
        <div className="max-h-[50vh] overflow-y-scroll no-scrollbar">
          {renderStepContent()}
        </div>
        {step === 1 && (
          <DrawerFooter className="pt-2">
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  if (provider.stripeConnectedAccountId) {
                    handleNextStep();
                  } else {
                    handleCreateAppointment();
                  }
                }}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Réserver"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancel}
              >
                Annuler
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

const Step1 = ({
  isDesktop,
  date,
  setDate,
  isDayOff,
  selectedMember,
  loadingTimeSlots,
  availableTimeSlots,
  salonAvailableTimeSlots,
  setSelectedMember,
  setTimeSlotSelected,
  SkeletonList,
  timeSlotSelected,
}) => {
  if (isDesktop) {
    return (
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
              <TimeSlotButton
                slot={slot}
                index={index}
                date={date}
                timeSlotSelected={timeSlotSelected}
                setTimeSlotSelected={setTimeSlotSelected}
              />
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
              <TimeSlotButton
                slot={slot}
                index={index}
                date={date}
                timeSlotSelected={timeSlotSelected}
                setTimeSlotSelected={setTimeSlotSelected}
              />
            ))}
          </div>
        )}
      </Popover>
    );
  }
  return (
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
              <TimeSlotButton
                slot={slot}
                index={index}
                date={date}
                timeSlotSelected={timeSlotSelected}
                setTimeSlotSelected={setTimeSlotSelected}
              />
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
              <TimeSlotButton
                slot={slot}
                index={index}
                date={date}
                timeSlotSelected={timeSlotSelected}
                setTimeSlotSelected={setTimeSlotSelected}
              />
            ))}
          </div>
        )}
      </div>
    </Popover>
  );
};

const Step2 = ({
  service,
  stripeConnectedAccountId,
  handlePrevStep,
  handleCreateAppointment,
  loading,
  setLoading,
  isDesktop,
}) => {
  const [clientSecret, setClientSecret] = useState();

  const stripePromise = useMemo(
    () =>
      loadStripe(
        "pk_test_51PslIK1WdYqLIXrDWRI9lV4ezDDD4O0n4yJtXnNSonD88rr3tJ2ZmDARu9T2NIDr6VF8tm4ABiYa10ujuMFznauN00knJNXpfB",
        { stripeAccount: stripeConnectedAccountId }
      ),
    [stripeConnectedAccountId]
  );
  const isRequestInProgress = useRef(false);

  const getClientSecret = async () => {
    if (isRequestInProgress.current) return; // Block multiple calls
    isRequestInProgress.current = true;

    try {
      const { data } = await axios.post("/api/stripe/create-payment-intent", {
        connectedAccountId: stripeConnectedAccountId,
        amount: service.price * 100,
      });
      setClientSecret(data);
    } catch (error) {
      console.error(error);
    } finally {
      isRequestInProgress.current = false;
    }
  };

  useEffect(() => {
    getClientSecret();
  }, []);

  const options = { clientSecret };

  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          handlePrevStep={handlePrevStep}
          handleCreateAppointment={handleCreateAppointment}
          loading={loading}
          setLoading={setLoading}
          isDesktop={isDesktop}
        />
      </Elements>
    );
  }
};

const TimeSlotButton = ({
  slot,
  index,
  date,
  timeSlotSelected,
  setTimeSlotSelected,
}) => {
  return (
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
  );
};
