import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type ChartPoint = {
  date: string;
  desktop: number;
  mobile: number;
};

type RenamedChartPoint = {
  date: string;
  [key: string]: string | number;
};

export function renameChartKeys(
  data: ChartPoint[],
  firstName: string,
  secondName: string
): RenamedChartPoint[] {
  return data.map(({ date, desktop, mobile }) => ({
    date,
    [firstName]: desktop,
    [secondName]: mobile,
  }));
}
