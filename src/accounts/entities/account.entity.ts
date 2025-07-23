export interface Account {
  id: number;
  user_id: number;
  account_number: string;
  account_name: null;
  account_type: string;
  balance: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  user: User;
}

export interface User {
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
}
