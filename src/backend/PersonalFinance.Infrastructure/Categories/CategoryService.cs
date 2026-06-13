using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Categories.Interfaces;
using PersonalFinance.Application.Categories.Requests;
using PersonalFinance.Application.Categories.Responses;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Domain.Enums;
using PersonalFinance.Infrastructure.Persistence;

namespace PersonalFinance.Infrastructure.Categories;

public class CategoryService : ICategoryService
{
    // DI
    private readonly AppDbContext _dbContext;

    public CategoryService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CategoryResponses> CreateAsync(Guid userId, CreateCategoryRequest request)
    {
        ValidateCategoryType(request.Type);
        var name = NormalizeName(request.Name);

        await EnsureCategoryDoesNotExistAsync(userId, name, request.Type);

        var category = new Category(userId, name, request.Type);

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync();

        return MapToResponse(category);
    }

    public async Task<IReadOnlyList<CategoryResponses>> GetAllAsync(Guid userId, CategoryType? type = null)
    {
        var query = _dbContext.Categories
            .AsNoTracking()
            .Where(category => category.UserId == userId && category.Type == type);

        if (type.HasValue)
        {
            query = query.Where(category => category.Type == type.Value);
        }

        return await query
            .OrderBy(category => category.Type)
            .ThenBy(category => category.Name)
            .Select(category => MapToResponse(category))
            .ToListAsync();
    }

    public async Task<CategoryResponses> GetByIdAsync(Guid userId, Guid categoryId)
    {
        var category = await GetActiveCategoryOrThrowAsync(userId, categoryId);

        return MapToResponse(category);
    }

    public async Task<CategoryResponses> UpdateAsync(Guid userId, Guid categoryId, UpdateCategoryRequest request)
    {
        ValidateCategoryType(request.Type);
        var category = await GetActiveCategoryOrThrowAsync(userId, categoryId);

        var name = NormalizeName(request.Name);

        var duplicatedCategory = await _dbContext.Categories
            .AnyAsync(existingCategory =>
                existingCategory.UserId == userId &&
                existingCategory.Id != categoryId &&
                existingCategory.Name == name &&
                existingCategory.Type == request.Type &&
                existingCategory.IsActive);

        if (duplicatedCategory)
        {
            throw new InvalidOperationException("Category already exists for this user and type.");
        }

        category.Update(name, request.Type);

        await _dbContext.SaveChangesAsync();

        return MapToResponse(category);
    }

    public async Task DeleteAsync(Guid userId, Guid categoryId)
    {
        var category = await GetActiveCategoryOrThrowAsync(userId, categoryId);

        category.Deactivate();

        await _dbContext.SaveChangesAsync();
    }

    // Helpers
    private async Task EnsureCategoryDoesNotExistAsync(Guid userId, string name, CategoryType type)
    {
        var categoryAlReadyExists = await _dbContext.Categories
            .AnyAsync(category =>
                category.UserId == userId &&
                category.Name == name &&
                category.Type == type &&
                category.IsActive);

        if (categoryAlReadyExists)
        {
            throw new InvalidOperationException($"Category already exists for this user and type.");
        }
    }

    private async Task<Category> GetActiveCategoryOrThrowAsync(Guid userId, Guid categoryId)
    {
        var category = await _dbContext.Categories.FirstOrDefaultAsync(category =>
            category.Id == categoryId &&
            category.UserId == userId &&
            category.IsActive);

        if (category is null)
        {
            throw new KeyNotFoundException("The category does not exist.");
        }

        return category;
    }

    private static string NormalizeName(string name)
    {
        return name.Trim();
    }

    private static CategoryResponses MapToResponse(Category category)
    {
        return new CategoryResponses
        {
            Id = category.Id,
            Name = category.Name,
            Type = category.Type,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt,
            IsActive = category.IsActive
        };
    }

    private static void ValidateCategoryType(CategoryType type)
    {
        if (!Enum.IsDefined(typeof(CategoryType), type))
        {
            throw new ArgumentException("Invalid category type.");
        }
    }
}
