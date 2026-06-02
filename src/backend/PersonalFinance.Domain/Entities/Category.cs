using System.Transactions;
using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Domain.Entities;

public class Category
{
    private readonly List<Transaction> _transactions = new();
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public CategoryType Type { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public bool IsActive { get; private set; }

    public User User { get; private set; } = default!;
    
    public IReadOnlyCollection<Transaction> Transactions => _transactions.AsReadOnly();

    private Category()
    {
    }

    public Category(Guid userId, string name, CategoryType type)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Name = name;
        Type = type;
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    public void Update(string name, CategoryType type)
    {
        Name = name;
        Type = type;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }
}