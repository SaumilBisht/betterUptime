export type Website = {
  id: string;
  url: string;
  indiaStatus: string;
  usStatus: string;
  indiaResponse: number;
  usResponse: number;
  lastCheckedIndia: Date | null;
  lastCheckedUS: Date | null;
};