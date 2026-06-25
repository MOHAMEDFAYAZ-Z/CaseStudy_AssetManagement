using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AssetManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AllocationController : ControllerBase
    {
        private readonly IAllocationService _allocationService;

        public AllocationController(IAllocationService allocationService)
        {
            _allocationService = allocationService;
        }

        [HttpPost("request")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> RequestAsset([FromBody] CreateAllocationDTO createAllocationDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var allocation = await _allocationService.RequestAsset(userId, createAllocationDTO);
            return Ok(ApiResponse<AllocationResponseDTO>.SuccessResponse(allocation, "Asset requested successfully."));
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAllocations()
        {
            var allocations = await _allocationService.GetAllAllocations();
            return Ok(ApiResponse<List<AllocationResponseDTO>>.SuccessResponse(allocations, "Allocations retrieved successfully."));
        }

        [HttpGet("my")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetMyAllocations()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var allocations = await _allocationService.GetMyAllocations(userId);
            return Ok(ApiResponse<List<AllocationResponseDTO>>.SuccessResponse(allocations, "My allocations retrieved successfully."));
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAllocationStatus(int id, [FromQuery] string status)
        {
            var allocation = await _allocationService.UpdateAllocationStatus(id, status);
            return Ok(ApiResponse<AllocationResponseDTO>.SuccessResponse(allocation, "Allocation status updated successfully."));
        }
    }
}