using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinance.Application.Categories.Interfaces;
using PersonalFinance.Application.Categories.Requests;
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
    public async Task<IActionResult> Create(CreateCategoryRequest request)
    {
        var userId = GetAuthenticatedUserId();

        try
        {
            var category = await _categoryService.CreateAsync(userId, request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = category.Id },
                category);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] CategoryType? type)
    {
        var userId = GetAuthenticatedUserId();

        var categories = await _categoryService.GetAllAsync(userId, type);

        return Ok(categories);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetAuthenticatedUserId();

        try
        {
            var category = await _categoryService.GetByIdAsync(userId, id);

            return Ok(category);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateCategoryRequest request)
    {
        var userId = GetAuthenticatedUserId();

        try
        {
            var category = await _categoryService.UpdateAsync(userId, id, request);

            return Ok(category);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetAuthenticatedUserId();

        try
        {
            await _categoryService.DeleteAsync(userId, id);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
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
