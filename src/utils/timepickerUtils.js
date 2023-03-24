export const getHourMinuteFromTime = time => {
  let minute = time % 100;
  minute = minute > 59 ? 59 : minute;

  let hour = Math.floor(time / 100);
  hour = hour > 23 ? 23 : hour;

  return { hour, minute };
};
