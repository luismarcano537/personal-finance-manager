using System.ComponentModel.DataAnnotations;
using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Application.Transactions.Requests;

public class CreateTransactionRequest
{
    [Required(ErrorMessage = "CategoryId is required.")]
    public Guid CategoryId { get; set; }

    [Required(ErrorMessage = "Type is required.")]
    [EnumDataType(typeof(CategoryType), ErrorMessage = "Invalid category type.")]
    public CategoryType Type { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
    public decimal Amount { get; set; }

    [MaxLength(500, ErrorMessage = "Description must have a maximum of 500 characters.")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "TransactionDate is required.")]
    public DateTime TransactionDate { get; set; }
}