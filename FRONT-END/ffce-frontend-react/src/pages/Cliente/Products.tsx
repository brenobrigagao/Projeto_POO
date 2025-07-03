import { useEffect, useState } from 'react';
import ClienteService from '../../services/ClienteService';
import type { ProdutoDisponivel } from '../../services/ClienteService';
import toast from 'react-hot-toast';
import { FaShoppingCart, FaSpinner } from 'react-icons/fa';

export default function Products() {
  const [produtos, setProdutos] = useState<ProdutoDisponivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await ClienteService.listarProdutos();
        setProdutos(list);
      } catch (err) {
        toast.error('Falha ao carregar produtos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (id: number) => {
    setAdding(id);
    try {
      await ClienteService.adicionarAoCarrinho({ produtoId: id, quantidade: 1 });
      toast.success('Adicionado ao carrinho!');
    } catch (err) {
      toast.error('Erro ao adicionar ao carrinho');
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Flores Disponíveis</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {produtos.map((p) => (
          <div 
            key={p.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            <div className="p-5">
              <div className="flex justify-center mb-4">
                <img 
                  src={p.imageUrl} 
                  alt={p.nome} 
                  className="w-32 h-32 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = '/imagem-padrao-flor.jpg';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{p.nome}</h3>
              <p className="text-gray-500 text-sm mb-4">{p.descricao}</p>

              <button
                onClick={() => handleAdd(p.id)}
                disabled={adding === p.id}
                className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium ${
                  adding === p.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } ${adding === p.id ? 'opacity-75' : ''}`}
              >
                {adding === p.id ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaShoppingCart className="mr-2" />
                )}
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
