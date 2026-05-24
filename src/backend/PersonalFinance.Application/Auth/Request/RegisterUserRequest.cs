using System.ComponentModel.DataAnnotations;

namespace PersonalFinance.Application.Auth.Requests;

public class RegisterUserRequest
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(150, ErrorMessage = "Name must have a maximum of 150 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    [MaxLength(255, ErrorMessage = "Email must have a maximum of 255 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(8, ErrorMessage = "Password must have at least 8 characters.")]
    public string Password { get; set; } = string.Empty;
}