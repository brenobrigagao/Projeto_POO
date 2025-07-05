import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProdutorService } from '../../api/services';
import type { ProdutoCadastroDto, ProdutoAtualizaDto } from '../../dto/produto-cadastro.dto';
import type { FlorDto } from '../../dto/flor.dto';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';

interface FormValues {
  florId: number;
  preco: number;
  estoque: number;
}

const schema = yup.object({
  florId: yup.number().min(1, 'Selecione uma flor').required('Obrigatório'),
  preco: yup.number()
    .positive('Deve ser maior que 0')
    .required('Obrigatório')
    .transform((value) => (isNaN(value) ? undefined : value)),
  estoque: yup.number()
    .integer('Deve ser um número inteiro')
    .min(0, 'Deve ser maior ou igual a 0')
    .required('Obrigatório')
    .transform((value) => (isNaN(value) ? undefined : value)),
}).required();

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flores, setFlores] = useState<FlorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagemFlor, setImagemFlor] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { florId: 0, preco: 0, estoque: 0 }
  });

  const florIdSelecionada = watch('florId');
  
  useEffect(() => {
    if (florIdSelecionada) {
      const florSelecionada = flores.find(f => f.id === florIdSelecionada);
      if (florSelecionada) {
        setImagemFlor(florSelecionada.imageUrl);
      }
    }
  }, [florIdSelecionada, flores]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const floresList = await ProdutorService.listarFlores();
        setFlores(floresList);
        
        if (id) {
          const produtoList = await ProdutorService.meusProdutos();
          const produto = produtoList.find(p => p.produtoId === parseInt(id));
          
          if (produto) {
            const flor = floresList.find(f => f.nome === produto.flor);
            
            reset({
              florId: flor?.id || 0,
              preco: produto.preco,
              estoque: produto.estoque,
            });

            if (flor) {
              setImagemFlor(flor.imageUrl);
            }
          }
        }
      } catch (err) {
        toast.error('Falha ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      if (id) {
        const dto: ProdutoAtualizaDto = {
          florId: data.florId,
          preco: data.preco,
          estoque: data.estoque
        };
        await ProdutorService.editarProduto(parseInt(id), dto);
        toast.success('Produto atualizado com sucesso!');
      } else {
        const dto: ProdutoCadastroDto = data;
        await ProdutorService.cadastrarProduto(dto);
        toast.success('Produto cadastrado com sucesso!');
      }
      navigate('/produtor/flores');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao salvar produto';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
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
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/produtor/flores')}
          className="flex items-center text-green-600 hover:text-green-800 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Voltar para lista
        </button>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {id ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-gray-100 border-2 border-dashed rounded-xl w-48 h-48 flex items-center justify-center">
                {imagemFlor ? (
                  <img 
                    src={imagemFlor} 
                    alt="Flor selecionada" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-gray-500">Imagem da flor</span>
                )}
              </div>
            </div>
            
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flor
                  </label>
                  <select
                    {...register('florId')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.florId 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  >
                    <option value={0}>Selecione uma flor</option>
                    {flores.map(flor => (
                      <option key={flor.id} value={flor.id}>
                        {flor.nome}
                      </option>
                    ))}
                  </select>
                  {errors.florId && (
                    <p className="mt-1 text-sm text-red-600">{errors.florId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (R$)
                  </label>
                  <input
                    {...register('preco')}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.preco 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  />
                  {errors.preco && (
                    <p className="mt-1 text-sm text-red-600">{errors.preco.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade em Estoque
                  </label>
                  <input
                    {...register('estoque')}
                    type="number"
                    placeholder="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.estoque 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  />
                  {errors.estoque && (
                    <p className="mt-1 text-sm text-red-600">{errors.estoque.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-75"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" /> 
                        {id ? 'Atualizando...' : 'Cadastrando...'}
                      </span>
                    ) : id ? 'Atualizar Produto' : 'Cadastrar Produto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}