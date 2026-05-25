using PersonalFinance.Application.Auth.Request;
using PersonalFinance.Application.Auth.Requests;
using PersonalFinance.Application.Auth.Response;

namespace PersonalFinance.Application.Auth.Interfaces;

public interface IAuthService
{
    Task<UserResponse> RegisterAsync(RegisterUserRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserResponse> GetCurrentUserAsync(Guid userId);
}