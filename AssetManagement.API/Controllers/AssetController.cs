using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _assetService;

        public AssetController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAssets()
        {
            var assets = await _assetService.GetAllAssets();
            return Ok(ApiResponse<List<AssetResponseDTO>>.SuccessResponse(assets, "Assets retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssetById(int id)
        {
            var asset = await _assetService.GetAssetById(id);
            return Ok(ApiResponse<AssetResponseDTO>.SuccessResponse(asset, "Asset retrieved successfully."));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAsset([FromBody] CreateAssetDTO createAssetDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var asset = await _assetService.CreateAsset(createAssetDTO);
            return CreatedAtAction(nameof(GetAssetById), new { id = asset.AssetId },
    ApiResponse<AssetResponseDTO>.SuccessResponse(asset, "Asset created successfully."));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAsset(int id, [FromBody] UpdateAssetDTO updateAssetDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var asset = await _assetService.UpdateAsset(id, updateAssetDTO);
            return Ok(ApiResponse<AssetResponseDTO>.SuccessResponse(asset, "Asset updated successfully."));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            await _assetService.DeleteAsset(id);
            return Ok(ApiResponse<object>.SuccessResponse(null!, "Asset deleted successfully."));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchAssets([FromQuery] string? keyword, [FromQuery] int? categoryId)
        {
            var assets = await _assetService.SearchAssets(keyword, categoryId);
            return Ok(ApiResponse<List<AssetResponseDTO>>.SuccessResponse(assets, "Assets retrieved successfully."));
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetAssetsPaged([FromQuery] PaginationParams paginationParams)
        {
            var result = await _assetService.GetAssetsPaged(paginationParams);
            return Ok(ApiResponse<PagedResponse<AssetResponseDTO>>.SuccessResponse(result, "Assets retrieved successfully."));
        }
    }
}