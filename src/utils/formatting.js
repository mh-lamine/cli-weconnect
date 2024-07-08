import { DateTime } from "luxon";

export function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function formatDate(date) {
  const formattedDate = DateTime.fromJSDate(date)
    .setLocale("fr")
    .toFormat("DDDD");

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

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