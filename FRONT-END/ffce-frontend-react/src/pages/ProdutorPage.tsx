import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { ProdutoListDto } from '../dto/produto-list.dto';
import type { FlorDto } from '../dto/flor.dto';
import type { ProdutoCadastroDto } from '../dto/produto-cadastro.dto';
import type { ProdutoAtualizaDto } from '../dto/produto-atualiza.dto';
import toast from 'react-hot-toast';

export default function ProdutorPage() {
  const [produtos, setProdutos] = useState<ProdutoListDto[]>([]);
  const [flores, setFlores] = useState<FlorDto[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProdutoCadastroDto>({
    florId: 0,
    preco: 0,
    estoque: 0,
  });

  useEffect(() => {
    api.get<ProdutoListDto[]>('/Produtor/meus-produtos').then(r => setProdutos(r.data));
    api.get<FlorDto[]>('/Produtor/listar-flores').then(r => setFlores(r.data));
  }, []);

  function submit() {
    if (editId !== null) {
      const dto = form as ProdutoAtualizaDto;
      api.put(`/Produtor/editar-produto/${editId}`, dto)
        .then(() => {
          toast.success('Produto atualizado!');
          window.location.reload();
        })
        .catch(() => toast.error('Erro ao atualizar produto'));
    } else {
      const dto = form as ProdutoCadastroDto;
      api.post('/Produtor/cadastrar-produto', dto)
        .then(() => {
          toast.success('Produto cadastrado!');
          window.location.reload();
        })
        .catch(() => toast.error('Erro ao cadastrar produto'));
    }
  }

  function remove(id: number) {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      api.delete(`/Produtor/excluir-produto/${id}`)
        .then(() => {
          setProdutos(ps => ps.filter(p => p.produtoId !== id));
          toast.success('Produto excluído!');
        })
        .catch(() => toast.error('Erro ao excluir produto'));
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Gerenciamento de Produtos</h2>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {editId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flor</label>
            <select
              value={form.florId}
              onChange={e => setForm({ ...form, florId: +e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="0">Selecione uma flor</option>
              {flores.map(f => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input
              type="number"
              placeholder="0.00"
              value={form.preco}
              onChange={e => setForm({ ...form, preco: +e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
            <input
              type="number"
              placeholder="0"
              value={form.estoque}
              onChange={e => setForm({ ...form, estoque: +e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={submit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {editId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map(p => (
          <div
            key={p.produtoId}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{p.flor}</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Preço:</p>
                  <p className="font-medium">R$ {p.preco.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estoque:</p>
                  <p className="font-medium">{p.estoque} unidades</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditId(p.produtoId);
                    setForm({
                      florId: flores.find(f => f.nome === p.flor)?.id || 0,
                      preco: p.preco,
                      estoque: p.estoque,
                    });
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => remove(p.produtoId)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}