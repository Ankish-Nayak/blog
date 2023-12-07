import { format } from "date-fns";

const humanReadableDate = (rawDate: string) => {
  const formattedDate: Date = new Date(rawDate);
  return format(formattedDate, "EEEE, MMMM do yyyy 'at' h:mm:ss a");
};

export default humanReadableDate;
