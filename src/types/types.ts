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

// iat: 유저정보가 발급된 시점의 타임스탬프(디버깅 용도.) exp: 유저정보 토큰 만료 시간(없애면 만료 기간이 없어지는거라 위험)
export type User = {
  email: string;
  username: string;
  phone_number?: string;
  isSocialUser?: boolean;
  iat?: number;
  exp?: number;
  is_active?: string;
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
