using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Application.Summary.Responses;

public class CategorySummaryResponse
{
    public int Month { get; set; }
    public int Year { get; set; }
    public CategoryType? Type { get; set; }
    public IReadOnlyList<CategorySummaryItemResponse> Categories { get; set; } = [];
}
