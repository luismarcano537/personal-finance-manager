using Microsoft.AspNetCore.Mvc;
using PersonalFinance.Application.Auth.Interfaces;
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
        try
        {
            var user = await _authService.RegisterAsync(request);

            return CreatedAtAction(
                nameof(Register),
                new { id = user.Id },
                user);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }
}