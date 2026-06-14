using PersonalFinance.Application.Summary.Responses;
using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Application.Summary.Interfaces;

public interface ISummaryService
{
    Task<MonthlySummaryResponse> GetMonthlySummaryAsync(Guid userId, int month, int year);
    Task<CategorySummaryResponse> GetCategorySummaryAsync(Guid userId, int month, int year, CategoryType? type = null);
}
