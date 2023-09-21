
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