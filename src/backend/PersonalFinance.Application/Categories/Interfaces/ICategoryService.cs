using PersonalFinance.Application.Categories.Requests;
using PersonalFinance.Application.Categories.Responses;
using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Application.Categories.Interfaces;

public interface ICategoryService
{
    Task<CategoryResponses> CreateAsync(Guid userId, CreateCategoryRequest request);
    Task<IReadOnlyList<CategoryResponses>> GetAllAsync(Guid userId, CategoryType? type = null);
    Task<CategoryResponses> GetByIdAsync(Guid userId, Guid categoryId);
    Task<CategoryResponses> UpdateAsync(Guid userId, Guid categoryId, UpdateCategoryRequest request);
    Task DeleteAsync(Guid userId, Guid categoryId);
}

