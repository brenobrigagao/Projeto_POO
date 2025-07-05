export interface ProdutoCadastroDto {
  florId: number;
  preco: number;
  estoque: number;
}

export interface ProdutoAtualizaDto {
  florId?: number;
  preco?: number;
  estoque?: number;
}
