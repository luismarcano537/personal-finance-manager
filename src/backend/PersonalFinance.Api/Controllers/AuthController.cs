using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinance.Application.Auth.Interfaces;
using PersonalFinance.Application.Auth.Request;
using PersonalFinance.Application.Auth.Requests;

namespace PersonalFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserRequest request)
    {
        var user = await _authService.RegisterAsync(request);

        return CreatedAtAction(
            nameof(Register),
            new { id = user.Id },
            user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var authResponse = await _authService.LoginAsync(request);

        return Ok(authResponse);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = GetAuthenticatedUserId();

        var user = await _authService.GetCurrentUserAsync(userId);

        return Ok(user);
    }

    private Guid GetAuthenticatedUserId()
    {
        var userIdClaims = new[]
        {
            User.FindFirstValue(ClaimTypes.NameIdentifier),
            User.FindFirstValue(JwtRegisteredClaimNames.Sub),
            User.FindFirstValue("sub")
        };

        foreach (var userIdClaim in userIdClaims)
        {
            if (Guid.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
        }

        throw new UnauthorizedAccessException("Invalid token.");
    }
}
