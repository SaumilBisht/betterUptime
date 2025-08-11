export interface Website {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down';
  lastChecked: Date;
  responseTime?: number;
}