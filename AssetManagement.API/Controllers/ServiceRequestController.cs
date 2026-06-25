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
    public class ServiceRequestController : ControllerBase
    {
        private readonly IServiceRequestService _serviceRequestService;

        public ServiceRequestController(IServiceRequestService serviceRequestService)
        {
            _serviceRequestService = serviceRequestService;
        }

        [HttpPost]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> CreateServiceRequest([FromBody] CreateServiceRequestDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var serviceRequest = await _serviceRequestService.CreateServiceRequest(userId, dto);
            return Ok(ApiResponse<ServiceRequestResponseDTO>.SuccessResponse(serviceRequest, "Service request created successfully."));
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllServiceRequests()
        {
            var serviceRequests = await _serviceRequestService.GetAllServiceRequests();
            return Ok(ApiResponse<List<ServiceRequestResponseDTO>>.SuccessResponse(serviceRequests, "Service requests retrieved successfully."));
        }

        [HttpGet("my")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetMyServiceRequests()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var serviceRequests = await _serviceRequestService.GetMyServiceRequests(userId);
            return Ok(ApiResponse<List<ServiceRequestResponseDTO>>.SuccessResponse(serviceRequests, "My service requests retrieved successfully."));
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateServiceRequestStatus(int id, [FromQuery] string status)
        {
            var serviceRequest = await _serviceRequestService.UpdateServiceRequestStatus(id, status);
            return Ok(ApiResponse<ServiceRequestResponseDTO>.SuccessResponse(serviceRequest, "Service request status updated successfully."));
        }
    }
}