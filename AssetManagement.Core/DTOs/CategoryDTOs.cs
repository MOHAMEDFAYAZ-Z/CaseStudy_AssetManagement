using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.DTOs
{
    public class CreateCategoryDTO
    {
        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 50 characters.")]
        public string CategoryName { get; set; } = string.Empty;
    }

    public class UpdateCategoryDTO
    {
        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 50 characters.")]
        public string CategoryName { get; set; } = string.Empty;
    }

    public class CategoryResponseDTO
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int TotalAssets { get; set; }
    }
}