import { useEffect, useState } from 'react';
import ClienteService from '../../services/ClienteService';
import type { CarrinhoItem } from '../../services/ClienteService';
import toast from 'react-hot-toast';
import { FaTrash, FaSpinner, FaShoppingBag, FaWhatsapp } from 'react-icons/fa';

export default function Cart() {
  const [cart, setCart] = useState<CarrinhoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      const cartItems = await ClienteService.verCarrinho();
      setCart(cartItems);
    } catch (error) {
      toast.error('Falha ao carregar carrinho');
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(produtoId: number) {
    setRemoving(produtoId);
    try {
      await ClienteService.removerDoCarrinho(produtoId);
      setCart(prev => prev.filter(i => i.produtoId !== produtoId));
      toast.success('Item removido do carrinho');
    } catch (error) {
      toast.error('Falha ao remover item');
      console.error('Erro ao remover item:', error);
    } finally {
      setRemoving(null);
    }
  }

  const updateQuantity = async (produtoId: number, quantidade: number) => {
    if (quantidade < 1) return;
    setUpdating(produtoId);
    try {
      await ClienteService.atualizarQuantidade(produtoId, quantidade);
      setCart(prev =>
        prev.map(i =>
          i.produtoId === produtoId ? { ...i, quantidade } : i
        )
      );
      toast.success('Quantidade atualizada!');
    } catch (error) {
      toast.error('Erro ao atualizar quantidade');
      console.error('Erro ao atualizar quantidade:', error);
    } finally {
      setUpdating(null);
    }
  };

  async function checkout() {
    setCheckoutLoading(true);
    try {
      await ClienteService.finalizarCompra();
      toast.success('Compra realizada com sucesso!');
      setCart([]);
    } catch (error) {
      toast.error('Erro ao finalizar compra');
      console.error('Erro ao finalizar compra:', error);
    } finally {
      setCheckoutLoading(false);
    }
  }

  const total = cart.reduce((s, i) => s + i.precoUnitario * i.quantidade, 0);

  function gerarLinkWhats(nome: string, numero: string) {
    const itensTexto = cart
      .map(i => `${i.nomeFlor} (qtd: ${i.quantidade}, R$ ${i.precoUnitario.toFixed(2)})`)
      .join('; ');
    const msg = `Olá Equipe do FFCE. Gostaria de comprar/saber mais sobre: ${itensTexto}. Isso vai me custar R$ ${total.toFixed(2)}, certo???`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
  }

  const numero = '5585988809033';
  const linkWhats = gerarLinkWhats('Seu Nome', numero);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Seu Carrinho</h2>
      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Seu carrinho está vazio</h3>
          <p className="text-gray-500 mb-6">Adicione produtos para continuar</p>
          <a href="/cliente/produtos" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg">
            Ver Produtos
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">Produto</div>
            <div className="col-span-2 text-center">Preço</div>
            <div className="col-span-2 text-center">Quantidade</div>
            <div className="col-span-2 text-center">Subtotal</div>
            <div className="col-span-1 text-center">Ações</div>
          </div>
          <div className="divide-y divide-gray-200">
            {cart.map(item => (
              <div key={item.produtoId} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center">
                <div className="md:col-span-5 flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.nomeFlor}
                    className="w-16 h-16 object-cover rounded-xl mr-4"
                    onError={e => { e.currentTarget.src = 'https://placehold.co/64x64/cccccc/ffffff?text=No+Image'; }}
                  />
                  <h3 className="font-medium text-gray-900">{item.nomeFlor}</h3>
                </div>
                <div className="md:col-span-2 text-center">R$ {item.precoUnitario.toFixed(2)}</div>
                <div className="md:col-span-2 flex items-center justify-center">
                  <button
                    onClick={() => updateQuantity(item.produtoId, item.quantidade - 1)}
                    disabled={updating === item.produtoId || item.quantidade <= 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    –
                  </button>
                  <span className="mx-2">{updating === item.produtoId ? <FaSpinner className="animate-spin inline" /> : item.quantidade}</span>
                  <button
                    onClick={() => updateQuantity(item.produtoId, item.quantidade + 1)}
                    disabled={updating === item.produtoId}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <div className="md:col-span-2 text-center font-medium">R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</div>
                <div className="md:col-span-1 flex justify-center">
                  <button
                    onClick={() => removeItem(item.produtoId)}
                    disabled={removing === item.produtoId}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {removing === item.produtoId ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center">
            <div className="text-lg font-bold text-gray-900 mb-4 md:mb-0">Total: R$ {total.toFixed(2)}</div>
            <div className="flex space-x-4">
              <button
                onClick={checkout}
                disabled={checkoutLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg disabled:opacity-50"
              >
                {checkoutLoading ? <FaSpinner className="animate-spin mr-2" /> : 'Finalizar Compra'}
              </button>
              <a
                href={linkWhats}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center"
              >
                <FaWhatsapp className="mr-2" /> Enviar WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
