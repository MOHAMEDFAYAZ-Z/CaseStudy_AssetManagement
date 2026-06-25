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
    public class ReturnRequestController : ControllerBase
    {
        private readonly IReturnRequestService _returnRequestService;

        public ReturnRequestController(IReturnRequestService returnRequestService)
        {
            _returnRequestService = returnRequestService;
        }

        [HttpPost]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> CreateReturnRequest([FromBody] CreateReturnRequestDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var returnRequest = await _returnRequestService.CreateReturnRequest(userId, dto);
            return Ok(ApiResponse<ReturnRequestResponseDTO>.SuccessResponse(returnRequest, "Return request created successfully."));
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllReturnRequests()
        {
            var returnRequests = await _returnRequestService.GetAllReturnRequests();
            return Ok(ApiResponse<List<ReturnRequestResponseDTO>>.SuccessResponse(returnRequests, "Return requests retrieved successfully."));
        }

        [HttpGet("my")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetMyReturnRequests()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var returnRequests = await _returnRequestService.GetMyReturnRequests(userId);
            return Ok(ApiResponse<List<ReturnRequestResponseDTO>>.SuccessResponse(returnRequests, "My return requests retrieved successfully."));
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateReturnRequestStatus(int id, [FromQuery] string status)
        {
            var returnRequest = await _returnRequestService.UpdateReturnRequestStatus(id, status);
            return Ok(ApiResponse<ReturnRequestResponseDTO>.SuccessResponse(returnRequest, "Return request status updated successfully."));
        }
    }
}