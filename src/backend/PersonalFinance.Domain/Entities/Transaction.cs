using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Domain.Entities;

public class Transaction
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid CategoryId { get; private set; }
    public CategoryType Type { get; private set; }
    public decimal Amount { get; private set; }
    public string? Description { get; private set; }
    public DateTime TransactionDate { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public bool IsActive { get; private set; }

    public User User { get; private set; } = default!;
    public Category Category { get; private set; } = default!;

    private Transaction()
    {
    }

    public Transaction(
        Guid userId,
        Guid categoryId,
        CategoryType type,
        decimal amount,
        string? description,
        DateTime transactionDate)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Amount must be greater than zero.", nameof(amount));
        }

        Id = Guid.NewGuid();
        UserId = userId;
        CategoryId = categoryId;
        Type = type;
        Amount = amount;
        Description = description;
        TransactionDate = transactionDate;
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    public void Update(
        Guid categoryId,
        CategoryType type,
        decimal amount,
        string? description,
        DateTime transactionDate)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Amount must be greater than zero.", nameof(amount));
        }

        CategoryId = categoryId;
        Type = type;
        Amount = amount;
        Description = description;
        TransactionDate = transactionDate;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }
}