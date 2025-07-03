import React, { createContext, useState, useContext, type ReactNode } from 'react';
import type { CarrinhoViewDto } from '../dto/carrinho-view.dto';
import { ClienteService } from '../api/services';

interface CartContextData {
  itensCount: number;
  refreshCart(): Promise<void>;
}

const CartContext = createContext<CartContextData | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [itensCount, setItensCount] = useState(0);

  const refreshCart = async () => {
    try {
      const data: CarrinhoViewDto = await ClienteService.visualizarCarrinho();
      setItensCount(data.itens.reduce((sum, i) => sum + i.quantidade, 0));
    } catch {}
  };

  React.useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ itensCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart dentro de CartProvider');
  return ctx;
}
