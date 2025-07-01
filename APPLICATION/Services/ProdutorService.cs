namespace FFCE.Application.Services
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using FFCE.Application.DTOs;
    using FFCE.Infra.UnitOfWork;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.AspNetCore.Hosting;
    using System.IO;

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
            return flores.Select(f => FlorDto.FromEntity(f, _baseUrl));
        }

        public async Task CadastrarProdutoAsync(int produtorId, ProdutoCadastroDto dto)
        {
            var flor = await _uow.Flores.GetByIdAsync(dto.FlorId);
            if (flor is null) throw new InvalidOperationException();

            var path = Path.Combine(_env.WebRootPath, "images", flor.ImageName);
            if (!File.Exists(path)) throw new FileNotFoundException();

            var entity = ProdutoCadastroDto.ToEntity(produtorId, dto, flor.ImageName);
            await _uow.Produtos.AddAsync(entity);
            await _uow.CompleteAsync();
        }

        public async Task<IEnumerable<ProdutoListDto>> MeusProdutosAsync(int produtorId)
        {
            var produtos   = await _uow.Produtos.GetAllAsync();
            var flores     = await _uow.Flores.GetAllAsync();
            var produtores = await _uow.Produtores.GetAllAsync();

            return produtos
                .Where(p => p.ProdutorId == produtorId)
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



        public async Task EditarProdutoAsync(int produtorId, int id, ProdutoAtualizaDto dto)
        {
            var produto = await _uow.Produtos.GetByIdAsync(id);
            if (produto is null || produto.ProdutorId != produtorId) throw new KeyNotFoundException();

            string? imageName = null;
            if (dto.FlorId.HasValue)
            {
                var flor = await _uow.Flores.GetByIdAsync(dto.FlorId.Value);
                if (flor is null) throw new InvalidOperationException();

                var path = Path.Combine(_env.WebRootPath, "images", flor.ImageName);
                if (!File.Exists(path)) throw new FileNotFoundException();

                imageName = flor.ImageName;
            }

            ProdutoAtualizaDto.Apply(produto, dto, imageName);
            _uow.Produtos.Update(produto);
            await _uow.CompleteAsync();
        }

        public async Task ExcluirProdutoAsync(int produtorId, int id)
        {
            var produto = await _uow.Produtos.GetByIdAsync(id);
            if (produto is null || produto.ProdutorId != produtorId) throw new KeyNotFoundException();

            await _uow.Produtos.DeleteAsync(id);
            await _uow.CompleteAsync();
        }
    }
}
