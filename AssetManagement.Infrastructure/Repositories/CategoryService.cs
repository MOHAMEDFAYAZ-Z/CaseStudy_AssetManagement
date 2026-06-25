using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoryResponseDTO>> GetAllCategories()
        {
            try
            {
                return await _context.AssetCategories
                    .Select(c => new CategoryResponseDTO
                    {
                        CategoryId = c.CategoryId,
                        CategoryName = c.CategoryName,
                        TotalAssets = c.Assets.Count()
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CategoryResponseDTO> GetCategoryById(int id)
        {
            try
            {
                var category = await _context.AssetCategories
                    .Include(c => c.Assets)
                    .FirstOrDefaultAsync(c => c.CategoryId == id);

                if (category == null)
                    throw new Exception("Category not found.");

                return new CategoryResponseDTO
                {
                    CategoryId = category.CategoryId,
                    CategoryName = category.CategoryName,
                    TotalAssets = category.Assets.Count()
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CategoryResponseDTO> CreateCategory(CreateCategoryDTO createCategoryDTO)
        {
            try
            {
                var existing = await _context.AssetCategories
                    .FirstOrDefaultAsync(c => c.CategoryName == createCategoryDTO.CategoryName);

                if (existing != null)
                    throw new Exception("Category already exists.");

                var category = new AssetCategory
                {
                    CategoryName = createCategoryDTO.CategoryName
                };

                _context.AssetCategories.Add(category);
                await _context.SaveChangesAsync();

                return await GetCategoryById(category.CategoryId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CategoryResponseDTO> UpdateCategory(int id, UpdateCategoryDTO updateCategoryDTO)
        {
            try
            {
                var category = await _context.AssetCategories.FindAsync(id);

                if (category == null)
                    throw new Exception("Category not found.");

                category.CategoryName = updateCategoryDTO.CategoryName;
                await _context.SaveChangesAsync();

                return await GetCategoryById(category.CategoryId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteCategory(int id)
        {
            try
            {
                var category = await _context.AssetCategories.FindAsync(id);

                if (category == null)
                    throw new Exception("Category not found.");

                _context.AssetCategories.Remove(category);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}