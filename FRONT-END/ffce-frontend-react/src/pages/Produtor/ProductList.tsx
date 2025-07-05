import { useEffect, useState } from 'react';
import { ProdutorService } from '../../api/services';
import type { ProdutoListDto } from '../../dto/produto-list.dto';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const [produtos, setProdutos] = useState<ProdutoListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const list = await ProdutorService.meusProdutos();
      setProdutos(list);
    } catch (err) {
      console.error(err);
      toast.error('Falha ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    setDeleting(id);
    try {
      await ProdutorService.excluirProduto(id);
      setProdutos(prev => prev.filter(p => p.produtoId !== id));
      toast.success('Produto excluído com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir produto');
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Meus Produtos</h2>
        <Link
          to="/produtor/flores/novo"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Adicionar Produto
        </Link>
      </div>

      {produtos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum produto cadastrado</h3>
          <p className="text-gray-500 mb-6">Adicione seu primeiro produto para começar a vender</p>
          <Link
            to="/produtor/flores/novo"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Adicionar Produto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map(p => (
            <div key={p.produtoId} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-5">
                <div className="flex justify-center mb-4">
                  {/* Imagem da flor */}
                  <img
                    src={p.imageUrl}
                    alt={p.flor}
                    className="w-32 h-32 object-cover rounded-xl"
                    onError={e => { e.currentTarget.src = '/imagem-padrao-flor.jpg'; }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{p.flor}</h3>

                {/* EXIBIÇÃO DA DESCRIÇÃO */}
                <p className="text-gray-500 text-sm mb-4">{p.descricao}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Preço:</p>
                    <p className="font-medium">R$ {p.preco.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estoque:</p>
                    <p className={`font-medium ${p.estoque === 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {p.estoque} unidades
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/produtor/flores/editar/${p.produtoId}`}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md text-center text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <FaEdit className="mr-2" /> Editar
                  </Link>
                  <button
                    onClick={() => remove(p.produtoId)}
                    disabled={deleting === p.produtoId}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {deleting === p.produtoId ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaTrash className="mr-2" />
                    )}
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
