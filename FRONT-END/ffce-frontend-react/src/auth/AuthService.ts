import api from '../services/api';

export interface LoginDto {
  email: string;
  senha: string;
}

export interface ClienteCreateDto {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  endereco: string;
  gostos: string;
}

export interface ProdutorCreateDto {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  endereco: string;
  nomeLoja: string;
  descricao: string;
}

export interface AuthResponse {
  token: string;
  role: 'Cliente' | 'Produtor';
  id: number;
}

class AuthService {
 
  registroCliente(dto: ClienteCreateDto) {
    return api.post<void>('/Auth/registro-cliente', dto);
  }

 
  registroProdutor(dto: ProdutorCreateDto) {
    return api.post<void>('/Auth/registro-produtor', dto);
  }

  
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/Auth/login', dto);
    return data;
  }

 
  async verificar(): Promise<AuthResponse> {
    const { data } = await api.get<AuthResponse>('/Auth/verificar');
    return data;
  }
}

export default new AuthService();
