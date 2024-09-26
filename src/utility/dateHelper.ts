export function datePortionEqual(a: Date, b: Date): boolean {
  return (a && b
    && (a.getFullYear() === b.getFullYear())
    && (a.getMonth() === b.getMonth())
    && (a.getDate() === b.getDate()));
}

/** Format the date as "M/d" */
export function getDateString(date: Date): string {
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();

  return `${month}/${day}`;
}

/** Format the date as "MM/DD/yyyy" or "MM/DD" */
export function getPaddedDateString(date: Date, includeYear: boolean = false): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1 and pad with '0'
  const day = date.getDate().toString().padStart(2, '0'); // Pad with '0'
  const year = date.getFullYear();

  return includeYear ? `${month}/${day}/${year}` : `${month}/${day}`;
}

/** Format the components as "HH:mm aa" or "H:mm aa" */
export function getTimeString(date: Date, padHours: boolean = false): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM or PM
  const amOrPm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  const adjustedHours = (hours % 12) || 12; // Handle midnight (0) as 12
  const formattedHours = padHours ? adjustedHours.toString().padStart(2, '0') : adjustedHours.toString();

  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
}

/** Format the date as "M/d" and time as "H:mm AM/PM" */
export function getLongDateTimeString(date: Date): string {
  return `${getDateString(date)} ${getTimeString(date)}`;
}

/** Format the date as "MM/DD/yyyy" and time as "hh:mm a" */
export function getFullDateTimeString(date: Date): string {
  return `${getPaddedDateString(date, true)} - ${getTimeString(date, true)}`;
}

export function getConditionalTimeString(date: Date): string {
  if (!date?.getMonth) {
    return 'unknown';
  }
  const day = 24 * 60 * 60 * 1000;
  if (Date.now() - date.valueOf() < day) {
    return getTimeString(date);
  }
  else {
    return getLongDateTimeString(date);
  }
}

export function getDateRangeString(a: Date, b: Date): string {
  if (!a || !b) {
    return '';
  }
  if (datePortionEqual(a, b)) {
    return '';
  }
  return `${getDateString(a)} - ${getDateString(b)}`;
}

export function getDateTimeRangeString(a: Date, b: Date): string {
  if (!a || !b) {
    return '';
  }
  if (datePortionEqual(a, b)) {
    return `${getTimeString(a)} - ${getTimeString(b)}`;
  }
  return `${getLongDateTimeString(a)} - ${getLongDateTimeString(b)}`;
}
