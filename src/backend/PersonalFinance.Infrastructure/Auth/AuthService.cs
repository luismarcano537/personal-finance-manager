using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Auth.Interfaces;
using PersonalFinance.Application.Auth.Requests;
using PersonalFinance.Application.Auth.Response;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Infrastructure.Persistence;

namespace PersonalFinance.Infrastructure.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
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

        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };
    }
}