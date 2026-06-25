using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategories();
            return Ok(ApiResponse<List<CategoryResponseDTO>>.SuccessResponse(categories, "Categories retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _categoryService.GetCategoryById(id);
            return Ok(ApiResponse<CategoryResponseDTO>.SuccessResponse(category, "Category retrieved successfully."));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDTO createCategoryDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var category = await _categoryService.CreateCategory(createCategoryDTO);
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.CategoryId },
                ApiResponse<CategoryResponseDTO>.SuccessResponse(category, "Category created successfully."));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDTO updateCategoryDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var category = await _categoryService.UpdateCategory(id, updateCategoryDTO);
            return Ok(ApiResponse<CategoryResponseDTO>.SuccessResponse(category, "Category updated successfully."));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            await _categoryService.DeleteCategory(id);
            return Ok(ApiResponse<object>.SuccessResponse(null!, "Category deleted successfully."));
        }
    }
}