export function getTimeDiffInMinute(startDate: Date, endDate: Date) {
  startDate.setMilliseconds(0);
  endDate.setMilliseconds(0);

  const timeDiffInMinute =
    (endDate.getTime() - startDate.getTime()) / 1000 / 60;
  return timeDiffInMinute;
}
