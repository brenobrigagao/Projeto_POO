using APPLICATION.DTOs;
using FFCE.Infra.UnitOfWork;
using Microsoft.AspNetCore.Hosting;

namespace APPLICATION.Services
{
    public class ProdutorService
    {
        private readonly IUnitOfWork _uow;
        private readonly IWebHostEnvironment _env;
        private readonly string _baseUrl;

        public ProdutorService(IUnitOfWork uow, IWebHostEnvironment env, string baseUrl)
        {
            _uow = uow;
            _env = env;
            _baseUrl = baseUrl;
        }

        public async Task<IEnumerable<FlorDto>> ListarFloresAsync()
        {
            var flores = await _uow.Flores.GetAllAsync();
            return flores.Select(f => FlorDto.FromEntity(f, _baseUrl)).ToList();
        }

        public async Task CadastrarProdutoAsync(int produtorId, ProdutoCadastroDto dto)
        {
            var flor = await _uow.Flores.GetByIdAsync(dto.FlorId)
                       ?? throw new InvalidOperationException("Flor não encontrada.");

            var path = Path.Combine(_env.WebRootPath!, "images", flor.ImageName);
            if (!File.Exists(path))
                throw new FileNotFoundException("Imagem da flor não encontrada no servidor.");

            var entity = ProdutoCadastroDto.ToEntity(produtorId, dto, flor.ImageName);
            await _uow.Produtos.AddAsync(entity);
            await _uow.CompleteAsync();
        }

        public async Task<IEnumerable<ProdutoListDto>> MeusProdutosAsync(int produtorId)
        {
            var produtos = (await _uow.Produtos.GetAllAsync())
                .Where(p => p.ProdutorId == produtorId)
                .ToList();

            var florIds = produtos.Select(p => p.FlorId).Distinct().ToList();
            var flores = await _uow.Flores.GetAllAsync();
            var florMap = flores
                .Where(f => florIds.Contains(f.Id))
                .ToDictionary(f => f.Id);

            return produtos.Select(p =>
                ProdutoListDto.FromEntity(p, _baseUrl, florMap[p.FlorId])
            ).ToList();
        }

        public async Task EditarProdutoAsync(int produtorId, int id, ProdutoAtualizaDto dto)
        {
            var produto = await _uow.Produtos.GetByIdAsync(id)
                          ?? throw new KeyNotFoundException("Produto não encontrado.");

            if (produto.ProdutorId != produtorId)
                throw new KeyNotFoundException("Produto não pertence ao produtor.");

            string? imageName = null;
            if (dto.FlorId.HasValue)
            {
                var flor = await _uow.Flores.GetByIdAsync(dto.FlorId.Value)
                           ?? throw new InvalidOperationException("Flor informada inválida.");

                var path = Path.Combine(_env.WebRootPath!, "images", flor.ImageName);
                if (!File.Exists(path))
                    throw new FileNotFoundException("Imagem da flor não encontrada.");

                imageName = flor.ImageName;
            }

            ProdutoAtualizaDto.Apply(produto, dto, imageName);
            _uow.Produtos.Update(produto);
            await _uow.CompleteAsync();
        }

        public async Task ExcluirProdutoAsync(int produtorId, int id)
        {
            var produto = await _uow.Produtos.GetByIdAsync(id)
                          ?? throw new KeyNotFoundException("Produto não encontrado.");

            if (produto.ProdutorId != produtorId)
                throw new KeyNotFoundException("Produto não pertence ao produtor.");

            await _uow.Produtos.DeleteAsync(id);
            await _uow.CompleteAsync();
        }
    }
}
