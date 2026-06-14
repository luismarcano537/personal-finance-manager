using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Application.Categories.Responses;

public class CategoryResponses
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public CategoryType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
}

