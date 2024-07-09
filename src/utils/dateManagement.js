import { DateTime } from "luxon";

export function OneYearFromNow() {
  return DateTime.now().plus({ years: 1 });
}