import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { ProdutoListDto } from '../dto/produto-list.dto';
import type { AddCarrinhoDto } from '../dto/add-carrinho.dto';
import toast from 'react-hot-toast';

export default function ClientePage() {
  const [produtos, setProdutos] = useState<ProdutoListDto[]>([]);

  useEffect(() => {
    api
      .get<ProdutoListDto[]>('/Cliente/produtos-disponiveis')
      .then(res => setProdutos(res.data));
  }, []);

  async function add(id: number) {
    const dto: AddCarrinhoDto = { produtoId: id, quantidade: 1 };
    await api.post('/Cliente/adicionar-carrinho', dto);
    toast.success('Adicionado ao carrinho!');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Flores Disponíveis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map(p => (
          <div
            key={p.produtoId}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            <div className="p-5">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{p.flor}</h3>
              <p className="text-lg font-bold text-green-600 mb-4">R$ {p.preco.toFixed(2)}</p>
              <button
                onClick={() => add(p.produtoId)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}