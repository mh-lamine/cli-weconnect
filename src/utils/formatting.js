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