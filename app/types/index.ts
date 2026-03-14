export type ApplicationStatus =
  | 'Applied'
  | 'Phone Screen'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  status: ApplicationStatus;
  dateApplied: string;
  salary?: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type SortField = 'company' | 'position' | 'status' | 'dateApplied';
export type SortDirection = 'asc' | 'desc';

export type FilterStatus = ApplicationStatus | 'All';
