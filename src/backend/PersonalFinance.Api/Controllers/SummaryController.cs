using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinance.Api.Responses;
using PersonalFinance.Application.Summary.Interfaces;
using PersonalFinance.Application.Summary.Responses;

namespace PersonalFinance.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class SummaryController : ControllerBase
{
    private readonly ISummaryService _summaryService;

    public SummaryController(ISummaryService summaryService)
    {
        _summaryService = summaryService;
    }

    [HttpGet("monthly")]
    [ProducesResponseType(typeof(MonthlySummaryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetMonthly(
        [FromQuery] int month,
        [FromQuery] int year)
    {
        var userId = GetAuthenticatedUserId();

        var summary = await _summaryService.GetMonthlySummaryAsync(userId, month, year);

        return Ok(summary);
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
