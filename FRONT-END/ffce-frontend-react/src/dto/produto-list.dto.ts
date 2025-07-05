// src/dto/produto-list.dto.ts

export interface ProdutoListDto {
  produtoId: number;
  flor: string;
  descricao: string;    
  preco: number;
  estoque: number;
  nomeLoja: string;
  telefone: string;
  imageUrl?: string;
}
