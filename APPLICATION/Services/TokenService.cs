using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace APPLICATION.Services
{
    public sealed class TokenService
    {
        private readonly IConfiguration _cfg;
        private readonly byte[]         _keyBytes;

        public TokenService(IConfiguration configuration)
        {
            _cfg      = configuration;
            _keyBytes = Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!);
        }

        public string GenerateToken(int id, string email, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Email,         email),
                new Claim(ClaimTypes.Role,          role)
            };

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(_keyBytes),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer:             _cfg["Jwt:Issuer"],
                audience:           _cfg["Jwt:Audience"],
                claims:             claims,
                expires:            DateTime.UtcNow.AddHours(4),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}