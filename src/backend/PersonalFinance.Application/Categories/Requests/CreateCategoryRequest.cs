using System.ComponentModel.DataAnnotations;
using PersonalFinance.Domain.Enums;

namespace PersonalFinance.Application.Categories.Requests;

public class CreateCategoryRequest
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(100, ErrorMessage = "Name must have a maximum of 100 Characters.")]
    public string Name { get; set; } = string.Empty;
    
    [Required(ErrorMessage =  "Type is required.")]
    [EnumDataType(typeof(CategoryType), ErrorMessage = "Invalid category type.")]
    public CategoryType Type { get; set; }
}