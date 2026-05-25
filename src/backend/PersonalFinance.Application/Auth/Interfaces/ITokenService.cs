using PersonalFinance.Domain.Entities;

namespace PersonalFinance.Application.Auth.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user, DateTime expiresAt);
}