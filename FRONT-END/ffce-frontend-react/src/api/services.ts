import api from './axios';
import type { AddCarrinhoDto } from '../dto/add-carrinho.dto';
import type { ClienteCreateDto } from '../dto/cliente-create.dto';
import type { LoginDto } from '../dto/login.dto';
import type { ProdutoAtualizaDto } from '../dto/produto-atualiza.dto';
import type { ProdutoCadastroDto } from '../dto/produto-cadastro.dto';
import type { ProdutorCreateDto } from '../dto/produtor-create.dto';
import type { CarrinhoViewDto } from '../dto/carrinho-view.dto';
import type { FlorDto } from '../dto/flor.dto';
import type { ProdutoListDto } from '../dto/produto-list.dto';

export const AuthService = {
  registroCliente: (dto: ClienteCreateDto) =>
    api.post('/Auth/registro-cliente', dto),

  registroProdutor: (dto: ProdutorCreateDto) =>
    api.post('/Auth/registro-produtor', dto),

  login: (dto: LoginDto) =>
    api.post<{ token: string; role: string; id: number }>('/Auth/login', dto)
       .then(r => r.data),

  verificar: () =>
    api.get<void>('/Auth/verificar').then(r => r.data),
};

export const ClienteService = {
  listarProdutos: () =>
    api.get<ProdutoListDto[]>('/Cliente/produtos-disponiveis')
       .then(r => r.data),

  adicionarAoCarrinho: (dto: AddCarrinhoDto) =>
    api.post('/Cliente/adicionar-carrinho', dto),

  visualizarCarrinho: () =>
    api.get<CarrinhoViewDto>('/Cliente/ver-carrinho')
       .then(r => r.data),
};

export const ProdutorService = {
  listarFlores: () =>
    api.get<FlorDto[]>('/Produtor/listar-flores')
       .then(r => r.data),

  meusProdutos: () =>
    api.get<ProdutoListDto[]>('/Produtor/meus-produtos')
       .then(r => r.data),

  cadastrarProduto: (dto: ProdutoCadastroDto) =>
    api.post('/Produtor/cadastrar-produto', dto),

  editarProduto: (id: number, dto: ProdutoAtualizaDto) =>
    api.put(`/Produtor/editar-produto/${id}`, dto),

  excluirProduto: (id: number) =>
    api.delete(`/Produtor/excluir-produto/${id}`),
};
