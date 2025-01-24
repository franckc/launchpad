import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from 'moment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Returns the color class for a job status <Badge>
export function getJobStatusColor(status: string) {
  switch (status) {
    case "CREATED":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400";
    case "RUNNING":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400";
    case "SCHEDULED":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400";
    case "WAITING_FOR_FEEDBACK":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400";
    case "DONE":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
  }
};

export function formatDate(dateString: string) {
  const pastDate = moment(dateString);
  const agoString = pastDate.fromNow();
  return agoString;
  //return moment(dateString).format('MM/DD/YY h:mm:ss a');
};