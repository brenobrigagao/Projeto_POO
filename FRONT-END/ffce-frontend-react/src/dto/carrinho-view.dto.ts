interface CarrinhoViewDto {
  itens: {
    produtoId:      number;
    flor:           string;
    imageUrl:       string;
    precoUnitario:  number;
    quantidade:     number;
    subtotal:       number;
  }[];
  total: number;
}
