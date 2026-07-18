export interface UserProfileResponse {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  family_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfileUpdate {
  full_name?: string;
}
