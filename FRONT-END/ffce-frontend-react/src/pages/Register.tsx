import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../auth/AuthService';
import toast from 'react-hot-toast';

const baseSchema = {
  email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('Campo obrigatório'),
  nome: yup.string().required('Campo obrigatório'),
  telefone: yup.string().required('Campo obrigatório'),
  endereco: yup.string().required('Campo obrigatório'),
};

const clienteSchema = yup.object({
  role: yup.string().oneOf(['Cliente']).required(),
  ...baseSchema,
  gostos: yup.string().required('Campo obrigatório'),
});

const produtorSchema = yup.object({
  role: yup.string().oneOf(['Produtor']).required(),
  ...baseSchema,
  nomeLoja: yup.string().required('Campo obrigatório'),
  descricao: yup.string().required('Campo obrigatório'),
});

type FormData =
  | {
      role: 'Cliente';
      email: string;
      senha: string;
      nome: string;
      telefone: string;
      endereco: string;
      gostos: string;
    }
  | {
      role: 'Produtor';
      email: string;
      senha: string;
      nome: string;
      telefone: string;
      endereco: string;
      nomeLoja: string;
      descricao: string;
    };

export default function Register() {
  const [role, setRole] = useState<'Cliente' | 'Produtor'>('Cliente');
  const [loading, setLoading] = useState(false);
  const schema = role === 'Cliente' ? clienteSchema : produtorSchema;
  
  const {
    register,
    handleSubmit,
    formState,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema as any),
    defaultValues: { role } as any,
  });
  
  const navigate = useNavigate();
  const errors = formState.errors as Record<string, { message?: string }>;

  useEffect(() => {
    reset({ role } as any);
  }, [role, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (data.role === 'Cliente') {
        await AuthService.registroCliente({
          email: data.email,
          senha: data.senha,
          nome: data.nome,
          telefone: data.telefone,
          endereco: data.endereco,
          gostos: data.gostos,
        });
      } else {
        await AuthService.registroProdutor({
          email: data.email,
          senha: data.senha,
          nome: data.nome,
          telefone: data.telefone,
          endereco: data.endereco,
          nomeLoja: data.nomeLoja,
          descricao: data.descricao,
        });
      }
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Erro ao realizar cadastro';
      toast.error(errorMessage);
      console.error('Erro no cadastro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Criar nova conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            Faça login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Conta
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setRole('Cliente')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  role === 'Cliente'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cliente
              </button>
              <button
                type="button"
                onClick={() => setRole('Produtor')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  role === 'Produtor'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Produtor
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                {...register('nome')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              {errors.nome?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              {errors.email?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                {...register('senha')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              {errors.senha?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                id="telefone"
                type="text"
                {...register('telefone')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              {errors.telefone?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <input
                id="endereco"
                type="text"
                {...register('endereco')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              {errors.endereco?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
              )}
            </div>

            {role === 'Cliente' && (
              <div>
                <label htmlFor="gostos" className="block text-sm font-medium text-gray-700">
                  Preferências de Flores
                </label>
                <textarea
                  id="gostos"
                  rows={3}
                  {...register('gostos')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                ></textarea>
                {errors.gostos?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.gostos.message}</p>
                )}
              </div>
            )}

            {role === 'Produtor' && (
              <>
                <div>
                  <label htmlFor="nomeLoja" className="block text-sm font-medium text-gray-700">
                    Nome da Loja
                  </label>
                  <input
                    id="nomeLoja"
                    type="text"
                    {...register('nomeLoja')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                  {errors.nomeLoja?.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.nomeLoja.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                    Descrição da Loja
                  </label>
                  <textarea
                    id="descricao"
                    rows={3}
                    {...register('descricao')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  ></textarea>
                  {errors.descricao?.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}