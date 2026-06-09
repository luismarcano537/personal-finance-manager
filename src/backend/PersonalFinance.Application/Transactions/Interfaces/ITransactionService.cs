using PersonalFinance.Application.Transactions.Requests;
using PersonalFinance.Application.Transactions.Responses;
using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Application.Transactions.Interfaces;

public interface ITransactionService
{
    Task<TransactionResponse> CreateAsync(Guid userId, CreateTransactionRequest request);
    Task<IReadOnlyList<TransactionResponse>> GetAllAsync(
        Guid userId,
        int? month = null,
        int? year = null,
        CategoryType? type = null,
        Guid? categoryId = null);
    Task<TransactionResponse> GetByIdAsync(Guid userId, Guid transactionId);
    Task<TransactionResponse> UpdateAsync(
        Guid userId,
        Guid transactionId,
        UpdateTransactionRequest request);
    Task DeleteAsync(Guid userId, Guid transactionId);
}
