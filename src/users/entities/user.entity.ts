export class User {}

export interface Users {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  full_name: string;
  address: string;
  dob: Date;
  role_id: number;
  password: string;
  created_at: Date;
  updated_at: Date;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
