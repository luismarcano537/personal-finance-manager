using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Summary.Interfaces;
using PersonalFinance.Application.Summary.Responses;
using PersonalFinance.Domain.Enums;
using PersonalFinance.Infrastructure.Persistence;

namespace PersonalFinance.Infrastructure.Summary;

public class SummaryService : ISummaryService
{
    private readonly AppDbContext _dbContext;

    public SummaryService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<MonthlySummaryResponse> GetMonthlySummaryAsync(
        Guid userId,
        int month,
        int year)
    {
        if (month is < 1 or > 12)
        {
            throw new ArgumentException(
                "Month must be between 1 and 12.",
                nameof(month));
        }

        if (year < 2000)
        {
            throw new ArgumentException(
                "Year must be greater than or equal to 2000.",
                nameof(year));
        }

        var startDate = new DateTime(
            year,
            month,
            1,
            0,
            0,
            0,
            DateTimeKind.Utc);
        var endDate = startDate.AddMonths(1);

        var summary = await _dbContext.Transactions
            .AsNoTracking()
            .Where(transaction =>
                transaction.UserId == userId &&
                transaction.IsActive &&
                transaction.TransactionDate >= startDate &&
                transaction.TransactionDate < endDate)
            .GroupBy(_ => 1)
            .Select(transactions => new
            {
                TotalIncome = transactions
                    .Where(transaction => transaction.Type == CategoryType.income)
                    .Sum(transaction => transaction.Amount),
                TotalExpense = transactions
                    .Where(transaction => transaction.Type == CategoryType.Expense)
                    .Sum(transaction => transaction.Amount),
                TransactionsCount = transactions.Count()
            })
            .FirstOrDefaultAsync();

        var totalIncome = summary?.TotalIncome ?? 0;
        var totalExpense = summary?.TotalExpense ?? 0;

        return new MonthlySummaryResponse
        {
            Month = month,
            Year = year,
            TotalIncome = totalIncome,
            TotalExpense = totalExpense,
            Balance = totalIncome - totalExpense,
            TransactionsCount = summary?.TransactionsCount ?? 0
        };
    }
}
