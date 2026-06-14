using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PersonalFinance.Application.Auth.Interfaces;
using PersonalFinance.Application.Auth.Request;
using PersonalFinance.Application.Auth.Requests;
using PersonalFinance.Application.Auth.Response;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Infrastructure.Persistence;

namespace PersonalFinance.Infrastructure.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;

    public AuthService(
        AppDbContext dbContext,
        ITokenService tokenService,
        IConfiguration configuration)
    {
        _dbContext = dbContext;
        _tokenService = tokenService;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<UserResponse> RegisterAsync(RegisterUserRequest request)
    {
        var name = request.Name.Trim();
        var email = request.Email.Trim().ToLowerInvariant();

        var emailAlreadyExists = await _dbContext.Users
            .AnyAsync(user => user.Email == email);

        if (emailAlreadyExists)
        {
            throw new InvalidOperationException("Email is already registered.");
        }

        var user = new User(
            name,
            email,
            passwordHash: string.Empty
        );

        var passwordHash = _passwordHasher.HashPassword(user, request.Password);

        user.SetPasswordHash(passwordHash);

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return MapToUserResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(user => user.Email == email && user.IsActive);

        if (user is null)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password);

        if (passwordVerificationResult == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var expirationMinutes = int.Parse(
            _configuration["Jwt:ExpirationMinutes"] ?? "60");

        var expiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes);

        var accessToken = _tokenService.GenerateAccessToken(user, expiresAt);

        return new AuthResponse
        {
            AccessToken = accessToken,
            ExpiresAt = expiresAt,
            User = MapToUserResponse(user)
        };
    }

    public async Task<UserResponse> GetCurrentUserAsync(Guid userId)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == userId && user.IsActive);

        if (user is null)
        {
            throw new UnauthorizedAccessException("User not found.");
        }

        return MapToUserResponse(user);
    }

    private static UserResponse MapToUserResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };
    }
}