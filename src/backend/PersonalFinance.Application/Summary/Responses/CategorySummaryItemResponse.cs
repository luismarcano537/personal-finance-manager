namespace PersonalFinance.Application.Summary.Responses;

public class CategorySummaryItemResponse
{
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public int TransactionsCount { get; set; }
}
