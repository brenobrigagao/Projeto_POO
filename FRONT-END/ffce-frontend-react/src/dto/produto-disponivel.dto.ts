export interface ProdutoDisponivel {
  id: number;
  nome: string;
  descricao: string;
  imageUrl: string;
  preco: number;
  estoque: number;
  produtor: {
    id: number;
    nomeLoja: string;
  };
}
