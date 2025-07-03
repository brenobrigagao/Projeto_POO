import api from './api';

export interface CarrinhoItem {
  produtoId: number;
  nomeFlor: string;
  precoUnitario: number;
  quantidade: number;
  imageUrl?: string;
}

export interface ProdutoDisponivel {
  id: number;
  nome: string;
  descricao: string;
  imageUrl: string;
}

export interface AddCarrinhoDto {
  produtoId: number;
  quantidade: number;
}

class ClienteServiceClass {
  async listarProdutos(): Promise<ProdutoDisponivel[]> {
    const { data } = await api.get<ProdutoDisponivel[]>('/Cliente/produtos-disponiveis');
    return data;
  }

  async adicionarAoCarrinho(dto: AddCarrinhoDto): Promise<void> {
    await api.post('/Cliente/adicionar-carrinho', dto);
  }

  async verCarrinho(): Promise<CarrinhoItem[]> {
    const { data } = await api.get<{
      produtoId: number;
      nomeFlor: string;
      preco: number;
      quantidade: number;
      imageUrl?: string;
    }[]>('/Cliente/ver-carrinho');

    return data.map(item => ({
      produtoId: item.produtoId,
      nomeFlor: item.nomeFlor,
      precoUnitario: item.preco,
      quantidade: item.quantidade,
      imageUrl: item.imageUrl,
    }));
  }

  async removerDoCarrinho(produtoId: number): Promise<void> {
    await api.delete(`/Cliente/remover-carrinho/${produtoId}`);
  }

  async finalizarCompra(): Promise<void> {
    await api.post('/Cliente/finalizar-compra');
  }
}

export const ClienteService = new ClienteServiceClass();  
export default ClienteService;
