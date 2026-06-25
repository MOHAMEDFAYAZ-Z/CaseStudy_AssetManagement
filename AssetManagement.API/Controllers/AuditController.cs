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
    public class AuditController : ControllerBase
    {
        private readonly IAuditService _auditService;

        public AuditController(IAuditService auditService)
        {
            _auditService = auditService;
        }

        [HttpPost("send")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendAuditToAll()
        {
            var audits = await _auditService.SendAuditToAll();
            return Ok(ApiResponse<List<AuditResponseDTO>>.SuccessResponse(audits, "Audit requests sent to all employees."));
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAudits()
        {
            var audits = await _auditService.GetAllAudits();
            return Ok(ApiResponse<List<AuditResponseDTO>>.SuccessResponse(audits, "Audits retrieved successfully."));
        }

        [HttpGet("my")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetMyAudits()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var audits = await _auditService.GetMyAudits(userId);
            return Ok(ApiResponse<List<AuditResponseDTO>>.SuccessResponse(audits, "My audits retrieved successfully."));
        }

        [HttpPut("{id}/respond")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> RespondToAudit(int id, [FromQuery] string status)
        {
            var audit = await _auditService.RespondToAudit(id, status);
            return Ok(ApiResponse<AuditResponseDTO>.SuccessResponse(audit, "Audit response submitted successfully."));
        }
    }
}