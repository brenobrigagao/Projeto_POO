// src/services/ClienteService.ts
import api from './api'

export interface CarrinhoItem {
  produtoId: number
  nomeFlor: string
  precoUnitario: number
  quantidade: number
  imageUrl?: string
}

export interface ProdutoDisponivel {
  id: number
  nome: string
  descricao: string
  imageUrl: string
  preco: number
}

export interface AddCarrinhoDto {
  produtoId: number
  quantidade: number
}

interface CarrinhoItemDto {
  produtoId: number
  flor: string
  imageUrl: string
  precoUnitario: number
  quantidade: number
  subtotal: number
}
interface CarrinhoViewDto {
  itens: CarrinhoItemDto[]
  total: number
}

class ClienteServiceClass {
  async listarProdutos(): Promise<ProdutoDisponivel[]> {
    const { data } = await api.get<ProdutoDisponivel[]>('/Cliente/produtos-disponiveis')
    return data
  }

  async adicionarAoCarrinho(dto: AddCarrinhoDto): Promise<void> {
    await api.post('/Cliente/adicionar-carrinho', dto)
  }

  async atualizarQuantidade(produtoId: number, quantidade: number): Promise<void> {
    await api.put('/Cliente/atualizar-quantidade', { produtoId, quantidade })
  }

  async verCarrinho(): Promise<CarrinhoItem[]> {
    const { data } = await api.get<CarrinhoViewDto>('/Cliente/ver-carrinho')
    return data.itens.map(i => ({
      produtoId: i.produtoId,
      nomeFlor: i.flor,
      precoUnitario: i.precoUnitario,
      quantidade: i.quantidade,
      imageUrl: i.imageUrl
    }))
  }

  async removerDoCarrinho(produtoId: number): Promise<void> {
    await api.delete(`/Cliente/remover-carrinho/${produtoId}`)
  }

  async finalizarCompra(): Promise<void> {
    await api.post('/Cliente/finalizar-compra')
  }
}

export const ClienteService = new ClienteServiceClass()
export default ClienteService
