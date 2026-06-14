using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Transactions.Interfaces;
using PersonalFinance.Application.Transactions.Requests;
using PersonalFinance.Application.Transactions.Responses;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Domain.Enums;
using PersonalFinance.Infrastructure.Persistence;

namespace PersonalFinance.Infrastructure.Transactions;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _dbContext;

    public TransactionService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TransactionResponse> CreateAsync(
        Guid userId,
        CreateTransactionRequest request)
    {
        ValidateTransaction(
            request.CategoryId,
            request.Type,
            request.Amount,
            request.TransactionDate);

        var category = await GetActiveCategoryOrThrowAsync(userId, request.CategoryId);
        ValidateTransactionTypeMatchesCategory(request.Type, category);

        var transaction = new Transaction(
            userId,
            request.CategoryId,
            request.Type,
            request.Amount,
            request.Description,
            request.TransactionDate);

        _dbContext.Transactions.Add(transaction);
        await _dbContext.SaveChangesAsync();

        return MapToResponse(transaction, category.Name);
    }

    public async Task<IReadOnlyList<TransactionResponse>> GetAllAsync(
        Guid userId,
        int? month = null,
        int? year = null,
        CategoryType? type = null,
        Guid? categoryId = null)
    {
        ValidateFilters(month, year, type, categoryId);

        if (categoryId.HasValue)
        {
            await EnsureActiveCategoryExistsAsync(userId, categoryId.Value);
        }

        var query = _dbContext.Transactions
            .AsNoTracking()
            .Include(transaction => transaction.Category)
            .Where(transaction =>
                transaction.UserId == userId &&
                transaction.IsActive);

        if (month.HasValue && year.HasValue)
        {
            query = query.Where(transaction =>
                transaction.TransactionDate.Month == month.Value &&
                transaction.TransactionDate.Year == year.Value);
        }

        if (type.HasValue)
        {
            query = query.Where(transaction => transaction.Type == type.Value);
        }

        if (categoryId.HasValue)
        {
            query = query.Where(transaction => transaction.CategoryId == categoryId.Value);
        }

        var transactions = await query
            .OrderByDescending(transaction => transaction.TransactionDate)
            .ThenByDescending(transaction => transaction.CreatedAt)
            .ToListAsync();

        return transactions
            .Select(MapToResponse)
            .ToList();
    }

    public async Task<TransactionResponse> GetByIdAsync(
        Guid userId,
        Guid transactionId)
    {
        var transaction = await GetActiveTransactionOrThrowAsync(userId, transactionId);

        return MapToResponse(transaction);
    }

    public async Task<TransactionResponse> UpdateAsync(
        Guid userId,
        Guid transactionId,
        UpdateTransactionRequest request)
    {
        ValidateTransaction(
            request.CategoryId,
            request.Type,
            request.Amount,
            request.TransactionDate);

        var transaction = await GetActiveTransactionOrThrowAsync(userId, transactionId);
        var category = await GetActiveCategoryOrThrowAsync(userId, request.CategoryId);

        ValidateTransactionTypeMatchesCategory(request.Type, category);

        transaction.Update(
            request.CategoryId,
            request.Type,
            request.Amount,
            request.Description,
            request.TransactionDate);

        await _dbContext.SaveChangesAsync();

        return MapToResponse(transaction, category.Name);
    }

    public async Task DeleteAsync(Guid userId, Guid transactionId)
    {
        var transaction = await GetActiveTransactionOrThrowAsync(userId, transactionId);

        transaction.Deactivate();

        await _dbContext.SaveChangesAsync();
    }

    private async Task<Category> GetActiveCategoryOrThrowAsync(
        Guid userId,
        Guid categoryId)
    {
        var category = await _dbContext.Categories
            .FirstOrDefaultAsync(category =>
                category.Id == categoryId &&
                category.UserId == userId &&
                category.IsActive);

        if (category is null)
        {
            throw new KeyNotFoundException("The category does not exist.");
        }

        return category;
    }

    private async Task EnsureActiveCategoryExistsAsync(
        Guid userId,
        Guid categoryId)
    {
        var categoryExists = await _dbContext.Categories
            .AsNoTracking()
            .AnyAsync(category =>
                category.Id == categoryId &&
                category.UserId == userId &&
                category.IsActive);

        if (!categoryExists)
        {
            throw new KeyNotFoundException("The category does not exist.");
        }
    }

    private async Task<Transaction> GetActiveTransactionOrThrowAsync(
        Guid userId,
        Guid transactionId)
    {
        var transaction = await _dbContext.Transactions
            .Include(transaction => transaction.Category)
            .FirstOrDefaultAsync(transaction =>
                transaction.Id == transactionId &&
                transaction.UserId == userId &&
                transaction.IsActive);

        if (transaction is null)
        {
            throw new KeyNotFoundException("The transaction does not exist.");
        }

        return transaction;
    }

    private static void ValidateTransaction(
        Guid categoryId,
        CategoryType type,
        decimal amount,
        DateTime transactionDate)
    {
        if (categoryId == Guid.Empty)
        {
            throw new ArgumentException("CategoryId is required.", nameof(categoryId));
        }

        ValidateTransactionType(type);

        if (amount <= 0)
        {
            throw new ArgumentException(
                "Amount must be greater than zero.",
                nameof(amount));
        }

        if (transactionDate == default)
        {
            throw new ArgumentException(
                "TransactionDate is required.",
                nameof(transactionDate));
        }
    }

    private static void ValidateFilters(
        int? month,
        int? year,
        CategoryType? type,
        Guid? categoryId)
    {
        if (month.HasValue != year.HasValue)
        {
            throw new ArgumentException("Month and year must be provided together.");
        }

        if (month is < 1 or > 12)
        {
            throw new ArgumentException(
                "Month must be between 1 and 12.",
                nameof(month));
        }

        if (year.HasValue && year.Value < 2000)
        {
            throw new ArgumentException(
                "Year must be greater than or equal to 2000.",
                nameof(year));
        }

        if (type.HasValue)
        {
            ValidateTransactionType(type.Value);
        }

        if (categoryId == Guid.Empty)
        {
            throw new ArgumentException("CategoryId is required.", nameof(categoryId));
        }
    }

    private static void ValidateTransactionType(CategoryType type)
    {
        if (!Enum.IsDefined(typeof(CategoryType), type))
        {
            throw new ArgumentException("Invalid transaction type.", nameof(type));
        }
    }

    private static void ValidateTransactionTypeMatchesCategory(
        CategoryType type,
        Category category)
    {
        if (type != category.Type)
        {
            throw new InvalidOperationException(
                "Transaction type must match the selected category type.");
        }
    }

    private static TransactionResponse MapToResponse(Transaction transaction)
    {
        return MapToResponse(transaction, transaction.Category.Name);
    }

    private static TransactionResponse MapToResponse(
        Transaction transaction,
        string categoryName)
    {
        return new TransactionResponse
        {
            Id = transaction.Id,
            CategoryId = transaction.CategoryId,
            CategoryName = categoryName,
            Type = transaction.Type,
            Amount = transaction.Amount,
            Description = transaction.Description,
            TransactionDate = transaction.TransactionDate,
            CreatedAt = transaction.CreatedAt,
            UpdatedAt = transaction.UpdatedAt,
            IsActive = transaction.IsActive
        };
    }
}
