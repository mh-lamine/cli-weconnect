import { DateTime, Interval } from "luxon";

export function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function formatDateForClient(date) {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = date.toLocaleDateString("fr-FR", options);

  const parts = formattedDate.split(" ");
  const dayOfWeek = parts[0];
  const dayOfMonth = parseInt(parts[1], 10);
  const month = parts[2];
  const year = parts[3];

  return `${dayOfWeek} ${dayOfMonth} ${month} ${year}`;
}

export function formatAvailabilitiesByDayOfWeek(data) {
  const groupedData = {};

  data.forEach((item) => {
    const { dayOfWeek, ...rest } = item;
    if (!groupedData[dayOfWeek]) {
      groupedData[dayOfWeek] = {};
    }
    groupedData[dayOfWeek] = { ...groupedData[dayOfWeek], ...rest };
  });

  return groupedData;
}

export function ISODateToHHMM(isoDateString) {
  const dateTime = DateTime.fromISO(isoDateString);
  const formattedTime = dateTime.toFormat("HH:mm");
  return formattedTime;
}

export function addDurationToHHMM(hhmmString, duration) {
  const [hoursStr, minutesStr] = hhmmString.split(":");
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10);

  const dateTime = DateTime.fromObject({ hour: hours, minute: minutes });
  const adjustedDateTime = dateTime.plus({ minutes: duration });

  const adjustedTime = adjustedDateTime.toFormat("HH:mm");
  return adjustedTime;
}

export function formatAppointments(appointments) {
  return appointments.map((appointment) => ({
    dayOfWeek: DateTime.fromISO(appointment.date).toFormat("EEEE"), // Convert date to day of week
    startTime: DateTime.fromISO(appointment.date).toFormat("HH:mm"), // Convert date to HH:mm format
    endTime: DateTime.fromISO(appointment.date)
      .plus({ minutes: appointment.service.duration })
      .toFormat("HH:mm"), // Calculate end time based on service duration and convert to HH:mm format
  }));
}

export function getAvailableTimeRanges(
  dayOfWeek,
  dailyStartTime,
  dailyEndTime,
  bookedAppointments
) {
  // Parse daily start and end times
  const startOfDay = DateTime.fromISO(dailyStartTime);
  const endOfDay = DateTime.fromISO(dailyEndTime);

  // Filter booked appointments for the specified dayOfWeek
  const appointments = bookedAppointments.filter(
    (appointment) => appointment.dayOfWeek === dayOfWeek
  );

  // Convert booked appointments to Luxon Interval objects
  const busyIntervals = appointments.map((appointment) => {
    const start = DateTime.fromISO(appointment.startTime);
    const end = DateTime.fromISO(appointment.endTime);
    return Interval.fromDateTimes(start, end);
  });

  // Calculate available time ranges
  const availableRanges = [];

  // Initial gap from start of day to first appointment
  if (busyIntervals.length > 0) {
    const firstInterval = busyIntervals[0];
    if (startOfDay < firstInterval.start) {
      availableRanges.push(
        Interval.fromDateTimes(startOfDay, firstInterval.start)
      );
    }
  } else {
    availableRanges.push(Interval.fromDateTimes(startOfDay, endOfDay));
    return availableRanges;
  }

  // Gaps between consecutive appointments
  for (let i = 1; i < busyIntervals.length; i++) {
    const previousInterval = busyIntervals[i - 1];
    const currentInterval = busyIntervals[i];
    const gap = Interval.fromDateTimes(
      previousInterval.end,
      currentInterval.start
    );
    availableRanges.push(gap);
  }

  // Gap from last appointment to end of day
  const lastInterval = busyIntervals[busyIntervals.length - 1];
  if (lastInterval.end < endOfDay) {
    availableRanges.push(Interval.fromDateTimes(lastInterval.end, endOfDay));
  }

  return availableRanges;
}
