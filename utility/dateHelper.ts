
export const getTimeString = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const formattedHours = (hours % 12) || 12; // Handle midnight (0) as 12

    // Format the components as "HH:mm aa"
    const formattedTime = `${formattedHours.toString()}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;

    return formattedTime;
}

export const getLongTimeString = (date: Date): string => {
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const formattedHours = (hours % 12) || 12; // Handle midnight (0) as 12

    // Format the date as "M/d" and time as "HH:mm AM/PM"
    const formattedDate = `${month}/${day}`;
    const formattedTime = `${formattedHours.toString()}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;

    // Concatenate date and time
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    return formattedDateTime;
}