import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from 'moment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Returns the color class for a run status <Badge>
export function getRunStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400";
    case "RUNNING":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
    case "WAITING_FOR_FEEDBACK":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400";
    case "DONE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400";
    case "ERROR":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
  }
};

// Returns the color class for a build status <Badge>
export function getImageStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400";
    case "RUNNING":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
    case "DONE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400";
    case "ERROR":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
  }
};

export function formatDateAgo(dateString: string) {
  const pastDate = moment(dateString);
  const agoString = pastDate.fromNow();
  return agoString;
};

export function formatDate(dateString: string) {
  return moment(dateString).format('MM/DD/YY h:mm:ss a');
};
