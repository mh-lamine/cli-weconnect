export function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function ISODateToHHMM(isoDateString) {
  const date = new Date(isoDateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function hhmmToISODate(hhmmString) {
  const [hours, minutes] = hhmmString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toISOString();
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
