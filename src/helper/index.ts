export const timestampToDateAndMonth = (
  timestamp: number | undefined,
): string | null => {
  if (!timestamp) {
    return null;
  }
  const date = new Date(timestamp * 1000); // Convert the timestamp to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  // Format the date string in the desired format (YYYY-MM-DD)
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

export const timestampToDateObject = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert the timestamp to milliseconds
  return date;
};

export const dateObjectToTimestamp = (dateObject: Date | null) => {
  if (!dateObject) {
    return null;
  }
  const timestampInSeconds = Math.floor(dateObject.getTime() / 1000);
  return timestampInSeconds;
};