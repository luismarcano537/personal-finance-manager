using PersonalFinance.Application.Auth.Requests;
using PersonalFinance.Application.Auth.Response;

namespace PersonalFinance.Application.Auth.Interfaces;

public interface IAuthService
{
    Task<UserResponse> RegisterAsync(RegisterUserRequest request);
}