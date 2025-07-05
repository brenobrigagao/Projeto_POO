using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using APPLICATION.DTOs;
using FFCE.Infra.UnitOfWork;

namespace APPLICATION.Services
{
    public class ClienteService
    {
        private readonly IUnitOfWork _uow;
        private readonly string _baseUrl;

        public ClienteService(IUnitOfWork uow, string baseUrl)
        {
            _uow = uow;
            _baseUrl = baseUrl;
        }

        public async Task<IEnumerable<ProdutoDisponivelDto>> ListarProdutosAsync()
        {
            var produtos = await _uow.Produtos.GetAllAsync();
            var flores   = await _uow.Flores.GetAllAsync();

            return produtos
                .Select(p =>
                {
                    var f = flores.First(x => x.Id == p.FlorId);
                    return new ProdutoDisponivelDto
                    {
                        Id        = p.Id,
                        Nome      = f.Nome,
                        Descricao = f.Descricao,
                        ImageUrl  = $"{_baseUrl}{f.ImageName}",
                        Preco     = p.Preco,
                        Estoque   = p.Estoque
                    };
                })
                .ToList();
        }

        public async Task AdicionarAoCarrinhoAsync(int clienteId, AddCarrinhoDto dto)
        {
            var cliente = await _uow.Clientes.GetByIdAsync(clienteId)
                          ?? throw new KeyNotFoundException();

            var carrinho = (await _uow.Carrinhos.GetAllAsync())
                           .First(c => c.ClienteId == clienteId);

            var produto = await _uow.Produtos.GetByIdAsync(dto.ProdutoId)
                          ?? throw new KeyNotFoundException();

            if (dto.Quantidade <= 0)
                throw new InvalidOperationException();

            var itens = await _uow.ItensCarrinho.GetAllAsync();
            var item  = itens.FirstOrDefault(i =>
                i.CarrinhoId == carrinho.Id && i.ProdutoId == dto.ProdutoId);

            if (item != null)
                item.Quantidade += dto.Quantidade;
            else
            {
                var entity = AddCarrinhoDto.ToEntity(carrinho.Id, dto, produto.Preco);
                await _uow.ItensCarrinho.AddAsync(entity);
            }

            await _uow.CompleteAsync();
        }

        public async Task<CarrinhoViewDto> VisualizarCarrinhoAsync(int clienteId)
        {
            var carrinho = (await _uow.Carrinhos.GetAllAsync())
                           .First(c => c.ClienteId == clienteId);

            var itens      = (await _uow.ItensCarrinho.GetAllAsync())
                             .Where(i => i.CarrinhoId == carrinho.Id)
                             .ToList();
            var produtos   = await _uow.Produtos.GetAllAsync();
            var flores     = await _uow.Flores.GetAllAsync();
            var produtores = await _uow.Produtores.GetAllAsync();

            var dtoItems = itens
                .Select(i =>
                {
                    var p  = produtos.First(x => x.Id == i.ProdutoId);
                    var f  = flores.First(x => x.Id == p.FlorId);
                    var pr = produtores.First(x => x.Id == p.ProdutorId);
                    return new CarrinhoItemDto
                    {
                        Id               = i.Id,
                        ProdutoId        = i.ProdutoId,
                        Flor             = f.Nome,
                        ImageUrl         = $"{_baseUrl}{f.ImageName}",
                        PrecoUnitario    = i.Preco,
                        Quantidade       = i.Quantidade,
                        Subtotal         = i.Preco * i.Quantidade,
                        Produtor         = pr.Nome,
                        NomeLoja         = pr.NomeLoja,
                        TelefoneProdutor = pr.Telefone
                    };
                })
                .ToList();

            return new CarrinhoViewDto
            {
                Itens = dtoItems,
                Total = dtoItems.Sum(x => x.Subtotal)
            };
        }

        public async Task AtualizarQuantidadeAsync(int clienteId, int produtoId, int quantidade)
        {
            var carrinho = (await _uow.Carrinhos.GetAllAsync())
                           .First(c => c.ClienteId == clienteId);

            var item = (await _uow.ItensCarrinho.GetAllAsync())
                       .First(i => i.CarrinhoId == carrinho.Id && i.ProdutoId == produtoId);

            if (quantidade <= 0)
                throw new InvalidOperationException();

            item.Quantidade = quantidade;
            await _uow.CompleteAsync();
        }

        public async Task RemoverDoCarrinhoAsync(int clienteId, int produtoId)
        {
            var carrinho = (await _uow.Carrinhos.GetAllAsync())
                           .First(c => c.ClienteId == clienteId);

            var item = (await _uow.ItensCarrinho.GetAllAsync())
                       .FirstOrDefault(i => i.CarrinhoId == carrinho.Id && i.ProdutoId == produtoId)
                       ?? throw new KeyNotFoundException();

            await _uow.ItensCarrinho.DeleteAsync(item.Id);
            await _uow.CompleteAsync();
        }

        public async Task FinalizarCompraAsync(int clienteId)
        {
            var carrinho = (await _uow.Carrinhos.GetAllAsync())
                           .First(c => c.ClienteId == clienteId);

            var itens = (await _uow.ItensCarrinho.GetAllAsync())
                        .Where(i => i.CarrinhoId == carrinho.Id)
                        .ToList();

            if (!itens.Any())
                throw new InvalidOperationException();

            foreach (var item in itens)
                await _uow.ItensCarrinho.DeleteAsync(item.Id);

            await _uow.CompleteAsync();
        }
    }
}
