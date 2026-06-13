using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinance.Application.Transactions.Interfaces;
using PersonalFinance.Application.Transactions.Requests;
using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTransactionRequest request)
    {
        var userId = GetAuthenticatedUserId();

        var transaction = await _transactionService.CreateAsync(userId, request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = transaction.Id },
            transaction);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? month,
        [FromQuery] int? year,
        [FromQuery] CategoryType? type,
        [FromQuery] Guid? categoryId)
    {
        var userId = GetAuthenticatedUserId();

        var transactions = await _transactionService.GetAllAsync(
            userId,
            month,
            year,
            type,
            categoryId);

        return Ok(transactions);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetAuthenticatedUserId();

        var transaction = await _transactionService.GetByIdAsync(userId, id);

        return Ok(transaction);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateTransactionRequest request)
    {
        var userId = GetAuthenticatedUserId();

        var transaction = await _transactionService.UpdateAsync(userId, id, request);

        return Ok(transaction);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetAuthenticatedUserId();

        await _transactionService.DeleteAsync(userId, id);

        return NoContent();
    }

    private Guid GetAuthenticatedUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid token.");
        }

        return userId;
    }
}
