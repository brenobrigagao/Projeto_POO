import { CarrinhoItemDto } from './carrinho-item.dto';

export interface CarrinhoViewDto {
  itens: CarrinhoItemDto[];
  total: number;
}
