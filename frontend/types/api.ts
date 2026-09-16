export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string> | null;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalEvents: number;
  totalEventEditions: number;
  totalPartners: number;
  activePartners: number;
  totalTeamMembers: number;
}

export interface UploadResult {
  url: string;
  originalFilename: string;
  sizeBytes: number;
}
