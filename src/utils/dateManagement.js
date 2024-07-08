import { DateTime } from "luxon";

export function getAvailableTimeRanges(date, availabilities, appointments) {
  const selectedDate = DateTime.fromJSDate(date);
  const dayOfWeek = selectedDate.setLocale("en").weekdayLong.toUpperCase();

  const availability = availabilities.find(
    (avail) => avail.dayOfWeek === dayOfWeek
  );

  if (!availability) {
    return [];
  }

  const todaysAppointments = appointments.filter((appointment) => {
    return (
      DateTime.fromISO(appointment.date).toLocaleString() ===
      selectedDate.toLocaleString()
    );
  });

  const availableTimeRanges = [];
  let startTime = DateTime.fromISO(availability.startTime).toISOTime();
  let endTime = DateTime.fromISO(availability.endTime).toISOTime();

  todaysAppointments.sort((a, b) => {
    return DateTime.fromISO(a.date) - DateTime.fromISO(b.date);
  });

  todaysAppointments.forEach((appointment) => {
    const appointmentStartTime = DateTime.fromISO(appointment.date).toISOTime();
    const appointmentEndTime = DateTime.fromISO(appointment.date)
      .plus({
        minutes: appointment.service.duration,
      })
      .toISOTime();

    if (appointmentStartTime > startTime) {
      availableTimeRanges.push({
        start: startTime,
        end: appointmentStartTime,
      });
    }
    startTime = appointmentEndTime;
  });

  if (startTime < endTime) {
    availableTimeRanges.push({
      start: startTime,
      end: endTime,
    });
  }

  return availableTimeRanges;
}

export function OneYearFromNow() {
  return DateTime.now().plus({ years: 1 });
}

export const getAvailableTimeSlots = (availableTimeRanges, service) => {
  const timeSlots = [];

  availableTimeRanges.forEach((range) => {
    const rangeStart = DateTime.fromISO(range.start);
    const rangeEnd = DateTime.fromISO(range.end);
    let currentSlotStart = rangeStart;

    while (currentSlotStart.plus({ minutes: service.duration }) <= rangeEnd) {
      const currentSlotEnd = currentSlotStart.plus({
        minutes: service.duration,
      });

      timeSlots.push({
        start: currentSlotStart.toLocaleString(DateTime.TIME_SIMPLE),
        end: currentSlotEnd.toLocaleString(DateTime.TIME_SIMPLE),
      });

      currentSlotStart = currentSlotEnd;
    }
  });

  return timeSlots;
};
