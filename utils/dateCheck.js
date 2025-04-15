import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function getRelativeDayLabel(date) {
  const input = dayjs.utc(date);
  const now = dayjs.utc();

  if (input.isSame(now, "day")) return "today";
  if (input.isSame(now.subtract(1, "day"), "day")) {
    return "yesterday"};
  return "earlier";
}
