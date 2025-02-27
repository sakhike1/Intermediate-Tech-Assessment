export interface Office {
  id: string;
  name: string;
  location: string;
  capacity: number;
  color: string;
  created_at: string;
  phone?: string;
  email: string;
}

export interface Worker {
  id: string;
  name: string;
  position: string;
  email: string;
  avatar_url: string;
  office_id: string;
  created_at: string;
  phone?: string; // Optional field
}