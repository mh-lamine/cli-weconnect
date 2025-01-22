import {
  getProviderAvailableTimeSlots,
  getSalonAvailableTimeSlots,
} from "@/actions/providerActions";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";

export default function useTimeSlots(
  date,
  service,
  toast,
  setTimeSlotSelected,
  setSelectedMember
) {
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [salonAvailableTimeSlots, setSalonAvailableTimeSlots] = useState();

  useEffect(() => {
    setTimeSlotSelected({ date: null, startTime: "" });
    setSelectedMember();
    if (!date) return;
    async function fetchAvailableTimeSlots() {
      setLoadingTimeSlots(true);
      const { proId, salonId } = service;
      const formattedDate = DateTime.fromJSDate(date).toISODate();
      const serviceDuration = service.duration;

      try {
        if (proId) {
          const data = await getProviderAvailableTimeSlots(
            proId,
            formattedDate,
            serviceDuration
          );
          setAvailableTimeSlots(data);
        }
        if (salonId) {
          const data = await getSalonAvailableTimeSlots(
            salonId,
            formattedDate,
            service
          );
          setSalonAvailableTimeSlots(data);
        }
      } catch (error) {
        toast.error("Failed to fetch time slots. Please try again.");
      } finally {
        setLoadingTimeSlots(false);
      }
    }
    fetchAvailableTimeSlots();
  }, [date, service, toast]);

  return { loadingTimeSlots, availableTimeSlots, salonAvailableTimeSlots };
}
