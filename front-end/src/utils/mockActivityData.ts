export interface ActivityDataPoint {
  date: string;
  uploads: number;
  downloads: number;
  logins: number;
}

export const mockActivityOverTime: ActivityDataPoint[] = [
  { date: "Jan", uploads: 3, downloads: 12, logins: 18 },
  { date: "Feb", uploads: 5, downloads: 19, logins: 22 },
  { date: "Mar", uploads: 4, downloads: 24, logins: 28 },
  { date: "Apr", uploads: 7, downloads: 31, logins: 35 },
  { date: "May", uploads: 6, downloads: 38, logins: 41 },
  { date: "Jun", uploads: 9, downloads: 45, logins: 48 },
  { date: "Jul", uploads: 8, downloads: 52, logins: 55 },
  { date: "Aug", uploads: 11, downloads: 58, logins: 62 },
  { date: "Sep", uploads: 10, downloads: 64, logins: 68 },
  { date: "Oct", uploads: 13, downloads: 71, logins: 74 },
  { date: "Nov", uploads: 12, downloads: 78, logins: 82 },
  { date: "Dec", uploads: 15, downloads: 86, logins: 91 },
];

export function getMockTotalDownloads(): number {
  return mockActivityOverTime.reduce((sum, point) => sum + point.downloads, 0);
}

export function getMockRecentActivityCount(): number {
  const last = mockActivityOverTime[mockActivityOverTime.length - 1];
  return last.uploads + last.downloads + last.logins;
}
