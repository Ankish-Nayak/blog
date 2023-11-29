import { Typography } from "@mui/material";
import { parseISO, formatDistanceToNow } from "date-fns";
const TimeAgo = ({ timestamp }: { timestamp: string }) => {
  let timeAgo = "";
  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod}`;
  }
  return (
    <Typography title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </Typography>
  );
};

export default TimeAgo;
