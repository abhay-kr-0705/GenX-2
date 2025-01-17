export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  name: string;
  registration_no: string;
  branch: string;
  year: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser extends User {
  role: 'admin' | 'superadmin';
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  name: string;
  email: string;
  registration_no: string;
  phone: string;
  created_at: string;
  ticket_sent: boolean;
}

export interface EventDetails {
  id: string;
  full_description: string;
  winners: Array<{
    position: string;
    name: string;
    project: string;
  }>;
  gallery: Array<{
    url: string;
    caption: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants?: number;
  registration_deadline?: string;
  created_at: string;
  updated_at: string;
  details?: EventDetails;
}