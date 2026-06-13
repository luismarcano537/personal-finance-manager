using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinance.Api.Responses;
using PersonalFinance.Application.Categories.Interfaces;
using PersonalFinance.Application.Categories.Requests;
using PersonalFinance.Application.Categories.Responses;
using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(CategoryResponses), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create(CreateCategoryRequest request)
    {
        var userId = GetAuthenticatedUserId();

        var category = await _categoryService.CreateAsync(userId, request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = category.Id },
            category);
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(IReadOnlyList<CategoryResponses>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll([FromQuery] CategoryType? type)
    {
        var userId = GetAuthenticatedUserId();

        var categories = await _categoryService.GetAllAsync(userId, type);

        return Ok(categories);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CategoryResponses), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetAuthenticatedUserId();

        var category = await _categoryService.GetByIdAsync(userId, id);

        return Ok(category);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(CategoryResponses), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(Guid id, UpdateCategoryRequest request)
    {
        var userId = GetAuthenticatedUserId();

        var category = await _categoryService.UpdateAsync(userId, id, request);

        return Ok(category);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetAuthenticatedUserId();

        await _categoryService.DeleteAsync(userId, id);

        return NoContent();
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
