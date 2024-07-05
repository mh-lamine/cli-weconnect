import moment from "moment";

export function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
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

export function getAvailableTimeRanges(
  dayOfWeek,
  dailyStartTime,
  dailyEndTime,
  appointments
) {
  const todaysAppointments = appointments.filter((appointment) => {
    const appointmentDayOfWeek = moment(appointment.date)
      .format("dddd")
      .toUpperCase();
    return appointmentDayOfWeek === dayOfWeek;
  });

  const availableTimeRanges = [];
  let startTime = dailyStartTime;
  let endTime = dailyEndTime;

  todaysAppointments.forEach((appointment) => {
    const appointmentStartTime = moment(appointment.date).format("HH:mm");
    const appointmentEndTime = moment(appointment.date)
      .add(appointment.duration, "minutes")
      .format("HH:mm");

    if (appointmentStartTime > startTime) {
      availableTimeRanges.push({ start: startTime, end: appointmentStartTime });
    }

    startTime = appointmentEndTime;
  });

  if (startTime < endTime) {
    availableTimeRanges.push({ start: startTime, end: endTime });
  }

  return availableTimeRanges;
}
