using APPLICATION.DTOs;
using FFCE.Application.DTOs;
using FFCE.Infra.UnitOfWork;

public class ClienteService
{
    private readonly IUnitOfWork _uow;
    private readonly string _baseUrl;

    public ClienteService(IUnitOfWork uow, string baseUrl)
    {
        _uow = uow;
        _baseUrl = baseUrl;
    }

    public async Task<IEnumerable<ProdutoListDto>> ListarProdutosAsync()
    {
        var produtos   = await _uow.Produtos.GetAllAsync();
        var flores     = await _uow.Flores.GetAllAsync();
        var produtores = await _uow.Produtores.GetAllAsync();

        return produtos
            .Select(p =>
            {
                var flor     = flores.First(f => f.Id == p.FlorId);
                var produtor = produtores.First(pr => pr.Id == p.ProdutorId);
                return new ProdutoListDto
                {
                    ProdutoId = p.Id,
                    Flor      = flor.Nome,
                    Preco     = p.Preco,
                    Estoque   = p.Estoque,
                    NomeLoja  = produtor.NomeLoja,
                    Telefone  = produtor.Telefone
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
                      ?? throw new InvalidOperationException();

        if (dto.Quantidade <= 0) throw new InvalidOperationException();

        var itens = await _uow.ItensCarrinho.GetAllAsync();
        var item  = itens.FirstOrDefault(i =>
            i.CarrinhoId == carrinho.Id && i.ProdutoId == dto.ProdutoId);

        if (item is not null)
            item.Quantidade += dto.Quantidade;
        else
            await _uow.ItensCarrinho.AddAsync(
                AddCarrinhoDto.ToEntity(carrinho.Id, dto, produto.Preco)
            );

        await _uow.CompleteAsync();
    }

    public async Task<CarrinhoViewDto> VisualizarCarrinhoAsync(int clienteId)
    {
        var cliente = await _uow.Clientes.GetByIdAsync(clienteId)
                      ?? throw new KeyNotFoundException();
        var carrinho = (await _uow.Carrinhos.GetAllAsync())
                       .First(c => c.ClienteId == clienteId);

        var itens     = (await _uow.ItensCarrinho.GetAllAsync())
                        .Where(i => i.CarrinhoId == carrinho.Id)
                        .ToList();
        var produtos  = await _uow.Produtos.GetAllAsync();
        var flores    = await _uow.Flores.GetAllAsync();
        var produtores = await _uow.Produtores.GetAllAsync();

        var dtoItems = itens.Select(i =>
        {
            var p = produtos.First(p => p.Id == i.ProdutoId);
            var f = flores   .First(f => f.Id == p.FlorId);
            var pr= produtores.First(pr=> pr.Id == p.ProdutorId);
            return new CarrinhoItemDto
            {
                Id                = i.Id,
                ProdutoId         = i.ProdutoId,
                Flor              = f.Nome,
                ImageUrl          = $"{_baseUrl}{f.ImageName}",
                PrecoUnitario     = i.Preco,
                Quantidade        = i.Quantidade,
                Subtotal          = i.Preco * i.Quantidade,
                Produtor          = pr.Nome,
                NomeLoja          = pr.NomeLoja,
                TelefoneProdutor  = pr.Telefone
            };
        });

        var total = dtoItems.Sum(x => x.Subtotal);

        return new CarrinhoViewDto
        {
            Itens = dtoItems,
            Total = total
        };
    }
}
