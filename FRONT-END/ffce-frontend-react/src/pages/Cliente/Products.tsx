import { useEffect, useState } from 'react'
import ClienteService, { type ProdutoDisponivel } from '../../services/ClienteService'
import toast from 'react-hot-toast'
import { FaShoppingCart, FaSpinner, FaSearch } from 'react-icons/fa'

export default function Products() {
  const [produtos, setProdutos] = useState<ProdutoDisponivel[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const list = await ClienteService.listarProdutos()
        setProdutos(list)
      } catch {
        toast.error('Falha ao carregar produtos')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleAdd = async (id: number) => {
    setAdding(id)
    try {
      await ClienteService.adicionarAoCarrinho({ produtoId: id, quantidade: 1 })
      toast.success('Adicionado ao carrinho!')
    } catch {
      toast.error('Erro ao adicionar ao carrinho')
    } finally {
      setAdding(null)
    }
  }

  const filtered = produtos.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex items-center mb-6">
        <FaSearch className="mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Flores Disponíveis</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(p => (
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
                  onError={e => {
                    e.currentTarget.src = '/imagem-padrao-flor.jpg'
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{p.nome}</h3>
              <p className="text-gray-500 text-sm mb-1">{p.descricao}</p>
              <p className="text-gray-600 text-sm font-medium mb-2">
                Produtor: {p.produtor.nomeLoja}
              </p>
              <p className="text-lg font-bold text-green-600 mb-4">
                R$ {p.preco.toFixed(2)}
              </p>
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
  )
}
