// DEMO PURPOSES ONLY. ADJUST AS NEEDED FOR APPLICATION.
export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  accessToken: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  address: string;
}
