import moment from "moment";

export function getAvailableTimeRanges(
  unixDate,
  dailyStartTime,
  dailyEndTime,
  appointments
) {
  const todaysAppointments = appointments.filter((appointment) => {
    return (
      moment.unix(appointment.date).format("DMY") ===
      moment.unix(unixDate).format("DMY")
    );
  });

  const availableTimeRanges = [];
  let startTime = moment.unix(dailyStartTime).format("HH:mm");
  let endTime = moment.unix(dailyEndTime).format("HH:mm");

  todaysAppointments.forEach((appointment) => {
    const appointmentStartTime = moment.unix(appointment.date).format("HH:mm");
    const appointmentEndTime = moment
      .unix(appointment.date)
      .add(appointment.service.duration, "minutes")
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

export function OneYearFromNow() {
  const currentDate = new Date();

  const dateOneYearFromNow = new Date(currentDate);
  dateOneYearFromNow.setFullYear(currentDate.getFullYear() + 1);

  return dateOneYearFromNow;
}

export const getAvailableTimeSlots = (availableTimeRanges, service) => {
  const timeSlots = [];
  availableTimeRanges.forEach((range) => {
    let slotStartTime = moment(range.start, "HH:mm");
    let slotEndTime = moment(range.start, "HH:mm").add(
      service.duration,
      "minutes"
    );
    const endRange = moment(range.end, "HH:mm");
    const serviceDuration = moment.duration(service.duration, "minutes");
    while (
      slotStartTime.isBefore(endRange) &&
      (slotEndTime.isSame(endRange) || slotEndTime.isBefore(endRange))
    ) {
      timeSlots.push({
        start: slotStartTime.format("HH:mm"),
      });
      slotStartTime.add(serviceDuration, "minutes");
      slotEndTime.add(serviceDuration, "minutes");
    }
  });
  return timeSlots;
};
