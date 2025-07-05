export interface LoginDto {
  email: string;
  senha: string;
}

export interface LoginResult {
  token: string;
  role: string;
  id: number;
}
