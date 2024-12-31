export interface FormData {
  username: string;
  user_id: string;
  password: string;
  phone_number: string;
  email: string;
}

export type Tokens = {
  access: string;
  refresh: string;
};

export type User = {
  email: string;
  username: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  tokens?: Tokens;
  user?: User;
};

export type RefreshResponse = {
  success: boolean;
  message: string;
  tokens?: Tokens;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};
