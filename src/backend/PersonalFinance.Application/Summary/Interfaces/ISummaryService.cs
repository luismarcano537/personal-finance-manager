using PersonalFinance.Application.Summary.Responses;

namespace PersonalFinance.Application.Summary.Interfaces;

public interface ISummaryService
{
    Task<MonthlySummaryResponse> GetMonthlySummaryAsync(Guid userId, int month, int year);
}
