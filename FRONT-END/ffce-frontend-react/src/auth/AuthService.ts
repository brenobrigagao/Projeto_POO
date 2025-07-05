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
  /**
   * Registra um novo cliente no sistema.
   */
  registroCliente(dto: ClienteCreateDto) {
    return api.post<void>('/Auth/registro-cliente', dto);
  }

  /**
   * Registra um novo produtor com nome da loja e descrição.
   */
  registroProdutor(dto: ProdutorCreateDto) {
    return api.post<void>('/Auth/registro-produtor', dto);
  }

  /**
   * Realiza login e retorna os dados de autenticação: token, id e role.
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/Auth/login', dto);
    return data;
  }

  /**
   * Verifica se o token JWT atual é válido e retorna os dados do usuário autenticado.
   * Este método deve ser protegido por [Authorize] no backend.
   */
  async verificar(): Promise<AuthResponse> {
    const { data } = await api.get<AuthResponse>('/Auth/verificar');
    return data;
  }
}

export default new AuthService();
