using AssetManagement.Core.DTOs;

namespace AssetManagement.Core.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryResponseDTO>> GetAllCategories();
        Task<CategoryResponseDTO> GetCategoryById(int id);
        Task<CategoryResponseDTO> CreateCategory(CreateCategoryDTO createCategoryDTO);
        Task<CategoryResponseDTO> UpdateCategory(int id, UpdateCategoryDTO updateCategoryDTO);
        Task<bool> DeleteCategory(int id);
    }
}