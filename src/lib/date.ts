function convertUTCToTimezoneDate(
  utcDate: string | Date,
  timeZone: string
): Date {
  const date = new Date(utcDate);

  const timezoneOffset = getTimezoneOffsetInMinutes(timeZone, date);

  return new Date(date.getTime() + timezoneOffset * 60 * 1000);
}

function getTimezoneOffsetInMinutes(timeZone: string, date: Date): number {
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timeZone }));
  return (tzDate.getTime() - utcDate.getTime()) / (60 * 1000);
}

export { convertUTCToTimezoneDate };
