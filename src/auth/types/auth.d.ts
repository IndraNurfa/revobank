export interface Auth {
  id?: number;
  username?: string;
  fullname?: string;
  email: string;
  role?: string;
  password: string;
  access_token?: string;
  refresh_token?: string;
}
