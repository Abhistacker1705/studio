export interface Post {
  id: string;
  content: string;
  date: string; // YYYY-MM-DD format
  platform?: string;
}

export interface UserProfile {
  details: string; // To store resume and other details
}
