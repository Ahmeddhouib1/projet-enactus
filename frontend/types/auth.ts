export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresInMs: number;
  email: string;
  role: string;
}

export interface CurrentAdmin {
  email: string;
  role: string;
}
