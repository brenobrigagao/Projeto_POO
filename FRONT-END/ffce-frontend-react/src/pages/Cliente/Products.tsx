import { useEffect, useState, useMemo } from 'react'
import ClienteService, { type ProdutoDisponivel } from '../../services/ClienteService'
import toast from 'react-hot-toast'
import { FaShoppingCart, FaSpinner, FaSearch } from 'react-icons/fa'

export default function Products() {
  const [produtos, setProdutos] = useState<ProdutoDisponivel[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]); // [min, max]
  const [productTypes, setProductTypes] = useState<string[]>([]);

  // Calcular preços min/max apenas quando produtos mudarem
  const [minMaxPrices, setMinMaxPrices] = useState<[number, number]>([0, 100]);
  
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const list = await ClienteService.listarProdutos()
        setProdutos(list)
        
        const uniqueTypes = Array.from(new Set(list.map(p => p.tipo)));
        setProductTypes(uniqueTypes);

        // Calcular valores min/max reais
        const prices = list.map(p => p.preco);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setMinMaxPrices([minPrice, maxPrice]);
        setPriceRange([minPrice, maxPrice]);
        
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

  const filtered = useMemo(() => {
    return produtos.filter(p => {
      const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.descricao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'all' || p.tipo === selectedType;
      
      // Usar os valores reais do range
      const matchesPrice = p.preco >= priceRange[0] && p.preco <= priceRange[1];

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [produtos, searchTerm, selectedType, priceRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center w-full md:w-full">
          <FaSearch className="mr-2 text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
        </div>
      </div>

      {/* Filtro de preço corrigido (min e max) */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Faixa de Preço</h3>
        
        <div className="space-y-4">
          {/* Controle para preço mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mínimo: R${priceRange[0].toFixed(2)}
            </label>
            <input
              type="range"
              min={minMaxPrices[0]}
              max={minMaxPrices[1]}
              value={priceRange[0]}
              onChange={e => {
                const newMin = Number(e.target.value);
                // Garantir que min não seja maior que max
                if(newMin <= priceRange[1]) {
                  setPriceRange([newMin, priceRange[1]]);
                }
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Controle para preço máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo: R${priceRange[1].toFixed(2)}
            </label>
            <input
              type="range"
              min={minMaxPrices[0]}
              max={minMaxPrices[1]}
              value={priceRange[1]}
              onChange={e => {
                const newMax = Number(e.target.value);
                // Garantir que max não seja menor que min
                if(newMax >= priceRange[0]) {
                  setPriceRange([priceRange[0], newMax]);
                }
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        <div className="mt-2 flex justify-between text-sm text-gray-500">
          <span>R${minMaxPrices[0].toFixed(2)}</span>
          <span>R${minMaxPrices[1].toFixed(2)}</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Flores Disponíveis</h2>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Nenhum produto encontrado com os filtros atuais</p>
        </div>
      ) : (
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
                  className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium ${adding === p.id
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
      )}
    </div>
  )
}