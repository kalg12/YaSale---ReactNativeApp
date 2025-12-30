import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("es");

/**
 * Format date to readable string
 */
export const formatDate = (
  date: string | Date,
  format: string = "DD/MM/YYYY"
): string => {
  return dayjs(date).format(format);
};

/**
 * Format time to readable string
 */
export const formatTime = (
  date: string | Date,
  format: string = "HH:mm"
): string => {
  return dayjs(date).format(format);
};

/**
 * Format date and time
 */
export const formatDateTime = (
  date: string | Date,
  format: string = "DD/MM/YYYY HH:mm"
): string => {
  return dayjs(date).format(format);
};

/**
 * Get relative time (e.g., "hace 5 minutos")
 */
export const getRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

/**
 * Get time difference in minutes
 */
export const getMinutesDiff = (
  startDate: string | Date,
  endDate: string | Date = new Date()
): number => {
  return dayjs(endDate).diff(dayjs(startDate), "minute");
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), "day");
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().subtract(1, "day"), "day");
};
