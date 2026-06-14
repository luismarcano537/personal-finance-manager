namespace PersonalFinance.Application.Summary.Responses;

public class MonthlySummaryResponse
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal Balance { get; set; }
    public int TransactionsCount { get; set; }
}
