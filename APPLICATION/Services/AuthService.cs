using FFCE.Application.DTOs;
using FFCE.Application.Services;
using FFCE.Infra.UnitOfWork;

namespace APPLICATION.Services
{
    public class AuthService
    {
        private readonly IUnitOfWork _uow;
        private readonly TokenService _tokenService;

        public AuthService(IUnitOfWork uow, TokenService tokenService)
        {
            _uow = uow;
            _tokenService = tokenService;
        }

        public async Task<int> RegisterClienteAsync(ClienteCreateDto dto)
        {
            var entity = ClienteCreateDto.ToEntity(dto);
            await _uow.Clientes.AddAsync(entity);
            await _uow.CompleteAsync();
            return entity.Id;
        }

        public async Task<int> RegisterProdutorAsync(ProdutorCreateDto dto)
        {
            var entity = ProdutorCreateDto.ToEntity(dto);
            await _uow.Produtores.AddAsync(entity);
            await _uow.CompleteAsync();
            return entity.Id;
        }

        public async Task<(string token, string role, int id)> LoginAsync(LoginDto dto)
        {
            var clientes = await _uow.Clientes.GetAllAsync();
            var cliente = clientes.FirstOrDefault(c => c.Email == dto.Email);
            if (cliente is not null && BCrypt.Net.BCrypt.Verify(dto.Senha, cliente.SenhaHash))
                return (_tokenService.GenerateToken(cliente.Id, cliente.Email, "Cliente"), "Cliente", cliente.Id);

            var produtores = await _uow.Produtores.GetAllAsync();
            var produtor = produtores.FirstOrDefault(p => p.Email == dto.Email);
            if (produtor is not null && BCrypt.Net.BCrypt.Verify(dto.Senha, produtor.SenhaHash))
                return (_tokenService.GenerateToken(produtor.Id, produtor.Email, "Produtor"), "Produtor", produtor.Id);

            throw new InvalidOperationException("Credenciais inválidas");
        }


        public async Task<bool> VerificarCadastroAsync(int userId, string role) =>
            role switch
            {
                "Cliente" => await _uow.Clientes.GetByIdAsync(userId) is not null,
                "Produtor" => await _uow.Produtores.GetByIdAsync(userId) is not null,
                _ => throw new InvalidOperationException("Role desconhecida")
            };
    }
}
