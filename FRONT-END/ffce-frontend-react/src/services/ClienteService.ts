// src/services/ClienteService.ts
import api from './api'

export interface CarrinhoItem {
  produtoId: number
  nomeFlor: string
  precoUnitario: number
  quantidade: number
  imageUrl?: string
}

// DTO que reflete o JSON EXATO vindo da API:
interface ProdutoDisponivelDto {
  id: number
  nome: string
  descricao: string
  imageUrl: string
  preco: number
  estoque: number
  nomeLoja: string
  telefoneLoja: string
  produtorId: number
}

// Interface final usada no componente:
export interface ProdutoDisponivel {
  id: number
  nome: string
  descricao: string
  imageUrl: string
  preco: number
  estoque: number
  produtorNome: string        // redundância útil para listas
  telefoneLoja?: string
  produtor: {                 // estrutura esperada por Products.tsx
    id: number
    nomeLoja: string
    telefone?: string
  }
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
    const { data } = await api.get<ProdutoDisponivelDto[]>('/Cliente/produtos-disponiveis')

    return data.map(item => ({
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      imageUrl: item.imageUrl,
      preco: item.preco,
      estoque: item.estoque,
      produtorNome: item.nomeLoja,
      telefoneLoja: item.telefoneLoja,
      produtor: {
        id: item.produtorId,
        nomeLoja: item.nomeLoja,
        telefone: item.telefoneLoja
      }
    }))
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
