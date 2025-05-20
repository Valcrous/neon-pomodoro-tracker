export interface Report {
  id: string;
  username: string;
  date: string;
  courseName: string;
  startTime: string;
  endTime: string;
  description: string;
  created_at?: string;
}

// Adding this empty type to fix build errors while keeping compatibility
export interface AppUser {}
